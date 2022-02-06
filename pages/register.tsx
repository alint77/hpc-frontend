import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../context/authContext";
import "react-toastify/dist/ReactToastify.css";


export default function registerPage() {
  const [userInput, setUserInput] = useState({});
  const {register,isLoading,user} = useContext(AuthContext)

  const handleRegister = async (e) => {
    e.preventDefault();
    register(userInput)
    
  };

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };


  if(user){
    return <>You're Already Logged In</>
  }

  return (
    <div>
      <form className="" onSubmit={handleRegister} onChange={handleChange}>
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          className=""
          required
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          className=""
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className=""
          required
        />
        <input
          name="password"
          minLength={6}
          type="password"
          placeholder="Password"
          className=""
          required
        />
        <input
          name="passwordConfirmation"
          minLength={6}
          type="password"
          placeholder="Confirm Password"
          className=""
          required
        />
        <input
          name="nationalId"
          type="number"
          placeholder="2134567890"
          className=""
          required
        />
        <input
          name="phoneNumber"
          pattern="[0]{1}[9]{1}[0-9]{9}"
          type="tel"
          minLength={11}
          maxLength={11}
          placeholder="09*********"
          className=""
          required
        />
        <button type="submit">Register</button>
      </form>

      <ToastContainer></ToastContainer>
    </div>
  );
}
