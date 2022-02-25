import { OS } from "../../config/config";

interface Plan {
  id: string;
  isActive: boolean;
  memory: number;
  name: string;
  diskSize: number;
  price: number;
  processorCores: number;
}

interface Prop {
  plan: Plan;
  className?: string;
  selected?: boolean;
}
export default function planCard({ plan, className, selected }: Prop) {
  if (!plan.isActive) return <></>;
  return (
    <div
      className={className + (selected?" border-slate-800 text-white ":" border-slate-400")+" flex flex-col  border-2 m-2 rounded shadow "}
    >
      <div className={(selected?" bg-slate-700":"bg-slate-400")+" py-2 text-center "}>
        <div>{plan.name}</div>
      </div>
      <div className="p-4 text-left text-black">
        <div>CPU Cores: {plan.processorCores}</div>
        <div>RAM: {plan.memory}GB</div>
        <div>Disk Size: {plan.diskSize}GB</div>
      </div>
      <div className={(selected?"bg-slate-700 text-white ":"bg-slate-400 text-black ")+" py-2 text-center text-xs flex flex-row justify-center space-x-1"}>

          <span>تومان</span><span>{plan.price}</span><span>ساعتی</span>
      </div>
    </div>
  );
}
