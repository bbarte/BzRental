import axios, { type AxiosInstance } from "axios";
import { JwtManager } from "./JwtManager";
import type IApiErrorResponseDto from "./Models/IApiErrorResponseDto";
import { ApiError } from "./ApiError";
import type IApiErrorDto from "./Models/IApiErrorDto";

export class ApiClient {
    readonly API_URL: string = 'https://localhost:7194/api/';

    private static _instance: ApiClient;
    
    public static get instance(): ApiClient {
        if (!ApiClient._instance) {
            ApiClient._instance = new ApiClient();
        }

        return ApiClient._instance;
    }

    public http: AxiosInstance;

    private constructor() {
        this.http = axios.create({
            baseURL: this.API_URL
        });

        this.http.interceptors.request.use(config => {
            const token = JwtManager.getAccessToken();

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        this.http.interceptors.response.use(
            response => response,
            (error: unknown) => {
                if (!axios.isAxiosError<IApiErrorResponseDto>(error)) {
                    return Promise.reject(error);
                }

                if (!error.response) {
                    return Promise.reject(new ApiError(null, [
                        { code: 'Front.NetworkError', message: 'Nie można połączyć się z serwerem' }
                    ]));
                }

                const {status, data} = error.response;

                const errors: IApiErrorDto[] = Array.isArray(data?.errors)
                    ? data.errors
                    : [{code: `Http.${status}`, message: error.message}];
                    
                if (status === 401) {
                    JwtManager.removeAccessToken();
                }

                return Promise.reject(new ApiError(status, errors));
            }
        );
    }
}