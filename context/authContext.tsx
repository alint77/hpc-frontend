import { createContext, useState, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import jwtDecode, { JwtPayload } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

import { API_URL } from "../config/apiRoute";

interface loginUserModel {
  email: string;
  password: string;
}

interface registerUserModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phoneNumber: string;
  nationalId: number;
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoading, setisLoading] = useState(true);
  const [user, setUser] = useState(null);

  const router = useRouter();

  useLayoutEffect(() => {
    checkUserLoggedIn();
  }, []);

  const login = async (user: loginUserModel) => {
    if (!user.email || user.password.length < 6) {
      return toast.error("Password invalid");
    }

    toast.loading("Logging in..", { toastId: "2" });

    setisLoading(true);
    const res = await fetch(`${API_URL}/users/Login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    toast.dismiss("2");

    if (res.ok) {
      window.localStorage.setItem("access", data.data.accessToken);
      window.localStorage.setItem("refresh", data.data.refreshToken);
      toast.success("Success!");
      await checkUserLoggedIn();
      setisLoading(false);
      router.push("/");
    } else {
      setisLoading(false);
      toast.error(data.Message);
    }
  };

  const register = async (user: registerUserModel) => {
    toast.loading("please wait", { toastId: "1" });
    setisLoading(true);
    const res = await fetch(`${API_URL}/users/Register`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    toast.dismiss("1");

    if (res.ok) {
      toast.success("Successful!");
      window.localStorage.setItem("access", data.data.accessToken);
      window.localStorage.setItem("refresh", data.data.refreshToken);
      await checkUserLoggedIn();
      setisLoading(false);
      router.push("/");
    } else {
      setisLoading(false);
      toast.error(data.message);
    }
  };

  const checkUserLoggedIn = async () => {

    if (!window.localStorage.getItem("access")) {
      setUser(null);
      setisLoading(false);
      return;
    }

    const accessToken = window.localStorage.getItem("access");

    setisLoading(true);

    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }

    const res = await fetch(`${API_URL}/users/GetUserInfo`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
    });
    const data = await res.json();

    if (res.ok) {
      setUser(data.data);
      setisLoading(false);
    } else {
      setUser(null);
      console.log("CheckUserLoggedInError:", data);
      setisLoading(false);
    }
  };

  const isAccessTokenValid = () => {
    const accessToken = window.localStorage.getItem("access");

    const decodedAccess: JwtPayload = jwtDecode(accessToken);

    const deltaT = decodedAccess.exp - parseInt((Date.now() / 1000).toFixed());
    console.log(deltaT);
    return deltaT > 50;
  };

  const refreshAccessToken = async () => {

    if(isAccessTokenValid()) return

    setisLoading(true);

    const accessToken = window.localStorage.getItem("access");
    const refreshToken = window.localStorage.getItem("refresh");

    const res = await fetch(`${API_URL}/users/Refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });
    const data = await res.json();

    console.log(res);
    console.log(data);

    if (res.ok) {
      window.localStorage.setItem("access", data.data.accessToken);
      window.localStorage.setItem("refresh", data.data.refreshToken);
      setisLoading(false)

    } else if (data.statusCode >= 400) {
      logout()
    }
  };

  const logout = () => {
    setisLoading(true);
    window.localStorage.removeItem("access");
    window.localStorage.removeItem("refresh");
    setUser(null);
    setisLoading(false);
    router.reload();
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          isLoading,
          setisLoading,
          logout,
          login,
          register,
          checkUserLoggedIn,
        }}
      >
        {children}
      </AuthContext.Provider>
      <ToastContainer hideProgressBar />
    </>
  );
};

export default AuthContext;
