#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
人像集画廊发布器（增量）
────────────────────────────────────────────────
把 mflux-out 里的新图增量上传 R2、重新生成画廊数据、构建并（可选）部署。

用法：
  python3 tools/renxiang-publish.py                 # 扫描→上传→生成数据→构建
  python3 tools/renxiang-publish.py --deploy        # 上面全部 + git commit & push 上线
  python3 tools/renxiang-publish.py --chapter G03   # 新图追加进已有组
  python3 tools/renxiang-publish.py --title "标题"  # 新图新建一组时的组名
  python3 tools/renxiang-publish.py --no-upload     # 只重算数据+构建（改提示词后用）

状态文件：blog/tools/renxiang-state.json（组划分 / 密码 / R2 前缀 / 提示词覆盖）
数据产出：blog/src/data/renxiang-gallery.mjs
页面：blog/src/pages/renxiang/index.astro
"""
import argparse
import json
import os
import subprocess
import sys
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
BLOG = os.path.dirname(HERE)
STATE_PATH = os.path.join(HERE, "renxiang-state.json")
STAGE_ROOT = "/tmp/renxiang-upload"
R2_BUCKET = "mxppxm-blog-images"


def sh(cmd, **kw):
    print("$ " + (cmd if isinstance(cmd, str) else " ".join(cmd)))
    return subprocess.run(cmd, shell=isinstance(cmd, str), check=True, **kw)


def load_state():
    with open(STATE_PATH, encoding="utf-8") as f:
        return json.load(f)


def save_state(st):
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(st, f, ensure_ascii=False, indent=2)
        f.write("\n")


def scan_sources(sources):
    """basename -> 绝对路径（靠前的 source 优先）"""
    found = {}
    for d in sources:
        if not os.path.isdir(d):
            print("  ! 源目录不存在，跳过:", d)
            continue
        for name in sorted(os.listdir(d)):
            if name.lower().endswith(".png") and name not in found:
                found[name] = os.path.join(d, name)
    return found


def sidecar_meta(path):
    """读同名 .json 旁车 → (prompt, meta 字符串)"""
    j = os.path.splitext(path)[0] + ".json"
    if not os.path.isfile(j):
        return "", ""
    try:
        with open(j, encoding="utf-8") as f:
            d = json.load(f)
    except Exception:
        return "", ""
    bits = []
    w, h = d.get("width"), d.get("height")
    if w and h:
        bits.append("%s×%s" % (w, h))
    if d.get("steps"):
        bits.append("%s 步" % d["steps"])
    if d.get("seed") is not None:
        bits.append("seed %s" % d["seed"])
    if d.get("init_image"):
        bits.append("img2img %s" % (d.get("init_strength") or ""))
    if d.get("batch_total") and int(d["batch_total"]) > 1:
        bits.append("第 %s/%s 张" % (d.get("batch_index"), d.get("batch_total")))
    return (d.get("prompt") or "").strip(), " · ".join(x for x in bits if x.strip())


def djb2(s):
    h = 5381
    for ch in s:
        h = ((h << 5) + h + ord(ch)) & 0xFFFFFFFF
    return h


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--chapter", help="新图追加进这个组 id（如 G03）")
    ap.add_argument("--title", help="新图新建一组时的组名")
    ap.add_argument("--no-upload", action="store_true", help="跳过 rclone 上传")
    ap.add_argument("--no-build", action="store_true", help="跳过 astro build")
    ap.add_argument("--deploy", action="store_true", help="构建后 git commit + push")
    args = ap.parse_args()

    st = load_state()
    slug, prefix, pw = st["slug"], st["prefix"], str(st["pass"])
    print("=== 人像集画廊发布器 ===")
    print("slug=%s  prefix=%s  密码可用=%s" % (slug, prefix, bool(pw)))

    local = scan_sources(st["sources"])
    known = {f for ch in st["chapters"] for f in ch["files"]}
    new = [n for n in sorted(local) if n not in known]

    # ── 1) 归类新图 ──
    if new:
        print("\n[1/5] 发现 %d 张新图：" % len(new))
        for n in new:
            print("   +", n)
        target = None
        if args.chapter:
            target = next((c for c in st["chapters"] if c["id"] == args.chapter), None)
            if target is None:
                sys.exit("! 找不到组 %s" % args.chapter)
        else:
            nid = "G%02d" % (len(st["chapters"]) + 1)
            target = {"id": nid, "title": args.title or "新增 · %s" % date.today().isoformat(), "files": []}
            st["chapters"].append(target)
            print("   新组：%s %s" % (target["id"], target["title"]))
        target["files"].extend(new)
        save_state(st)
    else:
        print("\n[1/5] 没有新图，仅重算数据。")

    # ── 2) 校验 + 组装 items ──
    print("\n[2/5] 组装数据…")
    base = "https://pub-62a0367d331f458a973799ce72761c28.r2.dev/%s/panels/" % prefix
    over_p = st.get("prompt_overrides", {})
    over_m = st.get("meta_overrides", {})
    items, missing, nocap = [], [], []
    for ch in st["chapters"]:
        for f in ch["files"]:
            p = local.get(f)
            if not p:
                missing.append(f)
                continue
            if f in over_p:
                prompt = over_p[f]
            else:
                prompt, _ = sidecar_meta(p)
            meta = over_m.get(f, "")
            if not meta and f not in over_p:
                _, meta = sidecar_meta(p)
            if not prompt:
                nocap.append(f)
            items.append({"u": base + f, "c": ch["id"], "t": ch["title"],
                          "p": prompt, "m": meta})
    if missing:
        sys.exit("! 这些文件在源目录找不到（请确认仍在 mflux-out）：\n  " + "\n  ".join(missing))
    print("   %d 张 · %d 组 · 无提示词 %d 张" % (len(items), len(st["chapters"]), len(nocap)))
    if nocap:
        print("   （无提示词的：%s）" % ", ".join(nocap))

    # ── 3) 上传缺失图（以 state.uploaded 为准，保证幂等自愈） ──
    all_files = [f for ch in st["chapters"] for f in ch["files"]]
    uploaded = set(st.get("uploaded", []))
    to_up = [f for f in all_files if f not in uploaded]
    if to_up and not args.no_upload:
        print("\n[3/5] 上传 %d 张到 R2…" % len(to_up))
        stage = os.path.join(STAGE_ROOT, "panels")
        os.makedirs(stage, exist_ok=True)
        for f in to_up:
            sh(["cp", local[f], os.path.join(stage, f)])
        dest = "r2-blog:%s/%s/panels" % (R2_BUCKET, prefix)
        sh(["rclone", "copy", stage, dest, "--transfers", "16", "--stats", "10s"])
        sh(["rclone", "check", stage, dest])
        st["uploaded"] = sorted(uploaded | set(to_up))
        save_state(st)
    else:
        print("\n[3/5] R2 已是最新（%d 张在桶里），跳过上传。" % len(uploaded))

    # ── 4) 写数据模块 ──
    print("\n[4/5] 写数据模块…")
    h = djb2("lock:" + pw)
    out = os.path.join(BLOG, "src", "data", "%s-gallery.mjs" % slug)
    with open(out, "w", encoding="utf-8") as fh:
        fh.write("// 人像集 私密画廊数据 (auto-generated by tools/renxiang-publish.py, do not edit)\n")
        fh.write("export const RX_ITEMS = %s;\n" % json.dumps(items, ensure_ascii=False, separators=(",", ":")))
        fh.write("export const RX_HASH = %d;\n" % h)
    print("   %s  (%d bytes, hash=%d)" % (out, os.path.getsize(out), h))

    # ── 5) 构建 / 部署 ──
    if not args.no_build:
        print("\n[5/5] astro build…")
        sh(["npm", "run", "build"], cwd=BLOG)
    if args.deploy:
        print("\n[deploy] git commit + push…")
        sh(["git", "add", "src/data/%s-gallery.mjs" % slug, "src/pages/%s/index.astro" % slug,
            "tools/%s-state.json" % slug], cwd=BLOG)
        sh(["git", "commit", "-m", "feat(%s): 画廊更新 %d 图 / %d 组" % (slug, len(items), len(st["chapters"]))], cwd=BLOG)
        sh(["git", "push", "origin", "main"], cwd=BLOG)
        print("\n✅ 已推送。线上：https://mxppxm.github.io/%s/?q=%s" % (slug, pw))
    else:
        print("\n✅ 完成（未部署）。加 --deploy 可一键上线。")


if __name__ == "__main__":
    main()