import * as React from "react";
import * as moment from "moment";
import Messages, {MessageModel} from "@components/Chat/Messages";
import mockMessages from "./mock";
import {ChangeEvent, KeyboardEvent} from "react";
import {isAnEnter} from "@components/Chat/utils";
import {sendMessage} from "@state/actions/room";
import {connect} from "react-redux";
import {StoreState} from "@state/types";
import {MessageType} from "@request/types/sockets";

type Moment = moment.Moment;

interface ChatProps {
    user: string;
    className?: string;
    messages: Array<MessageModel>;
    sendMessage: ReturnType<typeof sendMessage>;
}

interface ChatState {
    now: Moment;
    inputValue: string;
}

export default class Chat extends React.Component<ChatProps, ChatState> {
    state = {
        inputValue: "",
        now: moment()
    };

    updateTime() {
        this.setState({now: moment()});
    }

    constructor(props: ChatProps) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.onInputKeyUp = this.onInputKeyUp.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        setInterval(this.updateTime.bind(this), 2000);
    }

    sendMessage() {
        const
            content = this.state.inputValue;

        this.props.sendMessage({
            content,
            type: MessageType.TEXT
        });

        this.setState({
            ...this.state,
            inputValue: ''
        });
    }

    onInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({inputValue: event.target.value});
    }

    onInputKeyUp(event: KeyboardEvent<HTMLInputElement>) {
        if (isAnEnter(event)) {
            this.sendMessage();
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <Messages messages={this.props.messages} user={this.props.user} now={this.state.now}/>
                <div className="input-group">
                        <input
                            className="form-control"
                            placeholder={`Typing as ${this.props.user}...`}
                            onKeyUp={this.onInputKeyUp}
                            onChange={this.onInputChange}
                            value={this.state.inputValue}
                        />
                    <div className="input-group-append">
                        <button
                            type="submit" className="btn btn-primary"
                            onClick={this.sendMessage}
                            disabled={!this.state.inputValue}>Send
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
/**/
