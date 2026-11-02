export default interface IProductFieldInfoDto {
    id: number,
    name: string,
    type: string,
    unitName?: string,
    textValue?: string,
    numberValue?: number,
    boolValue?: boolean
}