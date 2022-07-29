import { useContext } from "react";
import AuthContext from "../../context/authContext";
import Link from "next/link";

export default function Index() {
  const { isLoading, user } = useContext(AuthContext);

  if (!user || user.role == "USER") return <>Access Denied!</>;

  return (
    <div className="flex flex-col items-center">
      <div className="mx-auto bg-stone-200 rounded p-2 shadow">
        <div>
          <Link href="/admin/users">Users</Link>
        </div>
        <div>
          <Link href="/admin/hosts">Hosts</Link>
        </div>
        <div>
          <Link href="/admin/plans">Plans</Link>
        </div>
        <div>
          <Link href="/admin/vms">VMs</Link>
        </div>
        <div>
          <Link href="/admin/extendrequests">Extend Requests</Link>
        </div>
        <div>
          <Link href="/admin/images">Images</Link>
        </div>
        <div>
          <Link href="/admin/settings">Site Settings</Link>
        </div>
      </div>
    </div>
  );
}
