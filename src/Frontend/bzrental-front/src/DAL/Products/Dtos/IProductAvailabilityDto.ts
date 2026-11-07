export interface IProductAvailabilityPlannedRentingDto {
    startDate: string,
    endDate: string
}

export interface IProductAvailabilityDto {
    isAvailable: boolean,
    plannedRentings: IProductAvailabilityPlannedRentingDto[]
}