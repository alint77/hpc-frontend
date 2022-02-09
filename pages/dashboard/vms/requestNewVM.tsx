import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";
import PlanCard from "../../../components/Plans/planCard";

interface Plan {
  id: string;
  isActive: boolean;
  memory: number;
  name: string;
  os: string;
  period: number;
  price: number;
  processorCores: number;
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

  const [plansList, setPlansList] = useState<Array<Plan>>([]);

  const handleFetchPlansList = async () => {
    try {
      const res = await fetch(
        `${API_URL}/plans/GetAllPlans?pageSize=50&pageNumber=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        setPlansList(data.data);
      } else {
        console.log(data);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestVM = async () => {
    if (!selectedPlanId) toast.error("Please Select a Plan");
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
  }, []);

  return (
    <div>
      select:
      {plansList.map((v) => (
        <div key={v.id} className="" onClick={() => setSelectedPlanId(v.id)}>
          <PlanCard
            className={selectedPlanId == v.id ? "bg-green-100" : ""}
            plan={v}
            key={v.id}
          ></PlanCard>
        </div>
      ))}
      <div
        className=" w-fit bg-gray-200  cursor-pointer"
        onClick={handleRequestVM}
      >
        Request
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
