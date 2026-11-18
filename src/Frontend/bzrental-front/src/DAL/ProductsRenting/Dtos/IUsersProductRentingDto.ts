export default interface IUsersProductRentingDto {
    id: number,
    productId: number,
    productName: string,
    productCategoryName: string,
    status: string,
    startDate: string,
    endDate: string,
    dailyPrice: number,
    currentRentValue: number,
    userComments: string,
    createdAt: string
}