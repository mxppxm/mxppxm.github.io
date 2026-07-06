#!/usr/bin/env python3
"""Generate expressive TTS audio from a markdown article using Edge TTS + SSML (no newlines!)."""

import re
import sys
import asyncio
import edge_tts
from pathlib import Path

VOICE = "zh-CN-YunjianNeural"  # Male, Passion - closest to weathered/seasoned
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "audio"

# Pitch & rate for "weathered" effect: slightly deeper, slightly slower
PITCH = "-8%"
RATE = "-5%"


def extract_text(md_path: Path) -> str:
    """Strip frontmatter and markdown formatting, return plain text."""
    content = md_path.read_text(encoding="utf-8")

    content = re.sub(r"^---\n.*?\n---\n", "", content, flags=re.DOTALL)
    content = re.sub(r"!\[.*?\]\(.*?\)", "", content)
    content = re.sub(r"\*\*(.+?)\*\*", r"\1", content)
    content = re.sub(r"\*(.+?)\*", r"\1", content)
    content = re.sub(r"~~(.+?)~~", r"\1", content)
    content = re.sub(r"\[(.+?)\]\(.*?\)", r"\1", content)
    content = re.sub(r"^##\s+(.+)", r"\1。", content, flags=re.MULTILINE)
    content = re.sub(r"^#\s+(.+)", r"\1。", content, flags=re.MULTILINE)
    content = re.sub(r"^---+$", "", content, flags=re.MULTILINE)
    content = re.sub(r"—— .+完 ——", "", content)
    content = re.sub(r"📖\s*下一章预告.+", "", content, flags=re.DOTALL)
    content = re.sub(r"\n{3,}", "\n\n", content)
    return content.strip()


def build_ssml(text: str) -> str:
    """Convert plain text to SSML. CRITICAL: no newlines inside <speak> tags!"""
    # Strip ALL newlines from paragraph text — they become spoken text in SSML
    paragraphs = [p.replace('\n', '') for p in text.split("\n\n") if p.strip()]

    # Start with opening tag only
    parts = ['<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">']

    for i, para in enumerate(paragraphs):
        is_header = (
            (len(para) < 6 and re.match(r'^[一二三四五六七八九十百千万]+$', para.strip('。'))) or
            (para.endswith('。') and len(para) < 20)
        )

        if is_header:
            parts.append(f'<break time="1000ms"/><prosody rate="-12%" pitch="+3%">{para}</prosody><break time="800ms"/>')
        else:
            # Add natural sentence pauses
            processed = re.sub(r'([。！？])', r'\1<break time="300ms"/>', para)
            processed = re.sub(r'<break time="300ms"/>$', '', processed)
            # Comma micro-pauses
            processed = re.sub(r'([，、])', r'\1<break time="120ms"/>', processed)
            parts.append(f'<prosody rate="{RATE}" pitch="{PITCH}">{processed}</prosody><break time="500ms"/>')

    parts.append('</speak>')
    # Join WITHOUT newlines — this is the fix!
    return ''.join(parts)


async def generate_tts(ssml: str, output_path: Path):
    """Generate MP3 using Edge TTS with SSML."""
    communicate = edge_tts.Communicate(ssml, VOICE)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    await communicate.save(str(output_path))


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 generate-tts.py <markdown-file>")
        sys.exit(1)

    md_path = Path(sys.argv[1])
    if not md_path.exists():
        print(f"File not found: {md_path}")
        sys.exit(1)

    stem = md_path.stem
    output_path = OUTPUT_DIR / f"{stem}.mp3"

    print(f"📄 Extracting: {md_path.name}")
    text = extract_text(md_path)
    print(f"   {len(text)} chars")

    print(f"🎭 Building SSML...")
    ssml = build_ssml(text)
    # Verify no newlines inside speak tags
    inner = ssml[ssml.index('>')+1:ssml.rindex('<')]
    if '\n' in inner:
        print(f"   ⚠️  WARNING: {inner.count(chr(10))} newlines found in SSML body!")

    print(f"🎤 Voice: {VOICE} | pitch={PITCH} rate={RATE}")
    asyncio.run(generate_tts(ssml, output_path))

    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"✅ {output_path} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
