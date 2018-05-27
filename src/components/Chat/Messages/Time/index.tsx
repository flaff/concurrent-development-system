import * as React from 'react';
import {Moment} from "moment";

interface TimeProps {
    time: Moment;
    now: Moment;
}

const Time = (props: TimeProps) => {
    return <span>{props.time.from(props.now)}</span>
};

export default Time;
