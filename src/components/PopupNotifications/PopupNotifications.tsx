import React from 'react';
import {Notification} from "../../../types/system";
import BoxNotification from "./BoxNotification";
import WrapperScrollbar from "../blocks/WrapperScrollbar/WrapperScrollbar";
import styles from "../Notifications/Notifications.module.sass"

type PopupNotificationsProps = {
    className?: string;
    notificationList: Notification[] | null;
    isActive: boolean,
    isUnreadNotificationsExist: boolean,
    readAll?: () => void,
};

export const PopupNotifications: React.FC<PopupNotificationsProps> = ({
                                                                          notificationList,
                                                                          isActive,
                                                                          isUnreadNotificationsExist,
                                                                          readAll
                                                                      }) => {
    return isActive && <div className={`dropdown ${styles.notifications__wrapper} fade-in`}>
        <div className={`flex ${styles.notifications__header}`}>
            <p className={styles.notifications__title}>Уведомления</p>
            <p className={`${styles.readAll} ${isUnreadNotificationsExist ? "" :"disabled"}`} onClick={readAll}>Прочитать все</p>
        </div>
        <WrapperScrollbar type="thin" className={styles.notifications__list}>
            {
                notificationList?.map(item => {
                    return <BoxNotification key={item.id} notification={item}/>
                })
            }
        </WrapperScrollbar>
    </div>
};
