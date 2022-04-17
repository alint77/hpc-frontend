import { useContext, useState } from "react";
import AuthContext from "../../../context/authContext";
import { API_URL, OS } from "../../../config/config";
import Modal from "../../Modal/Modal";
import EditPlanModal from "./EditPlanModal";

interface Plan {
  id: string;
  name: string;
  isActive: boolean;
  diskSize:number,
  memory: number;
  price: number;
  processorCores: number;
}

interface Prop {
  plan: Plan;
}

export default function planCard({ plan }: Prop) {
  const [openModal, setOpenModal] = useState(false);
  const { isLoading, setisLoading } = useContext(AuthContext);


  return (
    <div>
      <div className="flex flex-col rounded bg-stone-200  border-[1px] m-2 p-4">
        <div>
          <div>name: {plan.name}</div>
          <div>cores: {plan.processorCores}</div>
          <div>memory: {plan.memory}</div>
          <div>disk: {plan.diskSize}GB</div>
          <div>price: {plan.price}</div>
          <div>isActive: {plan.isActive.toString()}</div>
        </div>
        <div className="flex flex-row justify-evenly">
          <div className=" border-2 cursor-pointer bg-slate-600 p-1 px-2 rounded text-white mt-2" onClick={()=>setOpenModal(true)}>
            Edit
          </div>
        </div>
      </div>
      <EditPlanModal
        isOpen={openModal}
        setIsOpen={setOpenModal}
        title={plan.name}
        plan={plan}
      ></EditPlanModal>
    </div>
  );
}
