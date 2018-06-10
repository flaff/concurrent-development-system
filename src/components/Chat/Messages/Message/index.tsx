import * as React from "react";
import * as classNames from "classnames";
import {Moment} from "moment";
import Time from "@components/Chat/Messages/Time";
import {MessageType} from "@request/types/sockets";
import Image from "@components/Image";
import {isAnEmojiOnly} from "@components/Chat/emojis";


const styles = require("./styles.scss");

export enum MessageOrder {
    ONLY = "ONLY",
    FIRST = "FIRST",
    BETWEEN = "BETWEEN",
    LAST = "LAST"
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
    content: string;
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

const messageTypeToClassName = (type: MessageType) => {
        switch (type) {
            case MessageType.BASE64IMAGE:
                return styles.image;
            case MessageType.SERVER:
                return styles.server;
            case MessageType.TEXT:
                return "";
        }
    },
    isAnEmoji = (type: MessageType, content: string) =>
        type === MessageType.TEXT && isAnEmojiOnly(content);

const
    Message = (props: MessageProps) => (
        <div>
            {shouldShowName(props.type, props.order, props.ownMessage) &&
            <div className={styles.author}>{props.author}</div>
            }
            <div
                className={classNames(styles.messageRow, messageTypeToClassName(props.type), {[styles.self]: props.ownMessage})}>
                <div className={classNames(styles.time, {[styles.self]: props.ownMessage})}>
                    <Time time={props.time} now={props.now}/>
                </div>
                <div
                    className={classNames(styles.bubble, messageOrderToClassName(props.order), messageTypeToClassName(props.type), {
                        [styles.self]: props.ownMessage,
                        [styles.pending]: props.pending,
                        [styles.emoji]: isAnEmoji(props.type, props.content)
                    })}>
                    {props.type === MessageType.BASE64IMAGE
                        ? <Image src={props.content}/>
                        : props.content}
                </div>
            </div>
        </div>
    );

export default Message;
