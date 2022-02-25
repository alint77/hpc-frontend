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

interface MessageInput {
  userId: string;
  title: string;
  context: string;
}
export default function SendMessageModal({
  isOpen,
  setIsOpen,
  title,
  children,
  user,
}: Prop) {
  const router = useRouter();
  const { setisLoading, isAccessTokenValid, refreshAccessToken } =
    useContext(AuthContext);
  const [msgInput, setMsgInput] = useState({
    userId: user.id,
    title: "",
    context: "",
  });

  useEffect(() => {
    setMsgInput({ ...msgInput, userId: user.id });
  }, [user]);

  const handleSendMessage = async () => {
    if (!confirm("Are you sure?")) return;

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    console.log(msgInput);

    const res = await fetch(`${API_URL}/messages/SendMessageToUser/admin`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(msgInput),
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        router.reload();
        toast.success("Message Sent!");
        console.log(data);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:", e.message);
      });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className="p-4 flex flex-col">
        <label htmlFor="msgTitle">Title :</label>
        <input
          className=" flex shadow appearance-none border rounded w-full py-2 px-4 mb-5 leading-tight focus:outline-none "
          type="text"
          name="msgTitle"
          id="msgTitle"
          value={msgInput.title}
          onChange={(e) => setMsgInput({ ...msgInput, title: e.target.value })}
          required
        />
        <label htmlFor="msgContext">Body :</label>
        <input
          className=" flex shadow appearance-none border rounded w-full py-2 px-4  leading-tight focus:outline-none "
          type="text"
          name="msgContext"
          id="msgContext"
          value={msgInput.context}
          onChange={(e) =>
            setMsgInput({ ...msgInput, context: e.target.value })
          }
          required
        />
      </div>
      <div className="flex flex-row-reverse items-center border-t-2 h-12">
        <div
          className="mr-5 px-2 py-1 bg-green-400 text-white rounded font-semibold text-sm cursor-pointer"
          onClick={() => handleSendMessage()}
        >
          Send
        </div>
      </div>
    </Modal>
  );
}
