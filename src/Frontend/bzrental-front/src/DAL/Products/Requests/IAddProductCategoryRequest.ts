import type IAddProductCategoryFieldRequest from "./IAddProductCategoryFieldRequest";

export default interface IAddProductCategoryRequest {
    name: string,
    fields: IAddProductCategoryFieldRequest[]
}