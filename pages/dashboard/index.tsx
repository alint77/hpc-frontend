import { useContext, useLayoutEffect } from "react";
import AuthContext from "../../context/authContext";
import Link from "next/link";

export default function Index() {
  const {
    user,
    isLoading,
    setisLoading,
    refreshAccessToken,
    isAccessTokenValid,
  } = useContext(AuthContext);


  return (
    <div>
      <div>
        <Link href={"/dashboard/vms"}>VMs</Link>
      </div>
      <div>
        <Link href={"/dashboard/profile"}>Profile</Link>
      </div>
      <div>
        <Link href={"/dashboard/messages"}>Messages</Link>
      </div>
    </div>
  );
}
