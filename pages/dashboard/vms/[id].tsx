import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import AuthContext from "../../../context/authContext";
import {
  API_URL,
  RegistrationStatus,
  UserRole,
  VMSTATES,
} from "../../../config/config";

import { toast } from "react-toastify";
import ExtendModal from "../../../components/VMs/VMPage/ExtendModal";
import UpgradeModal from "../../../components/VMs/VMPage/UpgradeModal";
import UserLayout from "../../../components/UserDashboardLayout";

interface Creator {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
}

interface Host {
  id: string;
  name: string;
}
interface Image {
  id: string;
  softWare?: string;
  osVersion: number;
  osName: string;
}

interface VM {
  startProidDateTime: string;
  diskSize: number;
  vmName: string;
  createDateTime: string;
  startDateTime: string;
  endPriodDateTime: string;
  id: string;
  vmState: string;
  creator: Creator;
  isPaid: boolean;
  host: Host;
  os: number;
  period: number;
  price: number;
  processorCores: number;
  memory: number;
  imageDto: Image;
}

export default function VMpage() {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const [showUpgradeRequestModal, setShowUpgradeRequestModal] = useState(false);
  const [showExtendRequestModal, setShowExtendRequestModal] = useState(false);
  const [vmData, setVmData] = useState<VM>({
    vmName: "",
    createDateTime: "",
    startDateTime: "",
    endPriodDateTime: "",
    id: "",
    vmState: "",
    creator: {
      email: "",
      firstName: "",
      id: "",
      lastName: "",
    },
    startProidDateTime: "",
    isPaid: false,
    host: {
      id: "",
      name: "",
    },
    os: NaN,
    period: NaN,
    price: NaN,
    processorCores: NaN,
    memory: NaN,
    diskSize: NaN,
    imageDto: {
      id: "",
      softWare: "",
      osName: "",
      osVersion: NaN,
    },
  });

  const router = useRouter();
  
  const handleFetchVM = async () => {
    const { id } = router.query;
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");
    
    const res = await fetch(`${API_URL}/vms/${id}/GetVMById`, {
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
      setVmData(data.data);
      setisLoading(false);
    })
    .catch((e) => {
      toast.error(e.message);
      setisLoading(false);
      console.log("ERROR:failed to fetch VM", e.message);
    });
  };
  
  const btnsRender = () => {
    const vmState = vmData.vmState;
    switch (vmState) {
      case VMSTATES[1]:
        return (
          <div>
            <button
              onClick={handleBtns}
              id="HardShutdown"
              className="p-2 mx-2 rounded bg-gray-200 w-fit"
              >
              Hard Shutdown
            </button>
            <button
              onClick={handleBtns}
              id="Restart"
              className="p-2 rounded bg-gray-200 w-fit"
              >
              Restart
            </button>
          </div>
        );
        case VMSTATES[2]:
          return (
            <button
            onClick={handleBtns}
            id="PowerUp"
            className="p-2 mx-2 rounded bg-gray-200 w-fit"
            >
            Power Up
          </button>
        );
        
        default:
          return;
        }
      };
      const handleBtns = async (e) => {
        const fn = e.target.id;
        const { id } = router.query;
        let q = true;
        if (fn == "HardShutdown") {
          q = confirm("تمام اطلاعات ذخیره نشده از دست خواهد رفت");
        }
        if (!q) return;
        setisLoading(true);
        if (!isAccessTokenValid()) {
          await refreshAccessToken();
        }
        const accessToken = window.localStorage.getItem("access");
        
        const res = await fetch(`${API_URL}/vms/RequestFor${fn}VM/${id}`, {
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
          toast.success("success!");
          console.log(data.data);
          setisLoading(false);
          setTimeout(() => router.reload(), 200);
        })
        .catch((e) => {
          toast.error(e.message);
          setisLoading(false);
          console.log("ERROR:failed to fetch VM", e.message);
        });
      };
      const stringToLocaleString = (date) => {
        const a = new Date(date);
        return a.toLocaleString();
      };
      const remainingDays = (value) => {
        return ((new Date(value).getTime() - Date.now()) / 86400000).toFixed();
      };
      
      useEffect(() => {
        if (router.query.id) {
          handleFetchVM();
        }
      }, [router.query.id]);
  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex flex-row justify-between max-w-2xl w-full m-auto">
        <div className="">
          <button
            onClick={handleFetchVM}
            className="p-2 rounded bg-gray-200 w-fit"
          >
            refresh
          </button>
        </div>
        <div className="">{btnsRender()}</div>
      </div>

      <div className="">
        <div className="rounded bg-stone-200 shadow-md text-right p-4 max-w-2xl m-auto w-full">
          <div>
            <div className=" flex flex-row-reverse justify-between my-4 px-6">
              <div>شناسه</div>
              <div className="">{vmData.vmName}</div>
            </div>
            <div className=" flex flex-row-reverse justify-between my-4 px-6">
              <div>دوره قرارداد</div>
              <div className="">{vmData.period}</div>
            </div>
            <div className=" flex flex-row-reverse justify-between my-4 px-6">
              <div>وضعیت فعلی</div>
              <div className="">{vmData.vmState}</div>
            </div>
            <div className=" flex flex-row-reverse justify-between my-4 px-6">
              <div>تاریخ شروع قرارداد</div>
              <div className="">
                {stringToLocaleString(vmData.startProidDateTime)}
              </div>
            </div>
            <div className=" flex flex-row-reverse justify-between my-4 px-6">
              <div>تاریخ پایان قرارداد</div>
              <div className="">
                {stringToLocaleString(vmData.endPriodDateTime)}
              </div>
            </div>
            <div className=" flex flex-row-reverse justify-between my-4 px-6">
              <div> روزهای باقیمانده</div>
              <div className="">{remainingDays(vmData.endPriodDateTime)}</div>
            </div>
            <div className=" flex flex-row-reverse justify-between my-4 px-6">
              <div>قیمت ساعتی بدون احتساب تخفیف</div>
              <div className="">
                <span>{vmData.price}</span>
              </div>
            </div>

            <div className=" flex flex-row-reverse justify-between my-4 px-6">
              <div>:مشخصات ماشین مجازی</div>
            </div>
          </div>
          <div className="border-2 text-stone-200 bg-slate-700  p-4 text-left rounded shadow">
            <div className="">{vmData.processorCores} Core Processor</div>
            <div className="">{vmData.memory}GB RAM</div>
            <div className="">{vmData.diskSize}GB Storage</div>
            <div className="">
              {vmData.imageDto.osName} version {vmData.imageDto.osVersion}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-2xl w-full m-auto">
        <button
          onClick={() => setShowExtendRequestModal(true)}
          className="p-2 mr-2 rounded bg-slate-700 text-white text-sm w-fit"
        >
          درخواست تمدید
        </button>
        <button
          onClick={() => setShowUpgradeRequestModal(true)}
          className="p-2 rounded bg-slate-700 text-white text-sm w-fit"
        >
          درخواست ارتقا
        </button>
        {vmData && (
          <ExtendModal
            isOpen={showExtendRequestModal}
            setIsOpen={setShowExtendRequestModal}
            title={"درخواست تمدید"}
            vmId={vmData.id}
            vmPrice={vmData.price}
          ></ExtendModal>
        )}
        {vmData && (
          <UpgradeModal
            isOpen={showUpgradeRequestModal}
            setIsOpen={setShowUpgradeRequestModal}
            title={"درخواست ارتقا"}
            vmId={vmData.id}
          ></UpgradeModal>
        )}
      </div>
    </div>
  );
}

// VMpage = UserLayout;
