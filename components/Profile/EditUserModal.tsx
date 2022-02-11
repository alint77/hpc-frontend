import React from "react";
import Modal from "../Modal/Modal";

interface Prop {
  isOpen: boolean;
  setIsOpen: Function;
  title: any;
  children?: any;
}

export default function EditUserModal({
  isOpen,
  setIsOpen,
  title,
  children,
}: Prop)

{



  return (
    <div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}></Modal>
    </div>
  );
}
