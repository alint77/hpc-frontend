import React, { useLayoutEffect, useState, useContext, useMemo } from "react";
import AuthContext from "../../context/authContext";
import { API_URL } from "../../config/apiRoute";
import { toast } from "react-toastify";
import Table, {
  SelectColumnFilter,
} from "../../components/Admin/Users/table";
import Link from "next/link";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  registrationState: string;
  phoneNumber: string;
  nationalId: number;
  createDateTime: string;
  lastLoginDateTime: string;
}

export default function users() {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: ({firstName,lastName,email,id})=> JSON.stringify([firstName,lastName,email,id]),
        Cell: ({value})=> {

          value=JSON.parse(value)
          return (
            <Link href={`/admin/dashboard/`+value[3]}>
              <div className="">
                <div className="flex flex-row">
                  <div className="mr-1">{value[0]}</div>
                  <div>{value[1]}</div>
                </div>
                <div>{value[2]}</div>
              </div>
            </Link>
          );
        },
      },
      {
        Header: "Status",
        accessor: "registrationState",
        Cell: ({ value }) => {
          value = value == "WAITING_FOR_EMAIL_VERIFICATION" ? "PENDING" : value;
          return <div className="">{value}</div>;
        },
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Phone",
        accessor: "phoneNumber",
      },
      {
        Header: "SSN",
        accessor: "nationalId",
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ value }) => {
          value = value == "DEVELOPER" ? "DEV" : value;
          return <div className="">{value}</div>;
        },
        Filter: SelectColumnFilter,
        filter: "includes",
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
        Header: "Last Logged In",
        accessor: "lastLoginDateTime",
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
    ],
    []
  );
  const [usersList, setUsersList] = useState<Array<User>>([]);
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  if (!user || user.role == "USER") return <>Access Denied!</>;

  const handleFetchUsersList = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");
    try {
      const res = await fetch(
        `${API_URL}/users/GetAllUsers/admin?PageNumber=1&PageSize=100`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        console.log(data.data);
        setUsersList(data.data);
        setisLoading(false);
      }
    } catch (error) {
      toast.error("Could not fetch list");
    }
  };

  useLayoutEffect(() => {
    handleFetchUsersList();
  }, []);

  return (
    <div className="w-11/12 mx-auto">
      <Table columns={columns} data={usersList} className=""></Table>
    </div>
  );
}
