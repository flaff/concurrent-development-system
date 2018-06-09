import * as React from 'react';
import * as classNames from 'classnames';
import Message, {MessageOrder} from './Message/index';
import {getMessageOrder, isMessageOfUser} from './utils';
import * as moment from 'moment';
import {Moment} from "moment";

const styles = require('./styles.scss');

export interface MessageModel {
    author: string;
    content: string;
    time: number;
    pending?: boolean;
}

interface MessagesProps {
    messages: Array<MessageModel>;
    user: string;
    currentTime?: number;
    now: Moment;
}

const Messages = (props: MessagesProps) => (
    <div className={styles.messagesContainer} id={'messages-container'}>
        {props.messages.map(
            (message, index) =>
                <Message
                    author={message.author}
                    ownMessage={isMessageOfUser(message, props.user)}
                    order={getMessageOrder(props.messages, index)}
                    time={moment(message.time)}
                    now={props.now}
                    pending={message.pending}
                    key={index}
                >
                    {message.content}
                </Message>
        )}
    </div>
);

export default Messages;
