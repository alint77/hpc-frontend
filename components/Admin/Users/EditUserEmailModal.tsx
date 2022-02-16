import React, { useContext, useEffect, useState } from "react";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";
import { toast } from "react-toastify";
import Modal from "../../Modal/Modal";
import Router, { useRouter } from "next/router";

interface Prop {
  isOpen: boolean;
  setIsOpen: Function;
  title: any;
  children?: any;
  user: any;
}
export default function EditUserEmailModal({
  isOpen,
  setIsOpen,
  title,
  children,
  user,
}: Prop) {
  const router = useRouter();
  const { setisLoading, isAccessTokenValid, refreshAccessToken } =
    useContext(AuthContext);
  const [emailInput, setEmailInput] = useState(user.email);
  useEffect(() => {
    setEmailInput(user.email);
  }, [user]);

  const handleEditUserEmail = async () => {
    if (!confirm("Are you sure?")) return;

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(
      `${API_URL}/users/UpdateUserEmail/${user.id}/admin`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({ email: emailInput }),
      }
    )
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        toast.success("success");
        console.log(data);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        router.reload();
        console.log("ERROR:", e.message);
      });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="p-4 flex flex-col">
        <label htmlFor="email">Email :</label>
        <input
          className=" flex shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none "
          type="email"
          name="email"
          id="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
      </div>
      <div className="flex flex-row-reverse items-center border-t-2 h-12">
        <div
          className="mr-5 px-2 py-1 bg-green-400 text-white rounded font-semibold text-sm cursor-pointer"
          onClick={() => handleEditUserEmail()}
        >
          Save
        </div>
      </div>
    </Modal>
  );
}
