import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";
import Modal from "../../Modal/Modal";

interface Prop {
  isOpen: boolean;
  setIsOpen: Function;
  title: any;
  children?: any;
  vmId: string;
}

export default function UpgradeModal({
  isOpen,
  setIsOpen,
  title,
  vmId,
  children,
}: Prop) {
  const [id, setId] = useState(vmId);
  const router = useRouter();
  const { setisLoading, isAccessTokenValid, refreshAccessToken } =
    useContext(AuthContext);
  const [upgradeInputs, setUpgradeInputs] = useState({
    extraCores: 0,
    extraDisk: 0,
    extraMemory: 0,
  });
  const [prices, setPrices] = useState({
    extraCorePrice: 800,

    extraDiskPrice: 100,

    extraMemoryPrice: 400,

    gpuPrice: 50000,

    shutDownVMDiscountPercent: 33,

    studentDiscountPercent: 5,
  });

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

  useEffect(() => {
    setId(vmId);
  }, [vmId]);
  useEffect(() => {
    handleFetchPrices();
  }, []);

  const handleRequestUpgrade = async () => {
    if (!confirm("Are you sure?")) return;

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/vms/RequestForUpgradingVM/${id}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(upgradeInputs),
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        console.log(data);
        toast.success("Request Sent!");
        setTimeout(() => router.reload(), 500);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:", e.message);
      });
  };

  const handleChangeUpgradeInput = (e) => {
    setUpgradeInputs({ ...upgradeInputs, [e.target.id]: e.target.value });
  };

  const calcTotalPrice = () => {
    return (
      upgradeInputs.extraCores * prices.extraCorePrice +
      upgradeInputs.extraDisk * prices.extraDiskPrice +
      upgradeInputs.extraMemory * prices.extraMemoryPrice
    );
  };

  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
        <div className="p-4 flex flex-col">
          <div className="flex flex-row justify-between my-4 items-center">
            <label htmlFor="extraCore">Extra CPU Core:</label>
            <input
              onChange={handleChangeUpgradeInput}
              value={upgradeInputs.extraCores}
              id="extraCores"
              type="number"
              className=" flex shadow appearance-none border rounded w-min py-2 px-4 text-gray-700 leading-tight focus:outline-none "
              min={0}
            />
          </div>
          <div className="flex flex-row justify-between my-4 items-center">
            <label htmlFor="extraMemory">Extra Memory:</label>
            <input
              onChange={handleChangeUpgradeInput}
              value={upgradeInputs.extraMemory}
              id="extraMemory"
              type="number"
              className=" flex shadow appearance-none border rounded w-min py-2 px-4 text-gray-700 leading-tight focus:outline-none "
              min={0}
            />
          </div>
          <div className="flex flex-row justify-between my-4 items-center">
            <label htmlFor="extraDisk">Extra Disk:</label>
            <input
              onChange={handleChangeUpgradeInput}
              value={upgradeInputs.extraDisk}
              id="extraDisk"
              type="number"
              className=" flex shadow appearance-none border rounded w-min py-2 px-4 text-gray-700 leading-tight focus:outline-none "
              min={0}
            />
          </div>
        <div className="text-center">{calcTotalPrice()}</div>
        </div>
        <div className="flex flex-row-reverse items-center border-t-2 h-12">
          <div
            className="mr-5 px-2 py-1 bg-green-400 text-white rounded font-semibold text-sm cursor-pointer"
            onClick={() => handleRequestUpgrade()}
          >
            Send
          </div>
        </div>
      </Modal>
    </div>
  );
}
