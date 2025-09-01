import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormField, useFormGenerator } from "@/shared/libs/formBuilder";
import { CategoryManagementModal } from "./CategoryManagementModal";
import {
  CreateTransactionDto,
  TransactionType,
  // Category,
} from "@fin-compass/types";
import {
  useTransactionsStore,
  useAccountsStore,
  useAssetsStore,
  useCategoriesStore,
} from "@/shared/stores";

interface TransactionData extends CreateTransactionDto {
  id: string;
  userId: string;
  createdAt: Date;
}

interface TransactionFormProps {
  transaction?: TransactionData;
  onSubmit: (
    isEditing: boolean,
    formData: CreateTransactionDto,
    id?: string
  ) => void;
  onCancel: () => void;
}

const TRANSACTION_FORM_FIELDS = {
  formName: "transaction_form",
  fields: [
    {
      name: "type",
      type: "select" as const,
      label: "Transaction Type",
      options: [
        { value: "Income", label: "Income" },
        { value: "Expense", label: "Expense" },
        { value: "Investment", label: "Investment" },
      ],
      defaultValue: "",
      validation: {
        required: true,
      },
    },
    {
      name: "amount",
      type: "number" as const,
      label: "Amount",
      placeholder: "Enter amount",
      defaultValue: "",
      validation: {
        required: true,
        min: 0.01,
      },
    },
    {
      name: "accountId",
      type: "select" as const,
      label: "Account",
      placeholder: "Select account",
      defaultValue: "",
      validation: {
        required: true,
      },
    },
    {
      name: "categoryId",
      type: "select" as const,
      label: "Category",
      placeholder: "Select category",
      defaultValue: "",
      validation: {
        required: true,
      },
    },
    {
      name: "assetId",
      type: "select" as const,
      label: "Asset (Optional)",
      placeholder: "Select asset",
      defaultValue: "",
      validation: {
        required: false,
      },
    },
    {
      name: "timestamp",
      type: "date" as const,
      label: "Date",
      defaultValue: "",
      validation: {
        required: true,
      },
    },
    {
      name: "note",
      type: "textarea" as const,
      label: "Note (Optional)",
      placeholder: "Add a note...",
      defaultValue: "",
      validation: {
        required: false,
        maxlength: 500,
      },
    },
  ],
};

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  transaction,
  onCancel,
}) => {
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType>(
    transaction?.type || "Expense"
  );

  const isEditing = !!transaction;

  // Store selectors
  const accounts = useAccountsStore((state) => state.accounts);
  const assets = useAssetsStore((state) => state.assets);
  const categories = useCategoriesStore((state) => state.categories);
  const { createTransactionError, updateTransactionError } =
    useTransactionsStore();

  const { formData, validateForm, getFieldProps, isSubmitting } =
    useFormGenerator({
      ...TRANSACTION_FORM_FIELDS,
      initialValues: {
        ...(transaction || {}),
        timestamp: new Date(transaction?.timestamp || Date.now())
          .toISOString()
          .split("T")[0],
      },
    });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    console.log({ formData });

    const transactionData: CreateTransactionDto = {
      type: formData.type as TransactionType,
      amount: Number(formData.amount),
      accountId: formData.accountId as string,
      categoryId: formData.categoryId as string,
      assetId: formData.assetId ? (formData.assetId as string) : undefined,
      timestamp: new Date(formData.timestamp as string),
      note: formData.note ? (formData.note as string) : undefined,
    };
    console.log({ transactionData });
    onSubmit(isEditing, transactionData, transaction?.id);
  };

  // Error handling
  useEffect(() => {
    if (createTransactionError) {
      toast.error(createTransactionError);
    }
    if (updateTransactionError) {
      toast.error(updateTransactionError);
    }
  }, [createTransactionError, updateTransactionError]);

  return (
    <>
      <form id="transaction-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type */}
        <div className="space-y-2">
          <FormField
            {...getFieldProps("type")!}
            onChange={(e) => {
              setSelectedType(e.target.value as TransactionType);
              getFieldProps("type")!.onChange(e);
            }}
          />
        </div>

        {/* Amount */}
        <FormField {...getFieldProps("amount")!} />

        {/* Account */}
        <FormField
          {...getFieldProps("accountId")!}
          options={accounts.map((account) => ({
            value: account.id,
            label: account.name,
          }))}
        />

        {/* Category with Manage button */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Category</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsManagingCategories(true)}
              className="h-6 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Manage
            </Button>
          </div>
          <FormField
            {...getFieldProps("categoryId")!}
            options={categories
              .filter((cat) => cat.type === selectedType)
              .map((category) => ({
                value: category.id,
                label: category.icon
                  ? `${category.icon} ${category.name}`
                  : category.name,
              }))}
          />
        </div>

        {/* Asset */}
        <FormField
          {...getFieldProps("assetId")!}
          options={[
            { value: "", label: "No asset" },
            ...assets.map((asset) => ({
              value: asset.id,
              label: asset.name,
            })),
          ]}
        />

        {/* Date */}
        <FormField
          {...getFieldProps("timestamp")!}
          value={
            getFieldProps("timestamp")!?.value ||
            (transaction?.timestamp
              ? new Date(transaction.timestamp).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0])
          }
        />

        {/* Note */}
        <FormField {...getFieldProps("note")!} />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>

      <CategoryManagementModal
        isOpen={isManagingCategories}
        onClose={() => setIsManagingCategories(false)}
        selectedType={selectedType}
      />
    </>
  );
};
