import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

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
    <div className="w-full max-w-[28rem] m-auto">
      <form
        onSubmit={handleSubmit}
        onChange={handleChange}
        className="bg-gray-100 h-[24rem] w-[28rem] shadow-md rounded p-12 pb-8 mb-4"
      >
        <div className="titleHolder flex w-full text-3xl font-semibold mb-8">
          Login
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
            Email
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
            Password
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
              className="absolute right-2 h-full flex items-center"
            >
              {showPass ? "hide" : "show"}
            </div>
          </div>
        </div>

        <div className="flex flex-row-reverse  items-center justify-between py-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
        </div>
      </form>
      <div className=" text-center w-full font-semibold text-blue-800">
        <Link href="/register">Create a New Account</Link>
      </div>
    </div>
  );
}
