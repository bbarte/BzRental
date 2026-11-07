import type IProductFieldInfoDto from "./ProductFieldInfoDto";

export default interface IProductDetailsDto {
    id: number,
    name: string,
    description: string,
    dailyPrice: number,
    categoryId: number,
    categoryName: string,
    imageFileNames: string[],
    rating: number,
    fieldValues: IProductFieldInfoDto[]
}