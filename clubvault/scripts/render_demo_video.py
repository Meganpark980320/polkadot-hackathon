from __future__ import annotations

import math
import textwrap
from dataclasses import dataclass
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFont

WIDTH = 1280
HEIGHT = 720
FPS = 20
OUTPUT_PATH = Path("/home/traverse/hackathon/clubvault-demo-roughcut.mp4")

BG = (12, 15, 18)
TEXT = (245, 243, 234)
MUTED = (170, 170, 162)
GREEN = (103, 231, 164)
BLUE = (147, 178, 255)
AMBER = (255, 212, 92)
RED = (255, 143, 143)
CARD = (17, 22, 28, 230)
BORDER = (245, 243, 234, 32)


@dataclass
class Scene:
    name: str
    duration: float
    caption: str
    renderer: callable


FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"

FONTS = {
    "title": ImageFont.truetype(FONT_BOLD, 64),
    "hero": ImageFont.truetype(FONT_BOLD, 82),
    "h2": ImageFont.truetype(FONT_BOLD, 34),
    "body": ImageFont.truetype(FONT_REG, 24),
    "small": ImageFont.truetype(FONT_REG, 18),
    "mono": ImageFont.truetype(FONT_MONO, 20),
    "badge": ImageFont.truetype(FONT_BOLD, 16),
}


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def ease(value: float) -> float:
    value = clamp(value)
    return value * value * (3 - 2 * value)


def scene_alpha(progress: float) -> float:
    fade_in = ease(progress / 0.12)
    fade_out = ease((1.0 - progress) / 0.12)
    return clamp(min(fade_in, fade_out))


def mix(start: float, end: float, progress: float) -> float:
    return start + (end - start) * progress


def base_frame() -> Image.Image:
    image = Image.new("RGBA", (WIDTH, HEIGHT), BG + (255,))
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    draw.ellipse((-120, -40, 420, 420), fill=(26, 144, 92, 78))
    draw.ellipse((760, -120, 1350, 340), fill=(53, 112, 211, 56))
    draw.ellipse((920, 480, 1400, 920), fill=(255, 212, 92, 22))
    draw.rounded_rectangle((20, 20, WIDTH - 20, HEIGHT - 20), 28, outline=(255, 255, 255, 12), width=1)
    return Image.alpha_composite(image, overlay)


BASE = base_frame()


def card(draw: ImageDraw.ImageDraw, box, fill=CARD, outline=BORDER, radius=24):
    draw.rounded_rectangle(box, radius, fill=fill, outline=outline, width=1)


def badge(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, fill=(255, 255, 255, 12), border=(255, 255, 255, 40), color=TEXT):
    w = int(draw.textlength(text, font=FONTS["badge"])) + 24
    draw.rounded_rectangle((x, y, x + w, y + 32), 16, fill=fill, outline=border, width=1)
    draw.text((x + 12, y + 7), text, font=FONTS["badge"], fill=color)
    return x + w


def wrap_text(text: str, width: int) -> list[str]:
    return textwrap.wrap(text, width=width, break_long_words=False, break_on_hyphens=False)


def multiline(draw: ImageDraw.ImageDraw, xy, text: str, font, fill, width_chars: int, spacing=6):
    lines = wrap_text(text, width_chars)
    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=font, fill=fill)
        y += font.size + spacing
    return y


def caption_bar(draw: ImageDraw.ImageDraw, text: str):
    box = (54, HEIGHT - 138, WIDTH - 54, HEIGHT - 42)
    draw.rounded_rectangle(box, 22, fill=(8, 10, 12, 220), outline=(255, 255, 255, 22), width=1)
    multiline(draw, (78, HEIGHT - 116), text, FONTS["body"], TEXT, 82, spacing=5)


def hero_header(draw: ImageDraw.ImageDraw, scene_name: str):
    draw.text((72, 56), "POLKADOT SOLIDITY HACKATHON 2026", font=FONTS["small"], fill=MUTED)
    draw.text((72, 84), scene_name.upper(), font=FONTS["badge"], fill=GREEN)
    badge(draw, 936, 56, "POLKADOT HUB TESTNET", fill=(37, 198, 120, 24), border=(103, 231, 164, 60), color=GREEN)


