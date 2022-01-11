class Recorder {
    constructor(audioContext, navigator) {
        this.audioContext = audioContext;
        this.navigator = navigator;

        this.EMPTY_STREAM = new MediaStream();
        this.mediaRecorder = this.createMediaRecorder(this.EMPTY_STREAM);

        this.recordedChunks = [];
        this.inputDeviceId = '';
    }

    createMediaRecorder(stream) {
        const mediaRecorder = new MediaRecorder(stream, {audioBitsPerSecond: 128000});
        mediaRecorder.addEventListener('dataavailable', this.handleDataAvailable.bind(this));

        return mediaRecorder;
    }

    async setInputDevice(deviceId) {
        this.inputDeviceId = deviceId;

        console.log(this.inputDeviceId);

        try {
            const stream = await this.navigator.mediaDevices.getUserMedia({audio: {deviceId: {exact: this.inputDeviceId}}});
            this.mediaRecorder = this.createMediaRecorder(stream);
            console.log(stream);

        } catch (error) {
            console.error(error);
        }
    }

    getInputDevice() {
        return this.inputDeviceId;
    }

    async availableInputDevices() {
        // if (!this.navigator.mediaDevices || !this.navigator.mediaDevices.enumerateDevices) Implement later

        try {
            await navigator.mediaDevices.getUserMedia({audio: true});
            const devices = await this.navigator.mediaDevices.enumerateDevices();
            console.log(devices);
            return devices.filter(device => device.kind === 'audioinput');

        } catch (error) {
            console.error(error);
        }
    }

    begin() {
        this.mediaRecorder.start();
    }

    async finish() {
        this.mediaRecorder.stop();

        return new Promise(resolve => {
            this.mediaRecorder.addEventListener('stop', () => this.handleStop(resolve));
        });
    }

    resume() {
        this.mediaRecorder.resume();
    }

    pause() {
        this.mediaRecorder.pause();
    }

    handleDataAvailable(event) {
        this.recordedChunks.push(event.data);
    }

    async handleStop(resolve) {
        const blob = new Blob(this.recordedChunks);
        const audioData = await blob.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(audioData);

        this.recordedChunks = [];

        resolve(audioBuffer);
    }
}

export default Recorder;
