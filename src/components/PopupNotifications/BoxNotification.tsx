import {Notification} from "../../../types/system";
import React, {memo} from "react";
import {useHttp} from "../../utils/hooks/http.hook";
import {useDispatch} from "react-redux";
import {actionsApp} from "../../redux/app_reducer";
import {useRouter} from "next/router";
import {NotificationEnum} from "../../../types/enums";
import styles from "../Notifications/Notifications.module.sass"

type BoxNotificationProps = {
    className?: string;
    notification: Notification
};

const BoxNotification: React.FC<BoxNotificationProps> = ({
                                                             notification,
                                                         }) => {
    const {request} = useHttp()
    const dispatch = useDispatch()
    const router = useRouter()

    const handleClickNotification = async () => {
        let url = `/matches/${notification.object_id}`
        if (notification.type === "team")
            url = `/teams/${notification.object_id}`
        else if(notification.type === "player")
            url = `/players/${notification.object_id}`

        router.push(url)
        if (notification.read)
            return
        try {
            let res = await request<{ status: boolean }>("notifications/read", "post", {notificationId: notification.id})
            if (res.status) {
                dispatch(actionsApp.readNotification({id: notification.id}))
            }
        } catch (e) {
        }
    }

    return <div className={`${styles.notification__item} ${notification.read ? "" : styles.unread}`}>
        {
            notification.message === NotificationEnum.FriendlyMatchScore && <>
                <p className={styles.notification__item__title}>
                    <span>Соперник внес результаты </span>
                    <span className={styles.notification__item__link} onClick={handleClickNotification}>
                        матча
                    </span>
                </p>
            </>
        }
        {
            notification.message === NotificationEnum.FriendlyMatch && <>
                <p className={styles.notification__item__title}>
                    <span>Вашу команду пригласили на </span>
                    <span className={styles.notification__item__link} onClick={handleClickNotification}>
                    матч
                    </span>
                </p>
            </>
        }
        {
            notification.message === NotificationEnum.FriendlyMatchAccepted &&
            <>
                <p className={styles.notification__item__title}>
                    <span className={styles.notification__item__link} onClick={handleClickNotification}>
                        Матч
                    </span>
                    <span> согласован!</span>
                </p>
            </>
        }
        {
            notification.message === NotificationEnum.FriendlyMatchDeclined &&
            <>
                <p className={styles.notification__item__title}>
                    <span>Соперник отказался от </span>
                    <span className={styles.notification__item__link} onClick={handleClickNotification}>
                        матча
                    </span>
                </p>
            </>
        }
        {
            notification.message === NotificationEnum.TeamPlayerRequest &&
            <>
                <p className={styles.notification__item__title}>
                    <span className={styles.notification__item__link} onClick={handleClickNotification}>
                        Игрок
                    </span>
                    <span> хочет вступить в вашу команду</span>
                </p>
            </>
        }
        {
            notification.message === NotificationEnum.TeamPlayerRequestReject &&
            <>
                <p className={styles.notification__item__title}>
                    <span className={styles.notification__item__link} onClick={handleClickNotification}>
                        Команда
                    </span>
                    <span> отклонила вашу заявку</span>
                </p>
            </>
        }
        {
            notification.message === NotificationEnum.TeamPlayerRequestAccept &&
            <>
                <p className={styles.notification__item__title}>
                    <span>Вас приняли в </span>
                    <span className={styles.notification__item__link} onClick={handleClickNotification}>
                        команду!
                    </span>
                </p>
            </>
        }
        {
            notification.message === NotificationEnum.TeamInvitation &&
            <>
                <p className={styles.notification__item__title}>
                    <span>Вас пригласили в </span>
                    <span className={styles.notification__item__link} onClick={handleClickNotification}>
                        команду
                    </span>
                </p>
            </>
        }
        {
            notification.message === NotificationEnum.TeamInvitationAccept &&
            <>
                <p className={styles.notification__item__title}>
                    <span className={styles.notification__item__link} onClick={handleClickNotification}>
                        Игрок
                    </span>
                    <span> принял приглашение в команду</span>
                </p>
            </>
        }
        {
            notification.message === NotificationEnum.TeamInvitationReject &&
            <>
                <p className={styles.notification__item__title}>
                    <span className={styles.notification__item__link} onClick={handleClickNotification}>
                        Игрок
                    </span>
                    <span> отклонил приглашение в команду</span>
                </p>
            </>
        }
        <p className={styles.notification__item__date}>{new Date(notification.createdAt).toLocaleString()}</p>
    </div>
};
export default memo(BoxNotification);