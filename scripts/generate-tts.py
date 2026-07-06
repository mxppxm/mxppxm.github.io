#!/usr/bin/env python3
"""Generate expressive TTS audio from a markdown article using Edge TTS + SSML."""

import re
import sys
import asyncio
import edge_tts
from pathlib import Path

VOICE = "zh-CN-YunxiNeural"  # Male, lively - feels like an older brother telling stories
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "audio"

# Rate: -20% ~ +20%, negative = slower. Literary text benefits from slightly slower pace.
BASE_RATE = "-5%"


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

    # Section headers → plain text with emphasis
    content = re.sub(r"^##\s+(.+)", r"\1。", content, flags=re.MULTILINE)
    content = re.sub(r"^#\s+(.+)", r"\1。", content, flags=re.MULTILINE)

    # Horizontal rules, chapter markers
    content = re.sub(r"^---+$", "", content, flags=re.MULTILINE)
    content = re.sub(r"—— .+完 ——", "", content)
    content = re.sub(r"📖\s*下一章预告.+", "", content, flags=re.DOTALL)

    # Collapse blank lines (keep at most 1 blank line between paragraphs)
    content = re.sub(r"\n{3,}", "\n\n", content)
    content = content.strip()

    return content


def build_ssml(text: str) -> str:
    """Convert plain text to SSML with natural pauses and prosody variations."""
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    ssml_parts = []
    ssml_parts.append(f'<speak xmlns="http://www.w3.org/2001/10/synthesis" version="1.0" xml:lang="zh-CN">')

    for i, para in enumerate(paragraphs):
        # Detect section headers (end with 。alone or are short titles like "一", "二", "三")
        is_section_header = (
            (len(para) < 6 and re.match(r'^[一二三四五六七八九十百千万]+$', para.strip('。')))
            or (para.endswith('。') and len(para) < 20)
        )

        # Detect dialogue lines (contain quotes)
        has_dialogue = '"' in para or '"' in para or '「' in para or '」' in para

        if is_section_header:
            # Section headers: pause before, slower with slight emphasis
            ssml_parts.append(f'<break time="1200ms"/>')
            ssml_parts.append(f'<prosody rate="-15%" pitch="+5%">{para}</prosody>')
            ssml_parts.append(f'<break time="1000ms"/>')

        elif has_dialogue:
            # Dialogue: slightly faster, more varied
            # Add micro-pauses at sentence boundaries for natural speech rhythm
            para_with_pauses = re.sub(r'([。！？])', r'\1<break time="400ms"/>', para)
            # Remove trailing break
            para_with_pauses = re.sub(r'<break time="400ms"/>$', '', para_with_pauses)
            ssml_parts.append(f'<prosody rate="+3%" pitch="+2%">{para_with_pauses}</prosody>')
            ssml_parts.append(f'<break time="700ms"/>')

        else:
            # Narrative: base rate, with sentence-level micro-pauses
            para_with_pauses = re.sub(r'([。！？])', r'\1<break time="350ms"/>', para)
            para_with_pauses = re.sub(r'<break time="350ms"/>$', '', para_with_pauses)

            # Add comma pauses too (shorter)
            para_with_pauses = re.sub(r'([，])', r'\1<break time="150ms"/>', para_with_pauses)

            ssml_parts.append(f'<prosody rate="{BASE_RATE}">{para_with_pauses}</prosody>')
            ssml_parts.append(f'<break time="600ms"/>')

    ssml_parts.append('</speak>')
    return '\n'.join(ssml_parts)


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

    print(f"📄 Extracting text from: {md_path.name}")
    text = extract_text(md_path)
    print(f"   {len(text)} characters")

    print(f"🎭 Building SSML with prosody...")
    ssml = build_ssml(text)
    print(f"   SSML {len(ssml)} chars")

    print(f"🎤 Generating audio with voice: {VOICE}")
    asyncio.run(generate_tts(ssml, output_path))

    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"✅ Saved: {output_path} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
