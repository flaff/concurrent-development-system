import {MessageModel} from './index';
import {MessageOrder} from './Message';

const
    isMessageOfAuthorOnlyOne = (messages: Array<MessageModel>, index: number) => {
        const
            sameAuthorMessageBefore = index > 0 && messages[index].author === messages[index - 1].author,
            sameAuthorMessageAfter = index < (messages.length - 1) && messages[index].author === messages[index + 1].author;

        return !sameAuthorMessageBefore && !sameAuthorMessageAfter;
    },

    isMessageOfAuthorFirst = (messages: Array<MessageModel>, index: number) => {
        const
            sameAuthorMessageBefore = index > 0 && messages[index].author === messages[index - 1].author,
            sameAuthorMessageAfter = index < (messages.length - 1) && messages[index].author === messages[index + 1].author;

        return !sameAuthorMessageBefore && sameAuthorMessageAfter;
    },

    isMessageOfAuthorBetween = (messages: Array<MessageModel>, index: number) => {
        const
            sameAuthorMessageBefore = index > 0 && messages[index].author === messages[index - 1].author,
            sameAuthorMessageAfter = index < (messages.length - 1) && messages[index].author === messages[index + 1].author;

        return sameAuthorMessageBefore && sameAuthorMessageAfter;
    },

    isMessageOfAuthorLast = (messages: Array<MessageModel>, index: number) => {
        const
            sameAuthorMessageBefore = index > 0 && messages[index].author === messages[index - 1].author,
            sameAuthorMessageAfter = index < (messages.length - 1) && messages[index].author === messages[index + 1].author;

        return sameAuthorMessageBefore && !sameAuthorMessageAfter;
    },

    getMessageOrder = (messages: Array<MessageModel>, index: number): MessageOrder => {
        if (isMessageOfAuthorFirst(messages, index)) {
            return MessageOrder.FIRST;
        }
        if (isMessageOfAuthorLast(messages, index)) {
            return MessageOrder.LAST;
        }
        if (isMessageOfAuthorBetween(messages, index)) {
            return MessageOrder.BETWEEN;
        }
        return MessageOrder.ONLY;
    },

    isMessageOfUser = (message: MessageModel, userName: string) => {
        return message.author === userName;
    };

export {
    getMessageOrder,
    isMessageOfUser
};
