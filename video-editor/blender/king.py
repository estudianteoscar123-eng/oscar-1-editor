import bpy, bmesh, math, sys
from mathutils import Vector, Quaternion

# Opción 1 · personaje del trono en Blender Cycles. Mismas medidas que src/k3/KingTest.tsx (three -> blender: (x, -z, y)).
A = sys.argv[sys.argv.index("--") + 1:]
OUT, RES, SAMPLES, FACE = A[0], int(A[1]), int(A[2]), A[3]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
P = lambda x, y, z: Vector((x, -z, y))
def lin(h): h = h.lstrip("#"); return tuple((int(h[i:i + 2], 16) / 255) ** 2.2 for i in (0, 2, 4))
_m = {}
def mat(col, rough=0.6, metal=0.0, emit=0.0, ecol=None):
    k = (col, rough, metal, emit, ecol)
    if k in _m: return _m[k]
    m = bpy.data.materials.new(col); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*lin(col), 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if emit: b.inputs["Emission Color"].default_value = (*lin(ecol or col), 1); b.inputs["Emission Strength"].default_value = emit
    _m[k] = m; return m
def put(o, m, smooth=True, bev=0.0):
    if smooth: bpy.ops.object.shade_smooth()
    if bev: md = o.modifiers.new("b", "BEVEL"); md.width = bev; md.segments = 3
    o.data.materials.append(m); return o
def box(p, s, m, bev=0.012):
    bpy.ops.mesh.primitive_cube_add(location=P(*p)); o = bpy.context.object; o.scale = (s[0] / 2, s[2] / 2, s[1] / 2); bpy.ops.object.transform_apply(scale=True); return put(o, m, False, bev)
def sph(p, r, m, scl=(1, 1, 1), seg=48):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=P(*p), segments=seg, ring_count=seg * 2 // 3); o = bpy.context.object; o.scale = (scl[0], scl[2], scl[1]); return put(o, m)
def cyl(p, r, h, m, axis_rot=None, r2=None, v=40):
    bpy.ops.mesh.primitive_cone_add(vertices=v, radius1=r, radius2=r if r2 is None else r2, depth=h, location=P(*p)); o = bpy.context.object
    if axis_rot: o.rotation_euler = axis_rot
    return put(o, m)
def limb(a, b, r=0.024, m=None):
    a, b = P(*a), P(*b); d = b - a
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d.length, location=(a + b) / 2, vertices=16); o = bpy.context.object
    o.rotation_mode = "QUATERNION"; o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(d.normalized()); put(o, m)
    for q in (a, b):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=q, segments=16, ring_count=8); put(bpy.context.object, m)

BLACK = mat("#141416", 0.5); JACK = mat("#1A1A1E", 0.8); WHITE = mat("#FBFBFB", 0.55)
PANEL = mat("#20262A", 0.6); EDGE = mat("#F2F2F0", 0.4, emit=0.3); LIME = mat("#C8F000", 0.4, emit=2.0, ecol="#B8E600")
FAN = mat("#23302A", 0.6); RING = mat("#2E4A16", 0.6, emit=0.3); CORE = mat("#86D81A", 0.4, emit=3.0, ecol="#6CC000"); GOLD = mat("#E9B820", 0.3, 0.6)
def fan(p, s=1.0):
    cyl(p, 0.36 * s, 0.04, FAN, axis_rot=(math.pi / 2, 0, 0))
    cyl((p[0], p[1], p[2] + 0.025), 0.21 * s, 0.01, RING, axis_rot=(math.pi / 2, 0, 0))
    cyl((p[0], p[1], p[2] + 0.032), 0.13 * s, 0.01, CORE, axis_rot=(math.pi / 2, 0, 0))
def tier(y, z, w):
    box((0, y, z), (w, 0.9, 0.5), PANEL); box((0, y + 0.47, z), (w + 0.02, 0.07, 0.52), EDGE)
    box((0, y + 0.33, z + 0.26), (w * 0.92, 0.06, 0.01), LIME, 0)
    for k in (-1, 0, 1): fan((k * w / 3.2, y - 0.07, z + 0.26))
# set
box((0, 3, -1.6), (12, 8, 0.05), mat("#2E3658", 0.9), 0)
box((2.05, 1.8, -1.4), (0.2, 2.4, 0.2), mat("#D9A62A", 0.5)); box((2.55, 3.0, -1.4), (1.1, 0.2, 0.2), mat("#D9A62A", 0.5))
tier(3.25, -1.25, 2.6); tier(2.3, -1.0, 2.9); tier(1.35, -0.75, 3.1)
box((0, 0.72, 0), (2.0, 0.55, 1.3), PANEL); box((0, 0.85, 0.66), (1.85, 0.08, 0.01), LIME, 0)
for sd in (-1, 1):
    box((sd * 1.25, 0.95, 0.15), (0.55, 1.0, 1.6), PANEL); box((sd * 1.25, 1.47, 0.15), (0.57, 0.08, 1.62), EDGE)
    box((sd * 1.25, 1.2, 0.96), (0.5, 0.07, 0.01), LIME, 0); fan((sd * 1.25, 0.83, 0.96), 0.8)
