export interface Notification {
    type: string;
    content: string;
}

export type NotificationsState = Array<Notification>;