import React, {
  useLayoutEffect,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import AuthContext from "../../context/authContext";
import { API_URL, RegistrationStatus, UserRole } from "../../config/config";
import { toast } from "react-toastify";
import Table, { SelectColumnFilter } from "../../components/Admin/Users/Table";
import Link from "next/link";

interface User {
  unSeenMessagesCount: number;
  isStudent: boolean;

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
        accessor: ({ firstName, lastName, email, id }) =>
          JSON.stringify([lastName, firstName, email, id]),
        Cell: ({ value }) => {
          value = JSON.parse(value);
          return (
            <Link href={`/admin/user/` + value[3]}>
              <div className=" cursor-pointer">
                <div className="m-auto">
                  <span className="mr-1">{value[1]}</span>
                  <span>{value[0]}</span>
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
          value = value == RegistrationStatus[0] ? "PENDING(Email)" : value;
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
          value = value == UserRole[2] ? "DEV" : value;
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
  const [usersList, setUsersList] = useState([]);
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const handleFetchUsersList = async () => {
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(
      `${API_URL}/users/GetAllUsers/admin?PageNumber=1&PageSize=100`,
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
        setUsersList(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        setisLoading(false);
        console.log("ERROR:failed to fetch usersList! ", e.message);
      });
  };

  useEffect(() => {
    handleFetchUsersList();
  }, []);

  if (!user || user.role == "USER") return <>Access Denied!</>;
  return (
    <div className="bg-stone-200 rounded-lg p-2 pt-6 w-full  mt-2">
      {usersList ? (
        <Table className="" columns={columns} data={usersList}></Table>
      ) : (
        <></>
      )}
    </div>
  );
}
