import { useContext, useLayoutEffect, useMemo, useState } from "react";
import AuthContext from "../../../context/authContext";
import Link from "next/link";
import Table, {
  SelectColumnFilter,
} from "../../../components/Admin/Users/Table";
import { API_URL, OS } from "../../../config/config";

export default function Index() {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },

      {
        Header: "Status",
        accessor: "vmState",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Period",
        accessor: "period",
      },
      {
        Header: "OS",
        accessor: "os",
        Cell: ({ value }) => <div>{OS[value]}</div>,
      },
      {
        Header: "RAM",
        accessor: "memory",
      },
      {
        Header: "CPU#",
        accessor: "processorCores",
      },
      {
        Header: "Paid",
        accessor: (e) => (e.isPaid ? "YES" : "NO"),
      },
      {
        Header: "Created",
        accessor: "createDateTime",
        Cell: ({ value }) => {
          const dateTime = new Date(value);
          const x = dateTime.toLocaleString().split(",");

          return (
            <div className="">
              <div>{x[0]}</div>
              <div>{x[1]}</div>
            </div>
          );
        },
      },
      {
        Header: "Expire Date",
        accessor: "endPriodDateTime",
        Cell: ({ value }) => {
          const dateTime = new Date(value);
          console.log(dateTime.getTime(), Date.now());
          const deltaT = (
            (dateTime.getTime() - Date.now()) /
            86400000
          ).toFixed();
          const x = dateTime.toLocaleString().split(",");

          return (
            <div className="">
              <div>{x[0]}</div>
              <div>{x[1]}</div>
              <div>{deltaT} days left </div>
            </div>
          );
        },
      },
    ],
    []
  );
  const [vmsList, setVmsList] = useState<Array<any>>([]);
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  if (!user || user.role == "USER") return <>Access Denied!</>;

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
        setisLoading(false);
        console.log("ERROR:failed to fetch! ", e.message);
      });
  };

  useLayoutEffect(() => {
    handleFetchVmsList();
  }, []);

  return (
    <div className="w-11/12 mx-auto">
      <Link href="/dashboard/vms/requestNewVM">
        <div className="border-2 w-fit cursor-pointer bg-gray-200">
          Request New VM
        </div>
      </Link>
      <Table columns={columns} data={vmsList} className=""></Table>
    </div>
  );
}
