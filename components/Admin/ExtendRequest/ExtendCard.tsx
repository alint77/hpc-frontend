import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";
import { useRouter } from "next/router";

interface Prop {
  request: Request;
  className?: string;
}

interface Request {
  vmId: string;
  id: string;
  description: string;
  extraPeriod: number;
}

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
  imageDto: Image;
  vmName: string;
  startProidDateTime: string;
  createDateTime: string;
  endPriodDateTime: string;
  id: string;
  vmState: string;
  creator: Creator;
  isPaid: boolean;
  host: Host;
  price: number;
  os: number;
  period: number;
  processorCores: number;
  memory: number;
  diskSize: number;
  hostDto: any;
  description: any;
  serverAccess: any;
}

export default function RequestCard({ request, className }: Prop) {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);
  const router = useRouter();
  const [vmData, setVmData] = useState({
    creator: {
      lastName: "",
      firstName: "",
    },
    hostDto: {
      name: "",
      id: "",
    },
    id: "",
    vmName: "",
    endPriodDateTime: "",
    serverNameIdentifier: "",
  });

  const handleAcceptOrDecline = async (isApproved: boolean) => {
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/vms/CheckExtendRequest/admin`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        isApproved,
        id: vmData.id,
      }),
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        toast.success("Success!");
        router.reload();
        console.log(data.data);
      })
      .catch((e) => {
        toast.error("Something went wrong");
        console.log("ERROR:failed to SetRequestSeen! ", e.message);
      });
  };

  const handleFetchVmData = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/vms/${request.vmId}/GetVMById`, {
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
  const stringToLocaleString = (date) => {
    const a = new Date(date);
    return a.toLocaleString();
  };

  useEffect(() => {
    handleFetchVmData();
  }, [request.vmId]);

  return (
    <div>
      <div className="p-4">
        <div className="flex flex-row-reverse justify-between items-center">
          <div className={" font-bold " + " "}>{request.description}</div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col text-left space-y-4 mb-4 p-2">
            <div>
              {vmData.creator.firstName}
              {" " + vmData.creator.lastName}
            </div>
            <Link href={"/admin/hosts/" + vmData.hostDto.id}>
              <div className="rounded bg-slate-700 w-fit p-1 text-white cursor-pointer">
                {vmData.hostDto.name}
              </div>
            </Link>
            <Link href={"/admin/vms/" + vmData.id}>
              <div className="rounded bg-slate-700 w-fit p-1 text-white cursor-pointer">
                {vmData.vmName}
              </div>
            </Link>
            <div>{stringToLocaleString(vmData.endPriodDateTime)}</div>
            <div>{request.extraPeriod}</div>
            <div>{vmData.serverNameIdentifier}</div>
          </div>
          <div className="flex flex-col text-right space-y-4 mb-4 p-2">
            <div>{"نام متقاضی"}</div>
            <div>{"شناسه هاست"}</div>
            <div>{"شناسه ماشین مجازی"}</div>
            <div>{"تاریخ اتمام سرویس"}</div>
            <div>{"روزهای درخواستی"}</div>
            <div>{"شناسه سمت سرور"}</div>
          </div>
        </div>
        <div>
          <button
            className=" focus:outline-none cursor-pointer rounded bg-green-500 font-bold mx-2 py-1 text-white  px-4"
            onClick={() => handleAcceptOrDecline(true)}
          >
            تایید
          </button>
          <button
            className=" focus:outline-none cursor-pointer rounded bg-red-600 font-bold mx-2 py-1 text-white px-4"
            onClick={() => handleAcceptOrDecline(false)}
          >
            رد درخواست
          </button>
        </div>
      </div>
    </div>
  );
}
