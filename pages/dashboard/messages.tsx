import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/authContext";
import { API_URL } from "../../config/config";

import Link from "next/link";
import { toast } from "react-toastify";
import MessageCard from "../../components/Messages/MessageCard";

interface Message {
  context: string;
  createDateTime: string;
  id: string;
  isSeen: boolean;
  title: string;
  userId: string;
}

export default function Messages() {
  useEffect(() => {
    handleFetchMessages();
  }, []);
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);
  const [messagesList, setMessagesList] = useState([]);
  const handleFetchMessages = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/messages/GetAllMessageOfUser`, {
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
        setMessagesList(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        toast.error("Failed to fetch messages");
        setisLoading(false);
        console.log("ERROR:failed to fetch! ", e.message);
      });
  };
  return (
    <div>
      {messagesList
        ? messagesList.map((v) => (
            <div
              className="mb-6 border-2 bg-gray-100 rounded shadow"
              key={v.id}
            >
              <MessageCard message={v} ></MessageCard>
            </div>
          ))
        : "No Message"}
    </div>
  );
}
