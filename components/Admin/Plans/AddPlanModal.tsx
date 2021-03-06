import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";
import Modal from "../../Modal/Modal";

import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

interface Prop {
  isOpen: boolean;
  setIsOpen: Function;
  title: any;
  children?: any;
}

interface InputPlan {
  name: string;
  isActive: boolean;
  diskSize: number;
  memory: number;
  price: number;
  processorCores: number;
}

export default function AddPlanModal({
  isOpen,
  setIsOpen,
  title,
  children,
}: Prop) {
  const { isLoading, setisLoading, isAccessTokenValid, refreshAccessToken } =
    useContext(AuthContext);

  const router = useRouter();

  const [inputPlan, setInputPlan] = useState<InputPlan>({
    isActive: false,
    memory: NaN,
    name: "",
    diskSize: NaN,
    price: NaN,
    processorCores: NaN,
  });

  const handleAddPlan = async () => {
    toast.loading("loading...", { toastId: "1" });

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }

    const res = await fetch(`${API_URL}/plans/Create/admin`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("access"),
      },
      body: JSON.stringify(inputPlan),
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
    setInputPlan({ ...inputPlan, isActive: false });

    setInputPlan({ ...inputPlan, [e.target.name]: e.target.value });
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
            />
            <label htmlFor="price">price:</label>
            <input
              onChange={(e) =>
                setInputPlan({ ...inputPlan, price: parseInt(e.target.value) })
              }
              className="border-2 text-sm mb-2"
              required
              name="price"
              type="number"
            />
            <label htmlFor="memory">memory:</label>
            <input
              onChange={(e) =>
                setInputPlan({ ...inputPlan, memory: parseInt(e.target.value) })
              }
              className="border-2 text-sm mb-2"
              required
              name="memory"
              type="number"
            />
            <label htmlFor="processorCores">processorCores:</label>
            <input
              onChange={(e) =>
                setInputPlan({
                  ...inputPlan,
                  processorCores: parseInt(e.target.value),
                })
              }
              className="border-2 text-sm mb-2"
              required
              name="processorCores"
              type="number"
            />
            <label htmlFor="diskSize">diskSize:</label>
            <input
              onChange={handleChange}
              className="border-2 text-sm mb-2"
              required
              name="diskSize"
              type="number"
            />

            <label htmlFor="isActive">isActive:</label>
            <input
              onChange={(e) =>
                setInputPlan({ ...inputPlan, isActive: e.target.checked })
              }
              className="border-2 text-sm mb-2"
              required
              name="isActive"
              type="checkbox"
            />
          </div>
        </div>
        <div className="flex flex-row-reverse items-center border-t-2 h-12">
          <div
            className="mr-5 px-2 py-1 bg-green-500 text-white rounded font-semibold text-sm cursor-pointer"
            onClick={() => handleAddPlan()}
          >
            Add
          </div>
        </div>
      </Modal>
    </>
  );
}
