import React from "react";

export const useOutsideAlerter = (ref, setState, exception) => {
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && setState) {
                if (exception && exception.current && exception.current.contains(event.target)) {
                    return;
                }
                setState(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [exception, ref, setState]);
};