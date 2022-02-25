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

export default function ChangePassModal({
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
    oldPassword: "",
    newPassword: "",
    passwordConfirmation: "",
  });
  const [showHideBtns, setShowHideBtns] = useState({
    oldPassword: false,
    newPassword: false,
    passwordConfirmation: false,
  });
  const handleChangePassword = async () => {

    if(inputFields.newPassword!==inputFields.passwordConfirmation) return toast.error("New Passwords Don't Match")

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/users/ChangePassword`, {
      method: "PATCH",
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
        logout()
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:", e.message);
      });
  };

  const handleChangeInputs = (e) => {
    setInputFields({ ...inputFields, [e.target.id]: e.target.value });
  };
  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
        <div className="p-4">
          <div className=" mb-5">
            <label
              className="block text-gray-700 text-sm my-2"
              htmlFor="oldPassword"
            >
              Old Password :
            </label>
            <div className="relative border-2 flex flex-row ">
              <input
                onChange={handleChangeInputs}
                value={inputFields.oldPassword}
                className=" flex shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none "
                id="oldPassword"
                type={showHideBtns.oldPassword ? "text" : "password"}
                placeholder="**********"
              />

              <div
                onClick={() =>
                  setShowHideBtns({
                    ...showHideBtns,
                    oldPassword: !showHideBtns.oldPassword,
                  })
                }
                className="absolute right-2 h-full flex items-center"
              >
                {showHideBtns.oldPassword ? "hide" : "show"}
              </div>
            </div>
          </div>
          <div className=" mb-5">
            <label
              className="block text-gray-700 text-sm my-2"
              htmlFor="newPassword"
            >
              New Password :
            </label>
            <div className="relative border-2 flex flex-row ">
              <input
                onChange={handleChangeInputs}
                value={inputFields.newPassword}
                className=" flex shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none "
                id="newPassword"
                type={showHideBtns.newPassword ? "text" : "password"}
                placeholder="**********"
              />

              <div
                onClick={() =>
                  setShowHideBtns({
                    ...showHideBtns,
                    newPassword: !showHideBtns.newPassword,
                  })
                }
                className="absolute right-2 h-full flex items-center"
              >
                {showHideBtns.newPassword ? "hide" : "show"}
              </div>
            </div>
          </div>

          <div className=" mb-5">
            <label
              className="block text-gray-700 text-sm my-2"
              htmlFor="passwordConfirmation"
            >
              Confirm New Password :
            </label>
            <div className="relative border-2 flex flex-row ">
              <input
                onChange={handleChangeInputs}
                value={inputFields.passwordConfirmation}
                className=" flex shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none "
                id="passwordConfirmation"
                type={showHideBtns.passwordConfirmation ? "text" : "password"}
                placeholder="**********"
              />

              <div
                onClick={() =>
                  setShowHideBtns({
                    ...showHideBtns,
                    passwordConfirmation: !showHideBtns.passwordConfirmation,
                  })
                }
                className="absolute right-2 h-full flex items-center"
              >
                {showHideBtns.passwordConfirmation ? "hide" : "show"}
              </div>
            </div>
          </div>

          

          
        </div>
        <div className="flex flex-row items-center border-t-2 h-12">
          <div
            className="mx-5 px-2 py-1 bg-green-400 text-white rounded font-semibold text-sm cursor-pointer"
            onClick={() => handleChangePassword()}
          >
            ذخیره
          </div>
        </div>
      </Modal>
    </div>
  );
}
