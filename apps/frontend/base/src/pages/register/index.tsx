import React, { useMemo } from "react";
import { Link } from "react-router";
import { useFormGenerator } from "@/shared/hooks/useFormGenerator";
import FormField from "@/shared/components/FormField";
import type { CreateUserInput } from "@fin-compass/types";

const RegisterPage = () => {
  const formConfig = useMemo(
    () => ({
      formName: "register",
      fields: [
        {
          name: "fullName",
          type: "text" as const,
          label: "Full Name",
          placeholder: "Enter your full name",
          validation: {
            required: true,
            minlength: 2,
            maxlength: 100,
          },
        },
        {
          name: "email",
          type: "email" as const,
          label: "Email Address",
          placeholder: "Enter your email address",
          validation: {
            required: true,
            email: true,
          },
        },
        {
          name: "password",
          type: "password" as const,
          label: "Password",
          placeholder: "Create a password",
          validation: {
            required: true,
            minlength: 8,
            custom: (value: unknown) => {
              const password = value as string;
              if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
                return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
              }
              return null;
            },
          },
        },
        {
          name: "confirmPassword",
          type: "password" as const,
          label: "Confirm Password",
          placeholder: "Confirm your password",
          validation: {
            required: true,
            custom: (_value: unknown) => {
              // This will be handled differently in the form submission
              return null;
            },
          },
        },
        {
          name: "preferredCurrency",
          type: "select" as const,
          label: "Preferred Currency",
          placeholder: "Select your preferred currency",
          options: [
            { value: "USD", label: "US Dollar (USD)" },
            { value: "EUR", label: "Euro (EUR)" },
            { value: "GBP", label: "British Pound (GBP)" },
            { value: "JPY", label: "Japanese Yen (JPY)" },
            { value: "CAD", label: "Canadian Dollar (CAD)" },
            { value: "AUD", label: "Australian Dollar (AUD)" },
            { value: "CHF", label: "Swiss Franc (CHF)" },
            { value: "CNY", label: "Chinese Yuan (CNY)" },
            { value: "INR", label: "Indian Rupee (INR)" },
          ],
          validation: {
            required: true,
          },
        },
      ],
      onSubmit: async (data: Record<string, unknown>) => {
        // Validate password confirmation
        if (data.password !== data.confirmPassword) {
          console.error("Passwords do not match");
          return;
        }

        // Create the user data matching CreateUserInput interface
        const userData: CreateUserInput = {
          email: data.email as string,
          password: data.password as string,
          fullName: data.fullName as string,
          preferredCurrency: data.preferredCurrency as string,
        };

        console.log("Register form submitted with data:", userData);
        // TODO: Implement API call to register user
        // Example: await registerUser(userData);
      },
    }),
    []
  );

  const { formData, isSubmitting, resetForm, handleSubmit, getFieldProps } =
    useFormGenerator(formConfig);

  // Custom validation for password confirmation
  const validatePasswordMatch = () => {
    const password = formData.password as string;
    const confirmPassword = formData.confirmPassword as string;

    if (password && confirmPassword && password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const confirmPasswordError = validatePasswordMatch();

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join FinCompass to start managing your finances
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Field */}
          <FormField {...getFieldProps("fullName")!} />

          {/* Email Field */}
          <FormField {...getFieldProps("email")!} />

          {/* Password Field */}
          <FormField {...getFieldProps("password")!} />

          {/* Confirm Password Field */}
          <FormField
            {...getFieldProps("confirmPassword")!}
            error={
              confirmPasswordError || getFieldProps("confirmPassword")!.error
            }
          />

          {/* Preferred Currency Field */}
          <FormField {...getFieldProps("preferredCurrency")!} />

          {/* Submit Button */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting || !!confirmPasswordError}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
