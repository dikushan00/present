import React, {useRef} from "react";
import {ButtonBlue, ButtonStart} from "./blocks/buttons";
import {actionsApp, closeModal, ModalNamesType, openModalMessage, showNextModal} from "../redux/app_reducer";
import {useDispatch, useSelector} from "react-redux";
import {Controller, useForm} from "react-hook-form";
import {useHttp} from "../utils/hooks/http.hook";
import {getInputsRules} from "../utils/validation/validation";
import {SelectTypeTitle} from "./styled/playgrounds/components";
import {SelectUI} from "./tools/select";
import {DatePicker} from "antd";
import {AppStateType} from "../redux/store_redux";
import data from "../data/data.json"
import {useRouter} from "next/router";
import {useNotification} from "../utils/hooks/useNotification";
import {makeValidDate} from "../utils/makeValidDate";
import {LoaderData} from "./LoaderData/LoaderData";
import moment from "moment";

export const ModalSign = () => {
    const dispatch = useDispatch();
    const {warningInputText} = data
    const {setErrorNotification} = useNotification()

    const {cities} = useSelector((state: AppStateType) => state.app)
    const {request, error, loading} = useHttp()
    const {register, handleSubmit, watch, control, formState: {errors}} = useForm()
    const password = React.useRef({});
    password.current = watch("password", "");

    const [isEmailIsExist, setIsEmailIsExist] = React.useState(false);

    const [citySelectOptions, setCitySelectOptions] = React.useState([])
    const [activeCity, setActiveCity] = React.useState<{ id: number, title: string, value: string, isSelected: boolean }>(null)

    React.useEffect(() => {
        if (error) {
            setErrorNotification(error)
        }
    }, [error])

    React.useEffect(() => {
        if (cities) {
            setCitySelectOptions(cities?.map((item, i) => ({
                ...item,
                title: item.name,
                value: item.name,
                isSelected: i === 0
            })))
            setActiveCity(cities[0])
        }
    }, [cities])

    const openModal = (type: ModalNamesType) => {
        dispatch(actionsApp.setActiveModal(type));
    };

    const onSubmit = async (data) => {
        let birthday = makeValidDate(data.birthday)
        let body = {...data, city_id: activeCity?.id, birthday}
        delete body.passCheck

        try {
            let response = await request<{ user?: string }>("auth/register", "post", body, {}, false)
            if (response) {
                dispatch(closeModal())
                dispatch(openModalMessage({
                    title: "Проверьте почту",
                    text: "На ваш электронный адрес была отправлена ссылка для активации вашей страницы!",
                    content: () => <ButtonBlue text="Отправить снова"
                                               onClick={() => {
                                                   dispatch(closeModal())
                                                   openModal("modal-resend-activation")
                                               }}
                                               className="control__btn-sign resend__btn"/>
                }))
            }
        } catch (e) {
        }
    };

    let inputs = [
        {
            "placeholder": "Имя",
            "name": "first_name",
            "type": "text",
        },
        {
            "placeholder": "Фамилия",
            "name": "last_name",
            "type": "text"
        },
        {
            "placeholder": "Отчество",
            "name": "patronymic",
            "type": "text",
            required: false
        },
        {
            "placeholder": "E-mail",
            "name": "email",
            "type": "text"
        },
        {
            "placeholder": "Пароль",
            "name": "password",
            "type": "password"
        },
        {
            "placeholder": "Повторить пароль",
            "name": "passCheck",
            "type": "password"
        }
    ] as { placeholder: string, name: string, type: string, required?: boolean }[]

    const dateFormat = 'DD.MM.YYYY';
    function disabledDate(current) {
        if (!current)
            return false
        let currentTime = new Date(current["_d"]?.toString()).getTime()
        let date = new Date(moment().endOf('day')["_d"]).getTime() - (86400000 * 365 * 14)
        return current && currentTime > date;
    }
    return (
        <div className="modal sign">
            <div className="modal-body modal-sign fade-in">
                <ModalCloseButton/>
                <div className={"flex center column"}>
                    <h5 className="modal-title">Регистрация</h5>
                </div>
                <p className="modal-text">Это займет 2 минуты</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-body__wrapper">
                        <div className="modal-sign__inputs">

                            {
                                inputs?.map((item, i) => {
                                    let rules = getInputsRules(item.name, {}, password.current, item?.required)
                                    return <div key={i}
                                                className={`modal-body__place ${i !== 3 ? "col-md-6" : "col-md-12"}`}>
                                        <div className="inputs-row">
                                            <input
                                                type={item.type || "text"}
                                                onChange={() => item.name === "email" && isEmailIsExist && setIsEmailIsExist(false)}
                                                className={`input ${errors ? errors[item.name] ? "input-danger" : "" : ""}`}
                                                {...register(item.name, rules)}
                                                placeholder={item.placeholder}/>
                                            {
                                                errors[item.name] && <label
                                                    className="input-label input-label_display">{
                                                    errors[item.name].type === "required" ? warningInputText.requiredField :
                                                        warningInputText[item.name]}</label>
                                            }
                                        </div>
                                    </div>
                                })
                            }
                            <div className="modal-body__place margin normal column col-md-12">
                                <span>Дата рождения</span>
                                <Controller
                                    name="birthday"
                                    control={control}
                                    render={({field: {onChange, value}}) => <DatePicker defaultPickerValue = {moment("01-01-2000")} disabledDate = {disabledDate} format={dateFormat}
                                                                                        onChange={onChange}
                                                                                        value={value}/>}
                                    defaultValue={""}
                                    rules={{required: true}}
                                />
                                {
                                    errors.birthday &&
                                    <label className={"input-label input-label_display"}>Это поле обязательно</label>
                                }
                            </div>
                        </div>
                        <div className="block select__city">
                            <SelectTypeTitle>Город</SelectTypeTitle>
                            <SelectUI onChange={(active) => setActiveCity(active)} options={citySelectOptions}/>
                        </div>
                        <ButtonStart disabled={loading} text={loading ? <LoaderData/> :"Регистрация"} type="submit"
                                     className="modal-body__btn modal-sign__btn"/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ModalLogin = () => {
    const dispatch = useDispatch();
    const {warningInputText} = data
    const [showPass, setShowPass] = React.useState(false);
    const [message, setMessage] = React.useState({type: "", content: ""} as { type: string, content: string } | null)

    const {register, handleSubmit, formState: {errors}} = useForm()
    const {request, loading, error} = useHttp()

    const onSubmit = async (data) => {
        let body = {...data, email: data.email.toLowerCase()}
        try {
            let response = await request<{ access: string, user_id: number }>("auth/login", "post", body, {}, false)
            if (response && response?.access) {
                localStorage.setItem("access_token", response.access)
                location.reload()
            }
        } catch (e) {
        }
    }

    React.useEffect(() => {
        let timeout
        if (message) {
            timeout = setTimeout(() => {
                setMessage(null)
            }, 3000)
        }
        return () => timeout && clearTimeout(timeout)
    }, [message])

    React.useEffect(() => {
        if (error) {
            setMessage({
                type: "error",
                content: error || "Активная учетная запись с указанными учетными данными не найдена"
            })
        }
    }, [error])

    let inputs = [
        {
            "placeholder": "E-mail",
            "type": "text",
            "name": "email"
        },
        {
            "placeholder": "Пароль",
            "type": "password",
            "name": "password"
        }
    ]

    return (
        <div className="modal">
            <div className="modal-body modal-login fade-in">
                <ModalCloseButton/>
                <div className={"flex center column"}>
                    <h5 className="modal-title">Вход</h5>
                    <p className="modal-text">Добро пожаловать снова!</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-body__wrapper">
                        {
                            inputs.map((item, i) => {
                                let rules = {required: true}
                                if (item.name === "email")
                                    //@ts-ignore
                                    rules = {...rules, pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/}
                                if (item.name === "password")
                                    //@ts-ignore
                                    rules = {...rules, minLength: 8}
                                return <React.Fragment key={i}>
                                    <div className="modal-body__place">
                                        <input {...register(item.name, rules)}
                                               className={`input ${!!errors[item.name] ? "input-danger" : ""}`}
                                               type={item.name === "password" ? showPass ? "text" : "password" : item.type}
                                               placeholder={item.placeholder}/>

                                        {
                                            item.name === "password" &&
                                            <div className="modal-login__img"
                                                 onClick={() => setShowPass(prev => !prev)}>
                                                {
                                                    showPass ?
                                                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M20.4293 12.9292L22.7459 16.9417" stroke="#5699FF"
                                                                  strokeWidth="2.47619"
                                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M15.6591 15.1592L16.3816 19.2566" stroke="#5699FF"
                                                                  strokeWidth="2.47619"
                                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M10.3319 15.1577L9.60931 19.2558" stroke="#5699FF"
                                                                  strokeWidth="2.47619"
                                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M5.5665 12.9263L3.23871 16.9581" stroke="#5699FF"
                                                                  strokeWidth="2.47619"
                                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path
                                                                d="M3.24994 10.6514C4.95746 12.7649 8.08778 15.4375 13 15.4375C17.9122 15.4375 21.0425 12.765 22.75 10.6514"
                                                                stroke="#5699FF" strokeWidth="2.47619"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"/>
                                                        </svg>
                                                        :
                                                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M13 5.68701C4.875 5.68701 1.625 13.0003 1.625 13.0003C1.625 13.0003 4.875 20.312 13 20.312C21.125 20.312 24.375 13.0003 24.375 13.0003C24.375 13.0003 21.125 5.68701 13 5.68701Z"
                                                                stroke="#5699FF" strokeWidth="2.47619"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"/>
                                                            <path
                                                                d="M13 17.0625C15.2437 17.0625 17.0625 15.2437 17.0625 13C17.0625 10.7563 15.2437 8.9375 13 8.9375C10.7563 8.9375 8.9375 10.7563 8.9375 13C8.9375 15.2437 10.7563 17.0625 13 17.0625Z"
                                                                stroke="#5699FF" strokeWidth="2.47619"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"/>
                                                        </svg>
                                                }
                                            </div>
                                        }
                                    </div>
                                    {
                                        errors[item.name] && <label
                                            className="input-label input-label_display">{
                                            errors[item.name].type === "required" ? warningInputText.requiredField :
                                                warningInputText[item.name]}</label>
                                    }
                                </React.Fragment>
                            })
                        }
                        <button type="button" className="btn btn-login__reset"
                                onClick={() => dispatch(showNextModal("modal-reset"))}>Забыли пароль?
                        </button>
                        {/*//@ts-ignore*/}
                        <ButtonStart disabled={loading} type="submit" text={loading ? <LoaderData/> : "Вход"}
                                     className="modal-body__btn modal-login__btn"/>
                        {message && <span className="flex center"
                                          style={{color: message?.type === "error" ? "red" : "green"}}>{message.content}</span>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ModalReset = () => {
    const dispatch = useDispatch();
    const {setErrorNotification, setSucceedNotification} = useNotification()
    const {warningInputText} = data

    const {register, handleSubmit, formState: {errors}} = useForm()
    const {request, loading, error} = useHttp()

    const [message, setMessage] = React.useState({type: "", content: ""} as { type: string, content: string } | null)

    React.useEffect(() => {
        if (error) {
            setErrorNotification(error)
        }
    }, [error])

    const onSubmit = async (data) => {
        let response = await request<{ status: boolean }>("auth/reset_password", "post", data, {}, false)
        if (response?.status) {
            dispatch(actionsApp.closeModal());
            setSucceedNotification("На вашу почту была отправлена ссылка для смены пароля")
        } else {
            setMessage({type: "error", content: "Пользователь с данным адресом электронной почты не существует."})
        }
    };
    React.useEffect(() => {
        let timeout
        if (message) {
            timeout = setTimeout(() => {
                setMessage(null)
            }, 3000)
        }
        return () => timeout && clearTimeout(timeout)
    }, [message])

    return (
        <div className="modal">
            <div className="modal-body modal-reset fade-in">
                <ModalCloseButton/>
                <div className={"flex center column"}>
                    <h5 className="modal-title">Забыли пароль</h5>
                </div>
                <p className="modal-text">Введите данные ниже</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-body__wrapper">

                        <div className="modal-body__place">
                            <input  {...register("email", {
                                required: true,
                                pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
                            })}
                                    type={"text"}
                                    className={`input ${errors.email ? "input-danger" : ""}`}
                                    placeholder={"Номер мобильного или e-mail"}/>
                        </div>
                        {
                            errors.email && <label
                                className="input-label input-label_display">{
                                errors.email.type === "required" ? warningInputText.requiredField :
                                    warningInputText.email}</label>
                        }
                        <ButtonStart disabled={loading} type="submit" text={loading ? <LoaderData/> : "Отправить"}
                                     className={`modal-body__btn`}/>
                        {message && <span className="request__message"
                               style={{color: message?.type === "error" ? "red" : "green"}}>{message?.content}</span>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ModalConfirmPassword = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const {query} = useRouter()
    const {setErrorNotification, setSucceedNotification} = useNotification()

    const {register, handleSubmit, formState: {errors}, watch, reset} = useForm()
    const {request, loading, error} = useHttp()

    const password = useRef({});
    password.current = watch("password");

    let inputs = [
        {
            "placeholder": "Новый пароль",
            "name": "password",
            "type": "password"
        },
        {
            "placeholder": "Повтори новый пароль",
            "name": "passCheck",
            "type": "password"
        }
    ]
    let warningText = {
        password: "",
        passCheck: ""
    }
    React.useEffect(() => {
        if (error) {
            setErrorNotification(error)
        }
    }, [error])

    const onSubmit = async (data) => {

        let passToken = query?.active
        if (!passToken)
            return
        let body = {...data, token: passToken}
        try {
            let response = await request<{ status: true }>("auth/reset_password_confirm", "post", body, {}, false)
            if (response?.status) {
                reset()
                dispatch(closeModal())
                setSucceedNotification("Вы успешно изменили свой пароль")
                router.push("/")
            }
        } catch (e) {
        }
    };

    return (
        <div className="modal">
            <div className="modal-body modal-reset fade-in">
                <ModalCloseButton/>
                <div className={"flex center column"}>
                    <h5 className="modal-title">Востановление пароля</h5>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-body__wrapper">
                        {
                            inputs.map((item, i) => {
                                let rules = getInputsRules(item.name, warningText, password.current)
                                return <React.Fragment key={i}>
                                    <div className="modal-body__place">
                                        <input  {...register(item.name, rules)}
                                                type={item.type}
                                                className={`input ${errors[item.name] ? "input-danger" : ""}`}
                                                placeholder={item.placeholder}/>
                                    </div>
                                    {
                                        item.name === "password" && errors[item.name] &&
                                        <label
                                            className={`input-label input-label_display`}>{"Длина пароля должна быть не менее 8 символов"}</label>
                                    }
                                    {
                                        item.name === "passCheck" && errors[item.name] &&
                                        <label
                                            className={`input-label input-label_display`}>{"Пароли не совпадают"}</label>
                                    }
                                </React.Fragment>
                            })
                        }

                        <ButtonStart disabled={loading} type={"submit"} text={loading ? <LoaderData/> :"Отправить"}
                                     className={`modal-body__btn`}/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ModalMessage = ({title, text, loading, children}) => {
    const modalText = useSelector((state: AppStateType) => state.app.modalMessageText)
    const Content = modalText?.content
    return <div className="modal-window modal-message fade-in">
        <div className="modal-window__wrapper" style={{padding: loading ? 0 : "22px 24px"}}>
            {
                loading ? <LoaderData dark big/> : <>
                    <ModalCloseButton/>
                    <div className="share-content">
                        <h6 className="share__title">
                            {title || (modalText?.title || modalText || "")}
                        </h6>
                        <p className={"share__description"}>{text || (modalText?.text || modalText || "")}</p>
                        {children}
                        {modalText?.content && <Content/>}
                    </div>
                </>}
        </div>
    </div>
}

const ModalCloseButton = () => {
    const dispatch = useDispatch()
    return <button type="button" className="btn btn-close" onClick={() => dispatch(closeModal())}><img
        src="/img/close.svg" alt="close_icon"/>
    </button>
}

export const ModalInvitation = () => {
    const dispatch = useDispatch();

    const {register, handleSubmit, formState: {errors}, watch, reset} = useForm()
    const {request, loading, error} = useHttp()
    const {setErrorNotification} = useNotification()

    const router = useRouter()

    const password = useRef({});
    password.current = watch("password");

    let warningText = {
        password: "Слишком короткий пароль",
        passCheck: "Пароли не совпадают"
    }

    const warningInputText = {
        "passCheck": "Пароли не совпадают",
        "password": "Длина пароля должна быть не менее 8 символов",
        "email": "Некорректный e-mail",
        "error": "Что-то пошло не так!",
        "emailExist": "Пользователь с таким e-mail уже существует"
    }
    const confirmPassword = [
        {
            "placeholder": "Электронный адрес",
            "name": "email",
            "type": "email"
        },
        {
            "placeholder": "Новый пароль",
            "name": "password",
            "type": "password"
        },
        {
            "placeholder": "Повтори новый пароль",
            "name": "passCheck",
            "type": "password"
        }
    ]
    let isInputsEmpty = !!!confirmPassword.map(item => watch(item.name)).filter(item => item).length

    React.useEffect(() => {
        if (error) {
            setErrorNotification(error)
        }
    }, [error])

    const [message, setMessage] = React.useState<null | { type: string, content: string }>({type: "", content: ""})
    const openModal = (type: ModalNamesType) => {
        dispatch(actionsApp.setActiveModal(type));
    };
    const onSubmit = async (data) => {
        let token = router.query.token
        if (!token) {
            return
        }
        let body = {password: data.password, email: data.email, token}
        try {
            let response = await request("users/confirm/invitation", "post", body, {}, false)
            if (response) {
                reset()
                dispatch(closeModal())
                dispatch(openModalMessage({
                    title: "Проверьте почту!",
                    text: "На ваш email было отправлена ссылка для активации страницы",
                    content: () => <ButtonBlue text={"Отправить снова"}
                                               onClick={() => {
                                                   dispatch(closeModal())
                                                   openModal("modal-resend-activation")
                                               }}
                                               className="control__btn-sign resend__btn"/>
                }))
            }
        } catch (e) {
        }
    };

    React.useEffect(() => {
        let timeout
        if (message) {
            timeout = setTimeout(() => {
                setMessage(null)
            }, 3000)
        }
        return () => timeout && clearTimeout(timeout)
    }, [message])

    return (
        <div className="modal">
            <div className="modal-body modal-reset fade-in">
                <ModalCloseButton/>
                <div className={"flex center column"}>
                    <h5 className="modal-title">Активация приглашения</h5>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-body__wrapper">
                        {
                            confirmPassword.map((item, i) => {
                                let rules = getInputsRules(item.name, warningText, password.current)
                                return <React.Fragment key={i}>
                                    <div className="modal-body__place">
                                        <input  {...register(item.name, rules)}
                                                type={item.type}
                                                className={`input ${errors[item.name] ? "input-danger" : ""}`}
                                                placeholder={item.placeholder}/>
                                    </div>
                                    {
                                        item.name === "email" && errors[item.name] &&
                                        <label
                                            className={`input-label input-label_display`}>{warningInputText[item.name]}</label>
                                    }
                                    {
                                        item.name === "password" && errors[item.name] &&
                                        <label
                                            className={`input-label input-label_display`}>{warningInputText[item.name]}</label>
                                    }
                                    {
                                        item.name === "passCheck" && errors[item.name] &&
                                        <label
                                            className={`input-label input-label_display`}>{warningInputText[item.name]}</label>
                                    }
                                </React.Fragment>
                            })
                        }

                        <ButtonStart disabled={loading} type={"submit"} text={loading ? <LoaderData/> :"Отправить"}
                                     className={`modal-body__btn ${(!isInputsEmpty && Object.keys(errors).length === 0) ? "" : "btn-shake"}`}/>
                        {message && <span className="request__message"
                               style={{color: message?.type === "error" ? "red" : "green"}}>{message?.content}</span>}
                    </div>
                </form>
            </div>
        </div>
    );
};
export const ModalResendActivation = () => {
    const dispatch = useDispatch();

    const {register, handleSubmit, formState: {errors}} = useForm()
    const {request, loading, error} = useHttp()

    const [message, setMessage] = React.useState<null | { type: string, content: string }>({type: "", content: ""})
    const onSubmit = async (data) => {
        try {
            let body = {...data, email: data.email.toLowerCase()}
            let response = await request("users/activate/resend", "post", body, {}, false)
            if (response) {
                dispatch(actionsApp.closeModal());
                dispatch(openModalMessage({
                    title: "Проверьте почту",
                    text: "На ваш email было отправлена ссылка для активации страницы"
                }))
            }
        } catch (e) {
            setMessage({type: "error", content: "Пользователя с таким email не существует"})
        }
    };
    React.useEffect(() => {
        let timeout
        if (message) {
            timeout = setTimeout(() => {
                setMessage(null)
            }, 3000)
        }
        return () => timeout && clearTimeout(timeout)
    }, [message])

    React.useEffect(() => {
        if (error) {
            setMessage({type: "error", content: "Пользователя с таким email не существует"})
        }
    }, [error])

    let rules = {
        required: true,
        pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    }

    return (
        <div className="modal">
            <div className="modal-body modal-reset fade-in">
                <ModalCloseButton/>
                <div className={"flex center column"}>
                    <h5 className="modal-title">Активация аккаунта</h5>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-body__wrapper">
                        <div className="modal-body__place">
                            <input  {...register("email", rules)}
                                    type={"text"}
                                    className={`input ${errors["email"] ? "input-danger" : ""}`}
                                    placeholder={"Твой e-mail"}/>
                        </div>
                        {
                            errors["email"] &&
                            <label className="input-label input-label_display">Не корректный email</label>
                        }

                        <ButtonStart disabled={loading} type={"submit"} text={loading ? <LoaderData/> :"Отправить"}
                                     className={`modal-body__btn ${(Object.keys(errors).length === 0) ? "" : "btn-shake"}`}/>
                        {message && <span className="request__message"
                                          style={{color: message?.type === "error" ? "red" : "green"}}>{message?.content}</span>}
                    </div>
                </form>
            </div>
        </div>
    );
};