import { useContext, useEffect, useLayoutEffect } from "react";
import AuthContext from "../../context/authContext";
import Link from "next/link";
import UserLayout from "../../components/UserDashboardLayout";
import { useRouter } from "next/router";

export default function Index() {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);

  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard/vms");
  }, []);

  if (!user) return <>Access Denied!</>;

  return <div className="w-full"></div>;
}

Index.Layout = UserLayout;
