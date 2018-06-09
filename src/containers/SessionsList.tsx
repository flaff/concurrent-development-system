import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

import * as moment from 'moment';

import {StoreState} from "@state/types";
import {createSession, getSessions} from "@state/actions/sessions";
import {SessionRecord} from "@request/types";
import {leaveRoom} from '@state/actions/room';

const
    RoomRecord = (props: SessionRecord) => (
        <Link to={`/sessions/${props._id}`}
              className="list-group-item list-group-item-action flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{props.Name}</h5>
                <small className="text-muted">{props.CreateDate ? moment(props.CreateDate).fromNow() : 'Some time ago'}</small>
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

    componentDidMount() {
        this.props.leaveRoom({author: this.props.user.name});
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
                <h2>Select session</h2>
                <ul className="list-group">
                    {this.props.sessionsList && this.props.sessionsList.map((record: SessionRecord) => (
                        <RoomRecord {...record} key={record._id} />
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
        sessionsList: state.sessions.list,
        shouldRefresh: state.sessions.shouldRefresh,
        user: state.user
    }),
    dispatchToProps = (dispatch) => ({
        createSession: createSession(dispatch),
        getSessions: getSessions(dispatch),
        leaveRoom: leaveRoom(dispatch),
    });

export default connect(stateToProps, dispatchToProps)(SessionsList);