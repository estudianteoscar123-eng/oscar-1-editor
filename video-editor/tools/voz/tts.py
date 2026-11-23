"""Voz IA para ZK con VoiceStudio/OmniVoice (CPU).
Uso: /home/user/tools/VoiceStudio/.venv/bin/python tts.py "<instruct>" "<texto>" salida.wav [duracion_s] [pasos]
instruct: combinaciones de: male|female, child|teenager|young adult|middle-aged|elderly,
          very low pitch|low pitch|moderate pitch|high pitch|very high pitch, whisper.
Voces aprobadas: narrador="male, middle-aged, low pitch"; mujer="female, young adult, moderate pitch";
profeta="male, elderly, low pitch"; joven="male, young adult, moderate pitch".
Requiere HF_HUB_DISABLE_XET=1. Verificar siempre con transcripción (a veces sale mal: regenerar).
"""
import sys, torch, soundfile as sf
sys.path.insert(0, '/home/user/tools/VoiceStudio')
from omnivoice.models.omnivoice import OmniVoice
torch.set_num_threads(4)
ins, txt, out = sys.argv[1:4]
dur = float(sys.argv[4]) if len(sys.argv) > 4 and sys.argv[4] != '-' else None
steps = int(sys.argv[5]) if len(sys.argv) > 5 else 48
m = OmniVoice.from_pretrained('k2-fsa/OmniVoice', device_map='cpu', dtype=torch.float32, allow_tokenizer_fallback=True)
a = m.generate(text=txt, language='es', instruct=ins, duration=dur, num_step=steps)
x = a[0] if isinstance(a, (list, tuple)) else a
x = x.detach().cpu().numpy() if hasattr(x, 'detach') else x
sf.write(out, x.squeeze(), 24000)
