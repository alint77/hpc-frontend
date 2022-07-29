import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ExtendCard from "../../components/Admin/ExtendRequest/ExtendCard";
import { API_URL } from "../../config/config";
import AuthContext from "../../context/authContext";

export default function extendrequests() {
  useEffect(() => {
    handleFetchRequests();
  }, []);
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);
  const [requestsList, setRequestsList] = useState([]);
  const handleFetchRequests = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/vms/GetAllExtendRequests/admin`, {
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
        setRequestsList(data.data);

        setisLoading(false);
      })
      .catch((e) => {
        
        toast.error("Failed to fetch requests");
        setisLoading(false);
        console.log("ERROR:failed to fetch! ", e.message);
      });
  };

  return (
    <div className="p-2">
      <div className="">
        {requestsList.length > 0 ? (
          requestsList.map((v) => (
            <div className="mb-6  bg-stone-200 rounded shadow-lg" key={v.id}>
              <ExtendCard request={v}></ExtendCard>
            </div>
          ))
        ) : (
          <div className="mb-6 text-center py-12 bg-stone-200 rounded shadow-lg">
            درخواستی وجود ندارد
          </div>
        )}
      </div>
    </div>
  );
}
