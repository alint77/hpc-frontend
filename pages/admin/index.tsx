import { useContext } from "react";
import AuthContext from "../../context/authContext";
import Link from "next/link";

export default function Index() {
  const { isLoading, user } = useContext(AuthContext);

  if (!user || user.role == "USER") return <>Access Denied!</>;

  return (
  <div className="m-auto">
    <div><Link href="/admin/users">Users</Link></div>
    <div><Link href="/admin/hosts">Hosts</Link></div>
    <div><Link href="/admin/plans">Plans</Link></div>
    <div><Link href="/admin/vms">VMs</Link></div>
    <div><Link href="/admin/images">Images</Link></div>
  </div>
  )
}
