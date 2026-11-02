import type ISetProductFieldValueRequest from "./ISetProductFieldValueRequest";

export default interface IAddProductRequest {
    name: string,
    description: string,
    hourPrice: number,
    categoryId: number,
    fieldValues: ISetProductFieldValueRequest[]
}