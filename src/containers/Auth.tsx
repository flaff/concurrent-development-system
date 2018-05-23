import * as React from "react";
import {ChangeEvent, ChangeEventHandler} from "react";
import * as io from "socket.io-client";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {StoreState} from "@state/types";
import {loginUser, logoutUser, registerUser, restoreUser} from "@state/actions";
import {UserProfile} from "@request/types";

interface AuthProps extends ReturnType<typeof stateToProps>, ReturnType<typeof dispatchToProps> {
}

interface AuthState {
    loginField: string;
    passwordField: string;
    message: string;
    messages: Array<any>;
    socketConnected: string;
    socket: any;
    response: string;
}

interface LoginInputProps {
    title: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    type?: "password" | "checkbox";
}

const GenericInput = (props: LoginInputProps) => (
    <div>
        <div style={{opacity: (props.value ? 1 : 0)}}>{props.title}</div>
        <input className="form-control"
               value={props.value}
               onChange={props.onChange}
               type={props.type}
               placeholder={props.title}/>
    </div>
);

class Auth extends React.Component<AuthProps, AuthState> {
    constructor(props: AuthProps) {
        super(props);
        this.state = {
            loginField: "",
            passwordField: "",
            message: "",
            messages: [],
            socketConnected: "undefined",
            socket: io("http://localhost:3001/"),
            response: ""
        };
        this.onLoginInputChange = this.onLoginInputChange.bind(this);
        this.onPasswordInputChange = this.onPasswordInputChange.bind(this);
        this.onMessageInputChange = this.onMessageInputChange.bind(this);
        this.register = this.register.bind(this);
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        if (this.props.token) {
            this.getUserData();
        }

        this.state.socket.on("connectedToSocket", (data) => {
            console.log("Socket connected" + data.socket);

            this.state = {
                ...this.state,
                socketConnected: "success!"
            };
        });

        this.state.socket.on("messageFromServer", (data) => {
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
            passwordField: event.target.value
        });
    }

    onLoginInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            loginField: event.target.value
        });
    }

    register() {
        if (this.state.loginField && this.state.loginField && this.state.loginField.length >= 5 && this.state.passwordField.length >= 5) {
            const {loginField, passwordField} = this.state;

            this.props.registerUser({login: loginField, password: passwordField});
        } else {
            this.setState({
                ...this.state,
                response: "Login and password must be longer than 5 chars"
            });
        }
    }

    login() {
        if (this.state.loginField && this.state.loginField && this.state.loginField.length >= 5 && this.state.passwordField.length >= 5) {
            const {loginField: login, passwordField: password} = this.state;
            this.props.loginUser({login, password});
            // axios.post("http://localhost:3001/api/auth/login", {
            //     login: this.state.login,
            //     password: this.state.password
            // }).then(
            //     (response: any) => {
            //         this.setState({
            //             ...this.state,
            //             token: response.data.token,
            //             response: "ok",
            //             userProfile: response.data.userProfile
            //         });
            //         localStorage.setItem("token", JSON.stringify(this.state.token));
            //         this.state.socket.emit("change_room", this.state.userProfile);
            //     }).catch((err: any) => {
            //     localStorage.removeItem("token");
            //     this.setState({
            //         ...this.state,
            //         token: "",
            //         response: err.message + ": " + err.response.data.err
            //     });
            // });
        } else {
            this.setState({
                ...this.state,
                response: "Login and password must be longer than 5 chars"
            });
        }
    }

    logout() {
        this.props.logoutUser();
    }

    getUserData() {
        this.props.restoreUser({token: this.props.token});
        // axios.get("http://localhost:3001/api/auth/user", {
        //     headers: {"Authorize": this.state.token.replace("\"", "")}
        // })
        //     .then((response: any) => {
        //         this.setState({
        //             ...this.state,
        //             response: "authorized",
        //             userProfile: response.data.userProfile,
        //         });
        //
        //         this.state.socket.emit("change_room", this.state.userProfile);
        //     })
        //     .catch((err: any) => {
        //         this.setState({
        //             ...this.state,
        //             response: err.message + ": " + err.response.data.err
        //         });
        //     });
    }

    sendMessage() {
        if (this.props.name) {
            const userProfile: UserProfile = {Id: this.props.userId, Login: this.props.name};
            this.state.socket.emit("message", {message: this.state.message, userProfile});
        } else {
            alert("First login!");
        }
    }

    renderLogin() {
        return (
            <div>
                <div>
                    <GenericInput
                        value={this.state.loginField}
                        onChange={this.onLoginInputChange}
                        title={"Login"}
                    />
                </div>
                <div>
                    <GenericInput
                        value={this.state.passwordField}
                        onChange={this.onPasswordInputChange}
                        type={"password"}
                        title={"Password"}
                    />
                </div>
                <div style={{marginTop: "20px"}}>
                    <button type="button" className="btn btn-outline-primary"
                            onClick={this.login}>Login
                    </button>
                    {" or "}
                    <button type="button" className="btn btn-outline-secondary"
                            onClick={this.register}>Register
                    </button>
                </div>
            </div>
        );
    }

    renderWelcome() {
        return (
            <div style={{textAlign: "center"}}>
                <h1>Hello, {this.props.name}!</h1>
                <div>
                    <Link to={"/rooms"}>
                        <button type="button" className="btn btn-outline-success btn-lg">Continue</button>
                    </Link>
                </div>
                <div>
                    <button type="button" className="btn btn-link"
                            onClick={this.logout}>Not you?
                    </button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div style={{"paddingTop": "50px", "textAlign": "center"}}>
                <div className="card" style={{width: "400px", margin: "0 auto"}}>
                    <div className="card-body">
                        {
                            this.props.authorized
                                ? this.renderWelcome()
                                : this.renderLogin()
                        }
                    </div>
                </div>
            </div>

        );
    }
}

const
    stateToProps = (state: StoreState) => ({
        token: state.user.token,
        name: state.user.name,
        userId: state.user.id,
        authorized: state.user.authorized
    }),
    dispatchToProps = (dispatch) => ({
        restoreUser: restoreUser(dispatch),
        loginUser: loginUser(dispatch),
        registerUser: registerUser(dispatch),
        logoutUser: logoutUser(dispatch)
    });

export default connect(
    stateToProps, dispatchToProps
)(Auth);