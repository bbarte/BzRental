import { ApiClient } from "../../ApiAccess/ApiClient";
import { JwtManager } from "../../ApiAccess/JwtManager";
import type IAuthDto from "../Dtos/IAuthDto";
import type ILoggedUserDto from "../Dtos/ILoggedUserDto";
import type ILoginRequest from "../Requests/ILoginRequest";

export default class AuthService {
    public static isLoggedIn: boolean = false;
    public static isUserAdmin: boolean = false;

    public static loggedUserInfo: ILoggedUserDto = {
        firstName: '',
        lastName: '',
        username: ''
    };

    public static async login(request: ILoginRequest): Promise<void> {
        const {data} = await ApiClient.instance.http.post<IAuthDto>('auth/login', request);

        JwtManager.setAccessToken(data.accessToken);

        this.isLoggedIn = true;
        this.isUserAdmin = data.isAdmin;

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
        this.isLoggedIn = false;
        this.isUserAdmin = false;
    }
}