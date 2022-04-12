import React, {CSSProperties} from "react";
import {ButtonStart} from "./buttons";
import {LoaderData} from "../LoaderData/LoaderData";

type PropsType = {
    visible: boolean
    handleSubmit?: any
    title?: string
    description?: string
    okText?: string
    className?: string
    contentClassName?: string
    contentStyle?: CSSProperties
    onCancel: () => void
    onSubmit: (data: any) => Promise<void>
    loading?: boolean
}
export const CustomModal: React.FC<PropsType> = ({
                                                     children,
                                                     className,
                                                     contentClassName,
                                                     visible,
                                                     title,
                                                     okText,
                                                     description,
                                                     contentStyle = {},
                                                     onCancel,
                                                     onSubmit,
                                                     handleSubmit,
                                                     loading
                                                 }) => {
    React.useEffect(() => {
        if (visible)
            document.getElementsByTagName("body")[0].style.overflow = "hidden"
        else
            document.getElementsByTagName("body")[0].style.overflow = "auto"

    }, [visible])
    return <>
        {
            visible && <div className={`modal custom-modal ${className || ""}`}>
                <div className={`modal-body custom-modal-body ${contentClassName} fade-in`} style={contentStyle}>
                    <ModalCloseButton onClick={onCancel}/>
                    <div className={"flex center column"}>
                        <h5 className="modal-title">{title}</h5></div>
                    <p className="modal-text">{description}</p>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {children}
                        {/*@ts-ignore*/}
                        <ButtonStart disabled={loading} text={loading ? <LoaderData/> : okText || "Отправить"}
                                     type="submit"/>
                    </form>
                </div>
            </div>
        }
    </>
};
const ModalCloseButton = ({onClick}) => {
    return <button type="button" className="btn btn-close" onClick={onClick}><img
        src={"/img/close.svg"} alt="close_icon"/>
    </button>
}