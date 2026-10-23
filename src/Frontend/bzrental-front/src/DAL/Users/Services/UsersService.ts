import { ApiClient } from "../../ApiAccess/ApiClient";
import type IRegisterUserRequest from "../Requests/IRegisterUserRequest";

export default class UsersService {
    public static async registerUser(request: IRegisterUserRequest): Promise<void> {
        await ApiClient.instance.http.post('users/register', request);
    }
}