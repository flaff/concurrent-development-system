import * as React from 'react';
import * as classNames from 'classnames';
import Message, {MessageOrder} from './Message/index';
import {getMessageOrder, isMessageOfUser} from './utils';
import * as moment from 'moment';
import {Moment} from "moment";
import {MessageType} from "@request/types/sockets";

const styles = require('./styles.scss');

export interface MessageModel {
    author: string;
    content: string;
    time: number;
    pending?: boolean;
    type: MessageType;
}

interface MessagesProps {
    messages: Array<MessageModel>;
    user: string;
    showSystemMessages: boolean;
    currentTime?: number;
    now: Moment;
}

const Messages = (props: MessagesProps) => (
    <div className={styles.messagesContainer} id={'messages-container'}>
        {props.messages.filter((message) => message.type !== MessageType.SERVER || props.showSystemMessages).map(
            (message, index) =>
                <Message
                    showSystemMessages={props.showSystemMessages}
                    author={message.author}
                    ownMessage={isMessageOfUser(message, props.user)}
                    order={getMessageOrder(props.messages, index)}
                    time={moment(message.time)}
                    now={props.now}
                    type={message.type}
                    pending={message.pending}
                    key={index}
                    content={message.content}
            />
        )}
    </div>
);

export default Messages;
