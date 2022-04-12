import React from 'react';
import styles from "./LoaderData.module.sass"

type Props = {
    dark?: boolean
    big?: boolean
}

export const LoaderData: React.FC<Props> = ({dark, big}) => {
    return <div className={styles.LdsRingWrapper}>
        <div className={`${styles.LdsRing} ${dark ? styles.dark : ""} ${big ? styles.big : ""}`}>
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    </div>
}
