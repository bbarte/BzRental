export type ImageFromApiProps = {
    fileName?: string,
    className?: string | null
}

export function ImageFromApi(props: ImageFromApiProps) {
    return (
        <img src={`https://localhost:7194/uploads/${props.fileName}`} alt="" className={`${props.className}`}/>
    )
}