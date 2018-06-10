import * as React from 'react';
import * as classNames from 'classnames';
const styles = require('./styles.scss');

interface ImageProps {
    src?: string;
    className?: string;
}

const Image = (props: ImageProps) => (
    <img src={props.src}
         className={classNames(styles.image, props.className)} />
);

export default Image;
