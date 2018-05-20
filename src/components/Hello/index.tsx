import * as React from 'react';
import './styles.css';
import Messages, {MessageModel} from '@components/Messages';
import mock = jest.mock;
import axios from 'axios';

export interface Props {
    name: string;
    enthusiasmLevel?: number;
    onIncrement?: () => void;
    onDecrement?: () => void;
}

const mockMessages: Array<MessageModel> = [
    {author: 'someone', content: 'Lorem ipsum'},
    {author: 'someone', content: 'dolor sit amet'},
    {author: 'someone', content: 'consectetur adipiscing elit. Morbi mattis elit sit amet interdum cursus.'},

    {author: 'me', content: 'Mauris dictum'},

    {author: 'someoneElse', content: 'dolor sit amet'},
    {author: 'someoneElse', content: 'consectetur adipiscing elit. Morbi mattis elit sit amet interdum cursus.'},

    {author: 'me', content: 'Lorem ipsum'},
    {author: 'me', content: 'dolor sit amet'},
    {author: 'me', content: 'consectetur adipiscing elit. Morbi mattis elit sit amet interdum cursus.'},

];

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
            <div className="auth-constainer">
                <div>Is logged: {isLogged}</div>
                <div>Is Registered: {status}</div>
                <div>token: {token}</div>
                <div>
                    <input type="text" placeholder="login" onChange={evt => updateValue('login', evt)}/>
                </div>
                <div>
                    <input type="password" placeholder="password" onChange={evt => updateValue('password', evt)}/>
                </div>


                <button onClick={registerNewUser}>Resister new User</button>
                <button onClick={loginUser}>Login</button>
            </div>
            <Messages messages={mockMessages} user={'me'}/>
        </div>
    );
}

export default Hello;

// helpers

function getExclamationMarks(numChars: number) {
    return Array(numChars + 1).join('!');
}

