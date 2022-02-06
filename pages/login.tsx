import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function loginPage() {
    const {login,user,isLoading} = useContext(AuthContext)
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };
  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    login(userInput)
  };
  
  if(user)
  return <>you're already logged in</>

  return (
    <div>
      <form onSubmit={handleSubmit} onChange={handleChange} className="">
        <input name="email" type="email" placeholder="Email Address" />
        <input type="password" name="password" placeholder="********" />

        <button type="submit">login</button>
      </form>
      <ToastContainer></ToastContainer>
    </div>
  );
}
