import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import MenuSVG from "./SVGs/MenuSVG";
import Link from "next/link";
import { UserRole } from "../config/config";

export default function UserLayout({ children }) {
  const { logout, user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  const [sideBarShow, setSideBarShow] = useState(false);
  if (!user)
    return (
      <div className="font-[iransans] relative min-h-screen lg:flex lg:flex-row-reverse">
        <div className="bg-slate-700 px-4 inset-x-0 text-white flex justify-between lg:hidden">
          <div className="p-4 font-semibold text-lg">BNUT-HPC</div>
          <button
            onClick={() => setSideBarShow(!sideBarShow)}
            className="p-4 focus:outline-none focus:bg-slate-500"
          >
            <MenuSVG></MenuSVG>
          </button>
        </div>

        <div
          className={
            "sidebar shadow-lg bg-slate-700 w-64 text-white fixed inset-y-0 right-0 ease-in-out duration-200 lg:relative lg:translate-x-0" +
            (!sideBarShow && " translate-x-full")
          }
        >
          <div className="flex h-full pb-4 flex-col">
            <div className="flex h-full flex-col justify-between">
              <div className="">
                <div className="logo text-center mb-12">
                  <button
                    onClick={() => setSideBarShow(false)}
                    className="lg:hidden absolute right-4 top-6 p-4 focus:outline-none"
                  >
                    X
                  </button>
                  <div className="p-10 w-full bg-slate-800">ابر نوشیروانی</div>
                </div>
                <div className="text-center flex flex-col space-y-4">
                  <Link href={"/dashboard/login"}>
                    <a>
                      <div className="w-full py-2 rounded hover:bg-slate-600  active:bg-slate-500">
                        ورود
                      </div>
                    </a>
                  </Link>
                  <Link href={"/dashboard/register"}>
                    <a>
                      <div className="w-full py-2 rounded hover:bg-slate-600 active:bg-slate-500 ">
                        ثبت نام
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
              <div className="w-full mb-12 space-y-4 text-center"></div>
            </div>
          </div>
        </div>

        <div className="grow p-4">
          <div className="lg:w-[calc(100%-16rem)]">{children}</div>
        </div>
      </div>
    );
  return (
    <div className="font-[iransans] relative min-h-screen lg:flex lg:flex-row-reverse">
      <div className="bg-slate-700 px-4 inset-x-0 text-white flex justify-between lg:hidden">
        <div className="p-4 font-semibold text-lg">BNUT-HPC</div>
        <button
          onClick={() => setSideBarShow(!sideBarShow)}
          className="p-4 focus:outline-none focus:bg-slate-500"
        >
          <MenuSVG></MenuSVG>
        </button>
      </div>

      <div
        className={
          "sidebar shadow-lg bg-slate-700 w-64 text-white fixed inset-y-0 right-0 ease-in-out duration-200 lg:relative lg:translate-x-0" +
          (!sideBarShow && " translate-x-full")
        }
      >
        <div className="flex h-full pb-4 flex-col">
          <div className="flex h-full flex-col justify-between">
            <div className="">
              <div className="logo text-center mb-12">
                <button
                  onClick={() => setSideBarShow(false)}
                  className="lg:hidden absolute right-4 top-6 p-4 focus:outline-none"
                >
                  X
                </button>
                <div className="p-10 w-full bg-slate-800">ابر نوشیروانی</div>
              </div>
              <div className="text-center flex flex-col space-y-4">
                <Link href={"/dashboard/vms"}>
                  <a>
                    <div className="w-full py-2 rounded hover:bg-slate-600  active:bg-slate-500">
                      سرویس ها
                    </div>
                  </a>
                </Link>
                <Link href={"/dashboard/messages"}>
                  <a>
                    <div className="w-full py-2 rounded hover:bg-slate-600  active:bg-slate-500">
                      {` پیام ها` +
                        (user.unSeenMessagesCount != 0
                          ? `(${user.unSeenMessagesCount})`
                          : "")}
                    </div>
                  </a>
                </Link>
                <Link href={"/dashboard/profile"}>
                  <a>
                    <div className="w-full py-2 rounded hover:bg-slate-600  active:bg-slate-500">
                      ناحیه کاربری
                    </div>
                  </a>
                </Link>
                <Link href={"/dashboard/wallet"}>
                  <a>
                    <div className="w-full py-2 rounded hover:bg-slate-600 active:bg-slate-500 ">
                      امور مالی
                    </div>
                  </a>
                </Link>
              </div>
            </div>
            <div className="w-full mb-12 space-y-4 text-center">
              <Link href={"/dashboard/profile"}>
                <a href="">
                  <div className="w-full hover:bg-slate-600 py-2 active:bg-slate-500">
                    {user.firstName}
                  </div>
                </a>
              </Link>
              <button
                className="w-full hover:bg-slate-600 py-2 active:bg-slate-500"
                onClick={logout}
              >
                خروج
              </button>
              <div>
                {(user.role == UserRole[1] || user.role == UserRole[2]) && (
                  <Link href={"/admin"}>
                    <a href="">
                      <div className="w-full hover:bg-slate-600 py-2 active:bg-slate-500">
                        پنل ادمین
                      </div>
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grow p-4">
        <div className="">{children}</div>
      </div>
    </div>
  );
}
