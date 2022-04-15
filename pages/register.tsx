import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../context/authContext";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import HidePassSVG from "../components/SVGs/HidePassSVG";
import ShowPassSVG from "../components/SVGs/ShowPassSVG";

export default function registerPage() {
  const [userInput, setUserInput] = useState({});
  const { register, isLoading, user } = useContext(AuthContext);
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    register(userInput);
  };

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.id]: e.target.value });
  };

  if (user) {
    return <>You're Already Logged In</>;
  }

  return (
    <div className="w-full max-w-[28rem] mt-2 m-auto text-right">
      <form
        onSubmit={handleRegister}
        onChange={handleChange}
        className="bg-gray-100 w-[28rem] shadow-md rounded p-10 pb-8 mb-4"
      >
        <div className="titleHolder w-full text-3xl font-semibold mb-6">
          ثبت نام
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="firstName"
          >
            نام
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="First Name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none "
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="lastName"
          >
            نام خانوادگی
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Last Name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none "
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
            ایمیل
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none "
            required
          />
        </div>
        <div className=" mb-5">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="password"
          >
            کلمه عبور
          </label>
          <div className="relative border-2 flex flex-row ">
            <input
              id="password"
              minLength={6}
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none "
              required
            />
            <div
              onClick={() =>
                showPass ? setShowPass(false) : setShowPass(true)
              }
              className="absolute right-2 h-full flex items-center"
            >
              {showPass ? <HidePassSVG/> : <ShowPassSVG/>}
            </div>
          </div>
        </div>
        <div className=" mb-5">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="passwordConfirmation"
          >
            تکرار کلمه عبور
          </label>
          <div className="relative border-2 flex flex-row ">
            <input
              id="passwordConfirmation"
              minLength={6}
              type={showConfPass ? "text" : "password"}
              placeholder="Confirm Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none "
              required
            />
            <div
              onClick={() =>
                showConfPass ? setShowConfPass(false) : setShowConfPass(true)
              }
              className="absolute right-2 h-full flex items-center"
            >
              {showConfPass ? <HidePassSVG/> : <ShowPassSVG/>}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="nationalId"
          >
            کد ملی
          </label>
          <input
            id="nationalId"
            type="number"
            placeholder="2134567890"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none "
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="phoneNumber"
          >
            شماره همراه
          </label>
          <input
            id="phoneNumber"
            pattern="[0]{1}[9]{1}[0-9]{9}"
            type="tel"
            minLength={11}
            maxLength={11}
            placeholder="09*********"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none "
            required
          />
        </div>

        <div className="flex flex-row items-center justify-between pt-6">
          <button
            type="submit"
            className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            ثبت نام
          </button>
        </div>
      </form>
      <div className=" text-center w-full font-semibold text-slate-700">
        <Link href="/login">ورود</Link>
      </div>
    </div>
  );
}
