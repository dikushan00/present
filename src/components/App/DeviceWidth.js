import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {actionsApp} from "../../redux/app_reducer";

export const DeviceWidth = () => {
    const dispatch = useDispatch()
    const {isTablet} = useSelector(state => state.app.appSettings)

    React.useEffect(() => {

        let windowWidth = window && window.innerWidth
        if (windowWidth <= 991)
            dispatch(actionsApp.setIsTablet(true))
    }, [dispatch]);

    React.useEffect(() => {
        let listenerFunction = function (e) {
            let windowWidth = e.target.innerWidth
            if (windowWidth <= 991) !isTablet && dispatch(actionsApp.setIsTablet(true))
            else isTablet && dispatch(actionsApp.setIsTablet(false))
        }
        window.addEventListener("resize", listenerFunction)

        return () => window.removeEventListener("resize", listenerFunction)
    }, [dispatch, isTablet])

    return null
};
