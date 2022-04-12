import React, {useEffect} from 'react';
import {getInputsRules} from "../../utils/validation/validation";
import {Controller, useForm} from "react-hook-form";
import {Button, DatePicker, Input, InputNumber, Select} from "antd";
import {LoaderData} from "../LoaderData/LoaderData";
import moment from "moment";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import data from "../../data/data.json";
import {useNotification} from "../../utils/hooks/useNotification";
import {useHttp} from "../../utils/hooks/http.hook";
import {AppStateType} from "../../redux/store_redux";
import {getMatchSettings} from "../../redux/match_reducer";
import {getStadiums} from "../../redux/playgrounds_reducer";
import {getCompetitionTypes} from "../../redux/competition_reducer";
import {makeValidDate} from "../../utils/makeValidDate";
import {Competition} from "../../../types/match";

type Props = {
    competitionData?: Competition
}

type InputItem = { placeholder: string, name: string, type: string, required?: boolean, options: any[], multiple: boolean, defaultValue: string | number, labelProp: string }
export const TournamentForm: React.FC<Props> = ({competitionData}) => {


    const router = useRouter()
    const dispatch = useDispatch()
    const {warningInputText} = data
    const {setErrorNotification, setSucceedNotification} = useNotification()

    const {request, error, loading} = useHttp()
    const {handleSubmit, control, formState: {errors}, reset} = useForm()
    const {matchSettings} = useSelector((state: AppStateType) => state.match)
    const stadiums = useSelector((state: AppStateType) => state.playgrounds.playgrounds)
    const {types} = useSelector((state: AppStateType) => state.competition)

    useEffect(() => {
        dispatch(getMatchSettings())
        dispatch(getStadiums())
        dispatch(getCompetitionTypes())
    }, []);

    const onSubmit = async (data) => {
        let body = {
            ...data,
            stadiums: typeof data.stadiums === "number" ? [data.stadiums] : data.stadiums,
            date: !!data?.date ? makeValidDate(data.date._d) : null,
            finish_date: !!data?.finish_date ? makeValidDate(data.finish_date._d) : null,
        }

        let formdata = {}
        Object.keys(body).map(item => {
            if (!!body[item])
                formdata[item] = body[item]
        })

        try {
            let res = await request<Competition>("competitions", "post", formdata)
            if (res) {
                setSucceedNotification("Соревнование успешно создано!")
                reset()
                router.push(`/admin/tournaments/${res?.name}`)
            }
        } catch (e) {
        }
    }

    useEffect(() => {
        if (error)
            setErrorNotification(error)
    }, [error]);
    let inputs = [
        {
            "placeholder": "Название",
            "name": "name",
            "type": "text",
            defaultValue: competitionData?.name || null,
        },
        {
            "placeholder": "Заголовок",
            "name": "title",
            "type": "text",
            defaultValue: competitionData?.title || null,
        },
        {
            "placeholder": "Описание",
            "name": "description",
            "type": "text",
            required: false,
            defaultValue: competitionData?.description || null,
        },
        {
            "placeholder": "Дата начала",
            "name": "date",
            "type": "date",
            defaultValue: competitionData?.date ? moment(competitionData?.date) :  null,
        },
        {
            "placeholder": "Дата окончания",
            "name": "finish_date",
            "type": "date",
            required: false,
            defaultValue: competitionData?.finish_date ? moment(competitionData?.finish_date):  null,
        },
        {
            "placeholder": "Количество команд",
            "name": "max_teams_count",
            "type": "number",
            required: false,
            defaultValue: competitionData?.max_teams_count || null,
        },
        {
            "placeholder": "Место проведения",
            "name": "stadiums",
            "type": "select",
            options: stadiums,
            labelProp: "name",
            defaultValue: competitionData?.stadiums?.map(i => i.id) || [],
            multiple: true
        },
        {
            "placeholder": "Место проведения(другое)",
            "name": "stadium_other",
            "type": "text",
            required: false,
            defaultValue: competitionData?.stadium_other || null,
        },
        {
            "placeholder": "Формат",
            "name": "stadium_format_id",
            "type": "select",
            options: matchSettings?.stadiumFormats,
            defaultValue: competitionData?.stadium_format_id || 1
        },
        {
            "placeholder": "Время тайма",
            "name": "time_format_id",
            "type": "select",
            options: matchSettings?.timeFormats,
            defaultValue: competitionData?.time_format_id || 1
        },
        {
            "placeholder": "Покрытие",
            "name": "stadium_type_id",
            "type": "select",
            options: matchSettings?.stadiumTypes,
            defaultValue: competitionData?.stadium_type_id || 1
        },
        {
            "placeholder": "Тип соревнования",
            "name": "competition_type_id",
            "type": "select",
            options: types,
            defaultValue: competitionData?.competition_type_id || 2
        },
        {
            "placeholder": "Стоимость",
            "name": "cost",
            "type": "number",
            defaultValue: competitionData?.cost || null,
            required: false
        }
    ] as InputItem[]

    const dateFormat = 'DD.MM.YYYY';

    function disabledDate(current) {
        if (!current)
            return false
        let currentTime = new Date(current["_d"]).getTime() + 86400000
        let date = new Date(moment().endOf('day')["_d"]).getTime()
        return current && currentTime < date;
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        {
            inputs?.map((item, i) => {
                let rules = getInputsRules(item.name, {}, null, item?.required)
                return <div key={i} className={"margin"}>
                    <div className="">
                        <p>{item.placeholder}</p>
                        <Controller
                            name={item.name as string}
                            control={control}
                            render={({field: {onChange, value}}) => <>
                                {item.type === "text" && <Input
                                    type={item.type || "text"}
                                    onChange={onChange} value={value}
                                    className={`${errors ? errors[item.name] ? "input-danger" : "" : ""}`}
                                    placeholder={item.placeholder}/>}
                                {item.type === "number" && <InputNumber
                                    onChange={onChange} value={value}
                                    className={`${errors ? errors[item.name] ? "input-danger" : "" : ""}`}
                                    placeholder={item.placeholder}/>}
                                {item.type === "date" && <DatePicker format={dateFormat} disabledDate={disabledDate}
                                                                     onChange={onChange} value={value}
                                                                     className={`${errors ? errors[item.name] ? "input-danger" : "" : ""}`}
                                                                     placeholder={item.placeholder}/>}
                                {item.type === "select" &&
                                <Select mode={item?.multiple ? "multiple" : null} style={{minWidth: "200px"}}
                                        optionLabelProp={item?.labelProp || "label"}
                                        onChange={onChange} value={value} options={item.options}
                                        className={`${errors ? errors[item.name] ? "input-danger" : "" : ""}`}
                                        placeholder={item.placeholder}/>}
                            </>}
                            defaultValue={item?.defaultValue || null}
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

        <Button disabled={loading} htmlType="submit" type="primary"
                className="">{loading ? <LoaderData/> : "Сохранить"}</Button>
    </form>
}
