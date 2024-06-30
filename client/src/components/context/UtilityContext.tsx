import React, {createContext, useContext, useState, ReactNode} from "react";

interface Iutility {
isProfileModalOpen: boolean,
setIsPrtofileModalOpen: (isSet: boolean) => void;
}
interface props {
    children: ReactNode;
}
export const UtilityContext = createContext<Iutility | null>(null);

export const UtilityContextProvider = ({children}: props) => {
    const [isProfileModalOpen, setIsPrtofileModalOpen] = useState<boolean>(false);
    return (
        <UtilityContext.Provider value={{isProfileModalOpen, setIsPrtofileModalOpen}}>
            {children}
        </UtilityContext.Provider>
    )
}

export const useUtilityContext = () => {
    const context = useContext(UtilityContext)
    if(!context) {
        throw new Error("useUtilityContext is not properly used")
    } else {
        return context;
    }
}