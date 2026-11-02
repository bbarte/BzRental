import type { CSSProperties } from "react"

export type ImageFromApiProps = {
    fileName?: string,
    className?: string | null,
    style?: CSSProperties | null
}

export function ImageFromApi(props: ImageFromApiProps) {
    return (
        <img src={`https://localhost:7194/uploads/${props.fileName}`} alt="" className={`${props.className}`} style={props.style ?? {}}/>
    )
}