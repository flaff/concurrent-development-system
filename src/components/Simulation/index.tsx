import * as React from 'react';
import render from './renderer.js';
import {setRotationListener, RotatorPayload, setRotation} from '@components/Simulation/rotator';
import {StoreState} from '@state/types';
import {rotateSimulation} from '@state/actions/simulation';
import {connect} from 'react-redux';
import {GetSimulationFileByName, OnRotatedSimulation} from '@request/simulation';
import {ROTATED_SIMULATION} from '@state/constants/simulation';
import {ChangeEvent} from 'react';

interface SimulationProps extends ReturnType<typeof stateToProps>, ReturnType<typeof dispatchToProps> {
    data?: any;
}

class Simulation extends React.Component<SimulationProps> {
    containerRef: any;
    simulationData: any;
    fileNumber: any;

    onRotate(payload: RotatorPayload) {
        this.props.rotateSimulation(payload);
    }

    constructor(props: SimulationProps) {
        super(props);
        this.containerRef = React.createRef();
        this.onRotate = this.onRotate.bind(this);
        OnRotatedSimulation((d) => this.props.dispatch(ROTATED_SIMULATION(d)));
        this.onFileNumberChange = this.onFileNumberChange.bind(this);
        this.getSimulationDataFromFile = this.getSimulationDataFromFile.bind(this);
    }

    onFileNumberChange(event: ChangeEvent<HTMLInputElement>) {
        this.fileNumber = event.target.value;
    }

    componentDidMount() {
        setRotationListener(this.onRotate);
        render(this.containerRef.current);
    }

    componentWillReceiveProps(props: SimulationProps) {
        setRotation({x: props.rotateX, y: props.rotateY});
    }

    getSimulationDataFromFile() {
        GetSimulationFileByName(this.fileNumber).then((data: any) => {
            this.simulationData = data;
        });
    }

    render() {
        return (
            <div style={{padding: '20px'}}>
                <hr/>
                <h2>Simulation data</h2>
                <div className={'input-group'}>
                    <input className={'form-control'} type="text" placeholder={'Type simulation file number'}
                           value={this.fileNumber} onChange={this.onFileNumberChange}/>
                    <div className={'input-group-append'}>
                        <button className={'btn btn-success'} onClick={this.getSimulationDataFromFile}>
                            Get file
                        </button>
                    </div>
                </div>
                <div style={{width: '100%', height: '100vh'}} ref={this.containerRef}/>
            </div>
        );
    }
}

const
    stateToProps = (state: StoreState) => ({
        rotateX: state.simulation.rotateX,
        rotateY: state.simulation.rotateY
    }),

    dispatchToProps = (dispatch) => ({
        rotateSimulation: rotateSimulation(dispatch),
        dispatch
    });

export default connect(
    stateToProps,
    dispatchToProps
)(Simulation);