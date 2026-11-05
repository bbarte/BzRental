import type ISetProductFieldValueRequest from "./ISetProductFieldValueRequest";

export default interface IUpdateProductRequest {
    name: string,
    description: string,
    dailyPrice: number,
    categoryId: number,
    updateFieldValues: boolean,
    fieldValues: ISetProductFieldValueRequest[]
}