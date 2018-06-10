import {MessageModel} from "@components/Chat/Messages";

export interface RoomState {
    name: string;
    messages: Array<MessageModel>;
    showInfoMessages: boolean;
    id: string;
}