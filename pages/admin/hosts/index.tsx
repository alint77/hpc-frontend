import {
  useMemo,
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
} from "react";
import AuthContext from "../../../context/authContext";
import Table from "../../../components/Admin/Users/Table";
import { API_URL } from "../../../config/config";
import Link from "next/link";

export default function hosts() {
  const {
    user,
    isLoading,
    setisLoading,
    isAccessTokenValid,
    refreshAccessToken,
  } = useContext(AuthContext);
  const [hostsList, setHostsList] = useState<Array<any>>([]);

  if (!user || user.role == "USER") return <>Access Denied!</>;

  const handleFetchHostsList = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(
      `${API_URL}/hosts/GetAllHosts/admin?PageNumber=1&PageSize=100`,
      {
        method: "GET",
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
        setHostsList(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        setisLoading(false);
        console.log("ERROR:failed to fetch usersList! ", e.message);
      });
  };

  useLayoutEffect(() => {
    handleFetchHostsList();
  }, []);

  return (
    <div className="flex flex-row justify-evenly">
      {hostsList.map((v) => (
        <Link href={"/admin/hosts/"+v.id}>
          <div className="border-2 flex flex-col w-72 h-min mx-2" key={v.id}>
            <div> name: {v.name}</div>
            <div> deviceName: {v.deviceName}</div>
            <div> totalDiskSize: {v.totalDiskSize}</div>
            <div> freeDiskSize: {v.freeDiskSize}</div>
            <div> totalMemory: {v.totalMemory}</div>
            <div> freeMemory: {v.freeMemory}</div>
            <div> totalProcessorCores: {v.totalProcessorCores}</div>
            <div> freeProcessorCores: {v.freeProcessorCores}</div>
            <div> hostState: {v.hostState}</div>
            <div> isAvailable: {v.isAvailable.toString()}</div>
            <div> id: {v.id}</div>
            <div> createDateTime: {v.createDateTime}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
