import bpy, math, sys
from mathutils import Vector, Euler, Quaternion

# Opción 1 · recreación del fotograma de referencia (restaurante) en Blender Cycles.
# Mismas medidas que src/k3/RefTest.tsx. Conversión: three (x, y, z) -> blender (x, -z, y).
OUT = sys.argv[sys.argv.index("--") + 1]
RES = int(sys.argv[sys.argv.index("--") + 2]) if len(sys.argv) > sys.argv.index("--") + 2 else 540
SAMPLES = int(sys.argv[sys.argv.index("--") + 3]) if len(sys.argv) > sys.argv.index("--") + 3 else 128
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
P = lambda x, y, z: Vector((x, -z, y))
R = lambda rx=0, ry=0, rz=0: Euler((rx, -rz, ry))
def lin(h):
    h = h.lstrip("#"); return tuple((int(h[i:i + 2], 16) / 255) ** 2.2 for i in (0, 2, 4))
_mats = {}
def mat(col, rough=0.6, emit=0.0):
    k = (col, rough, emit)
    if k in _mats: return _mats[k]
    m = bpy.data.materials.new(col); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*lin(col), 1); b.inputs["Roughness"].default_value = rough
    b.inputs["Specular IOR Level"].default_value = 0.35
    if emit:
        b.inputs["Emission Color"].default_value = (*lin(col), 1); b.inputs["Emission Strength"].default_value = emit
    _mats[k] = m; return m
def fin(o, col, rough=0.6, bev=0.0, smooth=True, emit=0.0):
    if smooth: bpy.ops.object.shade_smooth()
    if bev:
        md = o.modifiers.new("b", "BEVEL"); md.width = bev; md.segments = 3; md.limit_method = "ANGLE"
    o.data.materials.append(mat(col, rough, emit)); return o
def box(p, s, col, rough=0.6, bev=0.015, rot=None):
    bpy.ops.mesh.primitive_cube_add(location=P(*p)); o = bpy.context.object
    o.scale = (s[0] / 2, s[2] / 2, s[1] / 2)
    if rot: o.rotation_euler = R(*rot)
    bpy.ops.object.transform_apply(scale=True); return fin(o, col, rough, bev, smooth=False)
def cyl(p, r1, r2, h, col, rough=0.4, rot=None, v=40, emit=0.0):
    bpy.ops.mesh.primitive_cone_add(vertices=v, radius1=r2, radius2=r1, depth=h, location=P(*p)); o = bpy.context.object
    if rot: o.rotation_euler = R(*rot)
    return fin(o, col, rough, min(0.008, h / 4), emit=emit)
def sph(p, r, col, rough=0.5, scl=(1, 1, 1), rot=None, cut=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=P(*p), segments=64, ring_count=40); o = bpy.context.object
    o.scale = (scl[0], scl[2], scl[1])
    if cut is not None:
        bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="DESELECT"); bpy.ops.object.mode_set(mode="OBJECT")
        for v in o.data.vertices: v.select = v.co.z < r * math.cos(cut)
        bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.delete(type="VERT"); bpy.ops.object.mode_set(mode="OBJECT")
        md = o.modifiers.new("s", "SOLIDIFY"); md.thickness = 0.03
    if rot: o.rotation_euler = R(*rot)
    return fin(o, col, rough)
def arc(p, r, thick, frac, col, rot):
    bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=thick, location=P(*p), major_segments=48, minor_segments=10)
    o = bpy.context.object
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="DESELECT"); bpy.ops.object.mode_set(mode="OBJECT")
    lim = math.pi * (1 - frac) / 2
    for v in o.data.vertices:
        a = math.atan2(v.co.y, v.co.x)
        v.select = not (lim <= a <= math.pi - lim)
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.delete(type="VERT"); bpy.ops.object.mode_set(mode="OBJECT")
    o.rotation_euler = R(*rot); return fin(o, col, 0.6)

# ---- set ----
box((0, 2.4, -1.3), (10, 7, 0.05), "#EAD69C", 0.95, 0)
box((0, 4.55, -1.2), (10, 0.16, 0.06), "#D99A3A", 0.6)
box((1.15, 3.45, -1.1), (2.9, 1.2, 0.14), "#F4C52A", 0.4, 0.04)
bpy.ops.object.text_add(location=P(1.15, 3.42, -1.02)); tx = bpy.context.object
tx.rotation_euler = (math.radians(90), 0, 0)
tx.data.body = "POSADA"; tx.data.align_x = "CENTER"; tx.data.align_y = "CENTER"; tx.data.size = 0.62; tx.data.extrude = 0.045; tx.data.bevel_depth = 0.008; tx.data.shear = 0.15
tx.data.materials.append(mat("#E1261A", 0.45))
box((0.95, 2.48, -0.92), (3.6, 0.1, 0.6), "#D2701F", 0.55)
box((0.95, 2.41, -0.92), (3.6, 0.06, 0.6), "#5A2210", 0.8)
for i in range(8):
    cyl((-0.25 + i * 0.36, 2.72, -0.95), 0.2, 0.2, 0.05, "#F6F0E2", 0.3, rot=(math.pi / 2 - 0.15, 0, 0))
box((-0.05, 1.82, -1.05), (1.2, 0.95, 0.06), "#F7F4EC", 0.3)
for i in range(1, 5):
    box((-0.65 + i * 0.24, 1.82, -1.015), (0.02, 0.93, 0.01), "#9C9184", 0.6, 0)
