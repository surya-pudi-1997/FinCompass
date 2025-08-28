import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/shared/hooks/useCurrency";
import { useTransactionsStore } from "@/shared/stores";

export const TransactionsSummary: React.FC = () => {
  const { formatCurrency } = useCurrency();

  const transactions = useTransactionsStore((state) => state.transactions);

  const summaryData = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

    const investments = transactions
      .filter((t) => t.type === "Investment")
      .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

    const netCashFlow = Number(income) - Number(expenses) - Number(investments);

    return {
      income,
      expenses,
      investments,
      netCashFlow,
      totalTransactions: transactions.length,
    };
  }, [transactions]);

  const summaryCards = [
    {
      title: "Total Income",
      value: summaryData.income,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Expenses",
      value: summaryData.expenses,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Investments",
      value: summaryData.investments,
      icon: PieChart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Net Cash Flow",
      value: summaryData.netCashFlow,
      icon: DollarSign,
      color: summaryData.netCashFlow >= 0 ? "text-green-600" : "text-red-600",
      bgColor: summaryData.netCashFlow >= 0 ? "bg-green-50" : "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {formatCurrency(card.value)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {card.title === "Net Cash Flow"
                  ? `From ${summaryData.totalTransactions} transaction${summaryData.totalTransactions !== 1 ? "s" : ""}`
                  : `Based on current transactions`}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
