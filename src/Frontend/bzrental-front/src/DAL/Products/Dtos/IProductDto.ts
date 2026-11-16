import type IProductFieldInfoDto from "./ProductFieldInfoDto";

export default interface IProductDto {
    id: number,
    name: string,
    description: string,
    dailyPrice: number,
    categoryId: number,
    firstImageFileName?: string,
    rating: number,
    reviewsCount: number,
    fieldValues: IProductFieldInfoDto[]
}