import * as React from 'react';
import './styles.css';
import mock = jest.mock;
import axios from 'axios';
import Simulation from '@components/Simulation';
import Chat from '@components/Chat';

export interface Props {
    name: string;
    enthusiasmLevel?: number;
    onIncrement?: () => void;
    onDecrement?: () => void;
}

function Hello({name, enthusiasmLevel = 1, onIncrement, onDecrement}: Props) {
    if (enthusiasmLevel <= 0) {
        throw new Error('You could be a little more enthusiastic. :D');
    }
    let credentials = {
        login: '',
        password: ''
    };

    let isLogged;
    let status = false;
    let token = '';

    function updateValue(property: string, evt: any) {
        credentials[property] = evt.target.value;
    }

    function registerNewUser() {
        axios.post('http://localhost:3001/api/auth/register', credentials).then((response: any) => {
            status = response.status;
        }).catch((err) => {
            status = err.status;
        });
    }

    function loginUser() {
        axios.post('http://localhost:3001/api/auth/login', credentials).then((response: any) => {
            isLogged = response.status;
            token = response.data.token;
            localStorage.setItem('token', JSON.stringify(token));
        });
    }



    return (
        <div className="hello">
            <div className="greeting">
                Hello {name + getExclamationMarks(enthusiasmLevel)}
            </div>
            <div>
                <button onClick={onDecrement}>-</button>
                <button onClick={onIncrement}>+</button>
            </div>
            {/*<Messages messages={mockMessages} user={'me'}/>*/}
            <Chat user={'me'} />
            <Simulation />

        </div>
    );
}

export default Hello;

// helpers

function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join('!');
}

