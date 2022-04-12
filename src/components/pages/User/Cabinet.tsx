import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import Link from 'next/link'
import {AppStateType} from "../../../redux/store_redux";
import {ButtonPencil} from "../../blocks/buttons";
import UserData from "../../pages/User/UserData";
import UserPass from "../../pages/User/UserPass";
import {actionsProfile} from "../../../redux/profile_reducer";
import {ProfileAPI} from "../../../api/ProfileAPI";
import {PlayerAPI} from "../../../api/PlayerAPI";
import {Button} from "antd";
import {useHttp} from "../../../utils/hooks/http.hook";
import {useNotification} from "../../../utils/hooks/useNotification";
import {ImgWrapper} from "../../ImgWrapper";
import {PlayerTeamRequest, TeamType} from "../../../../types/teams";
import {PlayerInfoType} from "../../../../types/player";
import styles from "./User.module.css"
import {Player} from "../../Players/Player";

export const Cabinet = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const {slug} = router.query
    const {setErrorNotification} = useNotification()
    const {profile, player} = useSelector((state: AppStateType) => state.profile)
    const [isFetching, setIsFetching] = React.useState(false)
    const [activeRouteName, setActiveRouteName] = React.useState("")
    const [notFoundPage,] = React.useState(false)
    const [username, setUsername] = React.useState({name: "", last_name: ""})

    const [routes, setRoutes] = React.useState([
        {
            path: '/info', text: 'Личная информация', active: true
        },
        {
            path: '/pass', text: 'Пароль', active: false
        },
        {
            path: '/stats', text: 'Статистика игрока', active: false
        },
    ])

    React.useEffect(() => {
        if (profile) {
            let {first_name, last_name} = profile
            if ((first_name.length + last_name.length) > 20) {
                last_name = last_name[0] + "."
                if ((first_name.length + last_name.length) > 19) {
                    first_name = first_name.slice(0, 15) + ".."
                }
            }
            setUsername({name: first_name, last_name})
        }
    }, [profile])

    React.useEffect(() => {
        let path = location.pathname
        setRoutes((prev) => {
            if (path === "/cabinet" || path === "/cabinet/")
                path = `/cabinet/info`
            return prev.map(val => {
                if (`/cabinet${val.path}` === path) {
                    setActiveRouteName(val.path.replace("/", ""))
                    return {...val, active: true}
                }
                return {...val, active: false}
            })
        })
    }, [location])

    const onSubmit = async (e) => {
        try {
            let file = e.target.files[0]
            let formdata = new FormData()
            formdata.append('avatar', file)
            setIsFetching(true)
            let response = file && await ProfileAPI.editProfileAvatar(formdata)
            setIsFetching(false)
            if (response && response.avatar) {
                dispatch(actionsProfile.setProfile({...profile, avatar: response.avatar}))
            }
        } catch (e) {
            setIsFetching(false)
            let message = e.response?.data?.message
            message && setErrorNotification(message)
        }
    }
    const handleClick = () => {
        //@ts-ignore
        document.getElementsByClassName("user__file__input")[0].click()
    }

    return <div className={`${styles.user} ${activeRouteName}`}>
        <div className={`${styles.container} ${styles.user_container}`}>
            <div className={`${styles.user_card}`}>
                <div className={`${styles.user_card__info_wrapper}`}>
                    <div className={`${styles.user_card__avatar_wrapper}`}>
                        <div className={`${styles.cabinet_card__avatar_img__wrapper}`}>
                            <ImgWrapper
                                src={profile?.avatar}
                                className={`${styles.user_card__avatar}`} defaultSrc={"/img/avatar.svg"}
                                alt="avatar"/>

                        </div>
                        <ButtonPencil loader = {isFetching} onClick={handleClick}/>
                        <input onInputCapture={onSubmit} accept="image/jpeg,image/jpg,image/png" className="user__file__input"
                               style={{display: "none"}} type="file"
                        />
                    </div>
                    <div className={`${styles.user_card__user_name}`}>
                        <p className={`${styles.user_card__hello_text}`}>
                            <svg width="20" height="19" viewBox="0 0 20 19" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19.2407 10.704C19.6195 10.3342 19.8283 9.8424 19.8286 9.31895C19.8288 8.7955 19.6206 8.30342 19.2423 7.93327C19.0495 7.74475 18.8266 7.60296 18.5884 7.50765L19.4103 6.70667C19.79 6.33709 19.9994 5.84505 20 5.32112C20.0006 4.79719 19.7924 4.30462 19.4137 3.93416L19.3924 3.91334C19.1002 3.62747 18.7389 3.44869 18.3603 3.37705C18.3833 3.258 18.3955 3.13611 18.3956 3.01228C18.3962 2.48843 18.188 1.99591 17.8093 1.62552L17.7832 1.59997C17.4051 1.23011 16.9024 1.02642 16.3677 1.02642C16.0067 1.02642 15.6604 1.1196 15.3571 1.29376C15.2583 1.03216 15.1024 0.792254 14.8951 0.589453L14.8778 0.572526C14.0974 -0.190788 12.8274 -0.190909 12.0468 0.572566L6.69747 5.80534L7.36192 3.12122C7.62444 2.06069 7.03203 0.979252 5.98393 0.605657C5.39411 0.395395 4.73958 0.443288 4.18821 0.736861C3.63685 1.03043 3.24049 1.54217 3.10075 2.14087L3.00963 2.53139C2.57383 4.39876 1.85344 6.27528 0.868487 8.10868C0.130428 9.48248 -0.150665 11.0891 0.0769978 12.6327C0.312534 14.2297 1.05519 15.6786 2.2247 16.8226C3.66031 18.2269 5.56838 19.0001 7.59844 19H7.60361C9.63552 18.9987 11.5448 18.2229 12.9796 16.8156L14.5112 15.3135L19.2407 10.704ZM12.1086 15.9658C10.906 17.1453 9.30579 17.7955 7.60283 17.7967H7.59848C5.89712 17.7967 4.29774 17.1487 3.09456 15.9717C2.11428 15.0129 1.49185 13.7988 1.29453 12.4609C1.10361 11.1664 1.33907 9.8195 1.95747 8.66843C2.99196 6.74285 3.7495 4.76815 4.20896 2.79917L4.30008 2.40869C4.36216 2.14263 4.53131 1.92427 4.77636 1.79379C5.02141 1.66331 5.30078 1.64293 5.56284 1.73631C6.02186 1.89992 6.28134 2.37355 6.16636 2.83804L4.98663 7.60336C4.84668 8.09456 5.49363 8.64171 6.01936 8.17041L12.9167 1.42348C13.2176 1.12911 13.7072 1.12919 14.0075 1.42292L14.0247 1.43981C14.1705 1.5824 14.2507 1.77189 14.2507 1.97353C14.2507 2.17516 14.1704 2.36469 14.0247 2.50728C12.9021 3.60545 10.8884 5.57522 9.78633 6.65321C9.54612 6.88814 9.54612 7.26911 9.78633 7.50408C10.0265 7.73905 10.416 7.73905 10.6562 7.50408C11.3371 6.83804 15.2489 3.01156 15.8221 2.45089C15.9679 2.30829 16.1616 2.2298 16.3678 2.2298C16.5739 2.2298 16.7677 2.30829 16.9134 2.45089L16.9395 2.47644C17.0855 2.61923 17.1658 2.80908 17.1656 3.011C17.1653 3.21292 17.0846 3.4026 16.9382 3.54516C15.396 5.04776 13.2867 7.10209 11.76 8.59045C11.5193 8.82498 11.5186 9.20592 11.7583 9.44137C11.8785 9.55937 12.0362 9.61842 12.1941 9.61842C12.3511 9.61842 12.5081 9.55998 12.6281 9.44305C13.6544 8.44304 16.4506 5.71846 17.4326 4.76297C17.7335 4.47012 18.2224 4.47068 18.5226 4.76421L18.5438 4.78503C18.6899 4.92787 18.7701 5.11771 18.7699 5.31967C18.7696 5.52163 18.6889 5.71132 18.5424 5.85395C17.0464 7.31155 14.6771 9.6197 13.1943 11.0657C12.9536 11.3003 12.9529 11.6813 13.1926 11.9167C13.3128 12.0346 13.4706 12.0937 13.6283 12.0937C13.7854 12.0937 13.9425 12.0352 14.0624 11.9183L16.8829 9.16969L17.284 8.78142C17.5848 8.49013 18.0731 8.49146 18.3724 8.78415C18.5183 8.92682 18.5985 9.11651 18.5984 9.31827C18.5983 9.52003 18.5178 9.70967 18.3721 9.85186L13.6415 14.4624L12.1086 15.9658Z"
                                    fill={"#484848"}/>
                            </svg>
                            &nbsp;&nbsp;Привет
                        </p>
                        <p className={`${styles.user_card__name_text}`}
                           title={profile?.first_name + ` ${profile?.last_name}`}><span
                            style={{marginRight: "5px"}}>{username.name}</span> <span>{username.last_name}</span>
                        </p>
                    </div>
                </div>
                <div className={`${styles.user_card__nav_wrapper}`}>
                    <nav className={`${styles.user_card__nav}`}>
                        {routes.map((item, i) => <li key={i}
                                                     className={`${styles.user_card__menu__item} ${item.active ? styles.cabinet_card__menu__item_active : ''} 
                                ${item.path === '/progress' ? styles.cabinet_card__menu__item_orange : ''} `}>
                                <Link href={`/cabinet${item.path}`}>
                                    <a>{item.text}</a>
                                </Link>
                            </li>
                        )}
                    </nav>
                </div>
            </div>
            <div className={`col-md-8 ${styles.user__content}`}>
                <PlayerTeamInvitations playerId={player?.id}/>
                {
                    (slug === "" || slug === "info") && <UserData/>
                }
                {
                    slug === "pass" && <UserPass/>
                }
                {
                    slug === "stats" && <Player player={player} isCabinetPage id={profile?.player?.id}/>
                }
                {
                    notFoundPage && <UserData/>
                }
            </div>
        </div>
    </div>
};

