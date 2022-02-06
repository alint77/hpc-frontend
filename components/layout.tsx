import AuthContext from "../context/authContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";

export default function Layout({ children }) {
  const { logout, user } = useContext(AuthContext);

  
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
        user :{" " + user.email + " "}
        <button className="" onClick={() => logout()}>Logout</button>
        <div>{children}</div>
      </div>
  );
}
