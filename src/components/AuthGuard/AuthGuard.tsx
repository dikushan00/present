import React from 'react';
import {useSelector} from "react-redux";
import {AppStateType} from "../../redux/store_redux";
import {Page403} from "../ErrorPage/Page403";

type Props = {
    isAuthRequired: boolean
}
const AuthGuard: React.FC<Props> = ({children, isAuthRequired}) => {
    const {isAuth} = useSelector((state: AppStateType) => state.auth)
    const [isRedirect, setIsRedirect] = React.useState<boolean | null>(null)

    React.useEffect(() => {
        if (isAuthRequired && !isAuth) {
            setIsRedirect(true)
        } else
            setIsRedirect(false)
    }, [isAuth, isAuthRequired])

    if (isRedirect) {
        return <Page403 />
    }
    return <>{isRedirect === false && children}</>
};

export default AuthGuard;
