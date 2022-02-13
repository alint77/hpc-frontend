import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import jwtDecode, { JwtPayload } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

import { API_URL } from "../config/config";

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
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const login = async (user: loginUserModel) => {
    if (!user.email || user.password.length < 6) {
      return toast.error("Password invalid");
    }

    toast.loading("Logging in..", { toastId: "1" });

    setisLoading(true);
    const res = await fetch(`${API_URL}/users/Login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then( (data) => {
        toast.dismiss("1");
        window.localStorage.setItem("access", data.data.accessToken);
        window.localStorage.setItem("refresh", data.data.refreshToken);
        toast.success("Success!");
        checkUserLoggedIn();
        setisLoading(false);
        router.push("/");
      })
      .catch((e) => {
        console.log(e);
        setisLoading(false);
        toast.dismiss("1");
        toast.error(e.message);
      });
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
    })
    .then(async (e) => {
      if (!e.ok) {
        throw Error((await e.json()).message);
      }
      return e.json();
    })
      .then((data) => {
        toast.dismiss("1");
        window.localStorage.setItem("access", data.data.accessToken);
        window.localStorage.setItem("refresh", data.data.refreshToken);
        toast.success("Success!");
        checkUserLoggedIn();
        setisLoading(false);
        router.push("/");
      })
      .catch((e) => {
        console.log(e);
        setisLoading(false);
        toast.dismiss("1");
        toast.error(e.message);
      });
  };

  const checkUserLoggedIn = async () => {
    if (!window.localStorage.getItem("access")||!window.localStorage.getItem("refresh")) {
      setUser(null);
      setisLoading(false);
      return;
    }

    setisLoading(true);

    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }

    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/users/GetUserInfo`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
    }).then(async (e) => {
      if (!e.ok) {
        throw Error((await e.json()).message);
      }
      return e.json();
    }).then(data=>{
      setUser(data.data);
      setisLoading(false);
    }).catch(e=>{
      setUser(null);
      console.log("CheckUserLoggedInError:",e.message);
      setisLoading(false);
    })
  
  };

  const isAccessTokenValid = () => {
    
    const accessToken = window.localStorage.getItem("access");
    const refreshToken = window.localStorage.getItem("refresh");

    if(!accessToken||!refreshToken) return false

    const decodedAccessToken: JwtPayload = jwtDecode(accessToken);

    const deltaT = decodedAccessToken.exp - parseInt((Date.now() / 1000).toFixed());
    console.log(deltaT);
    return deltaT > 40;
    
  };

  const refreshAccessToken = async () => {
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
    }).then(async (e) => {
      if (!e.ok) {
        throw Error((await e.json()).message);
      }
      return e.json();
    }).then(data=>{

      window.localStorage.setItem("access", data.data.accessToken);
      window.localStorage.setItem("refresh", data.data.refreshToken);
      setisLoading(false);

    }).catch(e=>{
      setUser(null);
      console.log("CheckUserLoggedInError:",e.message);
      logout()
      setisLoading(false);
    })
    
  };

  const logout = () => {
    setisLoading(true);
    window.localStorage.removeItem("access");
    window.localStorage.removeItem("refresh");
    setUser(null);
    setisLoading(false);
    router.push("/login");
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
          refreshAccessToken,
          isAccessTokenValid,
        }}
      >
        {children}
      </AuthContext.Provider>
      <ToastContainer hideProgressBar />
    </>
  );
};

export default AuthContext;
