import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import AuthContext from "../../../context/authContext";
import { API_URL, RegistrationStatus, UserRole } from "../../../config/config";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import VmTable from "../../../components/Admin/Users/VmTable";
import EditUserEmailModal from "../../../components/Admin/Users/EditUserEmailModal";
import EditUserModalAdmin from "../../../components/Admin/Users/EditUserModalAdmin";

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

export default function UserAdminPage() {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editEmailModal, setEditEmailModal] = useState(false);

  const [userData, setUserData] = useState<User>({
    unSeenMessagesCount: 0,
    isStudent: false,
    id: "",
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    registrationState: "",
    phoneNumber: "",
    nationalId: NaN,
    createDateTime: "",
    lastLoginDateTime: "",
  });

  const [userVMs, setUserVMs] = useState(null);

  const router = useRouter();
  useLayoutEffect(() => {
    if (router.query.id) {
      handleFetchUser();
      handleFetchUserVMs();
    }
  }, [router.query.id]);

  const handleFetchUser = async () => {
    const { id } = router.query;
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/users/${id}/GetUserById/admin`, {
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
        setUserData(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch user ", e.message);
      });
  };

  const handleChangeState = async () => {
    const conf = confirm(
      "change regState from " +
        userData.registrationState +
        " to " +
        (userData.registrationState == RegistrationStatus[0]
          ? RegistrationStatus[1]
          : RegistrationStatus[0])
    );

    if (!conf) return;

    const { id } = router.query;
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/users/ChangeUserState/admin`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        userId: id,
        registrationState:
          userData.registrationState == RegistrationStatus[0]
            ? RegistrationStatus.REGISTERED
            : RegistrationStatus.WAITING_FOR_EMAIL_VERIFICATION,
      }),
    })
      .then(async (e) => {
        if (!e.ok) {
          throw Error((await e.json()).message);
        }
        return e.json();
      })
      .then((data) => {
        toast.success("success");
        console.log(data);
        router.reload();
        setisLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:", e.message);
      });
  };

  const handleChangeIsStudent = async () => {
    const conf = confirm(
      "change isStudent from " +
        userData.isStudent +
        " to " +
        !userData.isStudent
    );

    if (!conf) return;

    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(
      `${API_URL}/users/ChangeUserStudentState/${userData.id}/admin`,
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
        toast.success("success");
        console.log(data);
        router.reload();
        setisLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:", e.message);
      });
  };

  const handleFetchUserVMs = async () => {
    const { id } = router.query;
    setisLoading(true);
    if (!isAccessTokenValid()) {
      await refreshAccessToken();
    }
    const accessToken = window.localStorage.getItem("access");

    const res = await fetch(`${API_URL}/vms/GetAllVMsOfUser/${id}/admin`, {
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
        setUserVMs(data.data);
        setisLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setisLoading(false);
        console.log("ERROR:failed to fetch userVMs", e.message);
      });
  };

  if (!user) return <></>;
  return (
    <div className="w-full px-2">
      <pre>{JSON.stringify(userData, null, 2)}</pre>

      {userData.role == UserRole[0] && (
        <div>
          <div
            className=" w-fit my-4 cursor-pointer border-2 bg-gray-200 rounded"
            onClick={() => setShowEditUserModal(true)}
          >
            Edit User Info
          </div>
          <div
            className=" w-fit my-4 cursor-pointer border-2 bg-gray-200 rounded"
            onClick={() => setEditEmailModal(true)}
          >
            Change User Email
          </div>
          <div
            onClick={handleChangeState}
            className=" w-fit my-4 cursor-pointer border-2 bg-gray-200 rounded"
          >
            Change RegisterationState
          </div>
          <div
            onClick={handleChangeIsStudent}
            className=" w-fit my-4 cursor-pointer border-2 bg-gray-200 rounded"
          >
            Change isStudent
          </div>
        </div>
      )}

      {userVMs && <VmTable vmsList={userVMs}></VmTable>}

      <EditUserEmailModal
        isOpen={editEmailModal}
        setIsOpen={setEditEmailModal}
        user={userData}
        title="Edit User Email"
      ></EditUserEmailModal>
      <EditUserModalAdmin
        isOpen={showEditUserModal}
        setIsOpen={setShowEditUserModal}
        title={"Edit User"}
        user={userData}
      ></EditUserModalAdmin>
      <ToastContainer hideProgressBar></ToastContainer>
    </div>
  );
}
