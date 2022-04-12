import {useSelector} from "react-redux";
import {AppStateType} from "../../redux/store_redux";
import {Controller, useForm} from "react-hook-form";
import {useHttp} from "../../utils/hooks/http.hook";
import {CustomModal} from "../blocks/CustomModal";
import {DatePicker, Input, Select} from "antd";
import React from "react";
import {Stadium, TeamsDataSource, TeamType} from "../../../types/teams";
import moment from "moment";
import data from "../../data/data.json";
import {useNotification} from "../../utils/hooks/useNotification";
import {ImgWrapper} from "../ImgWrapper";
import {makeValidDate} from "../../utils/makeValidDate";

type Props = {
    isModalVisible: boolean
    setIsModalVisible: (n: boolean) => void
    activeTeam: TeamType
    setActiveTeam?: (team: TeamsDataSource | null) => void
}

interface StadiumData extends Stadium {
    value: number | string
    label?: string
}

const dateFormat = 'DD.MM.YYYY,HH:mm';
export const CreateMatchModal: React.FC<Props> = ({isModalVisible, setIsModalVisible, activeTeam, setActiveTeam}) => {

    const {warningInputText} = data
    const {setSucceedNotification, setErrorNotification} = useNotification()
    const stadiums = useSelector((state: AppStateType) => state.playgrounds.playgrounds)
    const player = useSelector((state: AppStateType) => state.profile?.player)
    const {matchSettings} = useSelector((state: AppStateType) => state.match)
    const {control, handleSubmit, formState: {errors}} = useForm()
    const {request, error, loading} = useHttp()

    const hideModal = () => {
        setIsModalVisible(false)
        setActiveTeam && setActiveTeam(null)
    }

    const [stadiumsState, setStadiumState] = React.useState<StadiumData[] | null>(null)

    React.useEffect(() => {
        if (stadiums) {
            let edited = stadiums.map(item => ({...item, value: item.id, label: item.name}))
            setStadiumState(edited)
        }
    }, [stadiums])

    const onSubmit = async (data) => {
        if(!data?.stadium_id && !data.stadium_other) {
            setErrorNotification("Одно из полей места провидения должно быть заполнено!")
        }
        let time_format_id = matchSettings?.timeFormats.find(item => item.value === data.time_format_id)?.id
        let stadium_format_id = matchSettings?.stadiumFormats.find(item => item.name === data.stadium_format_id)?.id
        let date = makeValidDate(data.date._d)
        let body = {
            ...data,
            time_format_id,
            stadium_format_id,
            date,
            home_team_id: player?.team_id,
            away_team_id: activeTeam.id,
            stadium_id: data?.stadium_id || null
        }
        if (!body.stadium_id)
            delete body.stadium_id

        try {
            let response = await request("matches/friendly-match", "post", body)
            if (response) {
                setSucceedNotification("Заявка отправлена сопернику, ожидайте ответа!")
                setIsModalVisible(false)
            }
        } catch (e) {
        }
    }

    React.useEffect(() => {
        if (error) {
            setErrorNotification(error)
        }
    }, [error])

    function disabledDate(current) {
        if (!current)
            return false
        let currentTime = new Date(current["_d"]).getTime() + 86400000
        let date = new Date(moment().endOf('day')["_d"]).getTime()
        return current && currentTime < date;
    }

    if (!matchSettings?.stadiumFormats || !matchSettings.timeFormats)
        return null

    return <CustomModal handleSubmit={handleSubmit} loading={loading} visible={isModalVisible} okText="Пригласить"
                        onCancel={hideModal}
                        onSubmit={onSubmit}
                        title="Приглашение на игру" contentStyle={{minWidth: "auto"}}>
        <div className="custom-modal__item">
            <div className="flex justify-content-start">
                <ImgWrapper className="invitation__team__logo" defaultSrc={"/img/default-logo.png"} src={activeTeam?.logo} alt="logo"/>
                <p className="invitation__team__name">{activeTeam?.name}</p>
            </div>
        </div>
        <div className="flex wrap">
            <div className="custom-modal__item">
                <p>Дата*</p>
                <Controller
                    name="date"
                    control={control}
                    rules={{required: true, validate: (value) => new Date().getTime() < new Date(value).getTime()}}
                    render={({field: {onChange, value}}) =>
                        <DatePicker format={dateFormat} disabledDate={disabledDate} showNow={false} showSecond={false}
                                    showTime
                                    onChange={onChange} value={value}/>}
                    defaultValue=""
                />
                {
                    errors.date && <label
                        className="input-label input-label_display">{
                        errors.date.type === "required" ? warningInputText.requiredField :
                            warningInputText.date}</label>
                }
            </div>
            <div className="custom-modal__item">
                <p>Место провидения</p>
                <Controller
                    name="stadium_id"
                    control={control}
                    render={({field: {onChange, value}}) =>
                        <Select optionLabelProp="name" defaultActiveFirstOption={true} placeholder="Стадион"
                                options={stadiumsState || []} onChange={onChange} value={value} style={{width: 180}}/>}
                    defaultValue={null}
                />
            </div>
        </div>
        <div>
            <div className="custom-modal__item">
                <p>Место провидения(Другое)</p>
                <Controller
                    name="stadium_other"
                    control={control}
                    render={({field: {onChange, value}}) =>
                        <Input placeholder="Стадион(Другое)" onChange={onChange} value={value}/>}
                    defaultValue={null}
                />
            </div>
        </div>

        <div className="flex wrap">
            <div className="custom-modal__item">
                <p>Формат игры*</p>
                <Controller
                    name="stadium_format_id"
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) =>
                        <Select optionLabelProp="name" defaultActiveFirstOption={true} placeholder="Формат схемы"
                                options={matchSettings?.stadiumFormats || []} onChange={onChange}
                                value={value} style={{width: 180}}/>}
                    defaultValue={matchSettings?.stadiumFormats && matchSettings?.stadiumFormats[0].value}
                />
            </div>
            <div className="custom-modal__item">
                <p>Длительность тайма*</p>
                <Controller
                    name="time_format_id"
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) =>
                        <Select optionLabelProp="value" defaultActiveFirstOption={true} inputValue={"id"}
                                placeholder="Длительность" options={matchSettings?.timeFormats || []}
                                onChange={onChange}
                                value={value} style={{width: 180}}/>}
                    defaultValue={matchSettings?.timeFormats && matchSettings?.timeFormats[0].value}
                />
            </div>
        </div>

    </CustomModal>

}