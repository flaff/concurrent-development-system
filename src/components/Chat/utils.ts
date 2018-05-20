import {KeyboardEvent} from 'react';

export const isAnEnter = (event: KeyboardEvent<any>) =>
    event.keyCode === 13;

