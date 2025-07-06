import { routes } from "@/router/routes";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2  h-[40px] border-b border-gray-200 bg-white">
      <h1 className="text-xl font-bold">My Application</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href={routes.HOME} className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href={routes.ACCOUNTS} className="hover:underline">
              Accounts
            </a>
          </li>
          <li>
            <a href={routes.ASSETS} className="hover:underline">
              Assets
            </a>
          </li>
          <li>
            <a href={routes.TRANSACTIONS} className="hover:underline">
              Transactions
            </a>
          </li>
          <li>
            <a href={routes.CALCULATOR} className="hover:underline">
              Calculator
            </a>
          </li>
          <li>
            <a href={routes.ANALYZE} className="hover:underline">
              Analyze
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
