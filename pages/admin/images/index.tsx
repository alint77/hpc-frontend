import { useEffect, useState, useContext } from "react";
import AuthContext from "../../../context/authContext";
import { API_URL } from "../../../config/config";
import Link from "next/link";
import ImageCard from "../../../components/Admin/Images/ImageCard";
import AddImageModal from "../../../components/Admin/Images/AddImageModal";

interface Image {
  id: string;
  isActive: boolean;
  osName: string;
  osVersion: number;
  softWare: string;
}

export default function Index() {
  const {
    user,
    isLoading,
    setisLoading,
    isAccessTokenValid,
    refreshAccessToken,
  } = useContext(AuthContext);
  const [imagesList, setImagesList] = useState<Array<Image>>([]);
  const [showAddImageModal, setShowAddImageModal] = useState(false);

  const handleFetchImagesList = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/images/GetAllImagesAdmin/admin`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        console.log(data.data);
        setImagesList(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        setisLoading(false);
        console.log("ERROR:failed to fetch usersList! ", e.message);
      });
  };

  useEffect(() => {
    handleFetchImagesList();
  }, []);

  if (!user || user.role == "USER") return <>Access Denied!</>;
  return (
    <>
      <div className="">
        <div
          className="bg-gray-200 text-center w-20 m-auto cursor-pointer"
          onClick={() => setShowAddImageModal(true)}
        >
          Add Image
        </div>
        <div className="flex flex-row justify-evenly">
          {imagesList.map((v) => (
            <ImageCard image={v} key={v.id}></ImageCard>
          ))}
        </div>
      </div>
      <AddImageModal
        isOpen={showAddImageModal}
        setIsOpen={setShowAddImageModal}
        title="Create New Image"
      ></AddImageModal>
    </>
  );
}
