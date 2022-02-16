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

interface InputImage {
  isActive: boolean;
  osName: string;
  osVersion: number;
  softWare: string;
}

export default function AddImageModal({
  isOpen,
  setIsOpen,
  title,
  children,
}: Prop) {
  const { isLoading, setisLoading, isAccessTokenValid, refreshAccessToken } =
    useContext(AuthContext);

  const router = useRouter();

  const [inputImage, setInputImage] = useState<InputImage>({
    isActive: false,
    osName: "",
    osVersion: NaN,
    softWare: "",
  });

  const handleAddImage = async () => {
    toast.loading("loading...", { toastId: "1" });

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }

    const res = await fetch(`${API_URL}/images/Create/admin`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("access"),
      },
      body: JSON.stringify(inputImage),
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
    setInputImage({ ...inputImage, isActive: false });

    setInputImage({ ...inputImage, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
        <div className="p-4">
          {/* TODO: Constraints */}
          <div className="flex flex-col">
            <label htmlFor="osName">osName:</label>
            <input
              onChange={handleChange}
              className="border-2 text-sm mb-2"
              required
              name="osName"
              type="text"
            />
            <label htmlFor="softWare">software:</label>
            <input
              onChange={handleChange}
              className="border-2 text-sm mb-2"
              name="softWare"
              type="text"
            />

            <label htmlFor="osVersion">osVersion:</label>
            <input
              onChange={handleChange}
              className="border-2 text-sm mb-2"
              required
              name="osVersion"
              type="number"
            />

            <label htmlFor="isActive">isActive:</label>
            <input
              onChange={(e) =>
                setInputImage({ ...inputImage, isActive: e.target.checked })
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
            onClick={() => handleAddImage()}
          >
            Add
          </div>
        </div>
      </Modal>
    </>
  );
}
