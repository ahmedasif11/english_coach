/** RMS above this marks speech. Tweak on this laptop's microphone if clips cut early or run long. */
export const SPEECH_RMS_THRESHOLD = 0.02;

export const TARGET_SAMPLE_RATE = 16_000;
export const SILENCE_END_MS = 900;
export const MAX_CLIP_MS = 60_000;

const ANALYSIS_WINDOW = 800;
const SILENCE_END_SAMPLES = Math.round((TARGET_SAMPLE_RATE * SILENCE_END_MS) / 1000);
const MAX_CLIP_SAMPLES = TARGET_SAMPLE_RATE * (MAX_CLIP_MS / 1000);

const WORKLET_SOURCE = `
class PcmDownsampler extends AudioWorkletProcessor {
  constructor() {
    super();
    this.step = sampleRate / 16000;
    this.carry = 0;
    this.sum = 0;
    this.count = 0;
  }

  process(inputs, outputs) {
    const channels = inputs[0];
    if (channels && channels.length > 0 && channels[0]) {
      const frames = channels[0].length;
      const pending = [];
      for (let i = 0; i < frames; i++) {
        let sample = 0;
        for (let c = 0; c < channels.length; c++) sample += channels[c][i] || 0;
        sample /= channels.length;
        this.sum += sample;
        this.count += 1;
        this.carry += 1;
        if (this.carry >= this.step) {
          pending.push(this.sum / this.count);
          this.carry -= this.step;
          this.sum = 0;
          this.count = 0;
        }
      }
      if (pending.length > 0) this.port.postMessage(new Float32Array(pending));
    }

    const output = outputs[0];
    if (output) {
      for (let c = 0; c < output.length; c++) output[c].fill(0);
    }
    return true;
  }
}

registerProcessor("pcm-downsampler", PcmDownsampler);
`;

export class MicrophoneReleased extends Error {
  constructor() {
    super("Microphone released");
    this.name = "MicrophoneReleased";
  }
}

export class MicrophoneBusy extends Error {
  constructor() {
    super("Already recording");
    this.name = "MicrophoneBusy";
  }
}

export type CapturedClip = {
  wav: Blob;
  seconds: number;
};

export type Microphone = {
  capture(): Promise<CapturedClip>;
  release(): void;
};

export type ClipMeter = {
  chunks: Float32Array[];
  sampleCount: number;
  heardSpeech: boolean;
  silenceSamples: number;
  window: number[];
};

export function createClipMeter(): ClipMeter {
  return {
    chunks: [],
    sampleCount: 0,
    heardSpeech: false,
    silenceSamples: 0,
    window: [],
  };
}

export function rms(samples: ArrayLike<number>): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    sum += sample * sample;
  }
  return Math.sqrt(sum / samples.length);
}

export function pushSamples(meter: ClipMeter, incoming: Float32Array): "continue" | "end" {
  meter.chunks.push(incoming);
  meter.sampleCount += incoming.length;

  for (let i = 0; i < incoming.length; i++) {
    meter.window.push(incoming[i]);
    if (meter.window.length >= ANALYSIS_WINDOW) scoreWindow(meter);
  }

  if (meter.sampleCount >= MAX_CLIP_SAMPLES) return "end";
  if (meter.heardSpeech && meter.silenceSamples >= SILENCE_END_SAMPLES) return "end";
  return "continue";
}

export function recordedSeconds(sampleCount: number): number {
  if (sampleCount <= 0) return 0;
  return Math.max(1, Math.round(sampleCount / TARGET_SAMPLE_RATE));
}

export function encodeWav(samples: Float32Array, sampleRate = TARGET_SAMPLE_RATE): Blob {
  const dataBytes = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataBytes, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export function isMicrophoneDenied(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError" ||
      error.name === "SecurityError")
  );
}

export async function openMicrophone(): Promise<Microphone> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: { ideal: 1 },
      echoCancellation: true,
      noiseSuppression: true,
    },
    video: false,
  });

  try {
    const context = new AudioContext();
    if (context.state === "suspended") await context.resume();
    await loadWorklet(context);
    const source = context.createMediaStreamSource(stream);
    const worklet = new AudioWorkletNode(context, "pcm-downsampler");
    const mute = context.createGain();
    mute.gain.value = 0;
    source.connect(worklet);
    worklet.connect(mute);
    mute.connect(context.destination);
    return bindMicrophone(stream, context, source, worklet, mute);
  } catch (error) {
    stream.getTracks().forEach((track) => track.stop());
    throw error;
  }
}

function scoreWindow(meter: ClipMeter): void {
  const level = rms(meter.window);
  const count = meter.window.length;
  meter.window = [];
  if (level > SPEECH_RMS_THRESHOLD) {
    meter.heardSpeech = true;
    meter.silenceSamples = 0;
    return;
  }
  if (meter.heardSpeech) meter.silenceSamples += count;
}

function mergeChunks(chunks: Float32Array[], sampleCount: number): Float32Array {
  const merged = new Float32Array(sampleCount);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}

function finishClip(meter: ClipMeter): CapturedClip {
  return {
    wav: encodeWav(mergeChunks(meter.chunks, meter.sampleCount)),
    seconds: recordedSeconds(meter.sampleCount),
  };
}

type PendingClip = {
  resolve: (clip: CapturedClip) => void;
  reject: (error: Error) => void;
  meter: ClipMeter;
};

function bindMicrophone(
  stream: MediaStream,
  context: AudioContext,
  source: MediaStreamAudioSourceNode,
  worklet: AudioWorkletNode,
  mute: GainNode,
): Microphone {
  let released = false;
  let pending: PendingClip | null = null;

  worklet.port.onmessage = (event: MessageEvent<Float32Array>) => {
    if (released || !pending) return;
    const data = event.data;
    if (!(data instanceof Float32Array) || data.length === 0) return;
    const decision = pushSamples(pending.meter, new Float32Array(data));
    if (decision !== "end") return;
    const active = pending;
    pending = null;
    active.resolve(finishClip(active.meter));
  };

  return {
    capture() {
      if (released) return Promise.reject(new MicrophoneReleased());
      if (pending) return Promise.reject(new MicrophoneBusy());
      return new Promise((resolve, reject) => {
        pending = { resolve, reject, meter: createClipMeter() };
      });
    },
    release() {
      if (released) return;
      released = true;
      const active = pending;
      pending = null;
      worklet.port.onmessage = null;
      source.disconnect();
      worklet.disconnect();
      mute.disconnect();
      stream.getTracks().forEach((track) => track.stop());
      void context.close();
      active?.reject(new MicrophoneReleased());
    },
  };
}

function writeString(view: DataView, offset: number, value: string): void {
  for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
}

async function loadWorklet(context: AudioContext): Promise<void> {
  const blob = new Blob([WORKLET_SOURCE], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  try {
    await context.audioWorklet.addModule(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}
