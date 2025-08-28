import React from "react";
import { DollarSign, CreditCard, PiggyBank, TrendingUp } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAccountsSelectors } from "@/shared/stores";
import { useCurrency } from "@/shared/hooks";

const AccountsSummary: React.FC = () => {
  const accounts = useAccountsSelectors.accounts();
  const { formatCurrency } = useCurrency();

  const getAccountStats = () => {
    const stats = accounts.reduce(
      (acc, account) => {
        const balance = Number(account.balance) || 0;
        acc.total += balance;

        switch (account.type) {
          case "Savings":
            acc.savings += balance;
            acc.savingsCount++;
            break;
          case "CreditCard":
            acc.creditCard += balance;
            acc.creditCardCount++;
            break;
          case "Investment":
            acc.investment += balance;
            acc.investmentCount++;
            break;
          default:
            acc.other += balance;
            acc.otherCount++;
        }

        return acc;
      },
      {
        total: 0,
        savings: 0,
        creditCard: 0,
        investment: 0,
        other: 0,
        savingsCount: 0,
        creditCardCount: 0,
        investmentCount: 0,
        otherCount: 0,
      }
    );

    return stats;
  };

  const stats = getAccountStats();

  if (accounts.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Account Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Total Balance
              </span>
            </div>
            <div
              className={`text-3xl font-bold ${
                Number(stats.total || 0) <= 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {formatCurrency(stats.total)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {accounts.length} account{accounts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Savings */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <PiggyBank className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Savings
              </span>
            </div>
            <div className="text-3xl font-bold">
              {stats.savingsCount > 0
                ? formatCurrency(stats.savings)
                : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.savingsCount} account{stats.savingsCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Credit Cards */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Credit Cards
              </span>
            </div>
            <div className="text-3xl font-bold">
              {stats.creditCardCount > 0
                ? formatCurrency(stats.creditCard)
                : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.creditCardCount} card
              {stats.creditCardCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Investment Section - Only show if there are investments */}
        {stats.investmentCount > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Investments
                </span>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.investment)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.investmentCount} investment account
                {stats.investmentCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountsSummary;
