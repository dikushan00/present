import React from "react";
import Link from "next/link";
import {HeaderLink} from "../styled/main/header/components";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "antd";
import {AppStateType} from "../../redux/store_redux";
import {actionsApp, ModalNamesType} from "../../redux/app_reducer";
import {logout} from "../../redux/auth_reducer";
import {useOutsideAlerter} from "../../utils/hooks/useOutsideClick";
import Notifications from "../Notifications";
import {PlayerInfoType} from "../../../types/player";
import {ImgWrapper} from "../ImgWrapper";
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from "./Header.module.sass"

export const Header = () => {
    const isAuth = useSelector((state: AppStateType) => state.auth.isAuth)
    const {isTablet} = useSelector((state: AppStateType) => state.app.appSettings)
    const {modals} = useSelector((state: AppStateType) => state.app)
    const profile = useSelector((state: AppStateType) => state.profile)

    const [isCollapsed, setIsCollapsed] = React.useState(false)

    const closeRef = React.useRef(null)
    const collapseRef = React.useRef(null)
    useOutsideAlerter(collapseRef, setIsCollapsed, closeRef)

    const toggleIsCollapsed = () => {
        setIsCollapsed(state => !state)
    }

    React.useEffect(() => {
        modals && modals.forEach(item => {
            if (item.show) {
                setIsCollapsed(false)
            }
        })
    }, [modals])

    return <header className={styles.header}>
        <div className={`container ${styles.header__container}`}>
            <Link href="/">
                <a><img src="/img/logo_new_desc.svg" className={`logo ${styles.header__logo}`} alt="Лого"/></a>
            </Link>
            <div className={`${styles.header__dropdown} fade-in`} ref={collapseRef}
                 style={{display: isCollapsed ? "flex" : isTablet ? "none" : "flex"}}>
                <nav className={styles.header__nav}>
                    <HeaderItemLink href='/about-us'>О нас</HeaderItemLink>
                    <HeaderItemLink href='/teams'>Команды</HeaderItemLink>
                    <HeaderItemLink href='/players'>Игроки</HeaderItemLink>
                    <HeaderItemLink href='/playgrounds'>Площадки</HeaderItemLink>
                </nav>
                {
                    isAuth
                        ? <div className={`${styles.header__auth} ${styles.header__auth__block__wrapper}`}>
                            <HeaderTeamBtn player={profile.player}/>
                            {
                                !isTablet && <>
                                    <Notifications className={`${styles.header__auth__block__item}`}/>
                                </>
                            }
                            <AuthUserBlock/>
                        </div>
                        : <NotAuthUserBlock/>
                }
            </div>
            <div className={`${styles.header__mobile__right} flex`}>
                <HeaderTeamBtn mobile player={profile.player}/>
                {isTablet && <Notifications className={`${styles.header__auth__block__item}`}/>}
                <div ref={closeRef} className={styles.close_btn_wrapper}>
                    <div onClick={toggleIsCollapsed}
                         className={`${styles.header_burger} fade-in ${isCollapsed ? styles.collapsed : ""}`}>
                        <span className={styles.burger}/>
                    </div>
                </div>
            </div>
        </div>
    </header>
}

const HeaderItemLink: React.FC<{ href: string }> = ({href, children}) => (
    <Link href={href}><HeaderLink>{children}</HeaderLink></Link>
)

const AuthUserBlock = () => {
    const dispatch = useDispatch()
    const profile = useSelector((state: AppStateType) => state.profile.profile)

    const [isShowDropdown, setIsShowDropdown] = React.useState(false)
    const [username, setUsername] = React.useState({first_name: "", last_name: ""})

    React.useEffect(() => {
        if (profile) {
            let {first_name, last_name} = profile
            if ((first_name.length + last_name.length) > 10) {
                first_name = first_name[0] + "."
            }
            setUsername({first_name, last_name})
        }
    }, [profile])

    const dropdownRef = React.useRef(null)
    useOutsideAlerter(dropdownRef, () => setIsShowDropdown(false))

    const handleLogout = () => {
        dispatch(logout())
    }

    return <div className={`${styles.header__auth__block__item} ${styles.header__auth}`} ref={dropdownRef}>
        <div onClick={() => setIsShowDropdown(prevState => !prevState)} className={styles.header__auth__block}>
            <div className="flex">
                <span>{username?.last_name + " " + username?.first_name}</span>
            </div>
            <div className={styles.avatar}>
                <div className={styles.avatar__template}>
                    <ImgWrapper
                        src={profile?.avatar}
                        className="user-info-footer__avatar" defaultSrc={"/img/avatar.svg"}
                        alt="avatar"/></div>

                <i className={`fas fa-sort-down ${styles.auth__arrow} ${isShowDropdown ? styles.active : ""}`}
                   aria-hidden/>
            </div>
        </div>
        {
            isShowDropdown && <div className={`dropdown ${styles.header__auth__dropdown}`}>
                <div className={"dropdown__item"}>
                    <Link href="/cabinet/info">Мой кабинет</Link>
                </div>
                {profile?.isAdmin && <div className={"dropdown__item"}>
                    <Link href="/admin">Админ панель</Link>
                </div>}
                <div className={"dropdown__item"}>
                    <span className="cursor__pointer" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"/> Выйти</span>
                </div>
            </div>
        }
    </div>
}
const NotAuthUserBlock = () => {
    const dispatch = useDispatch()
    const openModal = (type: ModalNamesType) => {
        dispatch(actionsApp.setActiveModal(type));
    };
    return <div className={`${styles.header__auth} flex`}>
        <Button onClick={() => openModal("modal-login")} type="primary"
                className={`btn ${styles.header_auth__btn}`}>Войти</Button>
        <Button onClick={() => openModal("modal-sign")}
                className={`btn ${styles.header_auth__btn}`}>Регистрация</Button>
    </div>
}

const HeaderTeamBtn: React.FC<{ player: PlayerInfoType, mobile?: boolean }> = ({player, mobile}) => {
    return <>
        {
            player?.team_id
                ? <div style={{marginRight: mobile ? "15px" : 0}}>
                    <Link href={`/teams/${player.team_id}`}>
                        <a>
                            {
                                mobile ? <FontAwesomeIcon className={styles.header__icon} icon={faUsers}/> :
                                    <Button type="primary">
                                        Моя команда
                                    </Button>
                            }
                        </a>
                    </Link>
                </div>
                : <div style={{marginRight: mobile ? "12px" : 0}}>
                    <Link href={`/teams`}>
                        <a>
                            {
                                mobile ? <FontAwesomeIcon className={styles.header__icon} icon={faUsers}/> :
                                    <Button type="primary">
                                        Найти команду
                                    </Button>
                            }
                        </a>
                    </Link>
                </div>
        }
    </>
}
