import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import AuthContext from "../../context/authContext";
import { API_URL } from "../../config/config";

import { toast } from "react-toastify";
import DepositModal from "../../components/Admin/Users/Wallet/DepositModal";
import EditSettinsModal from "../../components/Admin/Settings/EditSettinsModal";

export default function Settings() {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const [settingsData, setSettingsData] = useState();
  const [input, setInput] = useState({
    id:"",
    name: "",
    extensionDaysLimit: NaN,
    studentDiscountPercent: NaN,
    shutDownVMDiscountPercent: NaN,
    notifyViaEmail: false,
    notifyViaSMS: false,
    notifyViaSystemMessage: false,
    extraCorePrice: NaN,
    extraMemoryPrice: NaN,
    extraDiskPrice: NaN,
    gpuPrice: NaN,
  });

  const handleFetchSettings = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    await fetch(`${API_URL}/root/GetSiteSettings/admin`, {
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
        setSettingsData(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch Settings:", e.message);
      });
  };
  useEffect(() => {
    handleFetchSettings();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="p-2 rounded bg-stone-200 shadow">
        <pre>{JSON.stringify(settingsData, null, 2)}</pre>
        <button
          className="bg-gray-200 p-1 rounded"
          onClick={() => setShowEditModal(true)}
        >
          Edit
        </button>
      </div>
      <EditSettinsModal
        settings={settingsData}
        isOpen={showEditModal}
        setIsOpen={setShowEditModal}
        title={"Edit Settings"}
      ></EditSettinsModal>
    </div>
  );
}

// "name": "Default",
//   "extensionDaysLimit": 1,
//   "studentDiscountPercent": 50,
//   "shutDownVMDiscountPercent": 33,
//   "notifyViaEmail": false,
//   "notifyViaSMS": false,
//   "notifyViaSystemMessage": true,
//   "extraCorePrice": 800,
//   "extraMemoryPrice": 400,
//   "extraDiskPrice": 100,
//   "gpuPrice": 50000
