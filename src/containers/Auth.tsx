import * as React from 'react';
import {ChangeEvent, ChangeEventHandler} from 'react';
import axios from 'axios';

interface AuthProps {
}

interface AuthState {
    login: string;
    password: string;
    isLogged: boolean;
    status: boolean;
    token: string;
}

interface LoginInputProps {
    title: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    type?: 'password' | 'checkbox';
}

const GenericInput = (props: LoginInputProps) => (
    <div>
        <div>{props.title}</div>
        <input value={props.value} onChange={props.onChange}/>
    </div>
);

export default class Auth extends React.Component<AuthProps, AuthState> {
    constructor(props: AuthProps) {
        super(props);
        this.state = {
            login: '',
            password: '',
            isLogged: false,
            status: false,
            token: ''
        };
        this.onLoginInputChange = this.onLoginInputChange.bind(this);
        this.onPasswordInputChange = this.onPasswordInputChange.bind(this);
        this.registerNewUser = this.registerNewUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    onPasswordInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            password: event.target.value
        });
    }

    onLoginInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            login: event.target.value
        });
    }

    registerNewUser() {
        axios.post('http://localhost:3001/api/auth/register', {
            login: this.state.login,
            password: this.state.password
        }).then(
            (response: any) => {
                this.setState({
                    ...this.state,
                    status: response.status
                });
            },
            (err: any) => {
                this.setState({
                    ...this.state,
                    status: err.status
                });
            });
    }

    loginUser() {
        axios.post('http://localhost:3001/api/auth/login', {
            login: this.state.login,
            password: this.state.password
        }).then(
            (response: any) => {
                this.setState({
                    ...this.state,
                    isLogged: response.status,
                    token: response.data.token
                });
                localStorage.setItem('token', JSON.stringify(this.state.token));
            },
            (err: any) => {
                localStorage.removeItem('token');
                this.setState({
                    ...this.state,
                    status: false,
                    isLogged: false,
                    token: ''
                });
            });
    }


    render() {
        return (
            <div>
                <div className="auth-constainer">
                    <div>Is logged: {this.state.isLogged}</div>
                    <div>Is Registered: {this.state.status}</div>
                    <div>token: {this.state.token}</div>
                </div>
                <div>
                    <GenericInput
                        value={this.state.login}
                        onChange={this.onLoginInputChange}
                        title={'Login'}
                    />
                </div>
                <div>
                    <GenericInput
                        value={this.state.password}
                        onChange={this.onPasswordInputChange}
                        title={'Password'}
                    />
                </div>
                <div>
                    <button onClick={this.registerNewUser}>Resister new User</button>
                    <button onClick={this.loginUser}>Login</button>
                </div>
            </div>

        );
    }
}