box((0, 0.0, 0), (12, 0.04, 12), mat("#2E7A2A", 0.9), 0); box((0, 0.23, 0.1), (2.2, 0.45, 1.5), PANEL)

# personaje (origen del grupo three: (0, 1.02, 0.35))
O = (0, 1.02, 0.35)
def R(x, y, z): return (O[0] + x, O[1] + y, O[2] + z)
for sd in (-1, 1):
    limb(R(0.13 * sd, 0.08, 0.15), R(0.15 * sd, 0.0, 0.62), m=BLACK); limb(R(0.15 * sd, 0.0, 0.62), R(0.17 * sd, -0.86, 0.66), m=BLACK)
    sph(R(0.17 * sd, -0.9, 0.72), 0.09, BLACK, scl=(1, 0.7, 1.5))
# cuerpo de frijol (torno)
bm = bmesh.new(); prof = []
for i in range(25):
    a = i / 24; r = math.sqrt(max(0, 1 - ((a - 0.42) / 0.58) ** 2)) * (0.4 - a * 0.12) + 0.02; prof.append((max(0.001, r), a))
for j in range(48):
    th = j / 48 * math.tau
    for (r, y) in prof: bm.verts.new((r * math.cos(th) * 0.86, r * math.sin(th) * 0.86, y))
bm.verts.ensure_lookup_table(); n = len(prof)
for j in range(48):
    for i in range(n - 1):
        a0 = j * n + i; b0 = ((j + 1) % 48) * n + i
        bm.faces.new((bm.verts[a0], bm.verts[b0], bm.verts[b0 + 1], bm.verts[a0 + 1]))
me = bpy.data.meshes.new("bean"); bm.to_mesh(me); body = bpy.data.objects.new("bean", me); bpy.context.collection.objects.link(body)
body.location = P(*R(0, -0.02, 0)); bpy.context.view_layer.objects.active = body; body.select_set(True); put(body, JACK)
LINE = mat("#E8E8E8", 0.5, emit=0.6)
for x in (-0.03, 0.03): box(R(x, 0.48, 0.37), (0.012, 0.62, 0.012), LINE, 0)
for sd in (-1, 1): box(R(sd * 0.2, 0.4, 0.33), (0.13, 0.012, 0.012), LINE, 0)
bpy.ops.mesh.primitive_torus_add(major_radius=0.13, minor_radius=0.05, location=P(*R(0, 0.92, 0))); put(bpy.context.object, JACK)
# brazos
limb(R(-0.3, 0.72, 0.1), R(-0.32, 0.55, 0.42), m=BLACK); limb(R(-0.32, 0.55, 0.42), R(-0.1, 0.98, 0.48), m=BLACK); sph(R(-0.08, 1.02, 0.5), 0.1, BLACK)
limb(R(0.3, 0.72, 0.1), R(0.62, 0.42, 0.25), m=BLACK); limb(R(0.62, 0.42, 0.25), R(0.82, 0.5, 0.3), m=BLACK); sph(R(0.86, 0.52, 0.3), 0.1, BLACK)
# cabeza + cara (casquete con UV propias)
H = R(0, 1.55, 0.02)
sph(H, 0.55, WHITE, scl=(1.04, 1.04, 1), seg=64)
img = bpy.data.images.load(FACE); fm = bpy.data.materials.new("face"); fm.use_nodes = True; fm.blend_method = "BLEND"
nt = fm.node_tree; bsdf = nt.nodes["Principled BSDF"]; tx = nt.nodes.new("ShaderNodeTexImage"); tx.image = img
mix = nt.nodes.new("ShaderNodeMixShader"); tr = nt.nodes.new("ShaderNodeBsdfTransparent"); out = nt.nodes["Material Output"]
nt.links.new(tx.outputs["Color"], bsdf.inputs["Base Color"]); bsdf.inputs["Roughness"].default_value = 0.6
nt.links.new(tx.outputs["Alpha"], mix.inputs["Fac"]); nt.links.new(tr.outputs[0], mix.inputs[1]); nt.links.new(bsdf.outputs[0], mix.inputs[2]); nt.links.new(mix.outputs[0], out.inputs["Surface"])
bm = bmesh.new(); N = 64; RAD = 0.553 * 1.04; ph0, phL, th0, thL = math.pi / 2 - 0.85, 1.7, math.pi / 2 - 0.85, 1.7
grid = []
for i in range(N + 1):
    row = []
    for j in range(N + 1):
        ph = ph0 + phL * j / N; th = th0 + thL * i / N
        x = -RAD * math.cos(ph) * math.sin(th); y = RAD * math.cos(th); z = RAD * math.sin(ph) * math.sin(th)
        row.append(bm.verts.new((x, -z, y)))
    grid.append(row)
