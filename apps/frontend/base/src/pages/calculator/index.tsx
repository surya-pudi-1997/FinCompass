import { Outlet } from "react-router";

const CalculatorPage = () => {
  return (
    <div>
      <h1>calculator</h1>
      <h2> sub calulator page</h2>
      <Outlet></Outlet>
    </div>
  );
};
export default CalculatorPage;
