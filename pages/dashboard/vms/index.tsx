import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import AuthContext from "../../../context/authContext";
import Link from "next/link";
import Table, {
  SelectColumnFilter,
} from "../../../components/Admin/Users/Table";
import { API_URL, OS } from "../../../config/config";
import VmTableUser from "../../../components/VMs/VmTableUser";
import UserLayout from "../../../components/UserDashboardLayout";

export default function Index() {
  const [vmsList, setVmsList] = useState<Array<any>>([]);
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const handleFetchVmsList = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/vms/GetAllVMsOfUser`, {
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
        setVmsList(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        setVmsList([]);
        setisLoading(false);
        console.log("ERROR:failed to fetch! ", e.message);
      });
  };

  useEffect(() => {
    handleFetchVmsList();
  }, []);

  if (!user) return <>not logged in</>;

  return (
    <div className="flex flex-col">
      <div className="bg-stone-200 rounded-lg p-4 pt-6 w-full shadow-lg mt-4">
        <div>
          {vmsList.length > 0 ? (
            <div className="text-center">
              <div>سرویس های شما</div>
              <VmTableUser vmsList={vmsList}></VmTableUser>
            </div>
          ) : (
            <div className=" text-center font-semibold">
              سرویسی برای نمایش موجود نیست
            </div>
          )}
        </div>
        <div className="m-auto flex flex-row-reverse">
          <Link href="/dashboard/vms/requestNewVM">
            <div className="my-2 shadow-md w-fit cursor-pointer p-2 text-sm bg-slate-700 rounded-md text-white">
               سرویس جدید
            </div>
          </Link>
        </div>

        <div></div>
      </div>
    </div>
  );
}
Index.Layout = UserLayout;
