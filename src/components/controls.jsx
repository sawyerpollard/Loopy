import React from 'react';
import '../styles.css';

import Looper from '../../lib/looper.js';
import Recorder from '../../lib/recorder.js';

class Controls extends React.Component {
    constructor(props) {
        super(props);

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        this.recorder = new Recorder(audioContext, navigator);
        this.looper = new Looper(audioContext, this.recorder);

        this.handleRecordingPauseChange = this.handleRecordingPauseChange.bind(this);
        this.handlePlaybackPauseChange = this.handlePlaybackPauseChange.bind(this);

        this.state = {
            isRecordingPaused: true,
            isPlaybackPaused: true
        };
    }

    async componentDidMount() {
        if (this.recorder.getInputDevice() === '') {
            const devices = await this.recorder.availableInputDevices();
            console.log(devices);
            await this.recorder.setInputDevice(devices[0].deviceId);
        }
    }

    async handleRecordingPauseChange(isPaused) {
        if (isPaused) {
            if (this.looper.loop.layers.length > 0) {
                this.looper.startPlayback();
            }
            this.looper.startRecord();
        } else {
            if (this.looper.loop.layers.length > 0) {
                this.looper.stopPlayback();
            }
            await this.looper.stopRecord();
        }
        this.setState({ isRecordingPaused: !isPaused });
    }

    handlePlaybackPauseChange(isPaused) {
        if (isPaused) {
            this.looper.startPlayback();
        } else {
            this.looper.stopPlayback();
        }
        this.setState({ isPlaybackPaused: !isPaused });
    }

    render() {
        const isRecordingPaused = this.state.isRecordingPaused;
        const isPlaybackPaused = this.state.isPlaybackPaused;

        return (
            <div className="">
                <PlaybackButton isPaused={isPlaybackPaused} onPauseChange={this.handlePlaybackPauseChange} />
                <RecordButton isPaused={isRecordingPaused} onPauseChange={this.handleRecordingPauseChange} />
            </div>
        )
    }
}

class PlaybackButton extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onPauseChange(this.props.isPaused);
    }

    render() {
        const isPaused = this.props.isPaused;
        return (
            <button onClick={this.handleClick} className="rounded-full bg-gradient-to-r from-gray-300 to-gray-100 shadow p-2 m-5 focus:outline-none hover:from-gray-400 hover:to-gray-200">
                { isPaused ? <StartPlaybackIcon /> : <StopPlaybackIcon /> }
            </button>
        );
    }
}

class RecordButton extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onPauseChange(this.props.isPaused);
    }

    render() {
        const isPaused = this.props.isPaused;
        return (
            <button onClick={this.handleClick} className="rounded-full bg-gradient-to-r from-gray-300 to-gray-100 shadow p-2 m-5 focus:outline-none hover:from-gray-400 hover:to-gray-200">
                { isPaused ? <StartRecordIcon /> : <StopRecordIcon /> }
            </button>
        );
    }
}

const StartPlaybackIcon = () => {
    return (
        <i className="material-icons align-middle text-gray-700 text-6xl">play_arrow</i>
    );
}

const StopPlaybackIcon = () => {
    return (
        <i className="material-icons align-middle text-gray-700 text-6xl">stop</i>
    );
}

const StartRecordIcon = () => {
    return (
        <i className="material-icons align-middle text-red-600 text-6xl">fiber_manual_record</i>
    );
}

const StopRecordIcon = () => {
    return (
        <i className="material-icons align-middle text-red-600 text-6xl">stop</i>
    );
}

export default Controls;
