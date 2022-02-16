import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { API_URL, OS } from "../../../config/config";
import AuthContext from "../../../context/authContext";
import Modal from "../../Modal/Modal";

import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

interface Prop {
  isOpen: boolean;
  setIsOpen: Function;
  title: any;
  children?: any;
  plan: any;
}

interface Plan {
  id: string;
  name: string;
  isActive: boolean;
  diskSize: number;
  memory: number;
  price: number;
  processorCores: number;
}

export default function EditPlanModal({
  isOpen,
  setIsOpen,
  title,
  plan,
  children,
}: Prop) {
  const { isLoading, setisLoading, isAccessTokenValid, refreshAccessToken } =
    useContext(AuthContext);

  const router = useRouter();

  const { id, ...omitedId } = plan;

  const [editedPlan, setEditedPlan] = useState<Plan>(omitedId);

  const handleEditPlan = async () => {
    toast.loading("loading...", { toastId: "1" });

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }

    const res = await fetch(`${API_URL}/plans/${plan.id}/UpdatePlan/admin`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("access"),
      },
      body: JSON.stringify(editedPlan),
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        toast.dismiss("1");
        console.log(data.message);
        setisLoading(false);
        toast.success("Success");
        router.reload();
      })
      .catch((e) => {
        console.log(e);
        setisLoading(false);
        toast.dismiss("1");
        toast.error(e.message);
      });
  };

  const handleChange = (e) => {
    setEditedPlan({ ...editedPlan, [e.target.name]: e.target.value });
  };

  const handleChangePlanState = async () => {
    toast.loading("loading...", { toastId: "1" });

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }

    console.log(editedPlan);

    const res = await fetch(
      `${API_URL}/plans/${plan.id}/ChangePlanState/admin`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("access"),
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
        toast.dismiss("1");
        console.log(data.message);
        setisLoading(false);
        toast.success(data.message);
        router.reload();
      })
      .catch((e) => {
        toast.dismiss("1");
        console.log(e);
        setisLoading(false);
        toast.error(e.message);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
        <div className="p-4">
          {/* TODO: Constraints */}
          <div className="flex flex-col">
            <label htmlFor="name">name:</label>
            <input
              onChange={handleChange}
              className="border-2 text-sm mb-2"
              required
              name="name"
              type="text"
              value={editedPlan.name}
            />
            <label htmlFor="price">price:</label>
            <input
              onChange={handleChange}
              className="border-2 text-sm mb-2"
              required
              name="price"
              type="number"
              value={editedPlan.price}
            />
            <label htmlFor="memory">memory:</label>
            <input
              onChange={handleChange}
              className="border-2 text-sm mb-2"
              required
              name="memory"
              type="number"
              value={editedPlan.memory}
            />
            <label htmlFor="processorCores">processorCores:</label>
            <input
              onChange={handleChange}
              className="border-2 text-sm mb-2"
              required
              name="processorCores"
              type="number"
              value={editedPlan.processorCores}
            />
            <label htmlFor="diskSize">diskSize:</label>
            <input
              onChange={handleChange}
              className="border-2 text-sm mb-2"
              required
              name="diskSize"
              type="number"
              value={editedPlan.diskSize}
            />
          </div>
        </div>
        <div className="flex flex-row-reverse items-center border-t-2 h-12">
          <div
            className="mr-5 px-2 py-1 bg-green-500 text-white rounded font-semibold text-sm cursor-pointer"
            onClick={() => handleEditPlan()}
          >
            Edit
          </div>
          {plan.isActive ? (
            <div
              className="mr-3 px-2 py-1 bg-red-500 text-white rounded font-semibold text-sm cursor-pointer"
              onClick={() => handleChangePlanState()}
            >
              Disable
            </div>
          ) : (
            <div
              className="mr-3 px-2 py-1 bg-yellow-500 text-white rounded font-semibold text-sm cursor-pointer"
              onClick={() => handleChangePlanState()}
            >
              Enable
            </div>
          )}
        </div>
      </Modal>
      <ToastContainer hideProgressBar></ToastContainer>
    </>
  );
}
