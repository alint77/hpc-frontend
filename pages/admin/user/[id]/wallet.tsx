import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import AuthContext from "../../../../context/authContext";
import { API_URL } from "../../../../config/config";

import { toast } from "react-toastify";
import DepositModal from "../../../../components/Admin/Users/Wallet/DepositModal";

export default function Wallet() {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);
  const router = useRouter();
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [walletData, setWalletData] = useState();
  const [trxData, setTrxData] = useState([]);

  const handleFetchWallet = async () => {
    if(!router.query.id)return
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
  useEffect(() => {
    handleFetchWallet();
  },[] );

  return (
    <div>
      <pre>{JSON.stringify(walletData, null, 2)}</pre>
      <pre>{JSON.stringify(trxData, null, 2)}</pre>

      <button className="bg-gray-200 p-1 rounded" onClick={()=>setShowDepositModal(true)}>Deposit</button>
      <DepositModal isOpen={showDepositModal} title={"شارژ حساب کاربر"} className={undefined} setIsOpen={setShowDepositModal}></DepositModal>

    </div>
  );
}
