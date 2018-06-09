import * as React from 'react';
import Chat from '@components/Chat';
import {connect} from 'react-redux';
import {StoreState} from '@state/types';
import Simulation from '@components/Simulation';
import {getAllMessages, joinRoom, leaveRoom, sendMessage} from "@state/actions/room";

interface RoomProps extends ReturnType<typeof stateToProps>, ReturnType<typeof dispatchToProps> {
}

interface RoomState {
    roomName: string;
}

class SessionRoom extends React.Component<RoomProps, RoomState> {
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
            <div>
                <Chat user={this.props.userName} sendMessage={this.props.sendMessage} messages={this.props.messages}/>
                <Simulation/>
            </div>
        );
    }
}

const
    stateToProps = (state: StoreState) => ({
        userName: state.user.name,
        userId: state.user.id,
        messages: state.room.messages
    }),

    dispatchToProps = (dispatch) => ({
        joinRoom: joinRoom(dispatch),
        sendMessage: sendMessage(dispatch),
        getAllMessages: getAllMessages(dispatch)
    });

export default connect(
    stateToProps,
    dispatchToProps
)(SessionRoom);