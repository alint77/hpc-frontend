import { useRouter } from "next/router";
import { useContext, useState, useLayoutEffect, useEffect } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";

export default function Host() {
  const {
    user,
    isLoading,
    setisLoading,
    isAccessTokenValid,
    refreshAccessToken,
  } = useContext(AuthContext);
  const [host, setHost] = useState({
    id: "",
    name: "",
    deviceName: "",
    totalMemory: NaN,
    freeMemory: NaN,
    totalProcessorCores: NaN,
    freeProcessorCores: NaN,
    totalDiskSize: NaN,
    freeDiskSize: NaN,
    hostState: "",
    createDateTime: "",
    isAvailable: false,
    temp:NaN,
    stat:NaN
  });

  const router = useRouter();
  useEffect(() => {
    if (router.query.id) {
      handleFetchHost();
    }
  }, [router.query.id]);

  const handleFetchHost = async () => {
    const { id } = router.query;

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/hosts/${id}/GetHostById/admin`, {
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
        setHost(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        setisLoading(false);
        console.log("ERROR:failed to fetch host! ", e.message);
      });
  };

  const handleChangeHostAvailability = async () => {
    const { id } = router.query;

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(
      `${API_URL}/hosts/${id}/ChangeHostAvailability/admin`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      }
    )
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
        console.log("ERROR:failed to change availability", e.message);
      });
  };

  return (
    <div className="flex flex-col space-y-4 p-4">

      <div className="">
        <div className="rounded bg-stone-200 shadow-md p-4 max-w-2xl m-auto w-full">
          <div>
            <div className=" flex flex-row justify-between my-4 px-6 py-1">
              <div>Name</div>
              <div className="">{host.name}</div>
            </div>
            <div className=" flex flex-row justify-between my-4 px-6 py-1">
              <div>Device Name</div>
              <div className="">{host.deviceName}</div>
            </div>
            <div className=" flex flex-row justify-between my-4 px-6 py-1">
              <div>Status</div>
              <div className="">{host.hostState}</div>
            </div>
            <div className=" flex flex-row justify-between my-4 px-6 py-1">
              <div>Availability : </div>
              <div className="">{host.isAvailable.toString().toUpperCase()}</div>
            </div>
            <div className=" flex flex-row justify-between my-4 px-6 py-1">
              <div>Create Date</div>
              <div className="">
                {new Date(host.createDateTime).toLocaleString()}
              </div>
            </div>

            <div className=" flex flex-row justify-between my-4 px-6">
              <div></div>
            </div>
          </div>
          <div className="border-2 text-stone-200 bg-slate-700  p-4 text-left rounded shadow">
            <div className="">Total CPU Cores : {host.totalProcessorCores}</div>
            <div className="">Available CPU Cores : {host.freeProcessorCores}</div>
            <br />
            <div className="">Total RAM : {host.totalMemory}GB</div>
            <div className="">Available RAM : {host.freeMemory}GB</div>
            <br />
            <div className="">Total Storage : {host.totalDiskSize}GB</div>
            <div className="">Available Storage : {host.freeDiskSize}GB</div>
            <br />
            <div className="">Temp : {host.temp}</div>
            <div className="">Stat : {host.stat}</div>
          </div>
        </div>
      </div>
      <div className="max-w-2xl w-full m-auto">
        <button
          onClick={handleChangeHostAvailability}
          className="p-2 rounded bg-slate-700 text-white text-sm w-fit"
        >
          Change Availability
        </button>
      </div>
    </div>
  );
}
