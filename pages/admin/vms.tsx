import React, { useLayoutEffect, useState, useContext, useMemo } from "react";
import AuthContext from "../../context/authContext";
import { API_URL } from "../../config/config";
import { toast } from "react-toastify";
import Table, { SelectColumnFilter } from "../../components/Admin/Users/Table";
import Link from "next/link";

interface Creator {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
}

interface Host {
  id: string;
  name: string;
}

interface VM {
  name: string;
  createDateTime: string;
  endPriodDateTime: string;
  id: string;
  vmState: string;
  creator: Creator;
  isPaid: boolean;
  host: Host;
  os: number;
  period: number;
  processorCores: number;
  memory: number;
}

export default function vms() {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Creator",
        accessor: ({ creator }) =>
          JSON.stringify([
            creator.lastName,
            creator.firstName,
            creator.email,
            creator.id,
          ]),
        Cell: ({ value }) => {
          value = JSON.parse(value);
          return (
            <Link href={`/admin/user/`+value[3]}>
              <div className="cursor-pointer">
                <div className="flex flex-row">
                  <div className="mr-1">{value[1]}</div>
                  <div>{value[0]}</div>
                </div>
                <div>{value[2]}</div>
              </div>
            </Link>
          );
        },
      },
      {
        Header: "Host",
        accessor: ({ host }) =>
          JSON.stringify([
            host.name,
            host.id,
          ]),
        Cell: ({ value }) => {
          value = JSON.parse(value);
          return (
            <Link href={`/admin/hosts/`+value[1]}>
              <div className=" cursor-pointer">
                <div className="flex flex-row">
                  <div className="mr-1">{value[0]}</div>
                  
                </div>
                
              </div>
            </Link>
          );
        },
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
          console.log(dateTime.getTime(),Date.now());
          const deltaT = ((dateTime.getTime() - Date.now())/86400000).toFixed()
          const x = dateTime.toLocaleString().split(",");

          return (
            <div className="">
              <div>{x[0]}</div>
              <div>{x[1]}</div>
              <div>{deltaT} days left  </div>
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

    const res = await fetch(
      `${API_URL}/vms/GetAllVMs/admin?PageNumber=1&PageSize=100`,
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
      <Table columns={columns} data={vmsList} className=""></Table>
    </div>
  );
}
