export default interface IPaginatedList<T> {
    pageNumber: number,
    pageSize: number,
    hasNextPage: boolean,
    items: T[]
}