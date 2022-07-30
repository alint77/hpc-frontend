import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import LandingPlanCard from "../components/Plans/LandingplanCard";
import { API_URL } from "../config/config";
import LandingLayout from "../components/landingLayout";
import AuthContext from "../context/authContext";


interface Plan {
  id: string;
  isActive: boolean;
  memory: number;
  name: string;
  os: string;
  diskSize: number;
  period: number;
  price: number;
  processorCores: number;
}

export default function index() {
  const { user, isLoading, setisLoading } = useContext(AuthContext);
  const [plansList, setPlansList] = useState<Array<Plan>>([]);

  const handleFetchPlansList = async () => {
    try {
      const res = await fetch(
        `${API_URL}/plans/GetAllPlans?pageSize=50&pageNumber=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        setPlansList(data.data);
      } else {
        console.log(data);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchPlansList();
  }, []);

  return (
    <div className="w-full text-right m-auto xl:max-w-fit">
      <div className=" text-slate-800 m-auto text-center font-bold text-xl p-4 mt-6">
        سامانه محاسبات سنگین دانشگاه صنعتی نوشیروانی بابل
      </div>
      <div className="text-center m-auto my-2">
        ارائه دهنده ماشین های مجازی پرسرعت
      </div>
      <div className="text-center m-auto font-bold text-xl mt-24 mb-2">
        ..مزایا..
      </div>
      <div className="flex flex-row-reverse flex-wrap justify-evenly align-top">
        <div className=" w-72 p-3 rounded shadow-md bg-stone-200 h-36 m-4">
          <div className=" text-slate-500 font-bold text-center ">
            راه‌اندازی در لحظه
          </div>
          <div className="text-sm mt-2">
            تمامی سرویس‌ها و قابلیت‌ها به صورت آنی و در لحظه برای شما راه‌اندازی
            می‌شوند
          </div>
        </div>
        <div className=" w-72 p-3 rounded shadow-md bg-stone-200  h-36 m-4">
          <div className=" text-slate-500 font-bold text-center ">
            مقیاس‌پذیری
          </div>
          <div className="text-sm mt-2">
            بدون لحظه‌ای اختلال یا از دسترس خارج شدن، فقط با یک کلیک منابع سخت
            افزاری سرویس‌تان را افزایش دهید
          </div>
        </div>
        <div className=" w-72 p-3 rounded shadow-md bg-stone-200 h-36 m-4">
          <div className=" text-slate-500 font-bold text-center ">
            پرداخت ساعتی
          </div>

          <div className="text-sm mt-2">
            دیگر نیازی به پرداخت هزینه ماهانه یا سالانه نیست، هزینه هر سرویس
            تنها به صورت ساعتی از اعتبارتان کسر می‌شود
          </div>
        </div>
        <div className=" w-72 p-3 rounded shadow-md bg-stone-200 h-36 m-4">
          <div className=" text-slate-500 font-bold text-center ">
            خاموش کردن سرویس
          </div>
          <div className="text-sm mt-2">
            در زمان دلخواه سرویس‌تان را خاموش کنید. در هنگام خاموش بودن، هزینه
            سرویس نصف محاسبه می‌شود
          </div>
        </div>
      </div>
      <div className="text-center m-auto font-bold text-xl my-6">..پلن ها..</div>
      <div className="plans flex flex-row-reverse flex-wrap justify-evenly align-top">
        {plansList.map((v) => (
          <LandingPlanCard plan={v} key={v.id}></LandingPlanCard>
        ))}
      </div>
      
    </div>
  );
}
index.Layout = LandingLayout