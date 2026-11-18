export default interface IProductReviewDto {
    id: number,
    createdBy: string,
    createdById: number,
    rating: number,
    content: string,
    modifiedAt?: string,
    createdAt: string
}