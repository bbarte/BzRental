export default interface IProductAdminDetailsDto {
    id: number,
    name: string,
    description: string,
    hourPrice: number,
    categoryId: number,
    imageFileNames: string[],
    isDeleted: boolean,
    createdAt: string
}