export interface ISearchProductsFieldValueFilter {
    fieldId: number,
    allowedTextValues: string[],
    exactBoolValue?: boolean,
    exactNumberValue?: number,
    numberValueFrom?: number,
    numberValueTo?: number
}

export interface ISearchProductsRequest {
    startDate: string,
    endDate: string,
    name: string,
    dailyPriceFrom?: number,
    dailyPriceTo?: number,
    ratingFrom?: number,
    ratingTo?: number,
    fieldValueFilters: ISearchProductsFieldValueFilter[]
}