import React, { useLayoutEffect, useState, useContext, useMemo } from "react";
import AuthContext from "../context/authContext";
import { API_URL, RegistrationStatus, UserRole } from "../config/config";
import { toast } from "react-toastify";

import Link from "next/link";
import ChangePassModal from "../components/Profile/ChangePassModal";
import EditUserModal from "../components/Profile/EditUserModal";

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

  useLayoutEffect(() => {}, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div
          className="bg-gray-200 text-center w-fit m-auto cursor-pointer mb-2"
          onClick={() => setShowChangePassModal(true)}
        >
          Change Password
        </div>
        <div
          className="bg-gray-200 text-center w-fit m-auto cursor-pointer mb-2"
          onClick={() => setShowEditUserModal(true)}
        >
          Edit
        </div>
      </div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <ChangePassModal isOpen={showChangePassModal} setIsOpen={setShowChangePassModal} title={"Change Password"}></ChangePassModal>
      <EditUserModal isOpen={showEditUserModal} setIsOpen={setShowEditUserModal} title={"Edit User"}></EditUserModal>
    </div>
  );
}
