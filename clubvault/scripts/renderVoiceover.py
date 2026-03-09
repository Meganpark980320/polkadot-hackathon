import asyncio
import re
import shutil
import subprocess
from pathlib import Path

import edge_tts
import imageio_ffmpeg

ROOT = Path("/home/traverse/hackathon")
VIDEO_MP4 = ROOT / "clubvault-demo-screenrecording-3min-final.mp4"
VIDEO_WEBM = ROOT / "clubvault-demo-screenrecording-3min-final.webm"
OUTPUT_AUDIO_WAV = ROOT / "clubvault-demo-screenrecording-3min-voiceover.wav"
OUTPUT_MP4 = ROOT / "clubvault-demo-screenrecording-3min-final-vo.mp4"
OUTPUT_WEBM = ROOT / "clubvault-demo-screenrecording-3min-final-vo.webm"
WORKDIR = ROOT / ".voiceover-build"
VOICE = "en-US-AvaMultilingualNeural"
RATE = "-4%"
VIDEO_DURATION = 180.04
MIN_GAP = 0.6
SAMPLE_RATE = 48000

SEGMENTS = [
    {
        "start": 0.0,
        "slug": "intro",
        "text": (
            "This is ClubVault, a shared treasury for student teams built on Polkadot Hub. "
            "Instead of managing money in chats and spreadsheets, the group can move spending "
            "decisions into one transparent flow."
        ),
    },
    {
        "start": 18.0,
        "slug": "create-vault",
        "text": (
            "We start by creating a vault for the team. The creator is added automatically, "
            "and the app sets a simple approval rule that is easy to understand during a fast student project."
        ),
    },
    {
        "start": 39.0,
        "slug": "deposit",
        "text": (
            "Next, we deposit P A S into the vault. This gives the group a real shared balance "
            "that can be spent only through proposals, approvals, and onchain execution."
        ),
    },
    {
        "start": 57.0,
        "slug": "ai-helper",
        "text": (
            "ClubVault also includes an offchain A I helper. The helper turns plain language "
            "into a cleaner proposal draft, but it does not control funds and it does not execute anything by itself."
        ),
    },
    {
        "start": 87.0,
        "slug": "edit-draft",
        "text": (
            "After generating the draft, we copy the text into the proposal form and tighten the "
            "title and description so the spending request is short, clear, and easy for teammates to review."
        ),
    },
    {
        "start": 112.0,
        "slug": "create-proposal",
        "text": (
            "Then we add the recipient address and create the proposal. At this point the request "
            "becomes visible to everyone in the vault, together with the requested amount and current approval status."
        ),
    },
    {
        "start": 136.0,
        "slug": "approve",
        "text": (
            "Now the team approves the request. As soon as the approval threshold is met, the proposal "
            "moves into a ready to execute state instead of relying on side messages or manual tracking."
        ),
    },
    {
        "start": 159.0,
        "slug": "execute",
        "text": (
            "Finally, we execute the proposal. The vault balance and proposal status update in one clean flow, "
            "which makes the treasury activity easy to demo and easy to audit."
        ),
    },
    {
        "start": 176.0,
        "slug": "close",
        "text": (
            "That is ClubVault: simple shared spending, transparent approvals, and clean execution on Polkadot Hub."
        ),
    },
]


async def main():
    if WORKDIR.exists():
        shutil.rmtree(WORKDIR)
    WORKDIR.mkdir(parents=True)

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    await synthesize_segments(ffmpeg)
    build_timed_audio(ffmpeg)
    mux_outputs(ffmpeg)

    print(OUTPUT_AUDIO_WAV)
    print(OUTPUT_MP4)
    print(OUTPUT_WEBM)


