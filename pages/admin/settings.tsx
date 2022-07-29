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
  const [settingsData, setSettingsData] = useState({
    id: "",
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
  const [input, setInput] = useState({
    id: "",
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
        <div className="rounded bg-stone-200 shadow-md text-right max-w-2xl p-4 m-auto w-full">
          <div className="firstname flex flex-row-reverse justify-between my-4 px-6 border-2">
            <div>extensionDaysLimit</div>{" "}
            <div className="">{settingsData.extensionDaysLimit}</div>
          </div>
          <div className="lastname flex flex-row-reverse justify-between my-4 px-6 border-2">
            <div>studentDiscountPercent</div>{" "}
            <div className="">{settingsData.studentDiscountPercent}</div>
          </div>
          <div className="email flex flex-row-reverse justify-between my-4 px-6 border-2">
            <div>shutDownVMDiscountPercent</div>{" "}
            <div className="">{settingsData.shutDownVMDiscountPercent}</div>
          </div>
          <div className="phone flex flex-row-reverse justify-between my-4 px-6 border-2">
            <div>notifyViaEmail</div>{" "}
            <div className="">{settingsData.notifyViaEmail.toString()}</div>
          </div>
          <div className="ssn flex flex-row-reverse justify-between my-4 px-6 border-2">
            <div>notifyViaSMS</div>{" "}
            <div className="">{settingsData.notifyViaSMS.toString()}</div>
          </div>
          <div className="ssn flex flex-row-reverse justify-between my-4 px-6 border-2">
            <div>notifyViaSystemMessage</div>{" "}
            <div className="">
              {settingsData.notifyViaSystemMessage.toString()}
            </div>
          </div>

          <div className=" flex flex-row-reverse justify-between my-4 px-6 border-2">
            <div>extraCorePrice</div>{" "}
            <div className="">
              {settingsData.extraCorePrice.toLocaleString()}
            </div>
          </div>
          <div className=" flex flex-row-reverse justify-between my-4 px-6 border-2">
            <div>extraMemoryPrice</div>{" "}
            <div className="">
              {settingsData.extraMemoryPrice.toLocaleString()}
            </div>
          </div>
          <div className=" flex flex-row-reverse justify-between my-4 px-6 border-2">
            <div>extraDiskPrice</div>{" "}
            <div className="">
              {settingsData.extraDiskPrice.toLocaleString()}
            </div>
          </div>
          <div className=" flex flex-row-reverse justify-between my-4 px-6 border-2">
            <div>gpuPrice</div>{" "}
            <div className="">{settingsData.gpuPrice.toLocaleString()}</div>
          </div>
        <button
          className="bg-slate-600 p-1 px-2 rounded text-white"
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
