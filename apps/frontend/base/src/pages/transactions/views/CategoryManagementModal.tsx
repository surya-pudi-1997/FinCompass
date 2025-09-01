import React, { useState, useMemo } from "react";
import { Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, useFormGenerator } from "@/shared/libs/formBuilder";
import { useCategoriesStore } from "@/shared/stores";
import {
  useCreateCategoryService,
  useUpdateCategoryService,
  useDeleteCategoryService,
} from "../services";
import {
  TransactionType,
  Category,
  CreateTransactionCategoryDto,
} from "@fin-compass/types";

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: TransactionType;
}

const CATEGORY_FORM_FIELDS = [
  {
    name: "name",
    type: "text" as const,
    label: "Category Name",
    placeholder: "Enter category name",
    validation: {
      required: true,
      minlength: 2,
      maxlength: 100,
    },
  },
  {
    name: "type",
    type: "select" as const,
    label: "Category Type",
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
    name: "icon",
    type: "text" as const,
    label: "Icon",
    placeholder: "Enter icon (optional)",
  },
];

export const CategoryManagementModal: React.FC<
  CategoryManagementModalProps
> = ({ isOpen, onClose, selectedType }) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const categories = useCategoriesStore((state) => state.categories);

  // Services for category management
  const { createCategory } = useCreateCategoryService();
  const { updateCategory } = useUpdateCategoryService();
  const { deleteCategory } = useDeleteCategoryService();

  // Filter categories based on selectedType
  const filteredCategories = useMemo(
    () =>
      categories.filter((cat) => cat.type === selectedType && !cat.isSystem),
    [categories, selectedType]
  );

  const handleCreateCategory = async (data: CreateTransactionCategoryDto) => {
    try {
      await createCategory(data);
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Create category error:", error);
      toast.error("Failed to create category");
    }
  };

  const handleUpdateCategory = async (
    id: string,
    data: CreateTransactionCategoryDto
  ) => {
    try {
      await updateCategory(id, data);
      setEditingCategory(null);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Update category error:", error);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error("Failed to delete category");
    }
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const cancelCategoryEdit = () => {
    setEditingCategory(null);
  };

  const CATEGORY_FORM_CONFIG = React.useMemo(
    () => ({
      formName: editingCategory ? "editCategory" : "createCategory",
      fields: CATEGORY_FORM_FIELDS.map((field) => {
        const commonField = {
          ...field,
          defaultValue: editingCategory
            ? (editingCategory[field.name as keyof Category]?.toString() ?? "")
            : field.name === "type"
              ? "Expense"
              : "",
        };
        return commonField;
      }),
    }),
    [editingCategory]
  );

  const { formData, validateForm, getFieldProps, isSubmitting } =
    useFormGenerator(CATEGORY_FORM_CONFIG);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const categoryData: CreateTransactionCategoryDto = {
      name: formData.name as string,
      type: formData.type as TransactionType,
      icon: formData.icon ? (formData.icon as string) : undefined,
    };

    try {
      if (editingCategory) {
        await handleUpdateCategory(editingCategory.id, categoryData);
      } else {
        await handleCreateCategory(categoryData);
      }
    } catch (error) {
      console.error("Category form error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Manage Categories</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Category Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-3 p-3 border rounded-lg"
          >
            <h4 className="font-medium">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h4>
            <div className="space-y-2">
              <FormField {...getFieldProps("name")!} />
              <FormField {...getFieldProps("type")!} />
              <FormField {...getFieldProps("icon")!} />
            </div>
            <div className="flex space-x-2">
              <Button
                type="submit"
                size="sm"
                disabled={!formData.name || isSubmitting}
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
          </form>

          {/* Existing Categories */}
          <div className="space-y-2">
            <h4 className="font-medium">Existing Categories</h4>
            {filteredCategories.length === 0 ? (
              <p className="text-sm text-gray-500">
                No categories found for editing in {selectedType.toLowerCase()}{" "}
                transactions.
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
  );
};
