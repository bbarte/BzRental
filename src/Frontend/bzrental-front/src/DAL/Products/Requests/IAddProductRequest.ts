import type ISetProductFieldValueRequest from "./ISetProductFieldValueRequest";

export default interface IAddProductRequest {
    name: string,
    description: string,
    dailyPrice: number,
    categoryId: number,
    fieldValues: ISetProductFieldValueRequest[]
}