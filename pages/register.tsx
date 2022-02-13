import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../context/authContext";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

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
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  if (user) {
    return <>You're Already Logged In</>;
  }

  return (
    <div className="w-full max-w-[28rem] m-auto">
      <form
        onSubmit={handleRegister}
        onChange={handleChange}
        className="bg-gray-100 w-[28rem] shadow-md rounded p-12 pb-8 mb-4"
      >
        <div className="titleHolder flex w-full text-3xl font-semibold mb-10">
          Register
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="firstName"
          >
            First Name
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
            Last Name
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
            Email
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
            Password
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
              {showPass ? "hide" : "show"}
            </div>
          </div>
        </div>
        <div className=" mb-5">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="passwordConfirmation"
          >
            Repeat Password
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
              {showConfPass ? "hide" : "show"}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="nationalId"
          >
            Social Security Number
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
            Phone Number
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

        <div className="flex flex-row-reverse items-center justify-between pt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign Up
          </button>
        </div>
      </form>
      <div className=" text-center w-full font-semibold text-blue-800">
        <Link href="/login">Login</Link>
      </div>

      <ToastContainer></ToastContainer>
    </div>
  );
}
