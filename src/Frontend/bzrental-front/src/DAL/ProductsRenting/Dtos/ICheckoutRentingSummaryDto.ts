export default interface ICheckoutRentingSummaryDto {
    createdById: number,
    createdBy: string,
    productId: number,
    productName: string,
    productCategoryName: string,
    plannedStartDate: string,
    actualStartDate: string,
    plannedEndName: string,
    actualEndDate: string,
    dailyPrice: number,
    totalValue: number
}