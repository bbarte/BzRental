import { ApiClient } from "../../ApiAccess/ApiClient";
import type IPaginatedList from "../../Shared/Models/IPaginatedList";
import type IPaginationParameters from "../../Shared/Models/IPaginationParameters";
import type ICheckoutRentingSummaryDto from "../Dtos/ICheckoutRentingSummaryDto";
import type { IProductRentingDto } from "../Dtos/IProductRentingDto";
import type IProductRentingStatusChangeDto from "../Dtos/IProductRentingStatusChangeDto";
import type IUsersProductRentingDto from "../Dtos/IUsersProductRentingDto";
import type ICancelProductRentingRequest from "../Requests/ICancelProductRentingRequest";
import type ICheckoutProductRentingRequest from "../Requests/ICheckoutProductRentingRequest";
import type IConfirmProductRentingPlanHandoverRequest from "../Requests/IConfirmProductRentingPlanHandoverRequest";
import type IPlanProductRentingRequest from "../Requests/IPlanProductRentingRequest";
import type ITurnDownProductRentingPlanRequest from "../Requests/ITurnDownProductRentingPlanRequest";

export default class ProductsRentingService {
    public static async getUsersRentings(
        pagination: IPaginationParameters,
        status: number | null,
        dateFrom: string | null,
        dateTo: string | null,
        orderBy: string | null
    ) : Promise<IPaginatedList<IUsersProductRentingDto>>
    {
        const {data} = await ApiClient.instance.http.get<IPaginatedList<IUsersProductRentingDto>>(
            'products/rentings/own', {
                params: {
                    pageNumber: pagination.pageNumber,
                    pageSize: pagination.pageSize,
                    status: status,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    orderBy: orderBy
                }
            }
        );

        return data;
    }

    public static async getRentings(
        pagination: IPaginationParameters,
        productId: number | null,
        createdById: number | null,
        status: number | null,
        dateFrom: string | null,
        dateTo: string | null,
        orderBy: string | null
    ) : Promise<IPaginatedList<IProductRentingDto>>
    {
        const {data} = await ApiClient.instance.http.get<IPaginatedList<IProductRentingDto>>(
            'products/rentings/all', {
                params: {
                    pageNumber: pagination.pageNumber,
                    pageSize: pagination.pageSize,
                    productId: productId,
                    createdById: createdById,
                    status: status,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    orderBy: orderBy
                }
            }
        );

        return data;
    }

    public static async getRentingsStatusChanges(rentingId: number) : Promise<IProductRentingStatusChangeDto[]> {
        const {data} = await ApiClient.instance.http.get<IProductRentingStatusChangeDto[]>(
            `products/rentings/${rentingId}/status-changes`
        );

        return data;
    }

    public static async planRenting(productId: number, request: IPlanProductRentingRequest) : Promise<void> {
        await ApiClient.instance.http.post(
            `products/${productId}/plan-renting`, request
        );
    }

    public static async cancelRentingPlan(id: number, request: ICancelProductRentingRequest) : Promise<void> {
        await ApiClient.instance.http.post(
            `products/rentings/${id}/cancel-renting-plan`,
            request
        );
    }

    public static async confirmRentingPlanHandover(id: number, request: IConfirmProductRentingPlanHandoverRequest) : Promise<void> {
        await ApiClient.instance.http.post(
            `products/rentings/${id}/confirm-renting-plan-handover`,
            request
        );
    }

    public static async turnDownRentingPlan(id: number, request: ITurnDownProductRentingPlanRequest) : Promise<void> {
        await ApiClient.instance.http.post(
            `products/rentings/${id}/turn-down-renting-plan`,
            request
        );
    }

    public static async checkoutRenting(id: number, request: ICheckoutProductRentingRequest) : Promise<ICheckoutRentingSummaryDto> {
        const {data} = await ApiClient.instance.http.post<ICheckoutRentingSummaryDto>(
            `products/rentings/${id}/checkout-renting`,
            request
        );

        return data;
    }
}