import React from "react";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAccountsSelectors } from "@/shared/stores";
import { CreateAccountDto } from "@fin-compass/types";
import AccountCard from "./AccountCard";
import { AccountsListSkeleton } from "./AccountsSkeleton";

interface Account extends CreateAccountDto {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountsListProps {
  onDeleteAccount: (accountId: string) => void;
  onEditAccount: (account: Account) => void;
  onAddAccount: () => void;
  onRefresh: () => void;
  deleteAccountLoading: boolean;
  refreshLoading?: boolean;
}

const AccountsList: React.FC<AccountsListProps> = ({
  onDeleteAccount,
  onEditAccount,
  onAddAccount,
  onRefresh,
  deleteAccountLoading,
  refreshLoading = false,
}) => {
  const accounts = useAccountsSelectors.accounts();
  const fetchAccountsLoading = useAccountsSelectors.fetchAccountsLoading();
  const fetchAccountsError = useAccountsSelectors.fetchAccountsError();

  if (fetchAccountsLoading) {
    return <AccountsListSkeleton />;
  }

  if (fetchAccountsError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Error Loading Accounts</h3>
          <p className="text-muted-foreground mt-2">{fetchAccountsError}</p>
        </div>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Accounts Found</h3>
          <p className="text-muted-foreground mt-2">
            You haven't created any accounts yet. Get started by creating your
            first account.
          </p>
        </div>
        <Button className="mt-4" onClick={onAddAccount}>
          <Plus className="h-4 w-4 mr-2" />
          Create Account
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Accounts</h2>
          <p className="text-muted-foreground">
            {accounts.length} account{accounts.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={refreshLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={onAddAccount}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onDelete={onDeleteAccount}
            onEdit={onEditAccount}
            isDeleting={deleteAccountLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default AccountsList;
