from pathlib import Path

from PIL import Image


ASSET_ROOT = Path(r"C:\Users\sgmxk\Desktop\AI\repos\github\harunamitrader\harunami_AI_base\showcase\jotei-no-yabo\assets")


for source in ASSET_ROOT.rglob("*.png"):
    destination = source.with_suffix(".webp")
    with Image.open(source) as image:
        image.save(destination, "WEBP", quality=82, method=6)