def dashboard(draw: ImageDraw.ImageDraw, title: str, balance: str, member_count: str, threshold: str, status: str, proposals: list[dict], prompt: str = "", draft: tuple[str, str, str] | None = None, form: dict | None = None, highlight: str | None = None):
    hero_header(draw, "Live Demo")
    draw.text((72, 138), "ClubVault", font=FONTS["hero"], fill=TEXT)
    draw.text((74, 228), "Shared treasury for student teams, with proposal-based spending and transparent execution.", font=FONTS["body"], fill=(220, 220, 214))

    card(draw, (790, 96, 1208, 260), fill=(15, 20, 25, 236))
    draw.text((822, 126), "LIVE STATUS", font=FONTS["small"], fill=MUTED)
    draw.text((822, 156), status, font=FONTS["body"], fill=TEXT)
    badge(draw, 822, 204, "0x3Dc5...2c66", fill=(255, 255, 255, 12), border=(255, 255, 255, 36), color=TEXT)
    badge(draw, 986, 204, "0xeED2...20b7", fill=(255, 255, 255, 12), border=(255, 255, 255, 36), color=TEXT)

    card(draw, (72, 284, 612, 520))
    draw.text((102, 316), "VAULT OVERVIEW", font=FONTS["small"], fill=MUTED)
    draw.text((102, 346), title, font=FONTS["h2"], fill=TEXT)

    metric(draw, (102, 398), "BALANCE", balance)
    metric(draw, (280, 398), "MEMBERS", member_count)
    metric(draw, (426, 398), "RULE", threshold)

    draw.text((102, 462), "Create vault", font=FONTS["small"], fill=MUTED)
    input_box(draw, (102, 488, 580, 522), "Hackathon Team Vault", active=highlight == "create")

    card(draw, (632, 284, 1208, 520))
    draw.text((662, 316), "AI PROPOSAL DRAFT", font=FONTS["small"], fill=MUTED)
    input_box(draw, (662, 350, 1178, 420), prompt or "Buy snacks for the team during demo prep, budget 30 PAS.", multiline_box=True, active=highlight == "prompt")
    if draft:
        metric(draw, (662, 438), "DRAFT TITLE", draft[0], value_font=FONTS["small"])
        metric(draw, (884, 438), "DRAFT AMOUNT", draft[1], value_font=FONTS["small"])
        draw.text((662, 478), draft[2], font=FONTS["small"], fill=(220, 220, 214))

    card(draw, (72, 544, 1208, 656))
    draw.text((102, 570), "PROPOSALS", font=FONTS["small"], fill=MUTED)
    x = 102
    for idx, proposal in enumerate(proposals[:2]):
        px = x + idx * 532
        proposal_card(draw, (px, 594, px + 500, 640), proposal, highlight == f"proposal-{idx}")

    if form:
        card(draw, (72, 674, 1208, 708), fill=(0, 0, 0, 0), outline=(0, 0, 0, 0), radius=0)
        form_row(draw, form, highlight)


def metric(draw: ImageDraw.ImageDraw, xy, label: str, value: str, value_font=None):
    value_font = value_font or FONTS["body"]
    x, y = xy
    draw.text((x, y), label, font=FONTS["small"], fill=MUTED)
    draw.text((x, y + 24), value, font=value_font, fill=TEXT)


def input_box(draw: ImageDraw.ImageDraw, box, text: str, multiline_box=False, active=False):
    fill = (0, 0, 0, 42) if not active else (0, 0, 0, 72)
    outline = (255, 255, 255, 30) if not active else (103, 231, 164, 110)
    draw.rounded_rectangle(box, 16, fill=fill, outline=outline, width=2 if active else 1)
    x1, y1, x2, y2 = box
    if multiline_box:
        multiline(draw, (x1 + 16, y1 + 12), text, FONTS["small"], TEXT, 42, spacing=4)
    else:
        draw.text((x1 + 16, y1 + 8), text, font=FONTS["small"], fill=TEXT)


