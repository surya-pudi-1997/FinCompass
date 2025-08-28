import React from "react";

import { TransactionsSummary, TransactionsTable } from "./views";

const TransactionsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Transactions
        </h1>
      </div>

      <TransactionsSummary />
      <TransactionsTable />
    </div>
  );
};

export default TransactionsPage;