async def synthesize_segments(ffmpeg):
    for index, segment in enumerate(SEGMENTS):
        mp3_path = WORKDIR / f"{index:02d}-{segment['slug']}.mp3"
        wav_path = WORKDIR / f"{index:02d}-{segment['slug']}.wav"

        communicate = edge_tts.Communicate(segment["text"], VOICE, rate=RATE)
        await communicate.save(mp3_path.as_posix())

        duration = probe_duration(ffmpeg, mp3_path)
        slot_end = SEGMENTS[index + 1]["start"] if index + 1 < len(SEGMENTS) else VIDEO_DURATION
        target_duration = max(slot_end - segment["start"] - MIN_GAP, 0.5)

        adjusted_source = mp3_path
        if duration > target_duration:
            ratio = duration / target_duration
            adjusted_source = WORKDIR / f"{index:02d}-{segment['slug']}-fit.mp3"
            run(
                ffmpeg,
                [
                    "-y",
                    "-i",
                    mp3_path.as_posix(),
                    "-filter:a",
                    atempo_chain(ratio),
                    adjusted_source.as_posix(),
                ],
            )
            duration = probe_duration(ffmpeg, adjusted_source)

        run(
            ffmpeg,
            [
                "-y",
                "-i",
                adjusted_source.as_posix(),
                "-ar",
                str(SAMPLE_RATE),
                "-ac",
                "1",
                wav_path.as_posix(),
            ],
        )

        segment["audio"] = wav_path
        segment["duration"] = duration


def build_timed_audio(ffmpeg):
    concat_list = WORKDIR / "concat.txt"
    current_time = 0.0
    concat_entries = []

    for index, segment in enumerate(SEGMENTS):
        gap = max(segment["start"] - current_time, 0.0)
        if gap > 0.02:
            silence_path = WORKDIR / f"silence-{index:02d}.wav"
            create_silence(ffmpeg, gap, silence_path)
            concat_entries.append(silence_path)
            current_time += gap

        concat_entries.append(segment["audio"])
        current_time = segment["start"] + segment["duration"]

    trailing = max(VIDEO_DURATION - current_time, 0.0)
    if trailing > 0.02:
        silence_path = WORKDIR / "silence-end.wav"
        create_silence(ffmpeg, trailing, silence_path)
        concat_entries.append(silence_path)

    concat_list.write_text(
        "".join(f"file '{path.as_posix()}'\n" for path in concat_entries),
        encoding="utf-8",
    )

    run(
        ffmpeg,
        [
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            concat_list.as_posix(),
            "-af",
            "loudnorm=I=-16:LRA=11:TP=-1.5",
            OUTPUT_AUDIO_WAV.as_posix(),
        ],
    )


def mux_outputs(ffmpeg):
    run(
        ffmpeg,
        [
            "-y",
            "-i",
            VIDEO_MP4.as_posix(),
            "-i",
            OUTPUT_AUDIO_WAV.as_posix(),
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-shortest",
            OUTPUT_MP4.as_posix(),
        ],
    )

    run(
        ffmpeg,
        [
            "-y",
            "-i",
            VIDEO_WEBM.as_posix(),
            "-i",
            OUTPUT_AUDIO_WAV.as_posix(),
            "-c:v",
            "copy",
            "-c:a",
            "libopus",
            "-b:a",
            "160k",
            "-shortest",
            OUTPUT_WEBM.as_posix(),
        ],
    )


def create_silence(ffmpeg, duration, output_path):
    run(
        ffmpeg,
        [
            "-y",
            "-f",
            "lavfi",
            "-i",
            f"anullsrc=r={SAMPLE_RATE}:cl=mono",
            "-t",
            f"{duration:.3f}",
            output_path.as_posix(),
        ],
    )


def probe_duration(ffmpeg, media_path):
    result = subprocess.run(
        [ffmpeg, "-i", media_path.as_posix()],
        capture_output=True,
        text=True,
        check=False,
    )
    match = re.search(r"Duration: (\d\d):(\d\d):(\d\d\.\d\d)", result.stderr)
    if not match:
        raise RuntimeError(f"Could not determine duration for {media_path}")
    hours, minutes, seconds = match.groups()
    return int(hours) * 3600 + int(minutes) * 60 + float(seconds)


def atempo_chain(ratio):
    factors = []
    remaining = ratio

    while remaining > 2.0:
        factors.append(2.0)
        remaining /= 2.0

    while remaining < 0.5:
        factors.append(0.5)
        remaining /= 0.5

    factors.append(remaining)
    return ",".join(f"atempo={factor:.5f}" for factor in factors)


def run(ffmpeg, arguments):
    subprocess.run([ffmpeg, *arguments], check=True, capture_output=True, text=True)


if __name__ == "__main__":
    asyncio.run(main())
