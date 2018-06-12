import * as React from 'react';
import render, {loadModel, getCurrentBase64Image} from './renderer.js';
import {setRotationListener, RotatorPayload, setRotation} from '@components/Simulation/rotator';
import {StoreState} from '@state/types';
import {changeAutoplaySimulation, changeSimulation, rotateSimulation} from "@state/actions/simulation";
import {connect} from 'react-redux';
import {GetSimulationFileByName} from '@request/simulation';
import {ChangeEvent} from 'react';
import Snapshot from "@components/Simulation/Snapshot";
import {sendMessage} from "@state/actions/room";
import {MessageType} from "@request/types/sockets";

const styles = require('./styles.scss');

interface SimulationProps extends ReturnType<typeof stateToProps>, ReturnType<typeof dispatchToProps> {
    url: string;
}

interface SimulationState {
    url?: string;
    fileNumberInputValue: string;
    snapshotBase64Image: string;
    snapshotVisible: boolean;
}

class Simulation extends React.Component<SimulationProps, SimulationState> {
    containerRef: any;

    onRotate(payload: RotatorPayload) {
        this.props.rotateSimulation(payload);
    }

    constructor(props: SimulationProps) {
        super(props);
        this.state = {
            url: props.url || '',
            fileNumberInputValue: props.simulationName || '',
            snapshotBase64Image: '',
            snapshotVisible: false
        };
        this.containerRef = React.createRef();
        this.onRotate = this.onRotate.bind(this);
        this.onFileNumberChange = this.onFileNumberChange.bind(this);
        this.getSimulationDataFromFile = this.getSimulationDataFromFile.bind(this);
        this.playPauseSimulation = this.playPauseSimulation.bind(this);
        this.onSnapshotClick = this.onSnapshotClick.bind(this);
        this.onSnapshotClose = this.onSnapshotClose.bind(this);
        this.sendImageMessage = this.sendImageMessage.bind(this);
    }

    onFileNumberChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            fileNumberInputValue: event.target.value
        })
    }

    componentDidMount() {
        setRotationListener(this.onRotate);
        render(this.containerRef.current);
    }

    componentWillReceiveProps(props: SimulationProps) {
        setRotation({x: props.rotateX, y: props.rotateY});
        if (props.url && props.url !== this.state.url) {
            this.setState({
                ...this.state,
                fileNumberInputValue: props.simulationName || this.state.fileNumberInputValue,
                url: props.url
            });
            loadModel(props.url);
        }
    }

    getSimulationDataFromFile() {
        this.props.changeSimulation({
            name: this.state.fileNumberInputValue
        });
    }

    playPauseSimulation() {
        this.props.changeAutoplaySimulation({
            userName: this.props.userName,
            autoPlay: !this.props.autoPlay
        })
    }

    onSnapshotClick() {
        this.setState({
            ...this.state,
            snapshotVisible: true,
            snapshotBase64Image: getCurrentBase64Image()
        });
    }

    onSnapshotClose() {
        this.setState({
            ...this.state,
            snapshotVisible: false,
            snapshotBase64Image: ''
        });
    }

    sendImageMessage(content: string) {
        this.props.sendMessage({
            content,
            type: MessageType.BASE64IMAGE,
            author: this.props.userName,
            room: location.href.split("/")[4]
        })
    }

    render() {
        return (
            <div className={styles.simulation}>
                {this.state.snapshotVisible && <Snapshot base64Image={this.state.snapshotBase64Image} onClose={this.onSnapshotClose} sendMessage={this.sendImageMessage} />}
                <div className={styles.controls}>
                    <h2>Simulation data</h2>
                    <div className={'input-group'}>
                        <div className={'input-group-prepend'}>
                            <button className={'btn btn-outline'} onClick={this.onSnapshotClick}>
                                Snapshot
                            </button>
                        </div>
                        <input className={'form-control'} type="text" placeholder={'Type simulation file number'}
                               value={this.state.fileNumberInputValue} onChange={this.onFileNumberChange}
                               disabled={this.props.autoPlay}/>
                        <div className={'input-group-append'}>
                            <button className={'btn btn-success'} onClick={this.getSimulationDataFromFile} disabled={this.props.autoPlay}>
                                Get file
                            </button>
                            <button className={'btn btn-outline-secondary'} onClick={this.playPauseSimulation}>
                                {this.props.autoPlay ? 'Pause' : 'Auto Play'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.renderView} ref={this.containerRef}/>
            </div>
        );
    }
}

const
    stateToProps = (state: StoreState) => ({
        rotateX: state.simulation.rotateX,
        rotateY: state.simulation.rotateY,
        autoPlay: state.simulation.autoPlay,
        simulationName: state.simulation.name,
        url: state.simulation.url,
        userName: state.user.name
    }),

    dispatchToProps = (dispatch) => ({
        rotateSimulation: rotateSimulation(dispatch),
        changeSimulation: changeSimulation(dispatch),
        changeAutoplaySimulation: changeAutoplaySimulation(dispatch),
        sendMessage: sendMessage(dispatch)
    });

export default connect(
    stateToProps,
    dispatchToProps
)(Simulation);