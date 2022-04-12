import React from 'react';
import {Controller, useForm} from "react-hook-form";
import {Button, Input} from "antd";
import {useNotification} from "../../../utils/hooks/useNotification";
import {useHttp} from "../../../utils/hooks/http.hook";
import {LoaderData} from "../../LoaderData/LoaderData";

const UserPass = () => {
    const {setSucceedNotification, setErrorNotification} = useNotification()
    const {request, loading, error} = useHttp()
    const {control, handleSubmit, formState: {errors}, watch} = useForm()
    const onSubmit = async (data) => {
        let response = await request<{ status: boolean }>("users/profile/change-password", "put", data)
        if (response?.status) {
            setSucceedNotification("Пароль изменен!")
        }
    }

    React.useEffect(() => {
        if (error) {
            setErrorNotification(error)
        }
    }, [error])

    const password = React.useRef({});
    password.current = watch("password");

    let warningText = {
        password: "Длина пароля должна быть не менее 8 символов",
        passCheck: "Пароли не совпадают"
    }

    let rules = {
        required: true, minLength: {
            value: 8,
            message: warningText.password
        }
    }

    return <div>
        <h1>Пароль</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form__item">
                <Controller
                    name="oldPassword"
                    control={control}
                    rules={rules}
                    render={({field: {onChange, value}}) => <Input type="password"
                                                                   className={`${!!errors["oldPass"] ? "input-danger" : ""}`}
                                                                   onChange={onChange}
                                                                   value={value} placeholder="Введите старый пароль"/>}
                    defaultValue=""
                />
                {
                    errors.oldPass && <label
                        className={"input-label input-label_display"}>{warningText.password}</label>
                }
            </div>
            <div className="form__item">
                <Controller
                    name="password"
                    control={control}
                    render={({field: {onChange, value}}) => <Input className={`${!!errors["password"] ? "input-danger" : ""}`} type="password"
                                                                   onChange={onChange}
                                                                   value={value} placeholder="Введите новый пароль"/>}
                    defaultValue=""
                    rules={rules}
                />
                {
                    errors.password && <label
                        className={"input-label input-label_display"}>{warningText.password}</label>
                }
            </div>
            <div className="form__item">
                <Controller
                    name="passCheck"
                    control={control}
                    rules={{
                        ...rules, validate: value =>
                            value === password.current
                    }}
                    render={({field: {onChange, value}}) => <Input type="password" className={`${!!errors["passCheck"] ? "input-danger" : ""}`}
                                                                   onChange={onChange}
                                                                   value={value} placeholder="Повторите пароль"/>}
                    defaultValue=""
                />
                {
                    errors.passCheck && <label
                        className={"input-label input-label_display"}>{warningText.passCheck}</label>
                }
            </div>
            <div className="form__item">
                <Button disabled={loading} type="primary" htmlType="submit">{loading ? <LoaderData /> : "Сохранить"}</Button>
            </div>
        </form>
    </div>
};

export default UserPass;
