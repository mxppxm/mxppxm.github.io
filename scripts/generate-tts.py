#!/usr/bin/env python3
"""Generate expressive TTS audio from a markdown article using Edge TTS + SSML.
Generates per-paragraph audio chunks then concats with ffmpeg (Edge TTS
rejects multiple very-slow-prosody segments in a single SSML message)."""

import re
import sys
import asyncio
import subprocess
import tempfile
from pathlib import Path

import edge_tts
import edge_tts.communicate as comm
from edge_tts.communicate import Communicate, remove_incompatible_characters

VOICE = "zh-CN-YunjianNeural"  # Male, Passion
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "audio"
PITCH = "-8%"
RATE = "-5%"

# ===== MONKEY PATCHES =====
_original_escape = comm.escape


def _patched_escape(text: str) -> str:
    if isinstance(text, str) and text.strip().startswith("<speak"):
        return text
    return _original_escape(text)


_original_mkssml = comm.mkssml


def _patched_mkssml(tc, escaped_text):
    text = escaped_text.decode("utf-8") if isinstance(escaped_text, bytes) else escaped_text
    if isinstance(text, str) and text.strip().startswith("<speak"):
        return text
    return _original_mkssml(tc, escaped_text)


_original_init = Communicate.__init__


def _patched_init(self, text, voice=comm.DEFAULT_VOICE, *, rate="+0%",
                  volume="+0%", pitch="+0Hz", boundary="SentenceBoundary",
                  connector=None, proxy=None, connect_timeout=10, receive_timeout=60):
    self.tts_config = comm.TTSConfig(voice, rate, volume, pitch, boundary)
    if not isinstance(text, str):
        raise TypeError("text must be str")
    is_ssml = isinstance(text, str) and text.strip().startswith("<speak")
    if is_ssml:
        self.texts = [comm.remove_incompatible_characters(text)]
    else:
        self.texts = comm.split_text_by_byte_length(
            comm.escape(comm.remove_incompatible_characters(text)), 4096
        )
    if proxy is not None and not isinstance(proxy, str):
        raise TypeError("proxy must be str")
    self.proxy = proxy
    if not isinstance(connect_timeout, int):
        raise TypeError("connect_timeout must be int")
    if not isinstance(receive_timeout, int):
        raise TypeError("receive_timeout must be int")
    import aiohttp
    self.session_timeout = aiohttp.ClientTimeout(
        total=None, connect=None, sock_connect=connect_timeout, sock_read=receive_timeout
    )
    self.connector = connector
    self.state = {
        "partial_text": b"",
        "offset_compensation": 0,
        "last_duration_offset": 0,
        "stream_was_called": False,
        "chunk_audio_bytes": 0,
        "cumulative_audio_bytes": 0,
    }


Communicate.__init__ = _patched_init
comm.escape = _patched_escape
comm.mkssml = _patched_mkssml


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


def split_paragraphs(text: str) -> list[str]:
    """Split text into logical TTS chunks: header+body or standalone paragraphs."""
    raw = [p.replace("\n", "") for p in text.split("\n\n") if p.strip()]
    # Merge header paragraphs with their following body paragraphs
    # to reduce total chunks while keeping each chunk valid
    chunks = []
    i = 0
    while i < len(raw):
        para = raw[i]
        is_header = (
            (len(para) < 6 and re.match(r"^[一二三四五六七八九十百千万]+$", para.strip("。")))
            or (para.endswith("。") and len(para) < 20)
        )
        if is_header and i + 1 < len(raw):
            # Merge header with next paragraph
            chunks.append(para + "。" + raw[i + 1])
            i += 2
        else:
            chunks.append(para)
            i += 1
    return chunks


# Pause macros — Edge TTS allows at most ONE slow rate (≤-90%) per SSML message.
# So we drop all internal pauses and keep only a trailing paragraph break.
PP = '<prosody rate="-95%">。。</prosody>'  # paragraph pause (~600ms)


def build_ssml_for_paragraph(para: str) -> str:
    """Build SSML for a single paragraph (at most one slow prosody)."""
    is_header = (
        (len(para) < 6 and re.match(r"^[一二三四五六七八九十百千万]+$", para.strip("。")))
        or (para.endswith("。") and len(para) < 20)
    )

    if is_header:
        return (
            '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">'
            f'<voice name="{VOICE}">'
            f'<prosody rate="-12%" pitch="+3%">{para}</prosody>{PP}'
            '</voice></speak>'
        )

    # Body: plain text with voice prosody + trailing paragraph pause.
    # Natural punctuation (。，！？) provides sentence-level rhythm.
    return (
        '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN">'
        f'<voice name="{VOICE}">'
        f'<prosody rate="{RATE}" pitch="{PITCH}">{para}</prosody>{PP}'
        '</voice></speak>'
    )


async def generate_chunk(ssml: str, output_path: str) -> int:
    """Generate one audio chunk. Returns byte count."""
    communicate = edge_tts.Communicate(ssml, VOICE)
    await communicate.save(output_path)
    return Path(output_path).stat().st_size


async def generate_all_chunks(paragraphs: list[str], tmpdir: str) -> list[str]:
    """Generate audio for each paragraph, return list of file paths."""
    chunk_files = []
    for i, para in enumerate(paragraphs):
        ssml = build_ssml_for_paragraph(para)
        chunk_path = Path(tmpdir) / f"chunk_{i:04d}.mp3"
        print(f"  🎤 [{i+1}/{len(paragraphs)}] {len(ssml)}B SSML → {chunk_path.name}")
        size = await generate_chunk(ssml, str(chunk_path))
        print(f"       {size}B audio ({para[:40]}...)")
        chunk_files.append(str(chunk_path))
    return chunk_files


def concat_mp3s(chunk_files: list[str], output_path: Path):
    """Concatenate MP3 files using ffmpeg."""
    # Write concat list
    list_path = output_path.parent / ".concat_list.txt"
    with open(list_path, "w") as f:
        for cf in chunk_files:
            f.write(f"file '{cf}'\n")

    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_path),
         "-c", "copy", str(output_path)],
        check=True, capture_output=True,
    )
    list_path.unlink(missing_ok=True)


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

    paragraphs = split_paragraphs(text)
    print(f"📦 {len(paragraphs)} chunks (header+body merged)")

    print(f"🎤 Voice: {VOICE} | pitch={PITCH} rate={RATE}")

    with tempfile.TemporaryDirectory() as tmpdir:
        chunk_files = asyncio.run(generate_all_chunks(paragraphs, tmpdir))

        output_path.parent.mkdir(parents=True, exist_ok=True)
        print(f"\n🔗 Concatenating {len(chunk_files)} chunks...")
        concat_mp3s(chunk_files, output_path)

    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"✅ {output_path} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
