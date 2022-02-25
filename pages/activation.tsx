import Router, { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_URL, RegistrationStatus } from "../config/config";
import AuthContext from "../context/authContext";

export default function Activation() {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);
  const [activationCodeInput, setActivationCodeInput] = useState("");
  if (!user) return <div>Access denied!</div>;
  if (user.registrationState != RegistrationStatus[0])
    return <div>Access denied!</div>;
  const router = useRouter();

  const handleActivateUser = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/users/ActivateUser`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        code: activationCodeInput,
      }),
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        setisLoading(false);
        toast.success("Account Activated!");
        setTimeout(() => router.push("/dashboard"), 300);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch VM", e.message);
      });
  };

  const handleResend = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/users/ResendActivationCode`, {
      method: "PATCH",
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
        setisLoading(false);
        toast.success("Code Sent to " + user.email);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch VM", e.message);
      });
  };
  return (
    <div>
      <div>Please Enter Activation Code:</div>
      <input
        onChange={(e) => setActivationCodeInput(e.target.value)}
        className="border-2"
        type="text"
        required
      />
      <button onClick={handleActivateUser}>Confirm</button>
      <button onClick={handleResend}>Resend Code</button>
    </div>
  );
}
