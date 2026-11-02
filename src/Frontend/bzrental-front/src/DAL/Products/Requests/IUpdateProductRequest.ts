import type ISetProductFieldValueRequest from "./ISetProductFieldValueRequest";

export default interface IUpdateProductRequest {
    name: string,
    description: string,
    hourPrice: number,
    categoryId: number,
    updateFieldValues: boolean,
    fieldValues: ISetProductFieldValueRequest[]
}