import * as React from 'react';
import {ChangeEvent, ChangeEventHandler} from 'react';

interface AuthProps {
}

interface AuthState {
    loginValue: string;
    passwordValue: string;
    rememberMe?: boolean;
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
            loginValue: '',
            passwordValue: '',
            rememberMe: true
        };
        this.onLoginInputChange = this.onLoginInputChange.bind(this);
    }

    onLoginInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            loginValue: event.target.value
        });
    }

    render() {
        return (
            <div>
                <div>
                    <GenericInput
                        value={this.state.loginValue}
                        onChange={this.onLoginInputChange}
                        title={'Login'}
                    />
                </div>
                <div>
                    <GenericInput
                        value={this.state.passwordValue}
                        onChange={this.onLoginInputChange}
                        title={'Password'}
                    />
                </div>
                <div>
                    <input type={'checkbox'}/>
                </div>
            </div>
        );
    }
}