export default interface IAddProductCategoryFieldRequest {
    name: string,
    type: string,
    minValue?: number,
    maxValue?: number,
    unitName?: string
}