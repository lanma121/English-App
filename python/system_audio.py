import sounddevice as sd
import numpy as np
import wave

# Parameters
SAMPLE_RATE = 44100
DURATION = 10  # seconds
OUTPUT_FILENAME = 'output_sys.wav'

print("Recording...")

# Record audio
audio_data = sd.rec(int(SAMPLE_RATE * DURATION), samplerate=SAMPLE_RATE, channels=2, dtype='int16')
sd.wait()  # Wait until recording is finished

print("Recording complete.")

# Save as WAV file
with wave.open(OUTPUT_FILENAME, 'wb') as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)  # 2 bytes for int16
    wf.setframerate(SAMPLE_RATE)
    wf.writeframes(audio_data.tobytes())

print(f"Audio saved as {OUTPUT_FILENAME}")
