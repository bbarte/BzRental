import { ApiClient } from "../../ApiAccess/ApiClient";
import { JwtManager } from "../../ApiAccess/JwtManager";
import type IAuthDto from "../Dtos/IAuthDto";
import type ILoggedUserDto from "../Dtos/ILoggedUserDto";
import type ILoginRequest from "../Requests/ILoginRequest";

export default class AuthService {
    private static readonly IS_ADMIN_KEY = 'isAdmin';

    public static get isUserAdmin(): boolean {
        return localStorage.getItem(this.IS_ADMIN_KEY) !== null;
    }

    public static get isLoggedIn(): boolean {
        return JwtManager.getAccessToken() !== null;
    }

    public static loggedUserInfo: ILoggedUserDto = {
        firstName: '',
        lastName: '',
        username: ''
    };

    public static async login(request: ILoginRequest): Promise<void> {
        const {data} = await ApiClient.instance.http.post<IAuthDto>('auth/login', request);

        JwtManager.setAccessToken(data.accessToken);

        if (data.isAdmin)
            localStorage.setItem(this.IS_ADMIN_KEY, '1');
        else
            localStorage.removeItem(this.IS_ADMIN_KEY);

        await this.setLoggedUserInfo();
    }

    public static async getUserInfo(): Promise<ILoggedUserDto> {
        const {data} = await ApiClient.instance.http.get<ILoggedUserDto>('auth/info');
        return data;
    }

    public static async setLoggedUserInfo(): Promise<void> {
        this.loggedUserInfo = await this.getUserInfo();
    }

    public static logout() {
        this.loggedUserInfo = {
            firstName: '',
            lastName: '',
            username: ''
        };

        JwtManager.removeAccessToken();
        localStorage.removeItem(this.IS_ADMIN_KEY);
    }
}