type Props = {
    playerId: number
}
const PlayerTeamInvitations: React.FC<Props> = ({playerId}) => {
    const dispatch = useDispatch()
    const {setErrorNotification, setSucceedNotification} = useNotification()
    const {request, error, loading} = useHttp()
    const [invitations, setInvitations] = React.useState<PlayerTeamRequest[] | null>(null)
    React.useEffect(() => {
        const getRequests = async (id: number) => {
            try {
                let res = await PlayerAPI.getPlayerRequests(id, true)
                if (res)
                    setInvitations(res)
            } catch (e) {

            }
        }
        if (playerId) {
            getRequests(playerId)
        }
    }, [playerId])

    const joinToTeam = (team: TeamType) => {
        team && dispatch(actionsProfile.joinTeam(team))
    }

    const answerRequest = async (id: number | null, team: TeamType, user_id: number, type: "reject" | "accept" = "accept") => {
        try {
            let invitation = true
            let response = await request<{ status: boolean, player: PlayerInfoType }>(`teams-player-requests/${type}`, "post", {
                team_id: team.id,
                user_id,
                invitation
            })
            if (response?.status) {
                if (type === "accept") {
                    setSucceedNotification("Вы присоединились в команду!")
                    invitation && joinToTeam(team)
                    setInvitations([])
                } else
                    id && setInvitations(prevState => prevState ? prevState.filter(item => item.id !== id) : prevState)
            }
        } catch (e) {
        }
    }

    React.useEffect(() => {
        if (error)
            setErrorNotification(error)
    }, [error])
    if (!invitations?.length)
        return null

    return <div>
        <div className="title__wrapper">
            <h2 className="secondary">Приглашения в команду</h2>
        </div>
        <div className="games__wrapper">
            {
                invitations?.map(item => {
                    return <div key={item.id} className="card games__item">
                        <Link href={`/teams/${item.team_id}`}>
                            <a>{(item.team?.name || "")}</a>
                        </Link>
                        <div className={"flex request__btn__wrapper"}>
                            <Button disabled={loading}
                                    onClick={() => answerRequest(item.id, item.team, item.user_id, "reject")}>Отклонить</Button>
                            <Button disabled={loading}
                                    onClick={() => answerRequest(item.id, item.team, item.user_id, "accept")}
                                    type={"primary"}>Принять</Button>
                        </div>
                    </div>
                })
            }
        </div>
    </div>
}
