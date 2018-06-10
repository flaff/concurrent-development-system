import * as React from 'react';
import Chat from '@components/Chat';
import {connect} from 'react-redux';
import {StoreState} from '@state/types';
import Simulation from '@components/Simulation';
import {getAllMessages, joinRoom, sendMessage, showInfoMessagesChange} from "@state/actions/room";
const styles = require('./SessionRoom.scss');

interface SessionProps extends ReturnType<typeof stateToProps>, ReturnType<typeof dispatchToProps> {
}

interface SessionState {
    roomName: string;
}

class SessionRoom extends React.Component<SessionProps, SessionState> {
    constructor(props) {
        super(props);
        //socket.emit("change_room", {Login: this.props.userName, roomId: props.match.params.roomId});
        this.props.joinRoom({
            room: props.match.params.roomId,
            user: this.props.userName,
            sessionName: 'Session 1',
            sessionId: props.match.params.roomId
        });
        this.props.getAllMessages({id: props.match.params.roomId});
    }

    render() {
        return (
            <div className={styles.sessionRoom}>
                <Chat user={this.props.userName} messages={this.props.messages}
                      showInfoMessages={this.props.showInfoMessages}
                      showInfoMessagesChange={this.props.showInfoMessagesChange} sendMessage={this.props.sendMessage} />
                <Simulation/>
            </div>
        );
    }
}

const
    stateToProps = (state: StoreState) => ({
        userName: state.user.name,
        userId: state.user.id,
        messages: state.room.messages,
        showInfoMessages: state.room.showInfoMessages
    }),

    dispatchToProps = (dispatch) => ({
        joinRoom: joinRoom(dispatch),
        sendMessage: sendMessage(dispatch),
        getAllMessages: getAllMessages(dispatch),
        showInfoMessagesChange: showInfoMessagesChange(dispatch)
    });

export default connect(
    stateToProps,
    dispatchToProps
)(SessionRoom);