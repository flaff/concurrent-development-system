import * as React from 'react';
import render from './renderer.js';

interface SimulationProps {
    data?: any;
}

export default class Simulation extends React.Component<SimulationProps> {
    containerRef: any;

    constructor(props: SimulationProps) {
        super(props);
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        render(this.containerRef.current);
    }

    render() {
        return <div style={{width: '100%', height: '100vh'}} ref={this.containerRef} />;
    }
}