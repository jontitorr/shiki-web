type Config = {
	sampleSize: number;
	sampleRate: number;
	channelCount: number;
	fftSize: number;
	down: boolean;
	debug: boolean;
};

export class PcmRecorder {
	private config: Config;
	private ctx: AudioContext;
	private analyzer: AnalyserNode;
	private recorder: ScriptProcessorNode;
	private cb: (data: Float32Array) => void;
	private pcmBufferSize = 0;
	private pcmBuffer: Float32Array[] = [];
	private audioInput: MediaStreamAudioSourceNode | null = null;

	constructor(config: Config, cb: (data: Float32Array) => void) {
		this.config = config;
		this.ctx = new AudioContext();
		this.analyzer = this.ctx.createAnalyser();
		this.analyzer.fftSize = this.config.fftSize;

		this.recorder = this.ctx.createScriptProcessor(
			this.config.fftSize,
			this.config.channelCount,
			this.config.channelCount
		);

		this.recorder.onaudioprocess = this.onaudioprocess.bind(this);
		this.cb = cb;
	}

	async start() {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: {
				noiseSuppression: false,
				echoCancellation: false,
				sampleSize: this.config.sampleSize,
				sampleRate: this.config.sampleRate,
				channelCount: this.config.channelCount
			}
		});

		this.audioInput = this.ctx.createMediaStreamSource(stream);
		this.audioInput.connect(this.analyzer);
		this.analyzer.connect(this.recorder);
		this.recorder.connect(this.ctx.destination);
	}

	stop() {
		this.audioInput?.disconnect();
		this.recorder.disconnect();
	}

	private onaudioprocess(event: AudioProcessingEvent) {
		if (this.config.channelCount === 1) {
			const data = event.inputBuffer.getChannelData(0);
			this.handlePcm(new Float32Array(data));
		}
	}

	private handlePcm(bytes: Float32Array) {
		if (bytes[0] === 0 && bytes[1] === 0) {
			return;
		}

		const data = bytes;

		this.cb(data);

		if (this.config.down) {
			this.pcmBufferSize += data.byteLength;
			this.pcmBuffer.push(data);
		}

		if (this.config.debug) {
			console.log('get pcm data success, pcm buffer size:', data.byteLength);
		}
	}
}

type PcmPlayerConfig = {
	bufferSize: number;
};

export class PcmPlayer {
	private config: PcmPlayerConfig;
	private ctx: AudioContext;
	private workletNode: AudioWorkletNode | null = null;
	private gainNode: GainNode | null = null;
	private queue: Float32Array = new Float32Array(0);

	constructor(config: PcmPlayerConfig) {
		this.config = config;
		this.ctx = new AudioContext();
	}

	async start() {
		await this.ctx.audioWorklet.addModule('/dist/pcm-processor.js');
		this.workletNode = new AudioWorkletNode(this.ctx, 'pcm-processor');
		this.gainNode = this.ctx.createGain();
		this.workletNode.connect(this.gainNode);
		this.gainNode.connect(this.ctx.destination);

		this.workletNode.port.onmessage = (e) => {
			console.log({ workletNode: e.data });
			if (e.data === 'Silence') {
				console.log('Silence');
			}
		};
	}

	stop() {
		this.workletNode?.disconnect();
		this.gainNode?.disconnect();
		this.queue = new Float32Array(0);
		this.ctx.close();
	}

	write(buffer: Float32Array) {
		const len = buffer.length + this.queue.length;
		const newBuffer = new Float32Array(len);
		newBuffer.set(this.queue);
		newBuffer.set(buffer, this.queue.length);
		this.queue = newBuffer;
	}
}
