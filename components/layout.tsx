import AuthContext from "../context/authContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";

export default function Layout({ children }) {
  const { logout, user,isLoading } = useContext(AuthContext);
  

  if (!user) {
    return (
      <>
        <Link href={"/login"}> login </Link>

        <Link href={"/register"}> Register </Link>

        <div>{children}</div>
      </>
    );
  }
  console.log(user);

  return (
    <div>
      <div className=" bg-gray-200 py-2 flex items-center justify-center">
        <div className="w-11/12">
          user :{" " + user.email + " "}
          {user.role !== "DEVELOPER" ||
            (user.role !== "ADMIN" && (
              <Link href="/admin/dashboard">AdminPanel </Link>
            ))}
          <button className="" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </div>
      <div className="py-2">{children}</div>
    </div>
  );
}
