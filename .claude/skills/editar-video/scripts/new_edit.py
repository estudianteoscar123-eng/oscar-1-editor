"""Crea una edición nueva a partir de la plantilla aprobada (src/ee46f) y la registra en Root.tsx.

Uso (desde la raíz del repo, después de prep_video.py):
  python3 -I .claude/skills/editar-video/scripts/new_edit.py <slug> <Componente>

Ejemplo: new_edit.py disciplina Disciplina  ->  src/disciplina/*, composición "Disciplina".
Copia theme/shapes/Captions/Main/Scenes/timeline, apunta las rutas a public/<slug>/ y fija la duración
con data.json. Lo que es propio de cada video (timeline.ts, Scenes.tsx, textos de la tarjeta y del
cierre en Main.tsx) se reescribe después a mano.
"""
import json
import pathlib
import re
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parents[4]
VE = ROOT / "video-editor"
TEMPLATE = VE / "src" / "ee46f"

slug, comp = sys.argv[1], sys.argv[2]
if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", slug) or not re.fullmatch(r"[A-Z][A-Za-z0-9]*", comp):
    sys.exit("slug en minúsculas (a-z, 0-9, -) y Componente en PascalCase")
data = VE / "public" / slug / "data.json"
if not data.exists():
    sys.exit(f"Falta {data}: corre antes prep_video.py")
frames = json.load(open(data))["frames"]
dst = VE / "src" / slug
if dst.exists():
    sys.exit(f"{dst} ya existe")
shutil.copytree(TEMPLATE, dst)

for f in dst.glob("*.ts*"):
    s = f.read_text()
    s = s.replace("public/ee46/data.json", f"public/{slug}/data.json")
    s = s.replace('"ee46/aroll.mp4"', f'"{slug}/aroll.mp4"').replace('"ee46/voz.wav"', f'"{slug}/voz.wav"')
    s = s.replace("export const EE46F", f"export const {comp}")
    s = re.sub(r"export const TOTAL = \d+;", f"export const TOTAL = {frames};", s)
    f.write_text(s)

root = VE / "src" / "Root.tsx"
r = root.read_text()
imp = f'import {{ {comp} }} from "./{slug}/Main";\n'
if imp not in r:
    r = r.replace('import { Composition } from "remotion";\n', 'import { Composition } from "remotion";\n' + imp, 1)
    r = r.replace(
        "    <>\n",
        f'    <>\n      <Composition\n        id="{comp}"\n        component={{{comp}}}\n        durationInFrames={{{frames}}}\n        fps={{30}}\n        width={{1080}}\n        height={{1920}}\n      />\n',
        1,
    )
    root.write_text(r)
print(f"src/{slug}/ creado; composición {comp} ({frames} fotogramas) registrada en Root.tsx")
