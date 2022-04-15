import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";
import Modal from "../../Modal/Modal";

export default function EditSettinsModal({
  settings,
  isOpen,
  setIsOpen,
  title,
}) {
  const {
    user,
    isLoading,
    logout,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const [inputFields, setInputFields] = useState({
    id: "",
    name: "",
    extensionDaysLimit: NaN,
    studentDiscountPercent: NaN,
    shutDownVMDiscountPercent: NaN,
    notifyViaEmail: false,
    notifyViaSMS: false,
    notifyViaSystemMessage: false,
    extraCorePrice: NaN,
    extraMemoryPrice: NaN,
    extraDiskPrice: NaN,
    gpuPrice: NaN,
  });

  const handleEditSettings = async () => {
    if (JSON.stringify(inputFields) === JSON.stringify(settings))
      return toast.error("No Change!");
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/root/UpdateSiteSettings/admin`, {
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

  const router = useRouter();
  useEffect(() => {
    setInputFields({ ...settings });
  }, [settings]);

  const handleChangeInputs = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="p-4">
        <div className=" mb-5 flex flex-col space-y-2 ">
          <label htmlFor="extensionDaysLimit">extensionDaysLimit:</label>
          <input
            onChange={handleChangeInputs}
            className="border-2 text-sm mb-2"
            required
            name="extensionDaysLimit"
            type="number"
            value={inputFields.extensionDaysLimit}
          />
          <label htmlFor="extraCorePrice">extraCorePrice:</label>
          <input
            onChange={handleChangeInputs}
            className="border-2 text-sm mb-2"
            required
            name="extraCorePrice"
            type="number"
            value={inputFields.extraCorePrice}
          />
          <label htmlFor="extraMemoryPrice">extraMemoryPrice:</label>
          <input
            onChange={handleChangeInputs}
            className="border-2 text-sm mb-2"
            required
            name="extraMemoryPrice"
            type="number"
            value={inputFields.extraMemoryPrice}
          />
          <label htmlFor="extraDiskPrice">extraDiskPrice:</label>
          <input
            onChange={handleChangeInputs}
            className="border-2 text-sm mb-2"
            required
            name="extraDiskPrice"
            type="number"
            value={inputFields.extraDiskPrice}
          />
          <label htmlFor="gpuPrice">gpuPrice:</label>
          <input
            onChange={handleChangeInputs}
            className="border-2 text-sm mb-2"
            required
            name="gpuPrice"
            type="number"
            value={inputFields.gpuPrice}
          />
          <label htmlFor="studentDiscountPercent">
            studentDiscountPercent:
          </label>
          <input
            max={100}
            min={0}
            onChange={handleChangeInputs}
            className="border-2 text-sm mb-2"
            required
            name="studentDiscountPercent"
            type="number"
            value={inputFields.studentDiscountPercent}
          />
          <label htmlFor="shutDownVMDiscountPercent">
            shutDownVMDiscountPercent:
          </label>
          <input
            onChange={handleChangeInputs}
            className="border-2 text-sm mb-2"
            required
            name="shutDownVMDiscountPercent"
            type="number"
            value={inputFields.shutDownVMDiscountPercent}
          />
          <label htmlFor="notifyViaEmail">notifyViaEmail:</label>
          <input
            className="border-2 text-sm mb-2"
            required
            name="notifyViaEmail"
            checked={inputFields.notifyViaEmail}
            type="checkbox"
            onChange={(e) =>
              setInputFields({
                ...inputFields,
                notifyViaEmail: e.target.checked,
              })
            }
          />
          <label htmlFor="notifyViaSMS">notifyViaSMS:</label>
          <input
            className="border-2 text-sm mb-2"
            required
            name="notifyViaSMS"
            checked={inputFields.notifyViaSMS}
            type="checkbox"
            onChange={(e) =>
              setInputFields({
                ...inputFields,
                notifyViaSMS: e.target.checked,
              })
            }
          />
          <label htmlFor="notifyViaSystemMessage">
            notifyViaSystemMessage:
          </label>
          <input
            className="border-2 text-sm mb-2"
            required
            checked={inputFields.notifyViaSystemMessage}
            name="notifyViaSystemMessage"
            type="checkbox"
            onChange={(e) =>
              setInputFields({
                ...inputFields,
                notifyViaSystemMessage: e.target.checked,
              })
            }
          />
        </div>
      </div>
      <div className="flex flex-row-reverse items-center border-t-2 h-12">
        <div
          className="mr-5 px-2 py-1 bg-green-400 text-white rounded font-semibold text-sm cursor-pointer"
          onClick={() => handleEditSettings()}
        >
          Save
        </div>
      </div>
    </Modal>
  );
}
