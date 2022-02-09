import { OS } from "../../config/config";

interface Plan {
  id: string;
  isActive: boolean;
  memory: number;
  name: string;
  os: string;
  period: number;
  price: number;
  processorCores: number;
}

interface Prop {
  plan: Plan;
}
export default function planCard({plan}: Prop) {
  if(!plan.isActive) return <></>
  return (
    <div className="flex flex-col border-black border-[1px] m-2">
        <div>
          <div>name: {plan.name}</div>
          <div>cores: {plan.processorCores}</div>
          <div>memory: {plan.memory}</div>
          <div>os: {OS[plan.os]}</div>
          <div>period: {plan.period}</div>
          <div>price: {plan.price}</div>
        </div>
      </div>
  );
}
