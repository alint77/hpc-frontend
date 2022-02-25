import Modal from "../Modal/Modal";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import AuthContext from "../../context/authContext";
import { API_URL, RegistrationStatus } from "../../config/config";

import { ToastContainer, toast } from "react-toastify";

interface Prop {
  isOpen: boolean;
  setIsOpen: Function;
  title: any;
  children?: any;
}

interface User {
  unSeenMessagesCount: number;
  isStudent: boolean;
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  registrationState: string;
  phoneNumber: string;
  nationalId: number;
  createDateTime: string;
  lastLoginDateTime: string;
}

export default function EditUserModal({
  isOpen,
  setIsOpen,
  title,
  children,
}: Prop) {
  const {
    user,
    isLoading,
    logout,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const router = useRouter();

  const [inputFields, setInputFields] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
  });
  const handleEditUser = async () => {
    if (
      inputFields.firstName.length < 1 &&
      inputFields.lastName.length < 1 &&
      inputFields.phoneNumber.length < 11
    )
      setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/users/UpdateUserInfo`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(inputFields),
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        toast.success("success");
        console.log(data);
        router.reload();
      })
      .catch((e) => {
        setisLoading(false);
        toast.error(e.message);
        console.log("ERROR:", e.message);
      });
  };

  const handleChangeInputs = (e) => {
    setInputFields({ ...inputFields, [e.target.id]: e.target.value });
  };
  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
        <div className="p-4 text-right">
          <div className=" mb-5">
            <label
              className="block  text-sm my-2 px-1"
              htmlFor="firstName"
            >
              نام
            </label>
            <div className="relative border-2 flex flex-row ">
              <input
                onChange={handleChangeInputs}
                value={inputFields.firstName}
                className=" flex shadow appearance-none border rounded w-full py-2 px-4  leading-tight focus:outline-none "
                id="firstName"
                type={"text"}
              />
            </div>
          </div>
          <div className=" mb-5">
            <label
              className="block  text-sm my-2 px-1"
              htmlFor="lastName"
            >
              نام خانوادگی

            </label>
            <div className="relative border-2 flex flex-row ">
              <input
                onChange={handleChangeInputs}
                value={inputFields.lastName}
                className=" flex shadow appearance-none border rounded w-full py-2 px-4  leading-tight focus:outline-none "
                id="lastName"
                type={"text"}
              />
            </div>
          </div>

          <div className=" mb-5">
            <label
              className="block  text-sm my-2 px-1"
              htmlFor="phoneNumber"
            >
              شماره همراه
            </label>
            <div className="relative border-2 flex flex-row ">
              <input
                onChange={handleChangeInputs}
                value={inputFields.phoneNumber}
                pattern="[0]{1}[9]{1}[0-9]{9}"
                type="tel"
                minLength={11}
                maxLength={11}
                className=" flex shadow appearance-none border rounded w-full py-2 px-4  leading-tight focus:outline-none "
                id="phoneNumber"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center border-t-2 h-12">
          <div
            className="mx-5 px-2 py-1 bg-green-400 text-white rounded font-semibold text-sm cursor-pointer"
            onClick={() => handleEditUser()}
          >
            ذخیره
          </div>
        </div>
      </Modal>
    </div>
  );
}
