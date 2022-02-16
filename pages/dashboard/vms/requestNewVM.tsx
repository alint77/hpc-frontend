import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";
import PlanCard from "../../../components/Plans/planCard";
import Router from "next/router";
import ImageCard from "../../../components/VMs/RequestNewVM/ImageCard";

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

export default function RequestNewVM() {
  const {
    user,
    isLoading,
    setisLoading,
    isAccessTokenValid,
    refreshAccessToken,
  } = useContext(AuthContext);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const [vmName, setVmName] = useState("");
  const [period, setPeriod] = useState(0);

  const [plansList, setPlansList] = useState<Array<Plan>>([]);
  const [imagesList, setImagesList] = useState<Array<Image>>([]);

  const handleFetchImagesList = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/images/GetAllImages`, {
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
  };

  const handleFetchPlansList = async () => {
    const res = await fetch(
      `${API_URL}/plans/GetAllPlans?pageSize=50&pageNumber=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
    handleFetchPlansList();
    handleFetchImagesList();
  }, []);

  return (
    <div>
      Select Plan:
      {plansList.map((v) => (
        <div key={v.id} className="" onClick={() => setSelectedPlanId(v.id)}>
          <PlanCard
            className={selectedPlanId == v.id ? "bg-green-100" : ""}
            plan={v}
          ></PlanCard>
        </div>
      ))}
      {selectedPlanId && (
        <div>
          <div>Select Image :</div>
          {imagesList.map((v) => (
            <div key={v.id} onClick={() => setSelectedImageId(v.id)}>
              <ImageCard
                className={selectedImageId == v.id ? "bg-green-100" : ""}
                image={v}
              ></ImageCard>
            </div>
          ))}
        </div>
      )}
      {selectedImageId && selectedPlanId && (
        <div>
          <div className="flex flex-col">
            <label htmlFor="vmName">VM Name:</label>
            <input
              required
              onChange={(e) => setVmName(e.target.value)}
              value={vmName}
              id="vmName"
              name="vmName"
              type="text"
              minLength={4}
              maxLength={12}
            />
            <label htmlFor="period">VM Duration Days:</label>
            <input
              required
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              value={period}
              id="period"
              name="period"
              type="number"
              min={3}
              max={15}
            />
          </div>
        </div>
      )}
      <div
        className=" w-fit bg-gray-200  cursor-pointer"
        onClick={handleRequestVM}
      >
        Request
      </div>
    </div>
  );
}
