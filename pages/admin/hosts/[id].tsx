import { useRouter } from "next/router";
import { useContext, useState, useLayoutEffect, useEffect } from "react";
import { toast } from "react-toastify";
import { API_URL } from "../../../config/config";
import AuthContext from "../../../context/authContext";

export default function Host() {
  const {
    user,
    isLoading,
    setisLoading,
    isAccessTokenValid,
    refreshAccessToken,
  } = useContext(AuthContext);
  const [host, setHost] = useState([]);

  const router = useRouter();
  useEffect(() => {
    if (router.query.id) {
      handleFetchHost();
    }
  }, [router.query.id]);

  const handleFetchHost = async () => {
    const { id } = router.query;

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/hosts/${id}/GetHostById/admin`, {
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
        setHost(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        setisLoading(false);
        console.log("ERROR:failed to fetch host! ", e.message);
      });
  };

  const handleChangeHostAvailability = async () => {
    const { id } = router.query;

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(
      `${API_URL}/hosts/${id}/ChangeHostAvailability/admin`,
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
        toast.success("success!");
        console.log(data.data);
        setisLoading(false);
        setTimeout(() => router.reload(), 200);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to change availability", e.message);
      });
  };

  return (
    <div>
      <pre>{JSON.stringify(host, null, 2)}</pre>
      <div>
        <button
          onClick={handleChangeHostAvailability}
          className="p-2 rounded bg-slate-700 text-white text-sm w-fit"
        >
          Change Availability
        </button>
      </div>
    </div>
  );
}
