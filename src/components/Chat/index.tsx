import * as React from "react";
import * as moment from "moment";
import * as classnames from "classnames";
import Dropzone from "react-dropzone";
import Messages, {MessageModel} from "@components/Chat/Messages";
import {ChangeEvent, KeyboardEvent} from "react";
import {isAnEnter} from "@components/Chat/utils";
import {sendMessage, showInfoMessagesChange} from "@state/actions/room";
import {MessageType} from "@request/types/sockets";
import {addEmojis} from "@components/Chat/emojis";

const styles = require("./styles.scss");



type Moment = moment.Moment;

interface ChatProps {
    user: string;
    className?: string;
    messages: Array<MessageModel>;
    showInfoMessages: boolean;
    sendMessage: ReturnType<typeof sendMessage>;
    showInfoMessagesChange: ReturnType<typeof showInfoMessagesChange>;
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
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.onFilesDrop = this.onFilesDrop.bind(this);
        this.onShowSystemMessagesClick = this.onShowSystemMessagesClick.bind(this);
        setInterval(this.updateTime.bind(this), 2000);
    }

    sendMessage() {
        const
            content = this.state.inputValue;

        this.props.sendMessage({
            content: addEmojis(content),
            author: this.props.user,
            type: MessageType.TEXT,
            room: location.href.split("/")[4]
        });

        this.setState({
            ...this.state,
            inputValue: ""
        });

        setTimeout(() => {
            this.scrollToBottom();
        }, 0);
    }

    scrollToBottom() {
        let objDiv = document.getElementById("messages-container");
        if (objDiv) {
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    }

    onInputChange(event: ChangeEvent<HTMLInputElement>) {
        this.setState({inputValue: event.target.value});
    }

    onInputKeyUp(event: KeyboardEvent<HTMLInputElement>) {
        if (isAnEnter(event)) {
            this.sendMessage();
        }
    }

    onShowSystemMessagesClick() {
        this.props.showInfoMessagesChange({show: !this.props.showInfoMessages});
    }

    onFilesDrop(acceptedFiles) {
        const file = acceptedFiles && acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                this.props.sendMessage({
                    type: MessageType.BASE64IMAGE,
                    content: reader.result,
                    author: this.props.user,
                    room: location.href.split("/")[4]
                });
            });

            reader.readAsDataURL(file);
        }
    }

    render() {
        return (
            <div className={classnames(this.props.className, styles.chat)}>
                <Messages
                    showSystemMessages={this.props.showInfoMessages}
                    messages={this.props.messages} user={this.props.user} now={this.state.now} />
                <div onClick={this.onShowSystemMessagesClick}>
                    <input type={'checkbox'}
                           checked={this.props.showInfoMessages} /> Show system messages
                </div>
                <div className="input-group">
                    <Dropzone
                        style={{}}
                        disableClick={true}
                        accept={"image/*"} onDrop={this.onFilesDrop}>
                        <input
                            className="form-control"
                            placeholder={`Typing as ${this.props.user}...`}
                            onKeyUp={this.onInputKeyUp}
                            onChange={this.onInputChange}
                            value={this.state.inputValue}
                        />
                    </Dropzone>
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
