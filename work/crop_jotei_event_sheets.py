from pathlib import Path
from PIL import Image


SOURCE_DIR = Path(r"C:\Users\sgmxk\.codex\generated_images\019fa379-bbbb-7632-a5ea-169447abbaa6")
OUTPUT_DIR = Path(r"C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\showcase\jotei-no-yabo\assets\events")

SHEETS = {
    "exec-94c241ed-62af-402f-a009-78c446e6ac5a.png": [
        "1949-tse-reopening", "1950-korean-boom", "1964-tokyo-olympics", "1965-securities-recession",
    ],
    "exec-5cc9aa31-59f0-41ce-8b0a-34924f2fb9cb.png": [
        "1971-nixon-shock", "1973-oil-shock", "1979-second-oil", "1985-plaza-accord",
    ],
    "exec-c370f031-6341-486a-8c6b-dd12414e9cc0.png": [
        "1987-black-monday", "1989-bubble-peak", "1990-bubble-collapse", "1997-financial-crisis",
    ],
    "exec-66bdd90e-0ad2-4a53-bbb0-dcb0e1a334a9.png": [
        "1999-it-bubble", "2008-lehman-shock", "2013-monetary-easing", "2020-covid-shock",
    ],
}


def crop_sheet(source: Path, names: list[str]) -> None:
    with Image.open(source) as image:
        width, height = image.size
        x_mid, y_mid = width // 2, height // 2
        boxes = [(0, 0, x_mid, y_mid), (x_mid, 0, width, y_mid), (0, y_mid, x_mid, height), (x_mid, y_mid, width, height)]
        for name, box in zip(names, boxes):
            image.crop(box).save(OUTPUT_DIR / f"{name}.png", optimize=True)


OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
for filename, names in SHEETS.items():
    crop_sheet(SOURCE_DIR / filename, names)

Image.open(SOURCE_DIR / "exec-a4d41443-0610-4444-a83b-2cd8017a482e.png").save(OUTPUT_DIR.parent / "empress-key-visual.png", optimize=True)
Image.open(SOURCE_DIR / "exec-73b1b5f8-c9de-4ce2-b44f-b2367605e675.png").save(OUTPUT_DIR.parent / "game-over-visual.png", optimize=True)
