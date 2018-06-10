import * as React from 'react';
import * as classNames from 'classnames';
import {Moment} from 'moment';
import Time from "@components/Chat/Messages/Time";
import {MessageType} from "@request/types/sockets";

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
    time: Moment;
    now: Moment;
    pending?: boolean;
    first?: boolean;
    order?: MessageOrder;
    type: MessageType;
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

    shouldShowName = (type: MessageType, order?: MessageOrder, messageOfUser?: boolean) => {
        return type !== MessageType.SERVER && (order === MessageOrder.ONLY || order === MessageOrder.FIRST) && !messageOfUser;
    };

const
    Message = (props: MessageProps) => (
        <div>
            {shouldShowName(props.type, props.order, props.ownMessage) &&
                <div className={styles.author}>{props.author}</div>
            }
            <div className={classNames(styles.messageRow, {[styles.self]: props.ownMessage, [styles.server]: props.type === MessageType.SERVER})}>
                <div className={classNames(styles.time, {[styles.self]: props.ownMessage})}>
                    <Time time={props.time} now={props.now} />
                </div>
                <div className={classNames(styles.bubble, messageOrderToClassName(props.order), {[styles.self]: props.ownMessage, [styles.pending]: props.pending, [styles.server]: props.type === MessageType.SERVER})}>
                    {props.children}
                </div>
            </div>
        </div>
    );

export default Message;
