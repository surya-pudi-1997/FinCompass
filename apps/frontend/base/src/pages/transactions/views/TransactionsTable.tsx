import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Transaction, TransactionType } from "@fin-compass/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import FormDrawer from "@/components/layouts/FormDrawer";
import {
  useTransactionsStore,
  useAccountsStore,
  useAssetsStore,
  useCategoriesStore,
} from "@/shared/stores";
import { useCurrency } from "@/shared/hooks/useCurrency";
import { formatDate } from "@/shared/utils/date";
import {
  TransactionForm,
  DeleteConfirmationModal,
  TransactionsSkeleton,
} from ".";
import {
  useGetTransactionsService,
  useDeleteTransactionService,
  useGetCategoriesService,
} from "../services";
import { useGetAccountsService } from "../../accounts/services";
import { useGetAssetsService } from "../../assets/services";

type SortField = "timestamp" | "amount" | "type" | "account" | "category";
type SortDirection = "asc" | "desc";

export const TransactionsTable: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Store selectors
  const {
    transactions,
    fetchTransactionsLoading,
    fetchTransactionsError,
    deleteTransactionError,
  } = useTransactionsStore();

  const accounts = useAccountsStore((state) => state.accounts);
  const assets = useAssetsStore((state) => state.assets);
  const categories = useCategoriesStore((state) => state.categories);

  // Services
  const { getTransactions } = useGetTransactionsService();
  const { deleteTransaction } = useDeleteTransactionService();
  const { getAccounts } = useGetAccountsService();
  const { getAssets } = useGetAssetsService();
  const { getCategories } = useGetCategoriesService();

  // Create lookup maps for efficient display
  const accountsMap = useMemo(
    () => new Map(accounts.map((account) => [account.id, account])),
    [accounts]
  );

  const assetsMap = useMemo(
    () => new Map(assets.map((asset) => [asset.id, asset])),
    [assets]
  );

  const categoriesMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  // Sorted transactions
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "timestamp":
          comparison =
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
        case "account":
          const accountA = accountsMap.get(a.accountId)?.name || "";
          const accountB = accountsMap.get(b.accountId)?.name || "";
          comparison = accountA.localeCompare(accountB);
          break;
        case "category":
          const categoryA = categoriesMap.get(a.categoryId)?.name || "";
          const categoryB = categoriesMap.get(b.categoryId)?.name || "";
          comparison = categoryA.localeCompare(categoryB);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [transactions, sortField, sortDirection, accountsMap, categoriesMap]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  const getSortIcon = useCallback(
    (field: SortField) => {
      if (sortField !== field) {
        return <ChevronsUpDown className="h-4 w-4" />;
      }
      return sortDirection === "asc" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    },
    [sortField, sortDirection]
  );

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case "Income":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Expense":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Investment":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleAdd = useCallback(() => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback((transaction: Transaction) => {
    setDeletingTransaction(transaction);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingTransaction) {
      deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
    }
  }, [deletingTransaction, deleteTransaction]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  }, []);

  // Effects
  useEffect(() => {
    getTransactions();
    getAccounts();
    getAssets();
    getCategories();
  }, []); // Empty dependency array to prevent infinite loops

  useEffect(() => {
    if (deleteTransactionError) {
      toast.error(deleteTransactionError);
    }
  }, [deleteTransactionError]);

  if (fetchTransactionsLoading) {
    return <TransactionsSkeleton />;
  }

  if (fetchTransactionsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-400">
            {fetchTransactionsError}
          </p>
          <Button onClick={getTransactions} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Transactions</CardTitle>
          <Button onClick={handleAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No transactions found. Create your first transaction to get
                started.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("timestamp")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date</span>
                        {getSortIcon("timestamp")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Type</span>
                        {getSortIcon("type")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Amount</span>
                        {getSortIcon("amount")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Category</span>
                        {getSortIcon("category")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("account")}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Account</span>
                        {getSortIcon("account")}
                      </div>
                    </TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {formatDate(transaction.timestamp.toString())}
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(transaction.type)}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {categoriesMap.get(transaction.categoryId)?.name ||
                          "Unknown Category"}
                      </TableCell>
                      <TableCell>
                        {accountsMap.get(transaction.accountId)?.name ||
                          "Unknown Account"}
                      </TableCell>
                      <TableCell>
                        {transaction.assetId
                          ? assetsMap.get(transaction.assetId)?.name ||
                            "Unknown Asset"
                          : "-"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.note || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(transaction)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Drawer */}
      <FormDrawer
        isOpen={isFormOpen}
        onClose={handleFormClose}
        header={
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleFormClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        }
        body={
          <TransactionForm
            transaction={editingTransaction}
            onSuccess={handleFormClose}
            onCancel={handleFormClose}
          />
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description={`Are you sure you want to delete this transaction? This action cannot be undone.`}
      />
    </>
  );
};
