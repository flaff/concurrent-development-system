import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {StoreState} from "@state/types";
import {createSession, getSessions} from "@state/actions/sessions";

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
    );

interface SessionsListProps extends ReturnType<typeof stateToProps>, ReturnType<typeof dispatchToProps> {
}

interface SessionsListState {
    newSessionInputValue: string;
}

class SessionsList extends React.Component<SessionsListProps, SessionsListState> {
    constructor(props) {
        super(props);
        this.state = {
            newSessionInputValue: ''
        };

        this.onSessionNameInputChange = this.onSessionNameInputChange.bind(this);
        this.onCreateSessionClick = this.onCreateSessionClick.bind(this);

        this.props.getSessions();
    }

    componentWillReceiveProps(props: SessionsListProps) {
        if (props.shouldRefresh) {
            props.getSessions();
        }
    }

    onSessionNameInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            newSessionInputValue: event.target.value
        });
    }

    onCreateSessionClick() {
        this.props.createSession({
            Name: this.state.newSessionInputValue
        });
        this.setState({
            ...this.state,
            newSessionInputValue: ''
        });
    }

    render() {
        return (
            <div className={"container-fluid"} style={{paddingTop: "30px"}}>
                <h2>Select room</h2>
                <ul className="list-group">
                    {this.props.sessions && this.props.sessions.map((roomName, key) => (
                        <RoomRecord roomName={roomName} key={key} roomId={roomName}/>
                    ))}
                    <li className="list-group-item"><h6>Create new session
                        {' '}
                        <span className="badge badge-secondary">WOW</span>
                        {' '}
                        <span className="badge badge-secondary">NEW</span>
                    </h6>
                        <div className={'input-group'}>
                            <input
                                placeholder={'Session name'}
                                className={'form-control'}
                                value={this.state.newSessionInputValue} onChange={this.onSessionNameInputChange} />
                            <div className="input-group-append">
                                <button className={'btn btn-outline-secondary'}
                                    onClick={this.onCreateSessionClick} disabled={!this.state.newSessionInputValue}>
                                    New session
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

const
    stateToProps = (state: StoreState) => ({
        sessions: state.sessions.list,
        shouldRefresh: state.sessions.shouldRefresh
    }),
    dispatchToProps = (dispatch) => ({
        createSession: createSession(dispatch),
        getSessions: getSessions(dispatch)
    });

export default connect(stateToProps, dispatchToProps)(SessionsList);