import { ApiClient } from "../../ApiAccess/ApiClient";
import type IPaginatedList from "../../Shared/Models/IPaginatedList";
import type IPaginationParameters from "../../Shared/Models/IPaginationParameters";
import type IProductReviewDto from "../Dtos/IProductReviewDto";
import type IAddUpdateProductReviewRequest from "../Requests/IAddUpdateProductReviewRequest";

export default class ProductUserReviewsService {
    public static async getReviews(
        productId: number,
        pagination: IPaginationParameters,
        orderBy: string | null
    ) : Promise<IPaginatedList<IProductReviewDto>>
    {
        const {data} = await ApiClient.instance.http.get<IPaginatedList<IProductReviewDto>>(
            `products/${productId}/reviews`, {
                params: {
                    pageNumber: pagination.pageNumber,
                    pageSize: pagination.pageSize,
                    orderBy: orderBy
                }
            }
        );

        return data;
    }

    public static async getUsersReview(productId: number): Promise<IProductReviewDto> {
        const {data} = await ApiClient.instance.http.get<IProductReviewDto>(
            `products/${productId}/reviews/own`
        );

        return data;
    }

    public static async addReview(productId: number, request: IAddUpdateProductReviewRequest) : Promise<void> {
        await ApiClient.instance.http.post(
            `products/${productId}/reviews`, request
        );
    }

    public static async updateReview(id: number, request: IAddUpdateProductReviewRequest) : Promise<void> {
        await ApiClient.instance.http.put(
            `products/reviews/${id}`,
            request
        );
    }

    public static async deleteReview(id: number) {
        await ApiClient.instance.http.delete(
            `products/reviews/${id}`
        );
    }
}