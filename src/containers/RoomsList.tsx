import * as React from "react";
import {Link} from "react-router-dom";

const roomsList = ["room1", "room2"];

const
    RoomRecord = (props: any) => (
        <Link to={`/rooms/${props.roomId}`}
              className="list-group-item list-group-item-action flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{props.roomName}</h5>
                <small className="text-muted">20 minutes ago</small>
            </div>
            <p className="mb-1">Room description.</p>
        </Link>
    ),

    RoomsList = () => (
        <div className={"container-fluid"} style={{paddingTop: "30px"}}>
            <h2>Select room</h2>
            <ul className="list-group">
                {roomsList.map((roomName, key) => (
                    <RoomRecord roomName={roomName} key={key} roomId={roomName}/>
                ))}
                <li className="list-group-item">Create new room</li>
            </ul>
        </div>
    );

export default RoomsList;