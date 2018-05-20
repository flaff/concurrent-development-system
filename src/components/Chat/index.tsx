import * as React from 'react';
import * as moment from 'moment';
import Messages, {MessageModel} from '@components/Chat/Messages';
import mockMessages from './mock';
import {ChangeEvent, KeyboardEvent} from 'react';
import {isAnEnter} from '@components/Chat/utils';

interface ChatProps {
    user: string;
    className?: string;
}

interface ChatState {
    messages: Array<MessageModel>;
    inputValue: string;
}

export default class Chat extends React.Component<ChatProps, ChatState> {
    state = {
        messages: mockMessages,
        inputValue: ''
    };

    constructor(props: ChatProps) {
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.onInputKeyUp = this.onInputKeyUp.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    sendMessage(content: string) {
        const nextMessageIndex = this.state.messages.length;
        this.setState({
            messages: [
                ...this.state.messages,
                {author: this.props.user, time: +moment(), content, pending: true}
            ],
            inputValue: ''
        });

        // mock message resolve
        setTimeout(
            () => {
                const messages = [...this.state.messages];
                messages[nextMessageIndex].pending = false;
                this.setState({messages});
            },
            500
        );
    }

    onInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({inputValue: event.target.value});
    }

    onInputKeyUp(event: KeyboardEvent<HTMLInputElement>) {
        if (isAnEnter(event)) {
            this.sendMessage(this.state.inputValue);
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <Messages messages={this.state.messages} user={this.props.user}/>
                <input
                    onKeyUp={this.onInputKeyUp}
                    onChange={this.onInputChange}
                    value={this.state.inputValue}
                />
            </div>
        );
    }
}
/**/