import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";
import PlanCard from "../../../components/Plans/planCard";
import Router from "next/router";
import ImageCard from "../../../components/VMs/RequestNewVM/ImageCard";
import UserLayout from "../../../components/UserDashboardLayout";
import { json } from "stream/consumers";

interface Plan {
  id: string;
  isActive: boolean;
  memory: number;
  name: string;
  price: number;
  processorCores: number;
  diskSize: number;
}
interface Image {
  id: string;
  isActive: boolean;
  osName: string;
  osVersion: number;
  softWare: string;
}
interface Upgrade {
  extraCores?: number;
  extraMemory?: number;
  extraDisk?: number;
}
interface VMrequest {
  planId: string;
  vmName: string;
  imageId: string;
  description?: string;
  period: number;
  isCustom: boolean;
  upgrade?: Upgrade;
}

export default function RequestNewVM() {
  const {
    user,
    isLoading,
    setisLoading,
    isAccessTokenValid,
    refreshAccessToken,
  } = useContext(AuthContext);

  const [isCustom, setIsCustom] = useState(false);
  const [upgradeInputs, setUpgradeInputs] = useState<Upgrade>({
    extraCores: 0,
    extraDisk: 0,
    extraMemory: 0,
  });

  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [prices, setPrices] = useState({
    extraCorePrice: 800,
    extraDiskPrice: 100,
    extraMemoryPrice: 400,
    gpuPrice: 50000,
    shutDownVMDiscountPercent: 33,
    studentDiscountPercent: 5,
  });

  const [vmName, setVmName] = useState("");
  const [period, setPeriod] = useState(0);

  const [plansList, setPlansList] = useState<Array<Plan>>([]);
  const [imagesList, setImagesList] = useState<Array<Image>>([]);

  const handleFetchPrices = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    await fetch(`${API_URL}/root/GetPrices`, {
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
        setPrices(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        setisLoading(false);
        console.log("ERROR:failed to fetch! ", e.message);
      });
  };

  const handleFetchImagesList = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    await fetch(`${API_URL}/images/GetAllImages`, {
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
        setImagesList(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        setisLoading(false);
        console.log("ERROR:failed to fetch! ", e.message);
      });
    await fetch(`${API_URL}/plans/GetAllPlans?pageSize=50&pageNumber=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
        setPlansList(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        setisLoading(false);
        console.log("ERROR:failed to fetch! ", e.message);
      });
  };

  const handleRequestVM = async () => {
    if (!selectedPlanId) return toast.error("Please Select a Plan");
    if (!selectedImageId) return toast.error("Please Select an Image");
    if (vmName.length < 4) return toast.error("Please Enter a Name");
    if (period < 3) return toast.error("Minimum Duration is 3 days");
    if (period > 15) return toast.error("Maximum Duration is 15 days");

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    toast.loading("please wait...", { toastId: "1" });

    const res = await fetch(`${API_URL}/vms/RequestForCreatingVM`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        planId: selectedPlanId,
        vmName,
        imageId: selectedImageId,
        description: "sth",
        period,
        isCustom,
        upgrade: upgradeInputs,
      }),
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        toast.dismiss("1");
        toast.success("success!");
        console.log(data);
        setisLoading(false);
        Router.push("/dashboard/vms");
      })
      .catch((e) => {
        toast.dismiss("1");
        setisLoading(false);
        console.log("ERROR:failed to fetch! ", e.message);
        toast.error(e.message);
      });
  };

  useEffect(() => {
    handleFetchImagesList();
    handleFetchPrices();
  }, []);

  const handleChangeUpgradeInput = (e) => {
    setUpgradeInputs({ ...upgradeInputs, [e.target.id]: e.target.value });
  };

  const calcTotalPrice = () => {
    let price = plansList.find((e) => e.id == selectedPlanId).price;
    return (price +=
      (upgradeInputs.extraCores * prices.extraCorePrice +
      upgradeInputs.extraDisk * prices.extraDiskPrice +
      upgradeInputs.extraMemory * prices.extraMemoryPrice));
  };

  return (
    <div className="text-right flex flex-col bg-stone-200 rounded shadow-md py-6 px-4">
      <div className="py-4 text-center">:انتخاب طرح</div>
      <div className="flex justify-center shadow-inner border-2 rounded ">
            <div className="flex flex-row overflow-x-auto">        {plansList.map((v) => (
          <div
            key={v.id}
            onClick={() => setSelectedPlanId(v.id)}
          >
            <PlanCard className="w-44" lineThrough={isCustom &&selectedPlanId == v.id} selected={selectedPlanId == v.id} plan={v}></PlanCard>
          </div>
        ))}
        </div>
      </div>
      {selectedPlanId && (
        <div className="text-center">
          <button
            className=" focus:outline-none shadow-md m-auto bg-slate-700 text-xs text-white p-2 mt-3 w-fit rounded cursor-pointer"
            onClick={() => setIsCustom(!isCustom)}
          >
            منابع بیشتر
          </button>
          <div>
            {isCustom && (
              <div className="text-xs flex flex-col items-center mt-4 border-2 border-slate-700 p-2 rounded w-fit m-auto">
                <div className="">
                  <div className="flex flex-row-reverse border-b-2 border-slate-700 items-center">
                    <label className="w-36 text-right" htmlFor="extraCores">
                      هسته پردازشی
                    </label>
                    <input
                      onChange={handleChangeUpgradeInput}
                      value={upgradeInputs.extraCores}
                      id="extraCores"
                      type="number"
                      min={0}
                      max={32}
                      className="p-1 w-16 my-2 rounded"
                    />
                  </div>
                  <div className="flex flex-row-reverse border-b-2 border-slate-700 items-center">
                    <label className="w-36 text-right" htmlFor="extraMemory">
                      رم{" "}
                    </label>
                    <input
                      onChange={handleChangeUpgradeInput}
                      value={upgradeInputs.extraMemory}
                      id="extraMemory"
                      type="number"
                      min={0}
                      max={64}
                      className="p-1 w-16 my-2 rounded"
                    />
                  </div>
                  <div className="flex flex-row-reverse border-b-2 border-slate-700 items-center">
                    <label className="w-36 text-right" htmlFor="extraDisk">
                      هارد
                    </label>
                    <input
                      onChange={handleChangeUpgradeInput}
                      value={upgradeInputs.extraDisk}
                      id="extraDisk"
                      type="number"
                      min={0}
                      max={1024}
                      className="p-1 w-16 my-2 rounded"
                    />
                  </div>
                </div>
                <div className="mt-2 text-base">
                  <span>قیمت </span>
                  <span>{calcTotalPrice().toLocaleString()}</span>{" "}
                  <span>تومان </span>

                </div>
              </div>
            )}
          </div>
          <div className="text-center py-4">:انتخاب سیستم عامل</div>
          <div className="flex justify-center shadow-inner border-2 rounded ">
            <div className="flex flex-row overflow-x-auto">
              {imagesList.map((v) => (
                <div
                className=""
                  key={v.id}
                  onClick={() => setSelectedImageId(v.id)}
                >
                  <ImageCard
                    className="w-44"
                    selected={selectedImageId == v.id}
                    image={v}
                  ></ImageCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {selectedImageId && selectedPlanId && (
        <div className="">
          <div className="flex flex-col space-y-4 items-center m-auto mt-4">
            <div className="flex flex-row-reverse">
              <label
                className="w-44 text-sm border-b-2 border-slate-700 p-1"
                htmlFor="vmName"
              >
                :شناسه سرویس
              </label>
              <input
                required
                onChange={(e) => setVmName(e.target.value)}
                value={vmName}
                id="vmName"
                name="vmName"
                type="text"
                minLength={4}
                maxLength={12}
                className="w-36 rounded border-slate-700 border-2 focus:outline-none px-1"
                placeholder="4-12 characters"
              />
            </div>
            <div className="flex flex-row-reverse">
              <label
                className="w-44 text-sm border-b-2 border-slate-700 p-1"
                htmlFor="period"
              >
                :مدت زمان سرویس
              </label>
              <input
                required
                onChange={(e) => setPeriod(parseInt(e.target.value))}
                value={period}
                id="period"
                name="period"
                type="number"
                min={3}
                max={15}
                className="w-36 rounded border-slate-700 border-2 focus:outline-none px-1"
                placeholder="3-15 days"
              />
            </div>
          </div>
          {vmName.length > 3 && period > 2 && (
            <div className="text-center">
              <div className=" pt-6">
                <span>قیمت نهایی : </span>
                <span>{(calcTotalPrice()*period*24).toLocaleString()}</span>
                <span>تومان</span>
              </div>
              <div>
                ({user.isSudent?"تعرفه شما: دانشحویی":"تعرفه شما: آزاد"})
              </div>
              <div
                className=" w-fit bg-slate-700 text-white mt-4 m-auto rounded p-2 text-sm  cursor-pointer"
                onClick={handleRequestVM}
              >
                ثبت درخواست
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
  
}
RequestNewVM.Layout = UserLayout;

