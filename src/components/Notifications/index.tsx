import {useHttp} from "../../utils/hooks/http.hook";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store_redux";
import React from "react";
import {useOutsideAlerter} from "../../utils/hooks/useOutsideClick";
import {PopupNotifications} from "../PopupNotifications/PopupNotifications";
import {actionsApp, getNotifications} from "../../redux/app_reducer";
import styles from "./Notifications.module.sass"

type Props = {
    className?: string
}
const Notifications: React.FC<Props> = ({className}) => {

    const dispatch = useDispatch()
    const {request} = useHttp()
    const {notifications} = useSelector((state: AppStateType) => state.app)

    const [notificationsCount, setNotificationsCount] = React.useState<number>(0)
    const [isShowDropdown, setIsShowDropdown] = React.useState(false)

    const dropdownNotificationRef = React.useRef(null)
    useOutsideAlerter(dropdownNotificationRef, setIsShowDropdown)

    React.useEffect(() => {
        dispatch(getNotifications())
    }, [])

    React.useEffect(() => {
        if (notifications) {
            let count = notifications?.filter(item => !item.read).length
            setNotificationsCount(count)
        }
    }, [notifications])

    const readAll = async () => {
        try {
            let isUnreadNotificationsExist = notifications?.some(item => !item.read)
            if (!isUnreadNotificationsExist)
                return
            let res = await request<{ status: boolean }>("notifications/read-all", "post")
            if (res.status) {
                dispatch(actionsApp.readAllNotifications())
            }
        } catch (e) {
        }

    }
    return <div className={`${styles.notification__block} ${className}`}>
        <div onClick={() => setIsShowDropdown(state => !state)} ref={dropdownNotificationRef}>
            {!!notificationsCount &&
            <div className={styles.notification__count}>{notificationsCount || ""}</div>}
            <i className={`fas fa-bell ${styles.notification__icon}`} aria-hidden/>
            <PopupNotifications isUnreadNotificationsExist={!!notificationsCount} readAll={readAll}
                                isActive={isShowDropdown} notificationList={notifications}/>
        </div>
    </div>
}

export default Notifications