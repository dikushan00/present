import React, {CSSProperties} from "react";

interface Props {
    src: string
    alt?: string
    className?: string
    defaultSrc?: string
    style?: CSSProperties
}

export const ImgWrapper: React.FC<Props> = ({src, defaultSrc, alt, className, style={}}, props) => {
    const onImgError = e => {
        if (!!defaultSrc) {
            e.target.style.visibility = "visible"
            e.target.src = defaultSrc
        } else
            e.target.style.visibility = "hidden"
    }
    const onImgLoad = e => {
        e.target.style.visibility = "visible"
    }

    return <img {...props} className={className} onError={onImgError} onLoad={onImgLoad} src={src || defaultSrc}
                alt={alt || "erImg"} style={style}/>
}