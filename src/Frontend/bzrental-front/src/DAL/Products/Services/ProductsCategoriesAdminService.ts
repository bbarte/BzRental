import { ApiClient } from "../../ApiAccess/ApiClient";
import type IPaginatedList from "../../Shared/Models/IPaginatedList";
import type IPaginationParameters from "../../Shared/Models/IPaginationParameters";
import type IProductCategoryDto from "../Dtos/IProductCategoryDto";
import type { IProductCategoryFieldDto } from "../Dtos/IProductCategoryFieldDto";
import type IAddProductCategoryFieldRequest from "../Requests/IAddProductCategoryFieldRequest";
import type IAddProductCategoryRequest from "../Requests/IAddProductCategoryRequest";
import type IUpdateProductCategoryFieldRequest from "../Requests/IUpdateProductCategoryFieldRequest";
import type IUpdateProductCategoryRequest from "../Requests/IUpdateProductCategoryRequest";

export default class ProductsCategoriesAdminService {
    public static async getCategories(
        pagination: IPaginationParameters,
        filter: string | null,
        includeDeleted: boolean
    ) : Promise<IPaginatedList<IProductCategoryDto>>
    {
        const {data} = await ApiClient.instance.http.get<IPaginatedList<IProductCategoryDto>>(
            'admin/product-categories', {
                params: {
                    pageNumber: pagination.pageNumber,
                    pageSize: pagination.pageSize,
                    filter: filter,
                    includeDeleted: includeDeleted
                }
            });
        
        return data;
    }

    public static async getCategoryById(id: number): Promise<IProductCategoryDto> {
        const {data} = await ApiClient.instance.http.get<IProductCategoryDto>(
            `admin/product-categories/${id}`);

        return data;
    }

    public static async getCategoryFields(
        categoryId: number,
        pagination: IPaginationParameters,
        filter: string | null,
        includeDeleted: boolean
    ) : Promise<IPaginatedList<IProductCategoryFieldDto>>
    {
        const {data} = await ApiClient.instance.http.get<IPaginatedList<IProductCategoryFieldDto>>(
            `admin/product-categories/${categoryId}/fields`, {
                params: {
                    pageNumber: pagination.pageNumber,
                    pageSize: pagination.pageSize,
                    filter: filter,
                    includeDeleted: includeDeleted
                }
            });
        
        return data;
    }

    public static async getCategoryFieldById(id: number): Promise<IProductCategoryFieldDto> {
        const {data} = await ApiClient.instance.http.get<IProductCategoryFieldDto>(
            `admin/product-categories/fields/${id}`);

        return data;
    }

    public static async addCategory(requets: IAddProductCategoryRequest): Promise<void> {
        await ApiClient.instance.http.post('admin/product-categories', requets);
    }

    public static async addCategoryField(
        categoryId: number,
        request: IAddProductCategoryFieldRequest
    ) : Promise<void>
    {
        await ApiClient.instance.http.post(`admin/product-categories/${categoryId}/fields`, request);
    }

    public static async updateCategory(
        id: number,
        request: IUpdateProductCategoryRequest
    ) : Promise<void>
    {
        await ApiClient.instance.http.put(`admin/product-categories/${id}`, request);
    }

    public static async updateCategoryField(
        id: number,
        request: IUpdateProductCategoryFieldRequest
    ) : Promise<void>
    {
        await ApiClient.instance.http.put(`admin/product-categories/fields/${id}`, request);
    }

    public static async deleteCategory(id: number): Promise<void> {        
        await ApiClient.instance.http.delete(`admin/product-categories/${id}`);
    }
    
    public static async recoverCategory(id: number): Promise<void> {        
        await ApiClient.instance.http.post(`admin/product-categories/${id}/recover`);
    }
    
    public static async deleteCategoryField(id: number): Promise<void> {        
        await ApiClient.instance.http.delete(`admin/product-categories/fields/${id}`);
    }
    
    public static async recoverCategoryField(id: number): Promise<void> {        
        await ApiClient.instance.http.post(`admin/product-categories/fields/${id}/recover`);
    }
}