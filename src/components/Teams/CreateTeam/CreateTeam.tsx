import React from 'react';
import {Button, DatePicker, Form, Input, Popconfirm} from "antd";
import {Controller, useForm} from "react-hook-form";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../../../utils/hooks/http.hook";
import {useNotification} from "../../../utils/hooks/useNotification";
import {fetchUserList} from "../../../utils/fetchUserList";
import {useRouter} from "next/router";
import CustomTable from "../../CustomTable";
import {makeValidDate} from "../../../utils/makeValidDate";
import {AppStateType} from "../../../redux/store_redux";
import {actionsProfile} from "../../../redux/profile_reducer";
import {LoaderData} from "../../LoaderData/LoaderData";
import {TeamType} from "../../../../types/teams";
import {getCorrectDate} from "../../../utils/getCorrectDate";
import {DebounceSelect} from "../../tools/DebounceSelect";

interface DataSource {
    "first_name": string,
    "last_name": string,
    "patronymic": string,
    "birthday": string
}

type Props = {
    admin?: boolean
    className?: string
}
export const CreateTeam: React.FC<Props> = ({admin, className}) => {
    const {setErrorNotification, setSucceedNotification} = useNotification()
    const {request, error, loading} = useHttp()
    const dispatch = useDispatch()
    const router = useRouter()
    const {player, profile} = useSelector((state: AppStateType) => state.profile)
    const {control, handleSubmit, formState: {errors}, reset} = useForm()
    const [dataSource, setDataSource] = React.useState<DataSource[]>([])
    const [value, setValue] = React.useState<string[]>([]);
    const [captainValue, setCaptainValue] = React.useState<number[]>([]);
    const [isAdmin, setIsAdmin] = React.useState<boolean>(null);

    React.useEffect(() => {
        setIsAdmin(admin && profile?.isAdmin)
    }, [profile])

    React.useEffect(() => {
        if (player?.team_id && isAdmin !== null && !isAdmin)
            setErrorNotification("У вас уже есть команда!")
    }, [player, isAdmin])

    const getPlayerId = (value: string) => {
        if (!value)
            return 0
        return Number(value.split("$id$")[0])
    }
    const onSubmit = async (data: {
        name: string
        new_players: DataSource[]
        players: number[],
        captain_id: number
    }) => {
        let body = {...data}
        let captainId
        if (isAdmin) {
            captainId = !!captainValue.length && captainValue[0]
            if (!captainId)
                return setErrorNotification("Укажите капитана команды")
            body = {...body, captain_id: getPlayerId(captainId)}
        }
        let players = value?.map(item => getPlayerId(item))
        let playersInviteExist = !!players?.length
        if (playersInviteExist)
            body = {...body, players}
        if (!!dataSource?.length) {
            if (dataSource.length > 25)
                return setErrorNotification("Максимальное количество новых игроков: 25")
            body = {
                ...body,
                new_players: dataSource.map(item => ({...item, birthday: makeValidDate(item.birthday, true)}))
            }
        }

        try {
            let res = await request<{ status: boolean, team: TeamType }>("teams", "post", body)
            if (res.status) {
                reset()
                playersInviteExist && setSucceedNotification("Приглашения указанным игрокам отправлено!")
                !isAdmin && dispatch(actionsProfile.joinTeam(res.team, true))
                !isAdmin && router.push("/teams/" + res.team.id)
                setSucceedNotification("Команда успешно создана!")
            }
        } catch (e) {
        }
    }

    React.useEffect(() => {
        if (error) {
            setErrorNotification(error)
        }
    }, [error])

    return <div className={`block__wrapper ${className || ""}`}>
        <h1>Создание команды</h1>
        <div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="margin"/>
                    <span>Название команды</span>
                    <Controller
                        name="name"
                        control={control}
                        rules={{required: true}}
                        render={({field: {onChange, value}}) => <Input
                            onChange={onChange}
                            className={`${!!errors["name"] ? "input-danger" : ""}`}
                            value={value} placeholder="Введите название"/>}
                        defaultValue=""
                    />
                    <div className="margin"/>

                    {
                        isAdmin && <>
                            <p>Капитан команды</p>
                            <DebounceSelect
                                mode="multiple"
                                value={captainValue}
                                placeholder="Поиск игроков"
                                fetchOptions={fetchUserList}
                                onChange={newValue => {
                                    if (newValue?.length > 1)
                                        return setCaptainValue(newValue[newValue.length - 1]);
                                    return setCaptainValue(newValue);
                                }}
                                style={{width: '100%'}}
                            />
                            <div className="margin"/>
                        </>
                    }
                    <p>Поиск существующих игроков</p>
                    <DebounceSelect
                        mode="multiple"
                        value={value}
                        placeholder="Поиск игроков"
                        fetchOptions={fetchUserList}
                        onChange={newValue => {
                            setValue(newValue);
                        }}
                        style={{width: '100%'}}
                    />
                    <div className="margin"/>
                    <EditableTable dataSource={dataSource}
                                   setDataSource={setDataSource}/>
                    <Button className="margin" disabled={(!isAdmin && !!player?.team_id) || loading}
                            htmlType="submit"
                            type="primary">{loading ? <LoaderData/> : "Создать"}</Button>
                </form>
            </div>
        </div>
    </div>
};

