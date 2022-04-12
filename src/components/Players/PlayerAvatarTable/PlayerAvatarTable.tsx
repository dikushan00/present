import React from 'react';
import {ImgWrapper} from "../../ImgWrapper";
import styles from "./PlayerAvatarTable.module.sass"

type Props = {
    src: string
}
export const PlayerAvatarTable: React.FC<Props> = ({src}) => {
    return <ImgWrapper className={styles.PlayerAvatar} src={src} defaultSrc={"/img/avatar.svg"}/>
}
