import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import HidePassSVG from "../components/SVGs/HidePassSVG";
import ShowPassSVG from "../components/SVGs/ShowPassSVG";

export default function loginPage() {
  const { login, user, isLoading } = useContext(AuthContext);
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };
  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      login(userInput);
    } catch (e) {
      toast.error("sign in failed!");
      console.log(e);
    }
  };

  if (user) return <>you're already logged in</>;

  return (
    <div className="w-full max-w-[28rem] m-auto text-right">
      <form
        onSubmit={handleSubmit}
        onChange={handleChange}
        className="bg-gray-100 h-[24rem] w-[28rem] shadow-md rounded p-12 pb-8 mb-4"
      >
        <div className="titleHolder text-right  w-full text-3xl font-semibold mb-8">
          ورود
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
            ایمیل
          </label>{" "}
          <input
            name="email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none "
            placeholder="Email Address"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="password"
          >
            کلمه عبور
          </label>{" "}
          <div className="relative border-2 flex flex-row">
            <input
              type={showPass ? "text" : "password"}
              className=" shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none "
              name="password"
              placeholder="********"
            />
            <div
              onClick={() =>
                showPass ? setShowPass(false) : setShowPass(true)
              }
              className="absolute right-2 h-full flex items-center z-10"
            >
              {showPass ? <HidePassSVG /> : <ShowPassSVG />}
            </div>
          </div>
        </div>

        <div className="flex flex-row  items-center justify-between py-2">
          <button
            type="submit"
            className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            ورود
          </button>
        </div>
      </form>
      <div className=" text-center w-full font-semibold text-slate-700">
        <Link href="/register">ثبت نام</Link>
      </div>
    </div>
  );
}
