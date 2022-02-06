import { useContext } from "react";
import AuthContext from "../context/authContext";

export default function LoadingModal({ children }) {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div>
        <div className="absolute z-10 w-screen h-screen inset-0 bg-opacity-50 bg-black cursor-pointer"></div>
        <div className="fixed z-20 w-96 h-min inset-0 m-auto bg-white text-lg">loading...</div>
      </div>
    );
  }
  return <div>{children}</div>;
}
