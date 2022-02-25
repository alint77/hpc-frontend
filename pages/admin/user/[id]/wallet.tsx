import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import AuthContext from "../../../../context/authContext";
import { API_URL } from "../../../../config/config";

import { toast } from "react-toastify";

export default function Wallet() {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);
  const router = useRouter();
  const [walletData, setWalletData] = useState();
  const [trxData, setTrxData] = useState([]);

  const handleFetchWallet = async () => {
    const { id } = router.query;
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    await fetch(`${API_URL}/wallet/GetUserBalanceAdmin/${id}/admin`, {
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
        console.log("ERROR:failed to fetch wallet:", e.message);
      });
    await fetch(`${API_URL}/wallet/GetUserTransactionsAdmin/${id}/admin`, {
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
        setTrxData(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch trxs:", e.message);
      });
  };
  useLayoutEffect(() => {
    if (router.query.id) handleFetchWallet();
  }, [router.query.id]);

  return <div>wallet</div>;
}
