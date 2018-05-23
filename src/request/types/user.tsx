export interface ErrorResponse {
    status: boolean;
    err: string;
}

export interface RegisterUserParams {
    login: string,
    password: string
}

export interface LoginUserParams {
    login: string,
    password: string
}

export interface RestoreUserParams {
    token: string
}

export interface UserProfile {
    Id: string;
    Login: string;
}

export interface LoginUserResponse {
    status: boolean;
    userProfile: UserProfile;
    token: string;
}

export interface RegisterUserResponse {
    status: boolean;
    data: any;
}

export interface RestoreUserResponse {
    status: boolean;
    userProfile: UserProfile;
}
