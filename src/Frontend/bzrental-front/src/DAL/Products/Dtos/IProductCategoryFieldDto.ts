export const ProductsCategoryFieldType = {
    Text: 'Text',
    Integer: 'Integer',
    Decimal: 'Decimal',
    Boolean: 'Boolean'
}

export interface IProductCategoryFieldDto {
    id: number,
    name: string,
    type: string,
    minValue?: number,
    maxValue?: number,
    unitName?: string,
    isDeleted: boolean,
    createdAt: string
}