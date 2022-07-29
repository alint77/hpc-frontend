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
  lineThrough?: boolean;
  plan: Plan;
  className?: string;
  selected?: boolean;
}
export default function LandingplanCard({
  lineThrough,
  plan,
  className,
  selected,
}: Prop) {
  if (!plan.isActive) return <></>;
  return (
    <div className="rounded w-72 shadow-sm border-2 m-4">
      <div className="top bg-gray-100 p-4 w-full">
        <div className="flex flex-row-reverse items-center w-fit m-auto">
          <div className="mx-1 font-bold text-lg">{(plan.price*720).toLocaleString()}</div>
          
          <div className="text-xs ">تومان در ماه</div>
        </div>
        <div className="flex flex-row-reverse items-center w-fit m-auto">
          <div className="mx-1 text-xs font-semibold">{(plan.price).toLocaleString()}</div>
          
          <div className="text-xs ">تومان هر ساعت</div>
        </div>
      </div>
      <div className="bottom flex flex-row w-full  py-2 ">
        <div className="leftside text-xs text-right p-2 text-black w-1/2 space-y-1 ">
          <div>CPU: </div>
          <div>RAM: </div>
          <div>فضای ذخیره سازی </div>
          <div>ترافیک</div>
        </div>
        <div className="rightside text-xs text-left p-2 text-black w-1/2 space-y-1">
          <div>{plan.processorCores}</div>
          <div>{plan.memory}GB</div>
          <div>{plan.diskSize}GB</div>
          <div>نامحدود</div>
        </div>
      </div>
    </div>
  );
}
