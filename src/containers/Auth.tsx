import * as React from 'react';
import {ChangeEvent, ChangeEventHandler} from 'react';
import axios from 'axios';
import * as io from 'socket.io-client';

interface AuthProps {
}

interface AuthState {
    login: string;
    password: string;
    response: string;
    token: string;
    message: string;
    messages: Array<any>;
    socketConnected: string;
    userProfile: {
        Id: string,
        Login: string
    };
    socket: any;
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

const loginCointainerStyle = {
    'padding': '150px'
};

export default class Auth extends React.Component<AuthProps, AuthState> {
    constructor(props: AuthProps) {
        super(props);
        this.state = {
            login: '',
            password: '',
            response: '',
            token: '',
            message: '',
            messages: [],
            socketConnected: 'undefined',
            userProfile: {
                Id: '',
                Login: ''
            },
            socket: io('http://localhost:3001/')
        };
        this.onLoginInputChange = this.onLoginInputChange.bind(this);
        this.onPasswordInputChange = this.onPasswordInputChange.bind(this);
        this.onMessageInputChange = this.onMessageInputChange.bind(this);
        this.registerNewUser = this.registerNewUser.bind(this);
        this.logout = this.logout.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        let token = localStorage.getItem('token');
        if (token) {
            this.state = {
                ...this.state,
                token: token,
                response: 'authorized'
            };
            this.getUserData();
        } else {
            this.state = {
                ...this.state,
                response: 'unathorized'
            };
        }

        this.state.socket.on('connectedToSocket', (data) => {
            console.log('Socket connected' + data.socket);

            this.state = {
                ...this.state,
                socketConnected: 'success!'
            };
        });

        this.state.socket.on('messageFromServer', (data) => {
            // let messages = this.state.messages;
            // messages.push(data);
            //
            // this.state = {
            //     ...this.state,
            //     messages: messages
            // };

            console.log(data);
        });
    }

    onMessageInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            message: event.target.value
        });
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
        if (this.state.login && this.state.login && this.state.login.length >= 5 && this.state.password.length >= 5) {
            axios.post('http://localhost:3001/api/auth/register', {
                login: this.state.login,
                password: this.state.password
            }).then(
                (response: any) => {
                    this.setState({
                        ...this.state,
                        response: response.data.status
                    });
                }).catch((err: any) => {
                this.setState({
                    ...this.state,
                    response: err.message + ': ' + err.response.data.err
                });
            });
        } else {
            this.setState({
                ...this.state,
                response: 'Login and password must be longer than 5 chars'
            });
        }
    }

    loginUser() {
        if (this.state.login && this.state.login && this.state.login.length >= 5 && this.state.password.length >= 5) {
            axios.post('http://localhost:3001/api/auth/login', {
                login: this.state.login,
                password: this.state.password
            }).then(
                (response: any) => {
                    this.setState({
                        ...this.state,
                        token: response.data.token,
                        response: 'ok',
                        userProfile: response.data.userProfile
                    });
                    localStorage.setItem('token', JSON.stringify(this.state.token));
                    this.state.socket.emit('change_room', this.state.userProfile);
                }).catch((err: any) => {
                localStorage.removeItem('token');
                this.setState({
                    ...this.state,
                    token: '',
                    response: err.message + ': ' + err.response.data.err
                });
            });
        } else {
            this.setState({
                ...this.state,
                response: 'Login and password must be longer than 5 chars'
            });
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.setState({
            ...this.state,
            login: '',
            password: '',
            response: 'unathorized',
            token: '',
            userProfile: {
                Id: '',
                Login: ''
            }
        });
    }

    getUserData() {
        axios.get('http://localhost:3001/api/auth/user', {
            headers: {'Authorize': this.state.token.replace('\"', '')}
        })
            .then((response: any) => {
                this.setState({
                    ...this.state,
                    response: 'authorized',
                    userProfile: response.data.userProfile,
                });

                this.state.socket.emit('change_room', this.state.userProfile);
            })
            .catch((err: any) => {
                this.setState({
                    ...this.state,
                    response: err.message + ': ' + err.response.data.err
                });
            });
    }

    sendMessage() {
        if (this.state.userProfile.Login) {
            this.state.socket.emit('message', {message: this.state.message, userProfile: this.state.userProfile});
        } else {
            alert('First login!');
        }
    }

    render() {
        return (
            <div style={{'paddingTop': '50px', 'textAlign': 'center'}}>
                <div className="auth-constainer" style={{'paddingBottom': '30px'}}>
                    <div style={{'textAlign': 'left', 'marginLeft': '10px'}}>
                        <div>
                            <span>Response: </span>
                            <span style={{'color': 'red'}}>{this.state.response}</span>
                        </div>
                        <div>token: {this.state.token}</div>
                        <div style={{'paddingTop': '10px'}}>
                            <div>Login: {this.state.userProfile.Login}</div>
                            <div>Id: {this.state.userProfile.Id}</div>
                        </div>
                    </div>
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
                <div style={{'paddingTop': '50px'}}>
                    <button onClick={this.registerNewUser}>Resister new User</button>
                    <button onClick={this.loginUser}>Login</button>
                    <button onClick={this.logout}>Logout</button>
                </div>

                <div style={{'textAlign': 'left', 'marginLeft': '10px', 'marginTop': '40px'}}>
                    <span>Socket connected: </span>
                    <span style={{'color': 'green'}}>{this.state.socketConnected}</span>
                    <GenericInput
                        value={this.state.message}
                        onChange={this.onMessageInputChange}
                        title={'Message'}
                    />
                    <button onClick={this.sendMessage}>Send message</button>
                </div>
            </div>

        );
    }
}