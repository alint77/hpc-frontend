import React, { useLayoutEffect, useState, useContext, useMemo } from "react";
import AuthContext from "../../context/authContext";
import { API_URL, RegistrationStatus, UserRole } from "../../config/config";
import { toast } from "react-toastify";

import Link from "next/link";
import ChangePassModal from "../../components/Profile/ChangePassModal";
import EditUserModal from "../../components/Profile/EditUserModal";
import UserLayout from "../../components/landingLayout";

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

export default function Profile() {
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  if (!user) return <div>not signed in</div>;

  return (
    <div className="flex flex-col p-2">
      <div className="rounded bg-stone-200 shadow-md text-right p-4 max-w-2xl m-auto w-full">
        <div className="firstname flex flex-row-reverse justify-between my-4 px-6">
          <div>نام</div>
          <div className="">{user.firstName}</div>
        </div>
        <div className="lastname flex flex-row-reverse justify-between my-4 px-6">
          <div>نام خانوادگی</div>
          <div className="">{user.lastName}</div>
        </div>
        <div className="email flex flex-row-reverse justify-between my-4 px-6">
          <div>ایمیل</div>
          <div className="">{user.email}</div>
        </div>
        <div className="phone flex flex-row-reverse justify-between my-4 px-6">
          <div>شماره همراه</div>
          <div className="">{user.phoneNumber}</div>
        </div>
        <div className="ssn flex flex-row-reverse justify-between my-4 px-6">
          <div>کد ملی</div>
          <div className="">{user.nationalId}</div>
        </div>

        <div>
          <div className="flex flex-row space-x-4 justify-center">
            <div
              className="bg-slate-700 text-white p-1.5 text-sm rounded shadow-md text-center w-fit cursor-pointer mb-2"
              onClick={() => setShowChangePassModal(true)}
            >
              تغییر رمز
            </div>
            <div
              className="bg-slate-700 text-white p-1.5 text-sm rounded shadow-md text-center w-fit cursor-pointer mb-2"
              onClick={() => setShowEditUserModal(true)}
            >
              تغییر اطلاعات
            </div>
          </div>
        </div>
      </div>
      <ChangePassModal
        isOpen={showChangePassModal}
        setIsOpen={setShowChangePassModal}
        title={"تغییر رمز"}
      ></ChangePassModal>
      <EditUserModal
        isOpen={showEditUserModal}
        setIsOpen={setShowEditUserModal}
        title={"تغییر اطلاعات"}
      ></EditUserModal>
    </div>
  );
}
// Profile.Layout = UserLayout;
