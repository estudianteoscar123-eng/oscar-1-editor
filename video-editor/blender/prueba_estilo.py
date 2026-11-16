import bpy, math, sys
from mathutils import Vector

# Prueba de estilo en Blender: misma escena que ToonTest (posada, platos, muñeco), luz cálida suave, contorno Freestyle.
OUT = sys.argv[sys.argv.index("--") + 1]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

def mat(name, col, rough=0.7, emit=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1); b.inputs["Emission Strength"].default_value = 1.0
    return m
def hexc(h):
    h = h.lstrip("#"); return tuple((int(h[i:i+2], 16) / 255) ** 2.2 for i in (0, 2, 4))
def add(obj, m):
    obj.data.materials.append(m); return obj
def box(name, loc, size, col, rough=0.7, bev=0.02):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.name = name; o.scale = (size[0]/2, size[1]/2, size[2]/2)
    bpy.ops.object.transform_apply(scale=True)
    if bev:
        md = o.modifiers.new("b", "BEVEL"); md.width = bev; md.segments = 3
    return add(o, mat(name, hexc(col), rough))
def cyl(name, loc, r, d, col, rot=(0, 0, 0), v=40, r2=None):
    bpy.ops.mesh.primitive_cone_add(vertices=v, radius1=r, radius2=r2 if r2 is not None else r, depth=d, location=loc, rotation=rot)
    o = bpy.context.object; o.name = name; bpy.ops.object.shade_smooth()
    md = o.modifiers.new("b", "BEVEL"); md.width = min(0.01, d / 3); md.segments = 2
    return add(o, mat(name, hexc(col), 0.6))
def sph(name, loc, r, col, scale=(1, 1, 1), rough=0.55):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=48, ring_count=32); o = bpy.context.object; o.name = name; o.scale = scale
    bpy.ops.object.shade_smooth(); return add(o, mat(name, hexc(col), rough))

# Blender: Z arriba. Usamos x derecha, y profundidad (negativo = fondo), z arriba.
box("pared", (0, -0.95, 2), (8, 0.1, 6), "#EAD9A6", 0.95, 0)
box("franja", (0, -0.89, 3.9), (8, 0.02, 0.12), "#D8A24A", 0.6, 0)
box("cartel", (0.55, -0.72, 2.95), (2.2, 0.1, 0.85), "#F2C230", 0.5, 0.04)
bpy.ops.object.text_add(location=(0.55, -0.66, 2.95), rotation=(math.radians(90), 0, math.radians(180)))
tx = bpy.context.object; tx.data.body = "POSADA"; tx.data.align_x = "CENTER"; tx.data.align_y = "CENTER"; tx.data.size = 0.55; tx.data.extrude = 0.03
add(tx, mat("txt", hexc("#D7261E"), 0.5))
box("estante", (0.6, -0.55, 2.1), (2.6, 0.5, 0.08), "#B8642A", 0.6)
for i in range(6):
    cyl(f"pl{i}", (-0.4 + i * 0.36, -0.55, 2.3), 0.17, 0.05, "#F4EEDF", rot=(math.radians(75), 0, 0))
box("azulejo", (-0.2, -0.6, 1.45), (1.1, 0.05, 0.75), "#F6F3EC", 0.4, 0.01)
box("barra", (0, -0.3, 1.0), (5, 0.4, 0.35), "#E0331F", 0.45, 0.02)
box("mostrador", (0, 0.7, 0.7), (5, 1.4, 0.2), "#EFE7D6", 0.6, 0.03)
box("esponja", (-0.25, -0.1, 1.22), (0.28, 0.18, 0.12), "#E8D140", 0.8, 0.02)
box("esponja2", (-0.25, -0.1, 1.3), (0.28, 0.18, 0.04), "#2BA84A", 0.8, 0.01)
def plates(x, y, n, stripe):
    for i in range(n):
        cyl(f"p{x}{i}", (x + math.sin(i * 1.7) * 0.012, y, 0.95 + i * 0.045), 0.32, 0.035, "#F4EEDF", r2=0.27)
        if i % 3 == 0:
            bpy.ops.mesh.primitive_torus_add(major_radius=0.3, minor_radius=0.012, location=(x, y, 0.95 + i * 0.045 + 0.018))
            add(bpy.context.object, mat("st", hexc(stripe), 0.5))
plates(-1.0, 0.2, 22, "#E4844A"); plates(-1.15, -0.15, 30, "#6FA9D8"); plates(1.45, 0.1, 26, "#4BB06A")

