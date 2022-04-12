import React from "react";
import {useSelector} from "react-redux";
import {AppStateType} from "../../redux/store_redux";
import {DeviceWidth} from "../App/DeviceWidth"
import AuthGuard from "../AuthGuard/AuthGuard";

type Props = {
    isAuthRequired: boolean
}

export const Layout:React.FC<Props> = ({isAuthRequired, children}) => {
    const modals = useSelector((state: AppStateType) => state.app.modals);
    const {activeModal} = useSelector((state: AppStateType) => state.app);

    return <AuthGuard isAuthRequired = {isAuthRequired}>
        <div className={`app__wrapper ${activeModal && activeModal.blur && "blur-in"}`}>
            {children}
        </div>
        {
            modals.map((item, i) => {
                let Content = item?.content
                return item.show && <React.Fragment key={i}><Content/></React.Fragment>
            })
        }
        <DeviceWidth/>
    </AuthGuard>
}