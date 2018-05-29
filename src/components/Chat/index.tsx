import * as React from 'react';
import * as moment from 'moment';
import Messages, {MessageModel} from '@components/Chat/Messages';
import mockMessages from './mock';
import {ChangeEvent, KeyboardEvent} from 'react';
import {isAnEnter} from '@components/Chat/utils';
import socket from '@request/socket';

type Moment = moment.Moment;

interface ChatProps {
    user: string;
    className?: string;
}

interface ChatState {
    messages: Array<MessageModel>;
    now: Moment;
    inputValue: string;
}

export default class Chat extends React.Component<ChatProps, ChatState> {
    state = {
        messages: mockMessages,
        inputValue: '',
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

        socket.on('messageFromServer', (data) => {
            console.log('messageFromServer: ' + data.message);
            this.setState({
                messages: [
                    ...this.state.messages,
                    {author: data.author, time: data.time, content: data.message, pending: true}
                ],
                inputValue: ''
            });
        });
    }

    sendMessage() {
        const
            content = this.state.inputValue;

        content &&
        socket.emit('message', {
            roomId: location.href.split('/')[4],
            author: this.props.user,
            time: +moment(),
            content,
            pending: true
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
            <div className={'p-3'}>
                <Messages messages={this.state.messages} user={this.props.user} now={this.state.now}/>
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