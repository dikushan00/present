import {instance} from "./API";
import {PlayerInfoType, ProfileType} from "../../types/player";
import {Notification} from "../../types/system";

export const ProfileAPI = {
    getProfile() {
        return instance.get<{profile: ProfileType, player: PlayerInfoType}>(`users/profile`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then((response) => {
            return response.data;
        });
    },
    editProfileAvatar(body) {
        return instance.put("users/profile/update", body, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token"),
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            return response.data;
        });
    },
    getNotifications() {
        return instance.get<Notification[]>(`notifications`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        }).then((response) => {
            return response.data;
        });
    }
};
