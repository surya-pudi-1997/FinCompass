import React, { useState } from "react";
import {
  Trash2,
  DollarSign,
  Calendar,
  Building2,
  CreditCard,
  TrendingUp,
  Edit,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateAccountDto } from "@fin-compass/types";
import { useCurrency } from "@/shared/hooks";
import { formatDate as formatDateUtil } from "@/shared/utils";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface Account extends CreateAccountDto {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountCardProps {
  account: Account;
  onDelete: (accountId: string) => void;
  onEdit: (account: Account) => void;
  isDeleting?: boolean;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onDelete,
  onEdit,
  isDeleting = false,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { formatCurrency } = useCurrency();

  console.log({
    balance: Number(account?.balance || 0),
    result:
      Number(account?.balance || 0) <= 0 ? "text-red-600" : "text-green-600",
  });

  const formatDate = (dateString: string) => {
    return formatDateUtil(dateString);
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "Savings":
        return <Building2 className="h-4 w-4" />;
      case "CreditCard":
        return <CreditCard className="h-4 w-4" />;
      case "Investment":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{account.name}</CardTitle>
            <span className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
              {account.type}
            </span>
          </div>
          <CardAction>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(account)}
                disabled={isDeleting}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              {account.isSystem ? null : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isDeleting}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span
              className={`text-2xl font-bold ${
                Number(account?.balance || 0) <= 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {formatCurrency(account.balance || 0)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground w-full">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(account.createdAt)}</span>
          </div>
          {account.updatedAt !== account.createdAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Updated {formatDate(account.updatedAt)}</span>
            </div>
          )}
        </div>
      </CardFooter>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(account.id);
          setShowDeleteModal(false);
        }}
        accountName={account.name}
        isDeleting={isDeleting}
      />
    </Card>
  );
};

export default AccountCard;
