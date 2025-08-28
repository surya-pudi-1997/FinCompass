import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useFormGenerator,
  FormConfig,
} from "@/shared/libs/formBuilder/useFormGenerator";
import {
  CreateTransactionDto,
  Transaction,
  TransactionType,
  Category,
  CreateTransactionCategoryDto,
} from "@fin-compass/types";
import {
  useTransactionsStore,
  useAccountsStore,
  useAssetsStore,
  useCategoriesStore,
} from "@/shared/stores";
import {
  useCreateTransactionService,
  useUpdateTransactionService,
  useCreateCategoryService,
  useUpdateCategoryService,
  useDeleteCategoryService,
} from "../services";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSuccess,
  onCancel,
}) => {
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryData, setNewCategoryData] =
    useState<CreateTransactionCategoryDto>({
      name: "",
      type: "Expense",
    });
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

  // Services
  const { createTransaction } = useCreateTransactionService();
  const { updateTransaction } = useUpdateTransactionService();
  const { createCategory } = useCreateCategoryService();
  const { updateCategory } = useUpdateCategoryService();
  const { deleteCategory } = useDeleteCategoryService();

  // Data is already loaded by the parent component (TransactionsTable)
  // No need to fetch data here as it's already available in the stores

  const formConfig: FormConfig = useMemo(() => {
    // Filter categories based on selectedType
    const availableCategories = categories.filter((cat) => {
      return cat.type === selectedType;
    });

    // Get default values with proper handling
    const defaultAccountId =
      transaction?.accountId || (accounts.length > 0 ? accounts[0].id : "");
    const defaultCategoryId =
      transaction?.categoryId ||
      (availableCategories.length > 0 ? availableCategories[0].id : "");
    const defaultAssetId = transaction?.assetId || "";

    return {
      formName: isEditing ? "editTransaction" : "createTransaction",
      fields: [
        {
          name: "type",
          type: "select",
          label: "Transaction Type",
          defaultValue: transaction?.type || "Expense",
          options: [
            { value: "Income", label: "Income" },
            { value: "Expense", label: "Expense" },
            { value: "Investment", label: "Investment" },
          ],
          validation: {
            required: true,
          },
        },
        {
          name: "amount",
          type: "number",
          label: "Amount",
          placeholder: "Enter amount",
          defaultValue: transaction?.amount || "",
          validation: {
            required: true,
            min: 0.01,
          },
        },
        {
          name: "accountId",
          type: "select",
          label: "Account",
          defaultValue: defaultAccountId,
          options: accounts.map((account) => ({
            value: account.id,
            label: account.name,
          })),
          validation: {
            required: true,
          },
        },
        {
          name: "categoryId",
          type: "select",
          label: "Category",
          defaultValue: defaultCategoryId,
          options: availableCategories.map((category) => ({
            value: category.id,
            label: category.name,
          })),
          validation: {
            required: true,
          },
        },
        {
          name: "assetId",
          type: "select",
          label: "Asset (Optional)",
          defaultValue: defaultAssetId,
          options: [
            { value: "", label: "No asset" },
            ...assets.map((asset) => ({
              value: asset.id,
              label: asset.name,
            })),
          ],
          validation: {
            required: false,
          },
        },
        {
          name: "timestamp",
          type: "date",
          label: "Date",
          defaultValue: transaction?.timestamp
            ? new Date(transaction.timestamp).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          validation: {
            required: true,
          },
        },
        {
          name: "note",
          type: "textarea",
          label: "Note (Optional)",
          placeholder: "Add a note...",
          defaultValue: transaction?.note || "",
          validation: {
            required: false,
            maxlength: 500,
          },
        },
      ],
      onSubmit: async (data) => {
        const transactionData: CreateTransactionDto = {
          type: data.type as TransactionType,
          amount: Number(data.amount),
          accountId: data.accountId as string,
          categoryId: data.categoryId as string,
          assetId: data.assetId ? (data.assetId as string) : undefined,
          timestamp: new Date(data.timestamp as string),
          note: data.note ? (data.note as string) : undefined,
        };

        try {
          if (isEditing && transaction) {
            await updateTransaction(transaction.id, transactionData);
          } else {
            await createTransaction(transactionData);
          }
          onSuccess();
        } catch (error) {
          console.error("Transaction form error:", error);
        }
      },
    };
  }, [transaction, accounts, assets, categories, selectedType, isEditing]);

  const {
    isSubmitting,
    handleSubmit: handleFormSubmit,
    getFieldProps,
    formData,
  } = useFormGenerator(formConfig);

  // Update categoryId when transaction type changes and no matching category exists
  useEffect(() => {
    const availableCategories = categories.filter((cat) => {
      return cat.type === selectedType;
    });

    const currentCategoryId = formData.categoryId as string;
    if (
      currentCategoryId &&
      !availableCategories.find((cat) => cat.id === currentCategoryId)
    ) {
      // Current category doesn't match selected type, reset to first available or empty
      // We'll rely on the form re-rendering with the new formConfig to handle this
    }
  }, [selectedType, categories, formData.categoryId]);

  // Category management functions
  const handleCreateCategory = useCallback(async () => {
    try {
      await createCategory(newCategoryData);
      setNewCategoryData({ name: "", type: "Expense" });
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Create category error:", error);
    }
  }, [createCategory, newCategoryData]);

  const handleUpdateCategory = useCallback(async () => {
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, newCategoryData);
      setEditingCategory(null);
      setNewCategoryData({ name: "", type: "Expense" });
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Update category error:", error);
    }
  }, [updateCategory, editingCategory, newCategoryData]);

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      try {
        await deleteCategory(categoryId);
        toast.success("Category deleted successfully");
      } catch (error) {
        console.error("Delete category error:", error);
      }
    },
    [deleteCategory]
  );

  const startEditingCategory = useCallback((category: Category) => {
    setEditingCategory(category);
    setNewCategoryData({
      name: category.name,
      type: category.type,
      icon: category.icon,
    });
  }, []);

  const cancelCategoryEdit = useCallback(() => {
    setEditingCategory(null);
    setNewCategoryData({ name: "", type: "Expense" });
  }, []);

  // Error handling
  useEffect(() => {
    if (createTransactionError) {
      toast.error(createTransactionError);
    }
    if (updateTransactionError) {
      toast.error(updateTransactionError);
    }
  }, [createTransactionError, updateTransactionError]);

  const renderField = (fieldName: string) => {
    const fieldProps = getFieldProps(fieldName);
    if (!fieldProps) return null;

    const commonProps = {
      id: fieldProps.name,
      name: fieldProps.name,
      disabled: fieldProps.disabled,
      onChange:
        fieldProps.type === "select" && fieldName === "type"
          ? (e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedType(e.target.value as TransactionType);
              fieldProps.onChange(e);
            }
          : fieldProps.onChange,
      onBlur: fieldProps.onBlur,
    };

    return (
      <div key={fieldName} className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor={fieldProps.name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {fieldProps.label}
            {fieldProps.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </label>
          {fieldName === "categoryId" && (
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
          )}
        </div>

        {fieldProps.type === "select" ? (
          <select
            {...commonProps}
            value={(fieldProps.value as string) || ""}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {fieldProps.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : fieldProps.type === "textarea" ? (
          <textarea
            id={fieldProps.name}
            name={fieldProps.name}
            disabled={fieldProps.disabled}
            onChange={fieldProps.onChange}
            onBlur={fieldProps.onBlur}
            placeholder={fieldProps.placeholder}
            value={fieldProps.value as string}
            rows={3}
            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        ) : (
          <Input
            id={fieldProps.name}
            name={fieldProps.name}
            disabled={fieldProps.disabled}
            onChange={fieldProps.onChange}
            onBlur={fieldProps.onBlur}
            type={fieldProps.type}
            placeholder={fieldProps.placeholder}
            value={fieldProps.value as string | number}
          />
        )}

        {fieldProps.error && (
          <p className="text-sm text-destructive">{fieldProps.error}</p>
        )}
      </div>
    );
  };

  const currentTransactionType = selectedType;

  const filteredCategories = categories.filter((cat) => {
    return cat.type === currentTransactionType;
  });

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {formConfig.fields.map((field) => renderField(field.name))}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>

      {/* Category Management Modal */}
      {isManagingCategories && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Manage Categories</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsManagingCategories(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Add/Edit Category Form */}
              <div className="space-y-3 p-3 border rounded-lg">
                <h4 className="font-medium">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Category name"
                    value={newCategoryData.name}
                    onChange={(e) =>
                      setNewCategoryData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <select
                    value={newCategoryData.type}
                    onChange={(e) =>
                      setNewCategoryData((prev) => ({
                        ...prev,
                        type: e.target.value as TransactionType,
                      }))
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                    <option value="Investment">Investment</option>
                  </select>
                  <Input
                    placeholder="Icon (optional)"
                    value={newCategoryData.icon || ""}
                    onChange={(e) =>
                      setNewCategoryData((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={
                      editingCategory
                        ? handleUpdateCategory
                        : handleCreateCategory
                    }
                    disabled={!newCategoryData.name.trim()}
                  >
                    {editingCategory ? "Update" : "Add"}
                  </Button>
                  {editingCategory && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={cancelCategoryEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

              {/* Existing Categories */}
              <div className="space-y-2">
                <h4 className="font-medium">Existing Categories</h4>
                {filteredCategories.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No categories found for{" "}
                    {currentTransactionType.toLowerCase()} transactions.
                  </p>
                ) : (
                  filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center space-x-2">
                        {category.icon && <span>{category.icon}</span>}
                        <span className="text-sm">{category.name}</span>
                        <span className="text-xs text-gray-500">
                          ({category.type})
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingCategory(category)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
