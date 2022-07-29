import Link from "next/link";

export default function help() {
  return (
    <div className="flex flex-col text-right max-w-4xl m-auto">
      <div className="mb-6  bg-stone-200 rounded shadow-md p-6 mx-2">
        <Link href="https://hpc.nit.ac.ir/nithpc.zip">
          <a>دانلود ابزارهای مورد نیاز برای اتصال به سامانه </a>
        </Link>
      </div>
      <div className="mb-6  bg-stone-200 rounded shadow-md p-6 mx-2">
        <Link href="https://hpc.nit.ac.ir/nithpc.pdf">
          <a> (پی دی اف ) دانلود راهنمای اتصال به ماشین‌ مجازی </a>
        </Link>
      </div>
      <div className="mb-6  bg-stone-200 rounded shadow-md p-6 mx-2 ">
        <p className="mb-6">راهنمای تصویری اتصال به ماشین مجازی ویندوزی از سیستم عامل ویندوز</p>
        <video src="https://hpc.nit.ac.ir/hpcrdp.mp4" className="z-0 max-w-2xl m-auto" controls></video>
      </div>
      <div className="mb-6  bg-stone-200 rounded shadow-md p-6 mx-2">
        <Link href="https://hpc.nit.ac.ir/HPC_FAQ.html">
          <a>پرسش‌های متداول</a>
        </Link>
      </div>
    </div>
  );
}
