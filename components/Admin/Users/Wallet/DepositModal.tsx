import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../../../../config/config";
import AuthContext from "../../../../context/authContext";
import Modal from "../../../Modal/Modal";

export default function DepositModal({ isOpen, title, className, setIsOpen }) {
  const [input, setInput] = useState({
    amount: 0,
    description: "",
  });
  const router = useRouter();
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const handleDeposit = async () => {
    const { id } = router.query;
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(
      `${API_URL}/wallet/DepositUserBalance/${id}/admin`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify(input),
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
        router.reload()
      })
      .catch((e) => {
        setisLoading(false);
        toast.error(e.message);
        console.log("ERROR:failed to fetch userVMs", e.message);
      });
  };
  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
        <div className="p-4 flex flex-col items-center justify-between">
          <label htmlFor="amount">Amount</label>
          <input
            className=" flex shadow appearance-none border rounded w-fit px-4 py-2 leading-tight focus:outline-none "
            type="number"
            name="amount"
            id="amount"
            value={input.amount}
            onChange={(e) =>
              setInput({ ...input, amount: parseInt(e.target.value) })
            }
            required
          />
          <label htmlFor="description">description</label>
          <input
            className=" flex shadow appearance-none border rounded w-fit px-4 py-2 leading-tight focus:outline-none "
            type="text"
            name="description"
            id="description"
            value={input.description}
            onChange={(e) =>
              setInput({ ...input, description: e.target.value })
            }
            required
          />
        </div>
        <div className="flex flex-row-reverse items-center border-t-2 h-12">
          <div
            className="mr-5 px-2 py-1 bg-green-400 text-white rounded font-semibold text-sm cursor-pointer"
            onClick={() => handleDeposit()}
          >
            شارژ
          </div>
        </div>
      </Modal>
    </div>
  );
}
