import React from "react";
import {Provider, useDispatch, useSelector} from "react-redux";
import {useStore} from "../src/redux/store_redux";
import {getCities, init} from "../src/redux/app_reducer";
import {Loader} from "../src/components/blocks/Loader";
import {getProfile} from "../src/redux/profile_reducer";

import 'antd/dist/antd.min.css'
import '../styles/antd.css'
import '../styles/vars.css'
import '../styles/normalize.css'
import '../styles/bootstrap-grid.css'
import '../styles/index.css'
import '../styles/style.css'
import '../styles/modals.css'
import '../styles/App.sass'

export default function MyApp({Component, pageProps}) {
    const store = useStore(pageProps.initialReduxState)
    return <React.StrictMode>
        <Provider store={store}>
            <App>
                <Component {...pageProps} />
            </App>
        </Provider>
    </React.StrictMode>
}

export const App = (
    {
        children
    }
) => {
    const dispatch = useDispatch()
    const {initialized, modals} = useSelector(state => state.app)
    const {userId} = useSelector(state => state.auth)
    const {profile, isFetchingProfile} = useSelector(state => state.profile)

    React.useEffect(() => {
        dispatch(init())
        dispatch(getCities())
    }, [])

    React.useEffect(() => {
        if (modals) {
            let activeModal = modals.find(item => item.show)
            if (activeModal) {
                if (activeModal?.blur)
                    document.body.style.overflowY = "hidden";
            } else {
                document.body.style.overflowY = "auto";
            }
        }
    }, [dispatch, modals]);

    React.useEffect(() => {
        if (!profile && userId) {
            dispatch(getProfile())
        }
    }, [profile, userId])

    if (!initialized || isFetchingProfile)
        return <Loader/>

    return <>
        {children}
    </>
}
