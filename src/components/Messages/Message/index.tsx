import * as React from 'react';
import * as classNames from 'classnames';

const styles = require('./styles.scss');

export enum MessageOrder {
    ONLY = 'ONLY',
    FIRST = 'FIRST',
    BETWEEN = 'BETWEEN',
    LAST = 'LAST'
}

interface MessageProps {
    ownMessage?: boolean;
    author: string;
    first?: boolean;
    order?: MessageOrder;
    children: string;
}

const messageOrderToClassName = (order: MessageOrder = MessageOrder.ONLY) => {
        switch (order) {
            case MessageOrder.FIRST:
                return styles.first;

            case MessageOrder.BETWEEN:
                return styles.between;

            case MessageOrder.LAST:
                return styles.last;

            case MessageOrder.ONLY:
                return;
        }
    },

    shouldShowName = (order?: MessageOrder, messageOfUser?: boolean) => {
        return (order === MessageOrder.ONLY || order === MessageOrder.FIRST) && !messageOfUser;
    };

const
    Message = (props: MessageProps) => (
        <div>
            {shouldShowName(props.order, props.ownMessage) &&
                <div className={styles.author}>{props.author}</div>
            }
            <div className={classNames(styles.messageRow, {[styles.self]: props.ownMessage})}>
                <div className={classNames(styles.bubble, messageOrderToClassName(props.order), {[styles.self]: props.ownMessage})}>
                    {props.children}
                </div>
            </div>
        </div>
    );

export default Message;
