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

  const [showFullMsg, setShowFullMsg] = useState(false);

  return (
    <div>
      <div className="p-7">
        <div className="flex flex-row-reverse justify-between items-center">
          <div className={(!message.isSeen && " font-bold ") + " "}>
            {message.title}
          </div>
          <button
            className=" focus:outline-none cursor-pointer font-bold text-2xl px-4"
            onClick={() => setShowFullMsg(!showFullMsg)}
          >
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
