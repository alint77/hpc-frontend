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

  const [walletData, setWalletData] = useState({
    total: 0,
    blocked: 0,
  });
  const [trxData, setTrxData] = useState([]);

  const handleFetchWallet = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    await fetch(`${API_URL}/wallet/GetUserBalance`, {
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
      .catch(async (e) => {
        if (e.message == "user not found") {
          return await handleCreateWallet();
        }
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch VM", e.message);
      });
    await fetch(`${API_URL}/wallet/GetUserTransactions`, {
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
      .catch(async (e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch VM", e.message);
      });
  };

  const handleCreateWallet = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/wallet/CreateWalletForUser`, {
      method: "POST",
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
        setisLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch VM", e.message);
      });
  };
  document.title = "امور مالی";
  useEffect(() => {
    handleFetchWallet();
  }, []);

  return (
    <div className="flex flex-col text-right p-1 ">
      <div className="bg-stone-200 rounded-lg shadow-md  mb-8 p-10 flex flex-col">
        <div className="flex flex-row-reverse justify-between font-semibold items-center">
          <div className=""> : موجودی کیف پول</div>
          <div className="flex flex-row items-center space-x-6 text-center">
            <div className="font-bold text-lg">
              <div>مبلغ آزاد</div>
              <div className="">{walletData.total-walletData.blocked}</div>
            </div>

            <div className=" font-light">
              <div>بلوکه شده</div>
              <div>{walletData.blocked}</div>
            </div>
          </div>
        </div>
        <div className=""></div>
      </div>
      <div className="bg-stone-200 rounded-lg shadow-md mb-8 p-6 ">
        <div className="font-semibold">: تاریخچه تراکنش ها</div>
        <div className="max-h-96 overflow-auto mt-4 rounded">
          {trxData.map(({ transaction, metaData }) => (
            <div key={transaction.id} className="bg-white rounded mb-1">
              <div className="flex flex-row-reverse p-2">
                <div className="px-1">
                  {transaction.type == "deposit"
                    ? " واریز "
                    : transaction.type == "withdraw"
                    ? " برداشت "
                    : ""}
                </div>
                <div className="px-1">مبلغ</div>
                <div className="px-1">{transaction.amount}</div>
                <div className="px-1">در تاریخ</div>
                <div className="px-1">
                  (
                  {new Date(
                    Date.parse(transaction.createDateTime)
                  ).toLocaleString()}
                  )
                </div>
                <div className="px-1">از</div>
                <div className="px-1">{metaData.issuer}</div>
              </div>
              <div className="flex flex-row-reverse p-2 ">
                <div className="px-1">توضیح</div>
                <div className="px-1">:</div>
                <div className="px-1">{metaData.description}</div>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Index.Layout = UserLayout;

// "type": "deposit",
// "amount": 1000000,
// "walletId": "2c31e868-1a2a-40c4-8759-cbbc08e46d5a",
// "id": "e5968ff4-ef1f-4637-9279-f2025d4e3ea8",
// "status": "completed",
// "createDateTime": "2022-02-25T23:23:25Z"
