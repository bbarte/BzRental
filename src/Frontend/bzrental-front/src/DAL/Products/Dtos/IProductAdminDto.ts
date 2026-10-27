export default interface IProductAdminDto {
    id: number,
    name: string,
    description: string,
    hourPrice: number,
    firstImageFileName?: string,
    categoryId: number,
    categoryName: string,
    isDeleted: boolean,
    createdAt: string
}