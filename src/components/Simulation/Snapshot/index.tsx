import * as React from 'react';

const styles = require('./styles.scss');

import {setCanvas} from './drawableCanvas.js';

interface SnapshotProps extends SnapshotPassedProps {

}

interface SnapshotPassedProps {
    base64Image: string;
    onClose: () => void;
    sendMessage: (content: string) => void;
}

interface SnapshotState {

}

class Snapshot extends React.Component<SnapshotProps, SnapshotState> {
    constructor(props: SnapshotProps) {
        super(props);
        this.sendImage = this.sendImage.bind(this);
        this.applyImageToCanvas = this.applyImageToCanvas.bind(this);
    }

    componentDidMount() {
        this.props.base64Image && this.applyImageToCanvas();

        const canvas = this.refs.canvas as HTMLCanvasElement;
        setCanvas(canvas);
    }

    componentWillReceiveProps(props: SnapshotProps) {
        props.base64Image && this.applyImageToCanvas();
    }

    resizeCanvas() {
        const
            canvas = this.refs.canvas as HTMLCanvasElement,
            styles = getComputedStyle(this.refs.canvasContainer as HTMLDivElement),
            width = parseInt(styles.getPropertyValue("width"), 10),
            height = parseInt(styles.getPropertyValue("height"), 10);

        canvas.width = width;
        canvas.height = height;
    }

    applyImageToCanvas() {
        const image = new Image(),
            canvas = this.refs.canvas as HTMLCanvasElement,
            ctx = canvas.getContext('2d');

        image.onload = () => {
            if (ctx) {
                this.resizeCanvas();
                ctx.drawImage(image, 0, 0);
            }
        };

        image.src = this.props.base64Image;
    }

    sendImage() {
        const canvas = this.refs.canvas as HTMLCanvasElement;
        this.props.sendMessage(canvas.toDataURL('image/png'));
        this.props.onClose();
    }

    render() {
        return (
            <div className={styles.snapshot}>
                <div className={styles.modal}>
                    <div className={styles.canvas} ref={'canvasContainer'}>
                        <canvas ref={'canvas'} />
                    </div>
                    <div>
                        <button className={'btn btn-success'} onClick={this.sendImage}>Send</button>
                        <button className={'btn btn-outline-danger'} onClick={this.applyImageToCanvas}>Clear</button>
                        <button className={'btn btn-outline-secondary'} onClick={this.props.onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Snapshot;
