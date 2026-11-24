"""Voz clonada SIN cortes: genera, transcribe, compara con el guion y repite hasta que esté completa.
Uso (con el python del venv de VoiceStudio):
  HF_HUB_DISABLE_XET=1 /home/user/tools/VoiceStudio/.venv/bin/python clonar.py "<guion>" salida_base [intentos=4]
Genera: salida_base.wav (masterizada, 48 kHz, -15 LUFS, SIN recorte) y salida_base.json (palabras con tiempos).
Referencia de voz: ref.wav + REF_TEXT (narración original del canal).
"""
import sys, re, json, subprocess, unicodedata, torch, soundfile as sf
sys.path.insert(0, '/home/user/tools/VoiceStudio')
from omnivoice.models.omnivoice import OmniVoice
from faster_whisper import WhisperModel

REF = '/home/user/oscar-1-editor/video-editor/tools/voz/ref.wav'
REF_TEXT = 'Abres los ojos. Huele a humo, a río... y a miedo. Estás en Egipto, y hoy es el último día de tu vida. Bueno... eso dicen.'

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.findall(r'[a-z0-9]+', s)

def score(script, heard):
    a, b = norm(script), norm(heard)
    if not a: return 1.0, True
    hit = sum(1 for w in a if w in b) / len(a)
    last_ok = any(w in b[-4:] for w in a[-2:]) if b else False
    return hit, last_ok

def load16(path):
    tmp = path + '.16k.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', path, '-ac', '1', '-ar', '16000', tmp], check=True)
    a, _ = sf.read(tmp, dtype='float32')
    return a

def main():
    txt, out = sys.argv[1], sys.argv[2]
    tries = int(sys.argv[3]) if len(sys.argv) > 3 else 4
    torch.set_num_threads(4)
    m = OmniVoice.from_pretrained('k2-fsa/OmniVoice', device_map='cpu', dtype=torch.float32, allow_tokenizer_fallback=True)
    asr = WhisperModel('/tmp/claude-0/asrmodel/small', device='cpu', compute_type='int8')
    best = None
    for n in range(tries):
        a = m.generate(text=txt, language='es', ref_audio=REF, ref_text=REF_TEXT, num_step=40)
        x = a[0] if isinstance(a, (list, tuple)) else a
        x = x.detach().cpu().numpy() if hasattr(x, 'detach') else x
        raw = f'{out}_raw{n}.wav'
        sf.write(raw, x.squeeze(), 24000)
        heard = ' '.join(s.text for s in asr.transcribe(load16(raw), language='es', vad_filter=False)[0])
        hit, last_ok = score(txt, heard)
        print(f'toma {n}: {hit:.0%} palabras, final {"OK" if last_ok else "CORTADO"} | {heard.strip()}', flush=True)
        if best is None or (last_ok, hit) > (best[1], best[2]): best = (raw, last_ok, hit)
        if hit >= 0.95 and last_ok: break
    raw = best[0]
    # masterizado: arranca en la 1ª sílaba (cero silencio inicial), compuerta suave contra respiraciones,
    # pausas largas acortadas a 0,2 s; nunca corta palabras ni el final
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af',
                    'highpass=f=70,agate=threshold=0.02:ratio=3:range=0.06:attack=4:release=150,silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.02:stop_periods=-1:stop_duration=0.3:stop_threshold=-42dB:stop_silence=0.2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,apad=pad_dur=0.5,loudnorm=I=-15:TP=-1.5',
                    '-ar', '48000', f'{out}.wav'], check=True)
    segs, _ = asr.transcribe(load16(f'{out}.wav'), language='es', word_timestamps=True, vad_filter=False)
    ch = [{'text': w.word, 'timestamp': [round(w.start, 2), round(w.end, 2)]} for s in segs for w in s.words]
    json.dump({'text': txt, 'chunks': ch}, open(f'{out}.json', 'w'), ensure_ascii=False)
    print('elegida', raw, 'completa' if best[1] and best[2] >= 0.95 else 'REVISAR')

if __name__ == '__main__':
    main()
