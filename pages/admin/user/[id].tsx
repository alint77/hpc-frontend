import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import AuthContext from "../../../context/authContext";
import { API_URL, RegistrationStatus } from "../../../config/config";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  registrationState: string;
  phoneNumber: string;
  nationalId: number;
  createDateTime: string;
  lastLoginDateTime: string;
}

export default function UserAdminPage() {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const [userData, setUserData] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    registrationState: "",
    phoneNumber: "",
    nationalId: NaN,
    createDateTime: "",
    lastLoginDateTime: "",
  });

  const [userVMs, setUserVMs] = useState({});

  const router = useRouter();
  useLayoutEffect(() => {
    if (router.query.id) {
      handleFetchUser();
    }
  }, [router.query.id]);

  const handleFetchUser = async () => {
    const { id } = router.query;
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/users/${id}/GetUserById/admin`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        console.log(data.data);
        setUserData(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch user ", e.message);
      });
  };

  const handleChangeState = async () => {
    const conf = confirm(
      "change regState from" +
        userData.registrationState +
        "to" +
        (userData.registrationState == RegistrationStatus[0]
          ? RegistrationStatus[1]
          : RegistrationStatus[0])
    );

    if (!conf) return;

    const { id } = router.query;
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/users/ChangeUserState/admin`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        userId: id,
        registrationState:
          userData.registrationState == RegistrationStatus[0]
            ? RegistrationStatus.REGISTERED
            : RegistrationStatus.WAITING_FOR_EMAIL_VERIFICATION,
      }),
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        toast.success("success");
        console.log(data);
        router.reload()
        setisLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:", e.message);
      });
  };

  const handleFetchUserVMs = async () => {
    const { id } = router.query;
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/vms/${id}/GetAllVMsOfUser`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        console.log(data.data);
        setUserData(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch userVMs", e.message);
      });
  };

  return (
    <div>
      <pre>{JSON.stringify(userData,null,2)}</pre>
      <div onClick={handleChangeState} className=" cursor-pointer">
        ChangeStatus
      </div>
      <ToastContainer hideProgressBar></ToastContainer>
    </div>
  );
}
