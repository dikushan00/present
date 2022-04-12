import React from 'react';
import Link from "next/link";
import {PlayerInfoType} from "../../../../types/player";
import {useSelector} from "react-redux";
import {AppStateType} from "../../../redux/store_redux";
import {ImgWrapper} from "../../ImgWrapper";

type PropsTypes = {
    isCabinetPage?: boolean
    player: PlayerInfoType
}
const PlayerInfo: React.FC<PropsTypes> = ({isCabinetPage, player}) => {

    const {profile} = useSelector((state: AppStateType) => state.profile)
    return <div className="player__wrapper">
        <div className="team__info player__info">
            {
                !isCabinetPage && <div>
                    <div className="team__logo">
                        <ImgWrapper defaultSrc={"/img/avatar.svg"} src={player?.avatar} alt={player?.avatar}/>
                    </div>
                </div>
            }
            <div>
                {
                    !isCabinetPage && <div className="title__wrapper">
                        <h1 className="secondary">{player?.user.first_name + " " + player?.user.last_name}</h1>
                    </div>
                }
                <div className="team__info__list">
                    <div>
                        <span className="team__info__title">Город, страна:</span>
                        {profile?.city && <span className="bold">{profile?.city?.name}, {profile.city?.country_name}</span>}
                    </div>
                    <div>
                        <span className="team__info__title">Команда:</span>
                        <span className="bold">
                            <Link href={`/teams/${player?.team?.id}`}><a>{player?.team?.name && player?.team?.name}</a></Link>
                        </span>
                    </div>
                    <div>
                        <span className="team__info__title">Дата рождения:</span>
                        <span className="bold">{new Date(player?.user.birthday).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <span className="team__info__title">Рост:</span>
                        <span className="bold">{player?.height && player?.height}</span>
                    </div>
                    <div>
                        <span className="team__info__title">Вес:</span>
                        <span className="bold">{player?.weight && player?.weight}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default PlayerInfo;
