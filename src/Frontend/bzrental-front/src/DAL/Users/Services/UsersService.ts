import { ApiClient } from "../../ApiAccess/ApiClient";
import type IPaginatedList from "../../Shared/Models/IPaginatedList";
import type IPaginationParameters from "../../Shared/Models/IPaginationParameters";
import type IUserDto from "../Dtos/IUserDto";
import type IRegisterUserRequest from "../Requests/IRegisterUserRequest";

export default class UsersService {
    public static async registerUser(request: IRegisterUserRequest): Promise<void> {
        await ApiClient.instance.http.post('users/register', request);
    }

    public static async getUsers(
        pagination: IPaginationParameters,
        filter: string | null,
        includeDeleted: boolean
    ) : Promise<IPaginatedList<IUserDto>>
    {
        const {data} = await ApiClient.instance.http.get<IPaginatedList<IUserDto>>('users', {
            params: {
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
                filter: filter,
                includeDeleted: includeDeleted
            }
        });

        return data;
    }

    public static async deleteUser(id: number): Promise<void> {
        await ApiClient.instance.http.delete(`users/${id}`)
    }

    public static async recoverUser(id: number): Promise<void> {
        await ApiClient.instance.http.post(`users/${id}/recover`);
    }
    
    public static async blockUser(id: number): Promise<void> {
        await ApiClient.instance.http.post(`users/${id}/block`);
    }
    
    public static async unblockUser(id: number): Promise<void> {
        await ApiClient.instance.http.post(`users/${id}/unblock`);
    }
    
    public static async grantAdminForUser(id: number): Promise<void> {
        await ApiClient.instance.http.post(`users/${id}/grant-admin`);
    }
    
    public static async revokeAdminForUser(id: number): Promise<void> {
        await ApiClient.instance.http.post(`users/${id}/revoke-admin`);
    }
}