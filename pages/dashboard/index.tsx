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
    </div>
  );
}
