import React, { useState, useContext, createContext, ReactNode } from "react";

interface IUserInfo {
  email: string;
  password: string;
  cpassword: string;
}

interface IuserContext {
  userInfo: IUserInfo;
  setUserInfo: (
    userInfo: IUserInfo | ((prevUserInfo: IUserInfo) => IUserInfo)
  ) => void;
  generatedOtp: number;
  setGeneratedOtp: (otp: number) => void;
  userId: string;
  setUserId: (id: string) => void;
}
interface props {
  children: ReactNode;
}

export const UserContext = createContext<IuserContext | null>(null);

export const UserContextProvider = ({ children }: props) => {
  const [generatedOtp, setGeneratedOtp] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    email: "",
    password: "",
    cpassword: "",
  });

  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, generatedOtp, setGeneratedOtp, userId, setUserId }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useThreadContext is not used porperly");
  } else {
    return context;
  }
};
