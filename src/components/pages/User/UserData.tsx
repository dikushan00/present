import React from 'react';
import {Controller, useForm} from "react-hook-form";
import {Button, DatePicker, Input, InputNumber, Select, Tabs} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../../redux/store_redux";
import {warningInputText} from "../../../data/data.json"
import moment from "moment";
import {useHttp} from "../../../utils/hooks/http.hook";
import {actionsProfile} from "../../../redux/profile_reducer";
import {PlayerInfoType, ProfileType} from "../../../../types/player";
import {useNotification} from "../../../utils/hooks/useNotification";
import {getPlayerPositions} from "../../../redux/app_reducer";
import {makeValidDate} from "../../../utils/makeValidDate";
import {LoaderData} from "../../LoaderData/LoaderData";

const {TabPane} = Tabs;
const dateFormat = 'MM-DD-YYYY';
const UserData = () => {
    const {profile} = useSelector((state: AppStateType) => state.profile)

    if (!profile)
        return <div/>

    return <div>
        <Tabs defaultActiveKey="1">
            <TabPane tab="Личные данные" key="1">
                <ProfileData/>
            </TabPane>
            <TabPane tab="Данные игрока" key="2">
                <PlayerData/>
            </TabPane>
        </Tabs>
    </div>
};

export default UserData;

const genders = [
    {
        id: 1, key: "M", value: "M", label: "М"
    },
    {
        id: 2, key: "W", value: "W", label: "Ж"
    }
]
const handTypes = [
    {
        id: 1, key: "R", value: "R", label: "Правша"
    },
    {
        id: 2, key: "L", value: "L", label: "Левша"
    }
]