def proposal_card(draw: ImageDraw.ImageDraw, box, proposal: dict, active=False):
    fill = (255, 255, 255, 12) if not active else (255, 255, 255, 20)
    border = (255, 255, 255, 24) if not active else (103, 231, 164, 90)
    draw.rounded_rectangle(box, 18, fill=fill, outline=border, width=1)
    x1, y1, x2, y2 = box
    draw.text((x1 + 16, y1 + 8), proposal["title"], font=FONTS["small"], fill=TEXT)
    draw.text((x1 + 16, y1 + 30), proposal["meta"], font=FONTS["small"], fill=MUTED)
    status_fill = {
        "Pending": (255, 202, 40, 40),
        "Ready": (37, 198, 120, 40),
        "Executed": (83, 132, 255, 40),
    }[proposal["status"]]
    status_color = {
        "Pending": AMBER,
        "Ready": GREEN,
        "Executed": BLUE,
    }[proposal["status"]]
    badge(draw, x2 - 132, y1 + 10, proposal["status"], fill=status_fill, border=(255, 255, 255, 18), color=status_color)


def form_row(draw: ImageDraw.ImageDraw, form: dict, highlight: str | None):
    y = 674
    columns = [
        ("Recipient", (72, y, 332, y + 34), form.get("recipient", ""), highlight == "recipient"),
        ("Amount", (344, y, 520, y + 34), form.get("amount", ""), highlight == "amount"),
        ("Title", (532, y, 844, y + 34), form.get("title", ""), highlight == "title"),
        ("Description", (856, y, 1208, y + 34), form.get("description", ""), highlight == "description"),
    ]
    for label, box, value, active in columns:
        x1, y1, x2, y2 = box
        draw.text((x1, y1 - 18), label.upper(), font=FONTS["small"], fill=MUTED)
        input_box(draw, box, value, active=active)


def hook_scene(image: Image.Image, draw: ImageDraw.ImageDraw, t: float, d: float):
    p = t / d
    hero_header(draw, "Problem")
    draw.text((72, 134), "ClubVault", font=FONTS["hero"], fill=TEXT)
    draw.text((76, 222), "Shared treasury for student teams", font=FONTS["h2"], fill=GREEN)
    paragraph = "Student teams still manage shared money with chats, screenshots, spreadsheets, and personal transfers."
    multiline(draw, (74, 296), paragraph, FONTS["body"], TEXT, 34, spacing=8)

    card(draw, (704, 144, 1196, 520))
    bullets = [
        ("Messy approvals", "Nobody knows who actually approved a payout."),
        ("Weak visibility", "Treasury state lives across chats and bank screenshots."),
        ("Slow decisions", "Teams lose momentum during demos, travel, and reimbursements."),
    ]
    for idx, (head, body) in enumerate(bullets):
        reveal = clamp((p - idx * 0.12) / 0.22)
        if reveal <= 0:
            continue
        alpha = int(255 * reveal)
        y = 186 + idx * 100
        draw.text((742, y), head, font=FONTS["h2"], fill=GREEN + (alpha,))
        multiline(draw, (742, y + 42), body, FONTS["small"], TEXT + (alpha,), 31, spacing=4)


def overview_scene(image: Image.Image, draw: ImageDraw.ImageDraw, t: float, d: float):
    dashboard(
        draw,
        title="ClubVault Demo Vault",
        balance="1.00 PAS",
        member_count="3",
        threshold="2 / 3",
        status="Shared treasury with proposal-based spending",
        proposals=[
            {"title": "Snacks budget", "meta": "30 PAS to 0x8A3...1f2 • 1 / 2 approvals", "status": "Pending"},
            {"title": "Demo editor", "meta": "12 PAS to 0x4B9...c81 • 2 / 2 approvals", "status": "Ready"},
        ],
        prompt="Buy snacks for the team during demo prep, budget 30 PAS.",
        draft=("Snacks budget", "30 PAS", "Auto-generated draft proposal for a team expense."),
    )


