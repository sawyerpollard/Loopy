class Looper {
    constructor(audioContext, recorder) {
        this.audioContext = audioContext;
        this.recorder = recorder;
        this.volume = 0.5;

        this.EMPTY_LOOP = {
            layers: []
        };

        this.loop = this.EMPTY_LOOP;

        this.source = {};
    }

    setVolume(volume) {
        if (volume >= 1 || volume < 0) {
            throw new RangeError('Allowed volume range: [0, 1]')
        }

        this.volume = volume;
    }

    getVolume() {
        return this.volume;
    }

    numLayers() {
        return this.loop.layers.length;
    }

    updateSources() {
        this.loop.layers.forEach(layer => {
            const source = this.audioContext.createBufferSource();
            source.buffer = layer.data;
            this.sources.push(source);
        });
    }

    startPlayback() {
        const audioBuffers = this.loop.layers.map(layer => layer.data);
        const mix = this.mixAudioBuffers(audioBuffers);

        this.source = this.audioContext.createBufferSource();
        this.source.buffer = mix;

        this.source.loop = true;
        this.source.connect(this.audioContext.destination);
        this.source.start();
    }

    stopPlayback() {
        this.source.stop();
    }

    mixAudioBuffers(audioBuffers) {
        const main = audioBuffers[0];
        const channel = 0;
        const bufferParameters = [
            main.numberOfChannels,
            main.length,
            main.sampleRate
        ];

        const dataArrays = audioBuffers.map(audioBuffer => audioBuffer.getChannelData(channel));

        const mix = this.audioContext.createBuffer(...bufferParameters);
        const mixData = mix.getChannelData(channel);
        const overflows = [];

        /*
        Possible overflow logic?
        const FLOAT32_MAX_VALUE = 3.4028235e+38;
        if (FLOAT32_MAX_VALUE - mixData[i] < sample)
        */
        /*
        if (this.additionDoesOverflow(mixData[i], sample)) {
          overflows.push(true);
          continue;
        }
        */

        for (let i = 0; i < mixData.length; i++) {
            let sum = 0;
            for (const dataArray of dataArrays) {
                const sample = dataArray[i] === undefined ? 0 : dataArray[i];
                sum += sample;
            }
            mixData[i] = sum / dataArrays.length;
        }
        console.log('overflows: ' + overflows.length);

        return mix;
    }

    startRecord() {
        this.recorder.begin();
    }

    async stopRecord() {
        const audioBuffer = await this.recorder.finish();

        const layer = {
            data: audioBuffer
        };

        this.loop.layers.push(layer);

        console.log(this.loop.layers);
    }

    additionDoesOverflow(a, b) {
        const c = a + b;

        return a !== c - b || b !== c - a;
    }
}

export default Looper;

/*
Add start and stop methods instead of play and pause.
And on start create the source buffers from the layer.data
and on stop destroy everything and reload it on next start.
Also in start store the maximum duration buffer and fill the rest with zeroes?
 */
