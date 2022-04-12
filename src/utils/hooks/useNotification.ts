import { notification } from 'antd';

const notificationDefaultOptions = {
    placement: "topRight" as "topRight",
    duration: 4,
};

export const useNotification = () => {
    const setErrorNotification = (message: string) => {
        notification.error({
            ...notificationDefaultOptions,
            message: 'Ошибка',
            description: message,
        });
    };

    const setSucceedNotification = (message: string) => {
        notification.success({
            ...notificationDefaultOptions,
            message: 'Успешно',
            description: message,
        });
    };

    const setDefaultNotification = (message: string, config = {}) => {
        notification.info({
            ...notificationDefaultOptions,
            ...config,
            message: 'Уведомление',
            description: message,
        });
    };

    return { setErrorNotification, setSucceedNotification, setDefaultNotification };
};

