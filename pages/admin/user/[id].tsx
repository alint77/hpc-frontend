import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import AuthContext from "../../../context/authContext";
import { API_URL, RegistrationStatus, UserRole } from "../../../config/config";

import { toast } from "react-toastify";

import VmTable from "../../../components/VMs/VmTable";
import EditUserEmailModal from "../../../components/Admin/Users/EditUserEmailModal";
import EditUserModalAdmin from "../../../components/Admin/Users/EditUserModalAdmin";
import SendMessageModal from "../../../components/Admin/Users/SendMessageModal";
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
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);

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
  useEffect(() => {
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
        setisLoading(false);
        console.log("ERROR:failed to fetch userVMs", e.message);
      });
  };

  if (!user || !userData) return <></>;
  return (
    <div className="container">
      <div className="m-auto flex flex-col">
        <div className="rounded bg-stone-200 shadow-md text-right p-4 max-w-2xl m-auto w-full">
          <div className="firstname flex flex-row-reverse justify-between my-4 px-6">
            <div>نام</div>
            <div className="">{userData.firstName}</div>
          </div>
          <div className="lastname flex flex-row-reverse justify-between my-4 px-6">
            <div>نام خانوادگی</div>
            <div className="">{userData.lastName}</div>
          </div>
          <div className="email flex flex-row-reverse justify-between my-4 px-6">
            <div>ایمیل</div>
            <div className="">{userData.email}</div>
          </div>
          <div className="phone flex flex-row-reverse justify-between my-4 px-6">
            <div>شماره همراه</div>
            <div className="">{userData.phoneNumber}</div>
          </div>
          <div className="ssn flex flex-row-reverse justify-between my-4 px-6">
            <div>کد ملی</div>
            <div className="">{userData.nationalId}</div>
          </div>
          <div className=" flex flex-row-reverse justify-between my-4 px-6">
            <div>تاریخ ثبت نام</div>
            <div className="">{new Date(userData.createDateTime).toLocaleString()}</div>
          </div>
          <div className=" flex flex-row-reverse justify-between my-4 px-6">
            <div>آخرین لاگین</div>
            <div className="">{new Date(userData.lastLoginDateTime).toLocaleString()}</div>
          </div>
          <div className=" flex flex-row-reverse justify-between my-4 px-6">
            <div>وضعیت ثبت نام</div>
            <div className="">{userData.registrationState}</div>
          </div>
          <div className=" flex flex-row-reverse justify-between my-4 px-6">
            <div>نقش</div>
            <div className="">{userData.role}</div>
          </div>
          {userData.isStudent && (
            <div className=" flex flex-row-reverse justify-between my-4 px-6">
              <div>کاربر دانشجو می باشد </div>
            </div>
          )}
        </div>
        <div className="max-w-2xl m-auto w-full mt-4">
          {userData.role == UserRole[0] && (
            <div className=" flex flex-row space-x-3 ">
              
                <div
                  onClick={() => setShowEditUserModal(true)}
                  className="bg-slate-700 text-white p-1.5 text-sm rounded shadow-md text-center w-fit cursor-pointer mb-2"
                >
                  Edit User Info
                </div>
                <div
                  onClick={() => setEditEmailModal(true)}
                  className="bg-slate-700 text-white p-1.5 text-sm rounded shadow-md text-center w-fit cursor-pointer mb-2"
                >
                  Change User Email
                </div>
                <div
                  onClick={handleChangeState}
                  className="bg-slate-700 text-white p-1.5 text-sm rounded shadow-md text-center w-fit cursor-pointer mb-2"
                >
                  Change RegisterationState
                </div>
                <div
                  onClick={handleChangeIsStudent}
                  className="bg-slate-700 text-white p-1.5 text-sm rounded shadow-md text-center w-fit cursor-pointer mb-2"
                >
                  Change isStudent
                </div>
                <div
                  onClick={() => setShowSendMessageModal(true)}
                  className="bg-slate-700 text-white p-1.5 text-sm rounded shadow-md text-center w-fit cursor-pointer mb-2"
                >
                  Send Message to User
                </div>
              
            </div>
          )}
        </div>

        <Link href={`/admin/user/${userData.id}/wallet`}>
          <div className="bg-slate-700 text-white p-1.5 text-sm rounded shadow-md text-center cursor-pointer mb-2 max-w-2xl m-auto w-fit">
            User Wallet Transactions
          </div>
        </Link>
        <Link href={`/admin/user/${userData.id}/messages`}>
          <div className="bg-slate-700 text-white p-1.5 text-sm rounded shadow-md text-center cursor-pointer mb-2 max-w-2xl m-auto w-fit">
            User Messages
          </div>
        </Link>
      </div>

      <div className="max-w-2xl m-auto w-full mt-4">{userVMs ? <VmTable vmsList={userVMs}></VmTable> : "No VM"}</div>

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
      {userData && (
        <SendMessageModal
          isOpen={showSendMessageModal}
          setIsOpen={setShowSendMessageModal}
          title={"Send Message"}
          user={userData}
        ></SendMessageModal>
      )}
    </div>
  );
}
