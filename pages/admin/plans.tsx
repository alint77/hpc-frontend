import {
  useMemo,
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
} from "react";
import AuthContext from "../../context/authContext";
import Table from "../../components/Admin/Users/Table";
import { API_URL } from "../../config/config";
import Link from "next/link";
import PlanCard from "../../components/Admin/Users/Plans/PlanCard";
import AddPlanModal from "../../components/Admin/Users/Plans/AddPlanModal";

export default function Plans() {
  const {
    user,
    isLoading,
    setisLoading,
    isAccessTokenValid,
    refreshAccessToken,
  } = useContext(AuthContext);
  const [plansList, setPlansList] = useState<Array<any>>([]);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);

  if (!user || user.role == "USER") return <>Access Denied!</>;

  const handleFetchUsersList = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(
      `${API_URL}/plans/GetAllPlans?PageNumber=1&PageSize=100`,
      {
        method: "GET",
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
        console.log(data.data);
        setPlansList(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        setisLoading(false);
        console.log("ERROR:failed to fetch usersList! ", e.message);
      });
  };

  useLayoutEffect(() => {
    handleFetchUsersList();
  }, []);

  return (
    <>
      <div className="">
        <div
          className="bg-gray-200 text-center w-20 m-auto"
          onClick={() => setShowAddPlanModal(true)}
        >
          Add Plan
        </div>
        <div className="flex flex-row justify-evenly">
          {plansList.map((v) => (
            <PlanCard plan={v} key={v.id}></PlanCard>
          ))}
        </div>
      </div>
      <AddPlanModal isOpen={showAddPlanModal} setIsOpen={setShowAddPlanModal} title="Create New Plan" ></AddPlanModal>
    </>
  );
}