const ProfileData = () => {
    const dispatch = useDispatch()
    const {control, handleSubmit, formState: {errors, dirtyFields}} = useForm()
    const {setSucceedNotification, setErrorNotification} = useNotification()
    const {request, loading, error} = useHttp()
    const {profile} = useSelector((state: AppStateType) => state.profile)
    const {cities} = useSelector((state: AppStateType) => state.app)
    const [citySelectOptions, setCitySelectOptions] = React.useState([])

    const onSubmit = async (data) => {
        let isEmpty = true
        Object.keys(data).forEach(i => {
            if(!!data[i])
                isEmpty = false
        })
        isEmpty = !!!Object.keys(dirtyFields).length
        if(isEmpty)
            return

        let birthday = makeValidDate(data.birthday)
        let body = {...data, birthday}
        let response = await request<ProfileType>("users/profile/update", "put", body)
        if (response) {
            dispatch(actionsProfile.updateProfile(response))
            setSucceedNotification("Данные сохранены")
        }
    }

    React.useEffect(() => {
        if (error) {
            setErrorNotification(error)
        }
    }, [error])

    React.useEffect(() => {
        if (cities && profile) {
            setCitySelectOptions(cities?.map((item) => ({
                ...item,
                key: item.id,
                label: item.name,
                value: item.id,
            })))
        }
    }, [cities, profile])
    return <div>
        <h1>Личные данные</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form__item">
                <span>Имя</span>
                <Controller
                    name="first_name"
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => <Input
                        className={`${!!errors["first_name"] ? "input-danger" : ""}`}
                        onChange={onChange}
                        value={value}
                        defaultValue={profile?.first_name || ""} placeholder="Введите имя"/>}
                    defaultValue={profile?.first_name || ""}
                />
                {
                    errors["first_name"] && <label
                        className="input-label input-label_display">{
                        errors["first_name"].type === "required" ? warningInputText.requiredField :
                            warningInputText["first_name"]}</label>
                }
            </div>
            <div className="form__item">
                <span>Фамилия</span>
                <Controller
                    name="last_name"
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => <Input
                        onChange={onChange}
                        className={`${!!errors["last_name"] ? "input-danger" : ""}`}
                        value={value} defaultValue={profile?.last_name || ""} placeholder="Введите фамилию"/>}
                    defaultValue={profile?.last_name || ""}
                />
                {
                    errors["last_name"] && <label
                        className="input-label input-label_display">{
                        errors["last_name"].type === "required" ? warningInputText.requiredField :
                            warningInputText["last_name"]}</label>
                }
            </div>
            <div className="form__item">
                <span>Отчество</span>
                <Controller
                    name="patronymic"
                    control={control}
                    render={({field: {onChange, value}}) => <Input
                        onChange={onChange}
                        className={`${!!errors["patronymic"] ? "input-danger" : ""}`}
                        value={value} defaultValue={profile?.patronymic || ""} placeholder="Введите отчество"/>}
                    defaultValue={profile?.patronymic || ""}
                />
                {
                    errors["patronymic"] && <label
                        className="input-label input-label_display">{
                        errors["patronymic"].type === "required" ? warningInputText.requiredField :
                            warningInputText["patronymic"]}</label>
                }
            </div>
            <div className="form__item">
                <span>Email</span>
                <Controller
                    name="email"
                    control={control}
                    rules={{required: true, pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/}}
                    render={({field: {onChange, value}}) => <Input
                        disabled
                        onChange={onChange}
                        className={`${!!errors["email"] ? "input-danger" : ""}`}
                        value={value} defaultValue={profile?.email || ""} placeholder="Введите email"/>}
                    defaultValue={profile?.email || ""}
                />
                {
                    errors["email"] && <label
                        className="input-label input-label_display">{
                        errors["email"].type === "required" ? warningInputText.requiredField :
                            warningInputText["email"]}</label>
                }
            </div>
            <div className="form__item">
                <span>День рождения</span>
                <Controller
                    name="birthday"
                    control={control}
                    render={({field: {onChange, value}}) =>
                        <DatePicker format={'DD.MM.YYYY'} onChange={onChange} value={value} style={{width: "100%"}}/>}
                    defaultValue={profile?.birthday && moment(profile.birthday, dateFormat)}
                    rules={{required: true}}
                />
                {
                    errors.birthday &&
                    <label className={"input-label input-label_display"}>Это поле обязательно</label>
                }
            </div>
            <div className="form__item">
                <span>Пол</span>
                <Controller
                    name="gender"
                    control={control}
                    render={({field: {onChange, value}}) =>
                        <Select optionLabelProp="label" defaultActiveFirstOption={true} placeholder="Пол"
                                options={genders || []} onChange={onChange} value={value} style={{width: "100%"}}/>}
                    defaultValue={profile.gender}
                />
            </div>
            <div className="form__item">
                <span>Город</span>
                <Controller
                    name="city_id"
                    control={control}
                    render={({field: {onChange, value}}) =>
                        <Select optionLabelProp="label" defaultActiveFirstOption={true} placeholder="Город"
                                options={citySelectOptions || []} onChange={onChange} value={value}
                                style={{width: "100%"}}/>}
                    defaultValue={profile.city_id}
                />
            </div>
            <div className="form__item">
                <Button disabled={loading} type="primary" htmlType="submit">{loading ? <LoaderData /> : "Сохранить"}</Button>
            </div>
        </form>
    </div>
}
const PlayerData = () => {
    const dispatch = useDispatch()
    const {setSucceedNotification, setErrorNotification} = useNotification()
    const {request, loading, error} = useHttp()
    const {control, handleSubmit, formState: {errors, dirtyFields}, } = useForm()
    const {player} = useSelector((state: AppStateType) => state.profile)
    const {playerPositions} = useSelector((state: AppStateType) => state.app)

    React.useEffect(() => {
        dispatch(getPlayerPositions())
    }, [])

    const onSubmit = async (data) => {
        let isEmpty = true
        Object.keys(data).forEach(i => {
            if(!!data[i])
                isEmpty = false
        })
        isEmpty = !!!Object.keys(dirtyFields).length
        if(isEmpty)
            return
        let response = await request<PlayerInfoType>("players/update", "put", data)
        if (response) {
            dispatch(actionsProfile.updatePlayerInfo(response))
            setSucceedNotification("Данные сохранены")
        }
    }

    React.useEffect(() => {
        if (error) {
            setErrorNotification(error)
        }
    }, [error])

    if (!player)
        return <LoaderData dark big/>

    return <div>
        <h1>Данные игрока</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form__item">
                <p>Рост(см)</p>
                <Controller
                    name="height"
                    control={control}
                    render={({field: {onChange, value}}) => <InputNumber max={250} min={120}
                                                                         className={`${!!errors.height ? "input-danger" : ""}`}
                                                                         onChange={onChange} style={{width: "100%"}}
                                                                         value={value} placeholder="Введите вес"/>}
                    defaultValue={player?.height}
                />
                {
                    errors.height && <label
                        className="input-label input-label_display">{warningInputText.requiredField}</label>
                }
            </div>
            <div className="form__item">
                <p>Вес(кг)</p>
                <Controller
                    name="weight"
                    control={control}
                    render={({field: {onChange, value}}) => <InputNumber max={250} min={30}
                                                                         className={`${!!errors.weight ? "input-danger" : ""}`}
                                                                         onChange={onChange} style={{width: "100%"}}
                                                                         value={value} placeholder="Введите вес"/>}
                    defaultValue={player?.weight}
                />
                {
                    errors.height && <label
                        className="input-label input-label_display">{warningInputText.requiredField}</label>
                }
            </div>
            <div className="form__item">
                <p>Номер на футболке</p>
                <Controller
                    name="number"
                    control={control}
                    render={({field: {onChange, value}}) => <InputNumber max={99} min={1}
                                                                         className={`${!!errors.number ? "input-danger" : ""}`}
                                                                         onChange={onChange} style={{width: "100%"}}
                                                                         value={value} placeholder="Введите номер"/>}
                    defaultValue={player?.number}
                />
                {
                    errors.number && <label
                        className="input-label input-label_display">{warningInputText.requiredField}</label>
                }
            </div>
            <div className="form__item">
                <p>Преобладающая рука</p>
                <Controller
                    name="hand_type"
                    control={control}
                    render={({field: {onChange, value}}) =>
                        <Select optionLabelProp="label" defaultActiveFirstOption={true} placeholder="Преобладающая рука"
                                options={handTypes || []} onChange={onChange} value={value} style={{width: "100%"}}/>}
                    defaultValue={player.hand_type}
                />
            </div>
            <div className="form__item">
                <p>Позиция</p>
                <Controller
                    name="position_id"
                    control={control}
                    render={({field: {onChange, value}}) =>
                        <Select optionLabelProp="label" defaultActiveFirstOption={true} placeholder="Позиция"
                                options={playerPositions || []} onChange={onChange} value={value} style={{width: "100%"}}/>}
                    defaultValue={player.position_id}
                />
            </div>
            <div className="form__item">
                <Button disabled={loading} type="primary" htmlType="submit">{loading ? <LoaderData /> : "Сохранить"}</Button>
            </div>
        </form>
    </div>
}
