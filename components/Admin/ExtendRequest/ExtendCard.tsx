import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";

interface Prop {
  request: Request;
  className?: string;
}

interface Request {
  context: string;
  createDateTime: string;
  id: string;
  isSeen: boolean;
  title: string;
  userId: string;
}
export default function RequestCard({ request, className }: Prop) {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const handleAcceptOrDecline = async (isApproved:boolean) => {
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(
      `${API_URL}/vms/CheckExtendRequest/admin`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body:JSON.stringify({
          isApproved,
          id:request.id
        })
      }
    )
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        toast.success('Success!')
        console.log(data.data);
      })
      .catch((e) => {
        toast.error('Something went wrong')
        console.log("ERROR:failed to SetRequestSeen! ", e.message);
      });
  };



  return (
    <div>
      <div className="p-7">
        <div className="flex flex-row-reverse justify-between items-center">
          <div className={(!request.isSeen && " font-bold ") + " "}>
            {request.title}
          </div>
          
        </div>
        <div className="flex flex-col text-right">
          <div className="my-4">{request.context}</div>
          <div>
            {new Date(Date.parse(request.createDateTime)).toLocaleString()}
          </div>
        </div>
        <div>
            <button
              className=" focus:outline-none cursor-pointer rounded bg-green-500 font-bold mx-2 py-1 text-white  px-4"
              onClick={()=>handleAcceptOrDecline(true)}
            >
              Approve
            </button>
            <button
              className=" focus:outline-none cursor-pointer rounded bg-red-500 font-bold mx-2 py-1 text-white px-4"
              onClick={()=>handleAcceptOrDecline(false)}
            >
              Decline
            </button>
          </div>
      </div>
    </div>
  );
}
