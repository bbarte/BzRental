import { ApiClient } from "../../ApiAccess/ApiClient";
import type IPaginatedList from "../../Shared/Models/IPaginatedList";
import type IPaginationParameters from "../../Shared/Models/IPaginationParameters";
import type IIsProductRentedByUserDto from "../Dtos/IIsProductRentedByUserDto";
import type { IProductAvailabilityDto } from "../Dtos/IProductAvailabilityDto";
import type IProductCategoryDistinctFieldValuesDto from "../Dtos/IProductCategoryDistinctFieldValuesDto";
import type IProductCategoryMinimalDto from "../Dtos/IProductCategoryMinimalDto";
import type IProductDetailsDto from "../Dtos/IProductDetailsDto";
import type IProductDto from "../Dtos/IProductDto";
import type IProductFieldInfoDto from "../Dtos/ProductFieldInfoDto";
import type { ISearchProductsRequest } from "../Requests/ISearchProductsRequest";

export default class ProductsSelectingService {
    public static async getCategories(): Promise<IProductCategoryMinimalDto[]> {
        const {data} = await ApiClient.instance.http.get<IProductCategoryMinimalDto[]>(
            'products/categories'
        );

        return data;
    }

    public static async getCategoryById(id: number): Promise<IProductCategoryMinimalDto> {
        const {data} = await ApiClient.instance.http.get<IProductCategoryMinimalDto>(
            `products/categories/${id}`
        );

        return data;
    }

    public static async getCategoryFields(categoryId: number) : Promise<IProductFieldInfoDto[]> {
        const {data} = await ApiClient.instance.http.get<IProductFieldInfoDto[]>(
            `products/categories/${categoryId}/fields`
        );

        return data;
    }

    public static async getDistinctCategoryFieldValues(categoryId: number) : Promise<IProductCategoryDistinctFieldValuesDto[]> {
        const {data} = await ApiClient.instance.http.get<IProductCategoryDistinctFieldValuesDto[]>(
            `products/categories/${categoryId}/distinct`
        );

        return data;
    }

    public static async searchProducts(
        categoryId: number,
        pagination: IPaginationParameters,
        request: ISearchProductsRequest,
        orderBy: string | null
    ) : Promise<IPaginatedList<IProductDto>>
    {
        const {data} = await ApiClient.instance.http.post<IPaginatedList<IProductDto>>(
            'products/search', request, {
                params: {
                    pageNumber: pagination.pageNumber,
                    pageSize: pagination.pageSize,
                    orderBy: orderBy,
                    categoryId: categoryId
                }
            }
        );

        return data;
    }

    public static async getProductById(id: number) : Promise<IProductDetailsDto> {
        const {data} = await ApiClient.instance.http.get<IProductDetailsDto>(
            `products/${id}`
        );

        return data;
    }

    public static async checkProductAvailability(
        productId: number,
        startDate: string,
        endDate: string
    ) : Promise<IProductAvailabilityDto>
    {
        const {data} = await ApiClient.instance.http.post<IProductAvailabilityDto>(
            `products/${productId}/check-availability`, null, {
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            }
        );

        return data;
    }

    public static async checkIfProductIsRentedByUser(productId: number) : Promise<IIsProductRentedByUserDto> {
        const {data} = await ApiClient.instance.http.post<IIsProductRentedByUserDto>(
            `products/${productId}/check-if-rented-by-user-now`, null
        );

        return data;
    }
}