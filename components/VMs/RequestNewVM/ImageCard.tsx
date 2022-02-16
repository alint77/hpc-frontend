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
}

export default function ImageCard({ image, className }: Prop) {
  return (
    <div>
      <div
        className={
          className + " flex flex-col border-black border-[1px] m-2 p-4"
        }
      >
        <div>
          <div>osName: {image.osName}</div>
          <div>osVersion: {image.osVersion}</div>
          {image.softWare && <div>software: {image.softWare}</div>}
        </div>
      </div>
    </div>
  );
}
