import { Outlet } from "react-router";

const CalculatorLayout = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Calculator</h1>
      <Outlet />
    </div>
  );
};

export default CalculatorLayout;
