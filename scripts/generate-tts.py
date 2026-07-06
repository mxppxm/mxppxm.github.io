#!/usr/bin/env python3
"""Generate TTS audio from a markdown article using Edge TTS."""

import re
import sys
import asyncio
import edge_tts
from pathlib import Path

VOICE = "zh-CN-XiaoxiaoNeural"  # Warm female voice, great for novels
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "audio"


def extract_text(md_path: Path) -> str:
    """Strip frontmatter and markdown formatting, return plain text."""
    content = md_path.read_text(encoding="utf-8")

    # Remove YAML frontmatter
    content = re.sub(r"^---\n.*?\n---\n", "", content, flags=re.DOTALL)

    # Remove images
    content = re.sub(r"!\[.*?\]\(.*?\)", "", content)

    # Remove markdown formatting but keep text
    content = re.sub(r"\*\*(.+?)\*\*", r"\1", content)  # bold
    content = re.sub(r"\*(.+?)\*", r"\1", content)       # italic
    content = re.sub(r"~~(.+?)~~", r"\1", content)       # strikethrough
    content = re.sub(r"\[(.+?)\]\(.*?\)", r"\1", content)  # links

    # Section headers → pause-worthy text
    content = re.sub(r"^##\s+(.+)", r"\1。", content, flags=re.MULTILINE)
    content = re.sub(r"^#\s+(.+)", r"\1。", content, flags=re.MULTILINE)

    # Horizontal rules, chapter markers
    content = re.sub(r"^---+$", "", content, flags=re.MULTILINE)
    content = re.sub(r"—— .+完 ——", "", content)
    content = re.sub(r"📖\s*下一章预告.+", "", content, flags=re.DOTALL)

    # Collapse blank lines
    content = re.sub(r"\n{3,}", "\n\n", content)
    content = content.strip()

    return content


async def generate_tts(text: str, output_path: Path):
    """Generate MP3 using Edge TTS."""
    communicate = edge_tts.Communicate(text, VOICE)
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

    # Determine output name from filename
    stem = md_path.stem  # e.g. novel-chapter-001
    output_path = OUTPUT_DIR / f"{stem}.mp3"

    print(f"📄 Extracting text from: {md_path.name}")
    text = extract_text(md_path)
    print(f"   {len(text)} characters")

    print(f"🎤 Generating audio with voice: {VOICE}")
    asyncio.run(generate_tts(text, output_path))

    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"✅ Saved: {output_path} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
