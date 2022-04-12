import React from 'react';
import {useSelector} from "react-redux";
import data from "../../../data/data.json";
import {useNotification} from "../../../utils/hooks/useNotification";
import {AppStateType} from "../../../redux/store_redux";
import {useHttp} from "../../../utils/hooks/http.hook";
import {Controller, useForm} from "react-hook-form";
import {makeValidDate} from "../../../utils/makeValidDate";
import moment from "moment";
import {getInputsRules} from "../../../utils/validation/validation";
import {Button, DatePicker, Input, Select} from "antd";
import {SelectTypeTitle} from "../../styled/playgrounds/components";
import {LoaderData} from "../../LoaderData/LoaderData";

export const CreatePlayer = () => {
    const {warningInputText} = data
    const {setErrorNotification, setSucceedNotification} = useNotification()

    const {cities} = useSelector((state: AppStateType) => state.app)
    const {request, error, loading} = useHttp()
    const {handleSubmit, watch, control, formState: {errors}, reset} = useForm()
    const password = React.useRef({});
    password.current = watch("password", "");


    const [citySelectOptions, setCitySelectOptions] = React.useState([])

    React.useEffect(() => {
        if (error) {
            setErrorNotification(error)
        }
    }, [error])

    React.useEffect(() => {
        if (cities) {
            setCitySelectOptions(cities?.map((item) => ({
                ...item,
                title: item.name,
                label: item.name,
                value: item.id,
            })))
        }
    }, [cities])

    const onSubmit = async (data) => {
        let birthday = makeValidDate(data.birthday)
        let body = {...data, birthday}
        delete body.passCheck

        try {
            let response = await request<{ user?: string }>("users", "post", body)
            if (response) {
                reset()
                setSucceedNotification("Пользователь создан!")
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
        <div className="">
            <h1>Создание игрока</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                    {
                        inputs?.map((item, i) => {
                            let rules = getInputsRules(item.name, {}, password.current, item?.required)
                            return <div key={i} className={"margin"}>
                                <div className="">
                                    <Controller
                                        name={item.name}
                                        control={control}
                                        render={({field: {onChange, value}}) => <Input
                                            type={item.type || "text"}
                                            onChange={onChange} value={value}
                                            className={`${errors ? errors[item.name] ? "input-danger" : "" : ""}`}
                                            placeholder={item.placeholder}/>}
                                        defaultValue={""}
                                        rules={rules}
                                    />
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
                    <div className="margin">
                        <p>Дата рождения</p>
                        <Controller
                            name="birthday"
                            control={control}
                            render={({field: {onChange, value}}) => <DatePicker
                                defaultPickerValue={moment("01-01-2000")} disabledDate={disabledDate}
                                format={dateFormat}
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
                    <div className="margin">
                        <SelectTypeTitle>Город</SelectTypeTitle>
                        <Controller
                            name="city_id"
                            control={control}
                            render={({field: {onChange, value}}) => <Select style={{minWidth: "150px"}} defaultValue={1} options={citySelectOptions}
                                                                            onChange={onChange}
                                                                            value={value}>
                            </Select>}
                            defaultValue={1}
                            rules={{required: true}}
                        />
                        {
                            errors.city_id &&
                            <label className={"input-label input-label_display"}>Это поле обязательно</label>
                        }
                    </div>
                    <Button disabled={loading} htmlType="submit" type="primary"
                            className="">{loading ? <LoaderData/> : "Сохранить"}</Button>
                </div>
            </form>
        </div>
    );
};
