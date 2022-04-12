import React from "react";

// Import STYLES
import styles from "./WrapperScrollbar.module.scss";

type Props = {
    className?: string;
    type?: "thin";
    id?: string | number;
    style?: React.CSSProperties;
    other?: any;
};

const WrapperScrollbar: React.FC<Props> = (
    {className, children, type, id, style},
    other
) => {
    const classNames = [
        styles.wrapper,
        type ? styles[`wrapper_type_${type}`] : "",
        className,
    ].join(" ");

    return (
        <div style={style} id = {id || ""} className={classNames} {...other}>
            {children}
        </div>
    );
};

export default WrapperScrollbar;
