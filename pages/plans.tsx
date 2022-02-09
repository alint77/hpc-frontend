import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { API_URL } from "../config/config";
import AuthContext from "../context/authContext";
import PlanCard from "../components/Plans/planCard";

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

export default function plans() {
  const { user, isLoading, setisLoading } = useContext(AuthContext);
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

  useEffect(() => {
    handleFetchPlansList();
  }, []);

  return (
    <div>
      {plansList.map((v) => (
        <PlanCard plan={v} key={v.id}></PlanCard>
      ))}
      <ToastContainer></ToastContainer>
    </div>
  );
}
