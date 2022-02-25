import { useContext } from "react";
import AuthContext from "../context/authContext";

export default function LoadingModal({ children }) {
  const { isLoading } = useContext(AuthContext);

  return (
    <>
      {isLoading && (
        <div>
          <div className="absolute z-40 w-screen h-[90rem] inset-0 opacity-60 bg-gray-900 cursor-pointer"></div>
          <div className="fixed z-50 w-96 h-min inset-0 m-auto bg-white rounded-lg text-lg p-4">
            loading...
          </div>
        </div>
      )}
      <div>{children}</div>
    </>
  );
}
