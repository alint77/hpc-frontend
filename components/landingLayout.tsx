import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import MenuSVG from "./SVGs/MenuSVG";
import Link from "next/link";
import { UserRole } from "../config/config";
import XbtnSVG from "./SVGs/XbtnSVG";

export default function LandingLayout({ children }) {
  const { logout, user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  const [sideBarShow, setSideBarShow] = useState(false);
  return (
    <div className="font-[iransans] relative min-h-screen flex flex-col">
      {user ? (
        <>
          <div className="bg-slate-700 px-4 inset-x-0 text-white flex justify-between ">
            <Link href="/">
              <div className="p-5 font-semibold text-xl cursor-pointer">
                BNUT-HPC
              </div>
            </Link>{" "}
            <button
              onClick={() => setSideBarShow(!sideBarShow)}
              className="p-4 focus:outline-none focus:bg-slate-500"
            >
              <MenuSVG></MenuSVG>
            </button>
          </div>

          <div
            className={
              "sidebar shadow-lg bg-slate-700 w-64 min-w-[16rem] z-10 text-white fixed inset-y-0 right-0 ease-in-out duration-200 " +
              (!sideBarShow && " translate-x-full ")
            }
          >
            <div className="flex h-full pb-4 flex-col">
              <div className="flex h-full flex-col justify-between">
                <div className="">
                  <div className="logo text-center mb-12">
                    <button
                      onClick={() => setSideBarShow(false)}
                      className=" absolute right-4 top-6 p-4 focus:outline-none"
                    >
                      <XbtnSVG></XbtnSVG>
                    </button>
                    <Link href={"/"}>
                      <a>
                        <div className="p-10 w-full bg-slate-800">
                          ابر نوشیروانی
                        </div>
                      </a>
                    </Link>
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
                    <Link href={"/dashboard/help"}>
                      <a>
                        <div className="w-full py-2 rounded hover:bg-slate-600  active:bg-slate-500">
                          راهنما
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
        </>
      ) : (
        <>
          <div className="bg-slate-700 px-4 inset-x-0 text-white flex justify-between">
            <Link href="/">
              <div className="p-5 font-semibold text-xl cursor-pointer">
                BNUT-HPC
              </div>
            </Link>
            <button
              onClick={() => setSideBarShow(!sideBarShow)}
              className="p-4 focus:outline-none focus:bg-slate-500"
            >
              <MenuSVG></MenuSVG>
            </button>
          </div>
          <div
            className={
              "sidebar text-lg shadow-lg bg-slate-700 w-64 text-white fixed inset-y-0 right-0 ease-in-out duration-200 z-50" +
              (!sideBarShow && " translate-x-full")
            }
          >
            <div className="flex h-full pb-4 flex-col">
              <div className="flex h-full flex-col justify-between">
                <div className="">
                  <div className="logo text-center mb-12">
                    <button
                      onClick={() => setSideBarShow(false)}
                      className=" absolute right-4 top-6 p-4 focus:outline-none"
                    >
                      <XbtnSVG></XbtnSVG>
                    </button>
                    <Link href={"/"}>
                      <a>
                        <div className="p-10 w-full bg-slate-800">
                          ابر نوشیروانی
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div className="text-center flex flex-col space-y-4">
                    <Link href={"/login"}>
                      <a>
                        <div className="w-full py-2 rounded hover:bg-slate-600  active:bg-slate-500">
                          ورود
                        </div>
                      </a>
                    </Link>
                    <Link href={"/register"}>
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
        </>
      )}

      <div className="grow m-auto w-full max-w-[1000px] mt-4  ">
        <div className=" m-auto">{children}</div>
      </div>
      <div className="bg-stone-200  rounded mt-8 text-right">
        <div className="m-auto w-full max-w-[1000px] p-4 h-full flex flex-row-reverse items-stretch">
          <div className="w-1/3 border-2 p-3">ابر نوشیروانی</div>
          <div className="w-1/3 border-2 p-3">لینک ها</div>
          <div className="w-1/3 p-3 space-y-3">
            <div className="font-bold">ارتباط با ما</div>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-bold">آدرس</span>: بابل ، خیابان شریعتی ،
                دانشگاه صنعتی نوشیروانی مرکز کامپیوتر
              </div>
              <div>
                <span className="font-bold">شماره تماس</span> :۰۱۱۱۲۳۴۵۶۷۸
              </div>
              <div>
                HPC@nit.ac.ir <span className="font-bold">ایمیل پشتیبانی</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