# muñeco
G = Vector((0.45, 0.15, 1.05))
sph("cuerpo", G, 0.36, "#F7F5F0")
head = sph("cabeza", G + Vector((0, 0, 0.62)), 0.5, "#F7F5F0")
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.53, location=G + Vector((0, -0.02, 0.76)), segments=48, ring_count=32)
hair = bpy.context.object; bpy.ops.object.shade_smooth(); add(hair, mat("pelo", hexc("#3A2418"), 0.6))
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="DESELECT"); bpy.ops.object.mode_set(mode="OBJECT")
for v in hair.data.vertices:
    v.select = v.co.z < 0.53 * 0.42
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.delete(type="VERT"); bpy.ops.object.mode_set(mode="OBJECT")
for sd in (-1, 1):
    bpy.ops.mesh.primitive_cone_add(radius1=0.1, depth=0.18, location=G + Vector((0.33 * sd, 0.05, 0.95)), rotation=(0, sd * math.radians(30), 0))
    add(bpy.context.object, mat("oreja", hexc("#F7F5F0")))
gray = mat("gris", hexc("#6A6A6A"), 0.6)
def arc(loc, r, ang, rot):
    bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=0.016, location=loc, rotation=rot, major_segments=32)
    o = bpy.context.object
    for v in o.data.vertices:
        if math.atan2(v.co.y, v.co.x) < 0: v.co.z += 0  # placeholder
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="DESELECT"); bpy.ops.object.mode_set(mode="OBJECT")
    for v in o.data.vertices:
        v.select = math.atan2(v.co.y, v.co.x) < -0.05 if ang > 0 else math.atan2(v.co.y, v.co.x) > 0.05
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.delete(type="VERT"); bpy.ops.object.mode_set(mode="OBJECT")
    o.data.materials.append(gray)
hc = G + Vector((0, 0, 0.62))
for sd in (-1, 1):
    arc(hc + Vector((0.16 * sd, 0.47, 0.06)), 0.075, 1, (math.radians(90), 0, 0))
    box(f"ceja{sd}", hc + Vector((0.16 * sd, 0.46, 0.2)), (0.16, 0.01, 0.025), "#6A6A6A", 0.6, 0)
arc(hc + Vector((0, 0.49, -0.12)), 0.1, -1, (math.radians(90), 0, 0))

# luz cálida suave + mundo
bpy.ops.object.light_add(type="AREA", location=(-3, 4, 5)); L = bpy.context.object; L.data.energy = 900; L.data.size = 4; L.data.color = (1, 0.88, 0.66)
L.rotation_euler = (Vector((0.3, 0.5, 1.6)) - L.location).to_track_quat("-Z", "Y").to_euler()
bpy.ops.object.light_add(type="POINT", location=(0.6, 1.2, 2.3)); P = bpy.context.object; P.data.energy = 120; P.data.color = (1, 0.82, 0.48); P.data.shadow_soft_size = 0.8
w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
w.node_tree.nodes["Background"].inputs["Color"].default_value = (1.0, 0.86, 0.62, 1); w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.6

# cámara (mismo encuadre que ToonTest: three (x,y,z) -> blender (x,-z,y))
bpy.ops.object.camera_add(location=(-0.1, 4.6, 1.2)); C = bpy.context.object; sc.camera = C
C.rotation_euler = (Vector((-0.15, 0, 1.85)) - C.location).to_track_quat("-Z", "Y").to_euler()
C.data.sensor_fit = "VERTICAL"; C.data.angle = math.radians(42)
C.data.dof.use_dof = True; C.data.dof.focus_distance = 4.35; C.data.dof.aperture_fstop = 2.8

# render: Cycles CPU con eliminación de ruido, contorno Freestyle, gradación filmica
sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = 160; sc.cycles.use_denoising = False
sc.render.resolution_x = 540; sc.render.resolution_y = 960; sc.render.resolution_percentage = 100
sc.render.use_freestyle = True; sc.render.line_thickness_mode = "ABSOLUTE"; sc.render.line_thickness = 1.6
fs = sc.view_layers[0].freestyle_settings
lset = fs.linesets[0] if len(fs.linesets) else fs.linesets.new("l")
if lset.linestyle is None: lset.linestyle = bpy.data.linestyles.new("ls")
lset.linestyle.color = (0.16, 0.1, 0.07)
sc.view_settings.view_transform = "Filmic"; sc.view_settings.look = "Medium High Contrast"
sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
