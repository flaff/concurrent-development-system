import * as React from "react";
import ColorPicker from './ColorPicker';

const styles = require("./styles.scss");

import {setCanvas, getColor, setColor} from "./drawableCanvas.js";

interface SnapshotProps extends SnapshotPassedProps {

}

interface SnapshotPassedProps {
    base64Image: string;
    onClose: () => void;
    sendMessage: (content: string) => void;
}

interface SnapshotState {
    colorPickerVisible: boolean;
    currentColor: string;
}

class Snapshot extends React.Component<SnapshotProps, SnapshotState> {
    constructor(props: SnapshotProps) {
        super(props);
        this.state = {
            colorPickerVisible: false,
            currentColor: getColor()
        };

        this.sendImage = this.sendImage.bind(this);
        this.applyImageToCanvas = this.applyImageToCanvas.bind(this);
        this.onColorChange = this.onColorChange.bind(this);
        this.toggleColorPicker = this.toggleColorPicker.bind(this);
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
            ctx = canvas.getContext("2d");

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
        this.props.sendMessage(canvas.toDataURL("image/png"));
        this.props.onClose();
    }

    onColorChange(color: {hex: string}) {
        this.setState({
            ...this.state,
            currentColor: color.hex
        });
        setColor(color.hex);
    }

    toggleColorPicker() {
        this.setState({
            ...this.state,
            colorPickerVisible: !this.state.colorPickerVisible
        });
    }

    render() {
        return (
            <div className={styles.snapshot}>
                <div className={styles.modal}>
                    <div className={styles.canvas} ref={"canvasContainer"}>
                        <canvas ref={"canvas"}/>
                    </div>
                    <div>
                        {this.state.colorPickerVisible &&
                        <div className={styles.colorPicker}>
                            <ColorPicker onChange={this.onColorChange} color={this.state.currentColor}/>
                        </div>}
                        <div className={styles.colorPickerButton} style={{background: this.state.currentColor}}
                             onClick={this.toggleColorPicker}/>
                        <button className={"btn btn-success"} onClick={this.sendImage}>Send</button>
                        <button className={"btn btn-outline-danger"} onClick={this.applyImageToCanvas}>Clear</button>
                        <button className={"btn btn-outline-secondary"} onClick={this.props.onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Snapshot;