const EditableRow = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableContext = React.createContext(null);
const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          type,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = React.useState(false);
    const inputRef = React.useRef(null);
    const form = React.useContext(EditableContext);

    const [value, setValue] = React.useState(dataIndex === "birthday" ? record[dataIndex] || "01.01.2000" : null)

    React.useEffect(() => {
        if (editing) {
            inputRef?.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async (newValue: any) => {
        try {
            let new_value = value || newValue
            if (dataIndex === "birthday") {
                new_value = newValue
                if (newValue?.includes("/")) {
                    new_value = newValue.split("/").join(".")
                }
            }
            !!new_value?.length && handleSave({...record, [dataIndex]: new_value});
            toggleEdit();
        } catch (errInfo) {
        }
    }

    const disabledDate = (current) => {
        if (!current)
            return false
        let currentTime = new Date(current["_d"]?.toString()).getTime()
        let date = new Date(moment().endOf('day')["_d"]).getTime() - (86400000 * 365 * 14)
        return current && currentTime > date;
    }

    let childNode = children;
    if (editable) {
        childNode = editing ? (
            !!dataIndex && <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                {
                    type === "text" &&
                    <Input defaultValue={record[dataIndex]} ref={inputRef}
                           style={{width: "120px"}}
                           onChange={(value) => setValue(value.target.value)} onPressEnter={save} onBlur={save}/>
                }
                {
                    type === "date" &&
                    <DatePicker format='DD.MM.YYYY' disabledDate={disabledDate} style={{width: "120px"}}
                                value={moment(getCorrectDate(record[dataIndex]))}
                                ref={inputRef} onChange={(value) => {
                        if (!value)
                            return
                        //@ts-ignore
                        let newValue = new Date(value?._d?.toString()).toLocaleDateString()
                        newValue && save(newValue)
                    }} inputReadOnly onBlur={toggleEdit}/>
                }
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};

const EditableTable = ({
                           dataSource,
                           setDataSource
                       }) => {
    const [count, setCount] = React.useState(1)
    const [columns,] = React.useState([
        {
            title: 'Фамилия',
            dataIndex: 'last_name',
            width: '20%',
            type: "text",
            editable: true,
        },
        {
            title: 'Имя',
            dataIndex: 'first_name',
            width: '20%',
            type: "text",
            editable: true,
        },
        {
            title: 'Отчество',
            dataIndex: 'patronymic',
            width: '20%',
            type: "text",
            editable: true,
        },
        {
            title: 'День рождения',
            dataIndex: 'birthday',
            editable: true,
            type: "date",
            width: "30%"
        },
        {
            title: 'Действие',
            editable: false,
            type: "text",
            dataIndex: 'operation',
            render: (_, record) =>
                <Popconfirm title="Подтвердите действие" onConfirm={() => handleDelete(record.key)}>
                    <a>Удалить</a>
                </Popconfirm>,
        },
    ].map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                name: col.dataIndex,
                title: col.title,
                type: col.type,
                handleSave: handleSave,
            }),
        };
    }))

    const handleDelete = (key: React.Key) => {
        setDataSource(prevState => prevState.filter(item => item.key !== key));
    };

    const handleAdd = () => {
        const newData = {
            key: count,
            first_name: 'Алибек',
            last_name: 'Алибеков',
            patronymic: 'Алибекулы',
            birthday: '01.01.2000',
        };
        setDataSource(prevState => ([...prevState, newData]));
        setCount(prevState => prevState + 1)
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    return (
        <div>
            <Button onClick={handleAdd} style={{margin: "15px 0"}}>
                Добавить игрока
            </Button>
            <CustomTable
                components={components}
                rowClassName={() => 'editable-row'}
                bordered dataSource={dataSource} columns={columns}/>
        </div>
    );
}