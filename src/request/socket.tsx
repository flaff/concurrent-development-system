import * as io from "socket.io-client";

const
    socket = io(`http://${window.location.hostname}:3001/`);

export default socket;