def polkadot_scene(image: Image.Image, draw: ImageDraw.ImageDraw, t: float, d: float):
    hero_header(draw, "Why Polkadot Hub")
    draw.text((72, 138), "Why Polkadot Hub", font=FONTS["title"], fill=TEXT)
    multiline(
        draw,
        (74, 224),
        "We keep a familiar Solidity workflow while targeting the Polkadot ecosystem directly. ClubVault ships an EVM-compatible UX on top of Polkadot Hub TestNet.",
        FONTS["body"],
        TEXT,
        38,
        spacing=8,
    )

    card(draw, (704, 138, 1198, 548))
    draw.text((736, 182), "NETWORK", font=FONTS["small"], fill=MUTED)
    draw.text((736, 212), "Polkadot Hub TestNet", font=FONTS["h2"], fill=GREEN)
    draw.text((736, 270), "CHAIN ID", font=FONTS["small"], fill=MUTED)
    draw.text((736, 298), "420420417", font=FONTS["mono"], fill=TEXT)
    draw.text((736, 352), "CONTRACT", font=FONTS["small"], fill=MUTED)
    multiline(draw, (736, 380), "0x3Dc5041c113844030162005a6827ad06308d2c66", FONTS["mono"], TEXT, 28, spacing=4)
    draw.text((736, 470), "GitHub repo is public and connected to the deployed demo.", font=FONTS["small"], fill=(220, 220, 214))


def create_vault_scene(image: Image.Image, draw: ImageDraw.ImageDraw, t: float, d: float):
    p = t / d
    typed_name_len = int(mix(4, 19, p))
    name = "Hackathon Team Vault"[:typed_name_len]
    members_text = "0xAbc...123\n0xDef...456" if p > 0.45 else "0xAbc...123"
    dashboard(
        draw,
        title="No vault created yet" if p < 0.7 else "Hackathon Team Vault",
        balance="0 PAS" if p < 0.7 else "0.00 PAS",
        member_count="0" if p < 0.7 else "3",
        threshold="-" if p < 0.7 else "2 / 3",
        status="Creating a team vault from the dashboard",
        proposals=[],
        prompt="Buy snacks for the team during demo prep, budget 30 PAS.",
        form={
            "recipient": "",
            "amount": "",
            "title": "",
            "description": "",
        },
        highlight="create",
    )
    input_box(draw, (102, 488, 580, 522), name + ("|" if int(t * 2) % 2 == 0 else ""), active=True)
    input_box(draw, (102, 532, 580, 588), members_text, multiline_box=True, active=True)
    draw.text((102, 514), "", font=FONTS["small"], fill=TEXT)
    draw.text((102, 538), "", font=FONTS["small"], fill=TEXT)
    draw.text((102, 538), "", font=FONTS["small"], fill=TEXT)
    draw.text((102, 538), "", font=FONTS["small"], fill=TEXT)
    draw.text((102, 538), "", font=FONTS["small"], fill=TEXT)
    draw.text((102, 538), "", font=FONTS["small"], fill=TEXT)
    draw.text((102, 538), "", font=FONTS["small"], fill=TEXT)
    draw.text((102, 538), "", font=FONTS["small"], fill=TEXT)
    draw.text((102, 538), "", font=FONTS["small"], fill=TEXT)
    if p > 0.72:
        badge(draw, 432, 458, "VAULT CREATED", fill=(37, 198, 120, 30), border=(103, 231, 164, 80), color=GREEN)


def deposit_scene(image: Image.Image, draw: ImageDraw.ImageDraw, t: float, d: float):
    p = t / d
    balance = mix(0.08, 1.00, ease(min(p * 1.25, 1.0)))
    dashboard(
        draw,
        title="ClubVault Demo Vault",
        balance=f"{balance:0.2f} PAS",
        member_count="3",
        threshold="2 / 3",
        status="Depositing native assets into the shared vault",
        proposals=[],
        prompt="Buy snacks for the team during demo prep, budget 30 PAS.",
        form={"recipient": "", "amount": "", "title": "", "description": ""},
    )
    input_box(draw, (102, 488, 580, 522), "0.25 PAS", active=False)
    input_box(draw, (102, 534, 362, 568), f"{mix(0.10, 1.00, p):0.2f}", active=True)
    badge(draw, 378, 534, "DEPOSIT", fill=(255, 255, 255, 16), border=(255, 255, 255, 40), color=TEXT)


def ai_scene(image: Image.Image, draw: ImageDraw.ImageDraw, t: float, d: float):
    prompt_full = "Buy snacks for the team during demo prep, budget 30 PAS."
    reveal = max(1, int(len(prompt_full) * clamp(t / (d * 0.55))))
    draft = None
    if t > d * 0.58:
        draft = ("Snacks budget", "30 PAS", "Auto-generated draft proposal for a team expense.")
    dashboard(
        draw,
        title="ClubVault Demo Vault",
        balance="1.00 PAS",
        member_count="3",
        threshold="2 / 3",
        status="Generating an offchain AI draft helper",
        proposals=[],
        prompt=prompt_full[:reveal] + ("|" if int(t * 3) % 2 == 0 and reveal < len(prompt_full) else ""),
        draft=draft,
        form={"recipient": "", "amount": "", "title": "", "description": ""},
        highlight="prompt",
    )
    if draft:
        badge(draw, 1036, 438, "DRAFT READY", fill=(37, 198, 120, 30), border=(103, 231, 164, 80), color=GREEN)


