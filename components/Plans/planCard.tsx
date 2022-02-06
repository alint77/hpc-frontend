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
export default function planCard(props: Prop) {
  return (
    <div className="flex flex-col border-black border-[1px] m-2">
      <div>{props.plan.name}</div>
      <div>{props.plan.isActive}</div>
      <div>{props.plan.memory}</div>
      <div>{props.plan.os}</div>
      <div>{props.plan.period}</div>
      <div>{props.plan.price}</div>
      <div>{props.plan.processorCores}</div>
      <div>{props.plan.id}</div>
    </div>
  );
}
