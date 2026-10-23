export default interface IUserDto {
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    isAdmin: boolean,
    isDeleted: boolean,
    isBlocked: boolean,
    createdAt: string
}