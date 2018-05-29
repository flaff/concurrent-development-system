import * as React from "react";
import Chat from "@components/Chat";
import {connect} from "react-redux";
import {StoreState} from "@state/types";
import Simulation from "@components/Simulation";
import socket from "@request/socket";

interface RoomProps extends ReturnType<typeof stateToProps> {
}

interface RoomState {

}

class Room extends React.Component<RoomProps, RoomState> {
    constructor(props) {
        super(props);
        socket.emit("change_room", {Login: this.props.userName, roomId: props.match.params.roomId});
    }

    render() {
        return (
            <div>
                <Chat user={this.props.userName} />
                <Simulation />
            </div>
        )
    }
}

const stateToProps = (state: StoreState) => ({
    userName: state.user.name,
    userId: state.user.id
});

export default connect(
    stateToProps
)(Room);