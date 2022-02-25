import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserLayout from "../../../components/UserDashboardLayout";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";

export default function Index() {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const[walletData,setWalletData]=useState(0)

  const handleFetchWallet = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/wallet/GetUserBalance`, {
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
        setWalletData(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch VM", e.message);
      });
  };

  useEffect(() => {
    document.title = "امور مالی";
    handleFetchWallet();
  }, []);

  return (
    <div className="flex flex-col text-right p-1 ">
      <div className="bg-stone-200 rounded-lg shadow-md h-64 mb-8 p-6 flex flex-col">
        <div className="flex flex-row-reverse font-semibold">
          <div className=""> : موجودی کیف پول</div>
          <div className="">{walletData}</div>
        </div>
        <div className=""></div>
      </div>
      <div className="bg-stone-200 rounded-lg shadow-md h-64 mb-8 p-4 "></div>
    </div>
  );
}

Index.Layout = UserLayout;