uvl = bm.loops.layers.uv.new()
for i in range(N):
    for j in range(N):
        f = bm.faces.new((grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]))
        for lp, (ii, jj) in zip(f.loops, ((i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1))): lp[uvl].uv = (jj / N, 1 - ii / N)
me = bpy.data.meshes.new("face"); bm.to_mesh(me); fo = bpy.data.objects.new("face", me); bpy.context.collection.objects.link(fo)
fo.location = P(*H); me.materials.append(fm)
for p in me.polygons: p.use_smooth = True
# pelo gris y corona
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.565 * 1.04, location=P(H[0], H[1] + 0.02, H[2] - 0.03), segments=48, ring_count=24); hc = bpy.context.object
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="DESELECT"); bpy.ops.object.mode_set(mode="OBJECT")
for v in hc.data.vertices: v.select = v.co.z < 0.565 * 1.04 * math.cos(0.62)
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.delete(type="VERT"); bpy.ops.object.mode_set(mode="OBJECT"); put(hc, mat("#C9CACF", 0.6))
crown_c = P(H[0], H[1] + 0.5, H[2] + 0.05)
bpy.ops.mesh.primitive_cone_add(vertices=40, radius1=0.31 * 0.92, radius2=0.34 * 0.92, depth=0.16 * 0.92, location=crown_c, end_fill_type="NOTHING"); cr = bpy.context.object
md = cr.modifiers.new("s", "SOLIDIFY"); md.thickness = 0.02; put(cr, GOLD)
for i in range(7):
    a = i / 7 * math.tau; h = (0.2 if i % 2 else 0.28) * 0.92
    p = crown_c + Vector((math.sin(a) * 0.33 * 0.92, -math.cos(a) * 0.33 * 0.92, 0.08 * 0.92 + h / 2))
    bpy.ops.mesh.primitive_cone_add(vertices=14, radius1=0.07 * 0.92, depth=h, location=p); put(bpy.context.object, GOLD)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.035, location=p + Vector((0, 0, h / 2 + 0.02))); put(bpy.context.object, GOLD)
# luces (como en three: llave blanca arriba-izquierda, contra azulada, cielo)
def light(kind, p, e, col, size=1.0, tgt=(0, 1.7, 0.3)):
    bpy.ops.object.light_add(type=kind, location=P(*p)); L = bpy.context.object; L.data.energy = e; L.data.color = lin(col)
    if kind == "AREA": L.data.size = size
    L.rotation_euler = (P(*tgt) - L.location).to_track_quat("-Z", "Y").to_euler(); return L
light("AREA", (-2.5, 4, 5), 900, "#FFFFFF", 4); light("AREA", (3, 3, -2), 350, "#B8C8FF", 3)
w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True; w.node_tree.nodes["Background"].inputs["Color"].default_value = (*lin("#9AA8D8"), 1); w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.6
# cámara
bpy.ops.object.camera_add(location=P(0.05, 2.05, 5.7)); C = bpy.context.object; sc.camera = C
C.rotation_mode = "QUATERNION"; C.rotation_quaternion = (P(0.05, 1.82, 0) - C.location).to_track_quat("-Z", "Y")
C.data.sensor_fit = "VERTICAL"; C.data.angle = math.radians(38)
C.data.dof.use_dof = True; C.data.dof.focus_distance = (P(*H) - C.location).length; C.data.dof.aperture_fstop = 4
sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = False; sc.cycles.max_bounces = 4
sc.render.resolution_x = RES; sc.render.resolution_y = int(RES * 16 / 9)
sc.render.use_freestyle = True; sc.render.line_thickness_mode = "RELATIVE"
fs = sc.view_layers[0].freestyle_settings; ls = fs.linesets[0] if len(fs.linesets) else fs.linesets.new("l")
ls.select_by_visibility = True; ls.select_silhouette = True; ls.select_border = True; ls.select_crease = False
if ls.linestyle is None: ls.linestyle = bpy.data.linestyles.new("ls")
ls.linestyle.color = lin("#121214"); ls.linestyle.thickness = 1.8
sc.view_settings.view_transform = "Filmic"; sc.view_settings.look = "Medium High Contrast"; sc.view_settings.exposure = -0.1
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