def proposal_scene(image: Image.Image, draw: ImageDraw.ImageDraw, t: float, d: float):
    p = t / d
    form = {
        "recipient": "0x8A3...1f2",
        "amount": "0.30 PAS" if p > 0.12 else "",
        "title": "Snacks budget" if p > 0.24 else "",
        "description": "Buy snacks for the final demo session." if p > 0.38 else "",
    }
    proposals = []
    if p > 0.55:
        proposals.append({"title": "Snacks budget", "meta": "0.30 PAS to 0x8A3...1f2 • 0 / 2 approvals", "status": "Pending"})
    dashboard(
        draw,
        title="ClubVault Demo Vault",
        balance="1.00 PAS",
        member_count="3",
        threshold="2 / 3",
        status="Submitting a spend request with recipient, amount, and reason",
        proposals=proposals,
        prompt="Buy snacks for the team during demo prep, budget 30 PAS.",
        draft=("Snacks budget", "30 PAS", "Auto-generated draft proposal for a team expense."),
        form=form,
        highlight="description" if p > 0.35 and p < 0.52 else ("title" if p > 0.2 else "recipient"),
    )
    if p > 0.58:
        badge(draw, 1000, 568, "PROPOSAL CREATED", fill=(37, 198, 120, 30), border=(103, 231, 164, 80), color=GREEN)


def execute_scene(image: Image.Image, draw: ImageDraw.ImageDraw, t: float, d: float):
    p = t / d
    if p < 0.34:
        proposal = {"title": "Snacks budget", "meta": "0.30 PAS to 0x8A3...1f2 • 1 / 2 approvals", "status": "Pending"}
        status = "Approving the proposal with a simple majority"
    elif p < 0.66:
        proposal = {"title": "Snacks budget", "meta": "0.30 PAS to 0x8A3...1f2 • 2 / 2 approvals", "status": "Ready"}
        status = "The proposal is now ready to execute"
    else:
        proposal = {"title": "Snacks budget", "meta": "0.30 PAS to 0x8A3...1f2 • 2 / 2 approvals", "status": "Executed"}
        status = "The payout is executed transparently onchain"

    dashboard(
        draw,
        title="ClubVault Demo Vault",
        balance="0.70 PAS" if p > 0.66 else "1.00 PAS",
        member_count="3",
        threshold="2 / 3",
        status=status,
        proposals=[proposal, {"title": "Travel budget", "meta": "0.10 PAS to 0x4B9...c81 • 0 / 2 approvals", "status": "Pending"}],
        prompt="Buy snacks for the team during demo prep, budget 30 PAS.",
        draft=("Snacks budget", "30 PAS", "Auto-generated draft proposal for a team expense."),
        form={"recipient": "", "amount": "", "title": "", "description": ""},
        highlight="proposal-0",
    )
    if p > 0.35:
        badge(draw, 986, 438, "APPROVED", fill=(37, 198, 120, 30), border=(103, 231, 164, 80), color=GREEN)
    if p > 0.68:
        badge(draw, 950, 568, "ONCHAIN EXECUTION", fill=(83, 132, 255, 30), border=(147, 178, 255, 80), color=BLUE)


