import { ApiClient } from "../../ApiAccess/ApiClient";
import type ICreatedObjectDto from "../../Shared/Models/ICreatedObjectDto";
import type IPaginatedList from "../../Shared/Models/IPaginatedList";
import type IPaginationParameters from "../../Shared/Models/IPaginationParameters";
import type IProductAdminDetailsDto from "../Dtos/IProductAdminDetailsDto";
import type IProductAdminDto from "../Dtos/IProductAdminDto";
import type IProductFieldInfoDto from "../Dtos/ProductFieldInfoDto";
import type IAddProductRequest from "../Requests/IAddProductRequest";
import type IUpdateProductRequest from "../Requests/IUpdateProductRequest";

export default class ProductsAdminService {
    public static async getProducts(
        pagination: IPaginationParameters,
        filter: string | null,
        categoryId: number | null,
        includeDeleted: boolean,
        orderBy: string | null
    ) : Promise<IPaginatedList<IProductAdminDto>>
    {
        const {data} = await ApiClient.instance.http.get<IPaginatedList<IProductAdminDto>>(
            'admin/products', {
                params: {
                    pageNumber: pagination.pageNumber,
                    pageSize: pagination.pageSize,
                    filter: filter,
                    includeDeleted: includeDeleted,
                    categoryId: categoryId,
                    orderBy: orderBy
                }
            }
        );

        return data;
    }

    public static async getProductById(id: number): Promise<IProductAdminDetailsDto> {
        const {data} = await ApiClient.instance.http.get<IProductAdminDetailsDto>(
            `admin/products/${id}`
        );

        return data;
    }

    public static async getFieldsInfoForCategory(categoryId: number): Promise<IProductFieldInfoDto[]> {
        const {data} = await ApiClient.instance.http.get<IProductFieldInfoDto[]>(
            `admin/products/fields-info/category/${categoryId}`
        );

        return data;
    }

    public static async getFieldsInfoForProductById(productId: number): Promise<IProductFieldInfoDto[]> {
        const {data} = await ApiClient.instance.http.get<IProductFieldInfoDto[]>(
            `admin/products/${productId}/fields-info`
        );

        return data;
    }

    public static async getAllFieldsValuesForProductById(productId: number): Promise<IProductFieldInfoDto[]> {
        const {data} = await ApiClient.instance.http.get<IProductFieldInfoDto[]>(
            `admin/products/${productId}/all-field-values`
        );

        return data;
    }

    public static async addProduct(request: IAddProductRequest): Promise<ICreatedObjectDto<number>> {
        const {data} = await ApiClient.instance.http.post<ICreatedObjectDto<number>>('admin/products', request);

        return data;
    }

    public static async updateProduct(id: number, request: IUpdateProductRequest): Promise<void> {
        await ApiClient.instance.http.put(`admin/products/${id}`, request);
    }

    public static async deleteProduct(id: number): Promise<void> {
        await ApiClient.instance.http.delete(`admin/products/${id}`);
    }

    public static async recoverProduct(id: number): Promise<void> {
        await ApiClient.instance.http.post(`admin/products/${id}/recover`);
    }

    public static async uploadProductImages(
        productId: number,
        files: File[] | FileList
    ): Promise<void>
    {
        const formData = new FormData();

        for (const file of files) {
            formData.append('files', file);
        }

        await ApiClient.instance.http.post(
            `admin/products/${productId}/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    }
}