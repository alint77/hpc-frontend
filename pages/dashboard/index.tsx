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



  useLayoutEffect(() => {}, []);

  return <div>user dashboard

      <div><Link href={"/dashboard/vms"}>
          
              VMs
      </Link>
      </div>


  </div>;
}
