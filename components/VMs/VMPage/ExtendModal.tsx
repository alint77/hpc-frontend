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
  vmPrice: number;
}

export default function ExtendModal({
  isOpen,
  setIsOpen,
  title,
  vmId,
  vmPrice,
  children,
}: Prop) {
  const [id, setId] = useState(vmId);
  const [price, setPrice] = useState(vmPrice);
  const router = useRouter();
  const { setisLoading, isAccessTokenValid, refreshAccessToken } =
    useContext(AuthContext);
  const [input, setInput] = useState({
    extraPeriod: 1,
    description: "",
  });

  useEffect(() => {
    setId(vmId);
    setPrice(vmPrice);
  }, [vmId]);

  const handleRequestExtend = async () => {
    if (!confirm("Are you sure?")) return;

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/vms/RequestForExtendingVM/${id}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(input),
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        console.log(data);
        toast.success("Message Sent!");
        setTimeout(() => router.reload(), 200);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:", e.message);
      });
  };

  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
        <div className="p-4 flex flex-row items-center justify-between">
          <label htmlFor="extraPeriod">Days (1-30):</label>
          <input
            className=" flex shadow appearance-none border rounded w-fit px-4 py-2 leading-tight focus:outline-none "
            type="number"
            name="extraPeriod"
            id="extraPeriod"
            min={1}
            max={30}
            value={input.extraPeriod}
            onChange={(e) =>
              setInput({ ...input, extraPeriod: parseInt(e.target.value) })
            }
            required
          />
          <div className="text-center">{price*input.extraPeriod*24}</div>
        </div>
        <div className="flex flex-row-reverse items-center border-t-2 h-12">
          <div
            className="mr-5 px-2 py-1 bg-green-400 text-white rounded font-semibold text-sm cursor-pointer"
            onClick={() => handleRequestExtend()}
          >
            Send
          </div>
        </div>
      </Modal>
    </div>
  );
}
