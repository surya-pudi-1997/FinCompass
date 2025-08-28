import React, { useMemo } from "react";

import { Input } from "@/components/ui/input";
import {
  useFormGenerator,
  FormConfig,
} from "@/shared/libs/formBuilder/useFormGenerator";
import { CreateAccountDto } from "@fin-compass/types";

interface Account extends CreateAccountDto {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountFormProps {
  account?: Account;
  onSubmit: (data: CreateAccountDto) => Promise<void>;
  onGetFormState?: (state: {
    isSubmitting: boolean;
    submitForm: () => void;
    isEditing: boolean;
  }) => void;
}

const AccountForm: React.FC<AccountFormProps> = ({
  account,
  onSubmit,
  onGetFormState,
}) => {
  const isEditing = !!account;

  const formConfig: FormConfig = useMemo(
    () => ({
      formName: isEditing ? "editAccount" : "createAccount",
      fields: [
        {
          name: "name",
          type: "text",
          label: "Account Name",
          placeholder: "Enter account name",
          defaultValue: account?.name || "",
          validation: {
            required: true,
            minlength: 2,
            maxlength: 50,
          },
        },
        {
          name: "type",
          type: "select",
          label: "Account Type",
          defaultValue: account?.type || "Savings",
          options: [
            { value: "Savings", label: "Savings" },
            { value: "CreditCard", label: "Credit Card" },
            { value: "Investment", label: "Investment" },
            { value: "Other", label: "Other" },
          ],
          validation: {
            required: true,
          },
        },
        {
          name: "balance",
          type: "number",
          label: isEditing ? "Current Balance" : "Initial Balance",
          placeholder: isEditing
            ? "Enter current balance"
            : "Enter initial balance",
          defaultValue: account?.balance || 0,
          validation: {
            required: true,
          },
        },
      ],
      onSubmit: async (data) => {
        const accountData: CreateAccountDto = {
          name: data.name as string,
          type: data.type as "Savings" | "CreditCard" | "Investment" | "Other",
          balance: Number(data.balance),
        };
        await onSubmit(accountData);
      },
    }),
    [account, isEditing, onSubmit]
  );

  const { isSubmitting, handleSubmit, getFieldProps } =
    useFormGenerator(formConfig);

  // Pass form state to parent component
  React.useEffect(() => {
    if (onGetFormState) {
      onGetFormState({
        isSubmitting,
        submitForm: () => {
          const form = document.getElementById(
            "account-form"
          ) as HTMLFormElement;
          if (form) {
            form.requestSubmit();
          }
        },
        isEditing,
      });
    }
  }, [isSubmitting, isEditing, onGetFormState]);

  const renderField = (fieldName: string) => {
    const fieldProps = getFieldProps(fieldName);
    if (!fieldProps) return null;

    const commonProps = {
      id: fieldProps.name,
      name: fieldProps.name,
      disabled: fieldProps.disabled,
      onChange: fieldProps.onChange,
      onBlur: fieldProps.onBlur,
    };

    return (
      <div key={fieldName} className="space-y-2">
        <label
          htmlFor={fieldProps.name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {fieldProps.label}
          {fieldProps.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </label>

        {fieldProps.type === "select" ? (
          <select
            {...commonProps}
            value={fieldProps.value as string}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {fieldProps.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <Input
            {...commonProps}
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

  return (
    <form id="account-form" onSubmit={handleSubmit} className="space-y-6">
      {formConfig.fields.map((field) => renderField(field.name))}
    </form>
  );
};

export default AccountForm;
