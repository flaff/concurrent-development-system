import * as React from "react";
import render from "./renderer.js";
import {setRotationListener, RotatorPayload, setRotation} from "@components/Simulation/rotator";
import {StoreState} from "@state/types";
import {rotateSimulation} from "@state/actions/simulation";
import {connect} from "react-redux";
import {OnRotatedSimulation} from "@request/simulation";
import {ROTATED_SIMULATION} from "@state/constants/simulation";

interface SimulationProps extends ReturnType<typeof stateToProps>, ReturnType<typeof dispatchToProps> {
    data?: any;
}

class Simulation extends React.Component<SimulationProps> {
    containerRef: any;

    onRotate(payload: RotatorPayload) {
        this.props.rotateSimulation(payload);
    }

    constructor(props: SimulationProps) {
        super(props);
        this.containerRef = React.createRef();
        this.onRotate = this.onRotate.bind(this);
        OnRotatedSimulation((d) => this.props.dispatch(ROTATED_SIMULATION(d)));
    }

    componentDidMount() {
        setRotationListener(this.onRotate);
        render(this.containerRef.current);
    }

    componentWillReceiveProps(props: SimulationProps) {
        setRotation({x: props.rotateX, y: props.rotateY});
    }

    render() {
        return (
            <div>
                <div style={{width: "100%", height: "100vh"}} ref={this.containerRef}/>
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