box((0, 1.18, -0.7), (6, 0.5, 0.4), "#E2321C", 0.35)
box((-0.2, 1.5, -0.6), (0.34, 0.14, 0.22), "#EFD13B", 0.8)
box((-0.2, 1.6, -0.6), (0.34, 0.05, 0.22), "#2FA84C", 0.8)
box((0, 0.8, 0.95), (6, 0.18, 1.6), "#F2EBDD", 0.3)
def stack(p, n, stripes):
    for i in range(n):
        y = p[1] + i * 0.052; x = p[0] + math.sin(i * 2.1) * 0.012
        cyl((x, y, p[2]), 0.36, 0.3, 0.045, "#F6F0E2", 0.25, rot=(math.sin(y * 13) * 0.03, 0, math.cos(y * 11) * 0.03), emit=0.08)
        if i % 2 == 0:
            bpy.ops.mesh.primitive_torus_add(major_radius=0.355, minor_radius=0.008, location=P(x, y + 0.006, p[2]), major_segments=48)
            bpy.context.object.data.materials.append(mat(stripes[(i // 2) % len(stripes)], 0.4))
stack((-1.0, 0.97, 0.75), 34, ["#E58A4E", "#6FA9D8"])
stack((-0.75, 0.97, 0.05), 40, ["#7AB2DE", "#E58A4E"])
stack((1.55, 0.97, 0.55), 48, ["#5DB873", "#7AB2DE"])

# ---- muñeco ----
G = (0.55, 1.12, 0.3); ry = -0.32
def rel(dx, dy, dz):
    c, s = math.cos(ry), math.sin(ry)
    return (G[0] + dx * c + dz * s, G[1] + dy, G[2] - dx * s + dz * c)
WHITE = "#F8F6F1"
sph(rel(0, 0, 0), 0.4, WHITE, 0.45)
H = rel(0, 0.74, 0)
sph(H, 0.55, WHITE, 0.42, scl=(1, 0.97, 1))
sph((H[0], H[1] + 0.02, H[2]), 0.575, "#2E1A10", 0.6, cut=math.pi * 0.4, rot=(0, ry, 0))
for sd in (-1, 1):
    bpy.ops.mesh.primitive_cone_add(radius1=0.12, depth=0.26, location=P(*rel(0.4 * sd, 1.1, 0.02)))
    o = bpy.context.object; o.rotation_euler = R(0.1, ry, sd * -0.75); fin(o, "#F3EFE6", 0.5)
GR = "#6E6A66"
for sd in (-1, 1):
    arc(rel(0.19 * sd, 0.79, 0.52), 0.095, 0.02, 1.0, GR, (math.pi / 2, ry + sd * 0.32, 0))
    bpy.ops.mesh.primitive_cylinder_add(radius=0.018, depth=0.2, location=P(*rel(0.19 * sd, 0.98, 0.5)))
    o = bpy.context.object; o.rotation_euler = R(0, ry + sd * 0.32, math.pi / 2 + sd * -0.12); fin(o, GR, 0.6)
arc(rel(0.02, 0.57, 0.53), 0.13, 0.017, 0.8, GR, (-math.pi / 2, ry, 0))
sph(rel(-0.42, 0.62, 0.32), 0.09, WHITE, 0.45)
cyl(rel(-0.32, 0.7, 0.38), 0.2, 0.2, 0.03, "#F6F0E2", 0.3, rot=(1.35, ry, 0.3))

# ---- luz ----
def light(kind, p, energy, col, size=1.0, target=None):
    bpy.ops.object.light_add(type=kind, location=P(*p)); L = bpy.context.object
    L.data.energy = energy; L.data.color = lin(col)
    if kind == "AREA": L.data.size = size
    else: L.data.shadow_soft_size = size
    if target: L.rotation_euler = (P(*target) - L.location).to_track_quat("-Z", "Y").to_euler()
    return L
light("AREA", (-3.2, 5.5, 2.2), 1400, "#FFD98F", 3.5, (0.5, 1.6, 0))
light("POINT", (0.9, 2.9, 0.9), 160, "#FFC870", 0.6)
light("POINT", (-1.5, 1.4, 2.2), 70, "#FFE7C0", 1.0)
w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
w.node_tree.nodes["Background"].inputs["Color"].default_value = (*lin("#F3DDA8"), 1); w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.5

# ---- cámara (misma que RefTest: posición, mirada, lente vertical 50°, giro -0,13 rad) ----
bpy.ops.object.camera_add(location=P(-0.25, 0.95, 4.7)); C = bpy.context.object; sc.camera = C
q = (P(0.62, 2.18, -0.6) - C.location).to_track_quat("-Z", "Y")
C.rotation_mode = "QUATERNION"; C.rotation_quaternion = q @ Quaternion((0, 0, 1), -0.13)
C.data.sensor_fit = "VERTICAL"; C.data.angle = math.radians(44)
C.data.dof.use_dof = True; C.data.dof.focus_distance = (P(*G) + Vector((0, 0, 0.7)) - C.location).length; C.data.dof.aperture_fstop = 2.2

# ---- render ----
sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = False
sc.cycles.max_bounces = 4; sc.cycles.diffuse_bounces = 3; sc.cycles.glossy_bounces = 2; sc.cycles.transparent_max_bounces = 2
sc.render.resolution_x = RES; sc.render.resolution_y = int(RES * 16 / 9)
sc.render.use_freestyle = True; sc.render.line_thickness_mode = "RELATIVE"; sc.render.line_thickness = 1.0
fs = sc.view_layers[0].freestyle_settings
ls = fs.linesets[0] if len(fs.linesets) else fs.linesets.new("l")
ls.select_by_visibility = True; ls.select_silhouette = True; ls.select_border = True; ls.select_crease = False
if ls.linestyle is None: ls.linestyle = bpy.data.linestyles.new("ls")
ls.linestyle.color = lin("#2B160C"); ls.linestyle.thickness = 1.7
sc.view_settings.view_transform = "Filmic"; sc.view_settings.look = "Medium High Contrast"; sc.view_settings.exposure = 0.25
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
