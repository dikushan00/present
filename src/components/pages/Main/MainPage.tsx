import MainSlider from "../../main/MainSlider";
import {ComingGames} from "../../main/ComingGames";
import {Teams} from "../../Teams/Teams";
import React from "react";
import {useDispatch} from "react-redux";
import {actionsApp, closeModal, ModalNamesType, openModalMessage} from "../../../redux/app_reducer";
import {useRouter} from "next/router";
import {ButtonBlue} from "../../blocks/buttons";
import {Players} from "../../Players/Players";

type Props = {
    status?: boolean
    verified?: "true" | "false"
    passwordActivated?: "true" | "false"
    token?: string
}

export const MainPage:React.FC<Props> = ({status, verified, passwordActivated, token}) => {
    const dispatch = useDispatch()
    const router = useRouter()

    React.useEffect(() => {
        if(status === true) {
            dispatch(actionsApp.setActiveModal("modal-invitation"))
        } else if(status === false) {
            router.push("/")
        }
    }, [status])

    const openModal = (type: ModalNamesType) => {
        dispatch(actionsApp.setActiveModal(type));
    };

    React.useEffect(() => {
        if(verified === "true") {
            dispatch(openModalMessage("Вы успешно активировали ваш аккаунт. Можете авторизоваться!"))
        } else if(verified === "false"){
            dispatch(openModalMessage({
                title: "Срок годности ссылки истек!",
                text: "Срок годности ссылки после регистрации 2 часа",
                content: () => <ButtonBlue text="Отправить снова"
                                           onClick={() => {
                                               dispatch(closeModal())
                                               openModal("modal-resend-activation")
                                           }}
                                           className="control__btn-sign resend__btn"/>
            }))
        }
    }, [verified])

    React.useEffect(() => {
        if(passwordActivated === "true") {
            dispatch(actionsApp.setActiveModal("modal-confirm-password"))
        } else if(passwordActivated === "false"){
            dispatch(openModalMessage({
                title: "Срок годности ссылки истек!",
                text: "Срок ссылки 15 мин",
                content: () => <ButtonBlue text="Отправить снова"
                                           onClick={() => {
                                               dispatch(closeModal())
                                               openModal("modal-reset")
                                           }}
                                           className="control__btn-sign resend__btn"/>
            }))
        }
    }, [passwordActivated])

    return <>
        <MainSlider />
        <ComingGames />
        <Teams limit={5} mode={"dark"}/>
        <Players limit={5} mode={"dark"}/>
    </>
}