def closing_scene(image: Image.Image, draw: ImageDraw.ImageDraw, t: float, d: float):
    hero_header(draw, "Closing")
    draw.text((72, 136), "ClubVault is live", font=FONTS["title"], fill=TEXT)
    multiline(
        draw,
        (74, 218),
        "The working contract is deployed on Polkadot Hub TestNet, the frontend is connected, and the repository is public for judges to inspect.",
        FONTS["body"],
        TEXT,
        38,
        spacing=8,
    )
    card(draw, (72, 350, 1208, 604))
    draw.text((112, 392), "GITHUB", font=FONTS["small"], fill=MUTED)
    multiline(draw, (112, 422), "github.com/Meganpark980320/polkadot-hackathon", FONTS["mono"], GREEN, 52, spacing=6)
    draw.text((112, 492), "CONTRACT", font=FONTS["small"], fill=MUTED)
    multiline(draw, (112, 522), "0x3Dc5041c113844030162005a6827ad06308d2c66", FONTS["mono"], TEXT, 48, spacing=6)
    badge(draw, 878, 392, "POLKADOT HUB TESTNET", fill=(37, 198, 120, 24), border=(103, 231, 164, 60), color=GREEN)
    badge(draw, 878, 438, "VAULT #1 SEEDED", fill=(83, 132, 255, 24), border=(147, 178, 255, 60), color=BLUE)
    badge(draw, 878, 484, "READY FOR SUBMISSION", fill=(255, 212, 92, 24), border=(255, 212, 92, 60), color=AMBER)


SCENES = [
    Scene(
        "Problem",
        18.0,
        "Student teams still manage money with chats, screenshots, spreadsheets, and personal transfers. ClubVault turns that messy flow into a shared onchain treasury.",
        hook_scene,
    ),
    Scene(
        "Overview",
        16.0,
        "ClubVault is a lightweight treasury app for hackathon teams, student clubs, and study groups. Members deposit funds, submit proposals, approve them, and execute payouts transparently.",
        overview_scene,
    ),
    Scene(
        "Why Polkadot Hub",
        16.0,
        "We keep a familiar Solidity workflow while targeting the Polkadot ecosystem directly. The product is already deployed on Polkadot Hub TestNet.",
        polkadot_scene,
    ),
    Scene(
        "Create Vault",
        22.0,
        "First, a team creates a shared vault. The creator is automatically added, extra member addresses can be included at setup, and the treasury starts with a simple majority rule.",
        create_vault_scene,
    ),
    Scene(
        "Deposit",
        16.0,
        "Next, a team member deposits native assets into the shared treasury. The balance becomes visible immediately in the dashboard before any spending happens.",
        deposit_scene,
    ),
    Scene(
        "AI Draft",
        18.0,
        "We also added an offchain AI draft helper. It does not control funds. It only helps members turn plain language into a cleaner proposal draft.",
        ai_scene,
    ),
    Scene(
        "Proposal",
        20.0,
        "After that, a member submits a spending proposal with a recipient, an amount, and a reason for the expense. The full request becomes visible to the team.",
        proposal_scene,
    ),
    Scene(
        "Approve and Execute",
        20.0,
        "Once the proposal reaches a simple majority, it becomes executable. That means the team cannot spend before approval, and the payout is executed transparently onchain afterwards.",
        execute_scene,
    ),
    Scene(
        "Closing",
        14.0,
        "ClubVault is live on Polkadot Hub TestNet, connected to a working frontend, and ready for hackathon submission.",
        closing_scene,
    ),
]


def render_frame(scene: Scene, local_t: float) -> np.ndarray:
    progress = clamp(local_t / scene.duration)
    alpha = scene_alpha(progress)
    image = BASE.copy()
    content = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(content, "RGBA")
    scene.renderer(content, draw, local_t, scene.duration)
    caption_bar(draw, scene.caption)

    if alpha < 1.0:
        arr = np.array(content, dtype=np.uint8)
        arr[..., 3] = (arr[..., 3].astype(np.float32) * alpha).astype(np.uint8)
        content = Image.fromarray(arr, "RGBA")

    frame = Image.alpha_composite(image, content).convert("RGB")
    return np.array(frame)


def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    total_duration = sum(scene.duration for scene in SCENES)
    print(f"Rendering {total_duration:.1f}s video to {OUTPUT_PATH}")

    with imageio.get_writer(
        OUTPUT_PATH,
        fps=FPS,
        codec="libx264",
        format="FFMPEG",
        pixelformat="yuv420p",
        ffmpeg_log_level="warning",
        macro_block_size=None,
    ) as writer:
        for scene in SCENES:
            frame_count = int(scene.duration * FPS)
            print(f"Scene: {scene.name} ({frame_count} frames)")
            for frame_index in range(frame_count):
                local_t = frame_index / FPS
                writer.append_data(render_frame(scene, local_t))

    print(f"Done: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
