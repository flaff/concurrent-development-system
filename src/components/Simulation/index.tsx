import * as React from 'react';
import render, {loadModel} from './renderer.js';
import {setRotationListener, RotatorPayload, setRotation} from '@components/Simulation/rotator';
import {StoreState} from '@state/types';
import {changeSimulation, rotateSimulation} from "@state/actions/simulation";
import {connect} from 'react-redux';
import {GetSimulationFileByName} from '@request/simulation';
import {ChangeEvent} from 'react';

const styles = require('./styles.scss');

interface SimulationProps extends ReturnType<typeof stateToProps>, ReturnType<typeof dispatchToProps> {
    url: string;
}

interface SimulationState {
    url?: string;
    fileNumberInputValue: string;
}

class Simulation extends React.Component<SimulationProps, SimulationState> {
    containerRef: any;

    onRotate(payload: RotatorPayload) {
        this.props.rotateSimulation(payload);
    }

    constructor(props: SimulationProps) {
        super(props);
        this.state = {
            url: '',
            fileNumberInputValue: ''
        };
        this.containerRef = React.createRef();
        this.onRotate = this.onRotate.bind(this);
        this.onFileNumberChange = this.onFileNumberChange.bind(this);
        this.getSimulationDataFromFile = this.getSimulationDataFromFile.bind(this);
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

    render() {
        return (
            <div className={styles.simulation}>
                <div className={styles.controls}>
                    <h2>Simulation data</h2>
                    <div className={'input-group'}>
                        <input className={'form-control'} type="text" placeholder={'Type simulation file number'}
                               value={this.state.fileNumberInputValue} onChange={this.onFileNumberChange}/>
                        <div className={'input-group-append'}>
                            <button className={'btn btn-success'} onClick={this.getSimulationDataFromFile}>
                                Get file
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
        url: state.simulation.url
    }),

    dispatchToProps = (dispatch) => ({
        rotateSimulation: rotateSimulation(dispatch),
        changeSimulation: changeSimulation(dispatch),
        dispatch
    });

export default connect(
    stateToProps,
    dispatchToProps
)(Simulation);