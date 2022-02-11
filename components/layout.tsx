import AuthContext from "../context/authContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";

export default function Layout({ children }) {
  const { logout, user, isLoading } = useContext(AuthContext);

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
            (user.role !== "ADMIN" && <Link href="/admin">AdminPanel </Link>)}
          <span className=" cursor-pointer">
            <Link href="/profile">Profile </Link>
          </span>
          <span className=" cursor-pointer">
            <Link href="/dashboard">Dashboard </Link>
          </span>
          <span className=" cursor-pointer" onClick={() => logout()}>
            Logout
          </span>
        </div>
      </div>
      <div className="py-2 flex justify-center">{children}</div>
    </div>
  );
}
