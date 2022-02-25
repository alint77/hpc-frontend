import { useContext, useState } from "react";
import AuthContext from "../../../context/authContext";
import { API_URL, OS } from "../../../config/config";
import Modal from "../../Modal/Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface Image {
  id: string;
  osName: string;
  osVersion: number;
  softWare: string;
}

interface Prop {
  image: Image;
  className?: string;
  selected?: boolean;
}

export default function ImageCard({
  image,
  className,
  selected = false,
}: Prop) {
  return (
    <div>
      <div
        className={
          className +
          (selected ? " border-slate-800 " : " border-slate-400 ") +
          " flex flex-col  border-2 m-2 rounded shadow "
        }
      >
        <div
          className={
            (selected ? " bg-slate-700" : "bg-slate-400") + " py-2 text-center "
          }
        >
        </div>
        <div className="p-4">
          <div>OS: {image.osName}</div>
          <div>Version: {image.osVersion}</div>
          {image.softWare && <div>software: {image.softWare}</div>}
        </div>
      </div>
    </div>
  );
}
