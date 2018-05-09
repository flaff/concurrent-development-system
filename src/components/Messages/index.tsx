import * as React from 'react';
import * as classNames from 'classnames';
import Message, {MessageOrder} from './Message';
import {getMessageOrder, isMessageOfUser} from '@components/Messages/utils';

export interface MessageModel {
    author: string;
    content: string;
}

interface MessagesProps {
    messages: Array<MessageModel>;
    user: string;
}

const Messages = (props: MessagesProps) => (
    <div>
        {props.messages.map(
            (message, index) =>
                <Message
                    author={message.author}
                    ownMessage={isMessageOfUser(message, props.user)}
                    order={getMessageOrder(props.messages, index)}
                    key={index}
                >
                    {message.content}
                </Message>
        )}
    </div>
);

export default Messages;
