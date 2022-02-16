import { useContext, useState } from "react";
import AuthContext from "../../../context/authContext";
import { API_URL, OS } from "../../../config/config";
import Modal from "../../Modal/Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface Image {
  id: string;
  isActive: boolean;
  osName: string;
  osVersion: number;
  softWare: string;
}

interface Prop {
  image: Image;
}

export default function ImageCard({ image }: Prop) {
  const [openEditImageModal, setOpenEditImageModal] = useState(false);
  const { isLoading, setisLoading, isAccessTokenValid, refreshAccessToken } =
    useContext(AuthContext);
  const router = useRouter();

  const handleChangeImageState = async () => {
    if (!confirm("Change isActive to " + (!image.isActive).toString())) return;

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(
      `${API_URL}/images/ChangeImageState/${image.id}/admin`,
      {
        method: "PATCH",
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
        toast.success("success");
        router.reload();
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
    <div>
      <div className="flex flex-col border-black border-[1px] m-2 p-4">
        <div>
          <div>osName: {image.osName}</div>
          <div>osVersion: {image.osVersion}</div>
          <div>software: {image.softWare}</div>
          <div>isActive: {image.isActive.toString()}</div>
        </div>
        <div className="flex flex-row justify-evenly">
          <div
            onClick={handleChangeImageState}
            className=" bg-gray-200 mt-4 text-sm p-1 cursor-pointer"
          >
            {image.isActive ? "Disable" : "Enable"}
          </div>
        </div>
      </div>
    </div>
  );
}
