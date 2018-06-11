import * as React from 'react';
import { ChromePicker } from 'react-color';

type ColorPickerProps = {
    onChange: any;
    color: string;
};

class ColorPicker extends React.Component<ColorPickerProps> {
    state = {
        displayColorPicker: true
    };

    render() {
        const popover: any = {
            position: 'absolute',
            zIndex: '2',
            marginTop: '-100px'
        };
        return (
            <div>
                { this.state.displayColorPicker ? <div style={ popover }>
                    <ChromePicker onChange={this.props.onChange} color={this.props.color} />
                </div> : null }
            </div>
        )
    }
}

export default ColorPicker;