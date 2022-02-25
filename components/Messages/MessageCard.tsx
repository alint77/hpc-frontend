import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../../config/config";
import AuthContext from "../../context/authContext";

interface Prop {
  message: Message;
  className?: string;
}

interface Message {
  context: string;
  createDateTime: string;
  id: string;
  isSeen: boolean;
  title: string;
  userId: string;
}
export default function MessageCard({ message, className }: Prop) {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const [showFullMsg, setShowFullMsg] = useState(false);

  const handleShowFullMsg = async () => {
    if (showFullMsg || message.isSeen) return setShowFullMsg(!showFullMsg);
    setShowFullMsg(!showFullMsg)

    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(
      `${API_URL}/messages/${message.id}/SetMessageSeen`,
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
        console.log(data.data);
      })
      .catch((e) => {
        console.log("ERROR:failed to SetMessageSeen! ", e.message);
      });
  };
  return (
    <div>
      <div className="p-7">
        <div className="flex flex-row-reverse justify-between items-center">
          <div className={(!message.isSeen&&" font-bold ")+" "}>{message.title}</div>
          <button className=" focus:outline-none cursor-pointer font-bold text-2xl px-4" onClick={handleShowFullMsg}>
            +
          </button>
        </div>
        {showFullMsg && (
          <div className="flex flex-col text-right">
            <div className="my-4">{message.context}</div>
            <div>
              {new Date(Date.parse(message.createDateTime)).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
