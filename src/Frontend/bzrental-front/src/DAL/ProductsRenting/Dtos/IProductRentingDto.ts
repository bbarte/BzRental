export const ProductRentingStatus = {
    Planned: 'Planned',
    InProgress: 'InProgress',
    Returned: 'Returned',
    Canceled: 'Canceled',
    UserDidNotShowUp: 'UserDidNotShowUp'
}

export interface IProductRentingDto {
    id: number,
    productId: number,
    productName: string,
    productCategoryName: string,
    createdById: number,
    createdBy: string,
    status: string,
    doesReserveProduct: boolean,
    startDate: string,
    endDate: string,
    dailyPrice: number,
    currentRentValue: number,
    userComments: string,
    createdAt: string
}