import React from 'react';
import {Button, Popconfirm} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {deleteOwnTeam} from "../../redux/profile_reducer";
import {useRouter} from "next/router";
import {AppStateType} from "../../redux/store_redux";

const TeamSettings: React.FC = () => {

    const router = useRouter()
    const dispatch = useDispatch()
    const {isFetching} = useSelector((state: AppStateType) => state.profile)
    const deleteTeam = () => {
        try {
            dispatch(deleteOwnTeam())
            router.push("/Teams")
        } catch (e) {}
    }
    return (
        <div>
            <div className="title__wrapper">
                <h1 className="secondary">Найстройки комнады</h1>
            </div>
            <div>

                <div className="title__wrapper">
                    <h3 className={"secondary"}>Удалить команду</h3>
                </div>
                <div>
                    <Popconfirm
                        title="Вы действительно хотите удалить команду?"
                        onConfirm={deleteTeam}
                        okText="Да"
                        cancelText="Отмена"
                        disabled={isFetching}
                    >
                        <Button disabled={isFetching} className="btn__w-icon" style={{marginLeft: "10px"}} type={"default"}>
                            <i className="fas fa-running"/><span>&nbsp;Удалить</span>
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        </div>
    );
};

export default TeamSettings;
