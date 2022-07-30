import { useContext } from "react";
import AuthContext from "../../context/authContext";
import Link from "next/link";

export default function Index() {
  const { isLoading, user } = useContext(AuthContext);

  if (!user || user.role == "USER") return <>Access Denied!</>;

  return (
    <div className="flex flex-col items-center mt-8">
        <Link href="/admin/users">
          <div  className="bg-stone-200 rounded p-3 w-72 my-3 font-bold shadow cursor-pointer">
            <div>Users</div>
          </div>
        </Link>
        <Link href="/admin/hosts">
          <div  className="bg-stone-200 rounded p-3 w-72 my-3 font-bold shadow cursor-pointer">
            <div>Hosts</div>
          </div>
        </Link>
        <Link href="/admin/plans">
          <div  className="bg-stone-200 rounded p-3 w-72 my-3 font-bold shadow cursor-pointer">
            <div>Plans</div>
          </div>
        </Link>
        <Link href="/admin/vms">
          <div  className="bg-stone-200 rounded p-3 w-72 my-3 font-bold shadow cursor-pointer">
            <div>VMs</div>
          </div>
        </Link>
        <Link href="/admin/extendrequests">
          <div  className="bg-stone-200 rounded p-3 w-72 my-3 font-bold shadow cursor-pointer">
            <div>Extend Requests</div>
          </div>
        </Link>
        <Link href="/admin/images">
          <div  className="bg-stone-200 rounded p-3 w-72 my-3 font-bold shadow cursor-pointer">
            <div>Images</div>
          </div>
        </Link>
        <Link href="/admin/settings">
          <div  className="bg-stone-200 rounded p-3 w-72 my-3 font-bold shadow cursor-pointer">
            <div>Site Settings</div>
          </div>
        </Link>
      
    </div>
  );
}



