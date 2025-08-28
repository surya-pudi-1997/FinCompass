import { useState, useCallback, useEffect, useMemo } from "react";

// TypeScript interface definitions
interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  email?: boolean;
  custom?: (value: unknown) => string | null;
}

interface FieldOption {
  value: string;
  label: string;
}

interface FieldConfig {
  name: string;
  type:
    | "text"
    | "number"
    | "date"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio";
  label: string;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: FieldOption[];
  validation?: FieldValidation;
}

interface FormConfig {
  formName: string;
  fields: FieldConfig[];
  onSubmit?: (data: Record<string, unknown>) => Promise<void> | void;
}

interface FieldProps {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  value: string | number | boolean;
  checked?: boolean;
  options?: FieldOption[];
  required?: boolean;
  disabled: boolean;
  error?: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

interface UseFormGeneratorReturn {
  formData: Record<string, unknown>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  validateField: (name: string, value: unknown) => string | null;
  validateForm: () => boolean;
  getFieldProps: (fieldName: string) => FieldProps | null;
  getAllFieldsProps: () => Record<string, FieldProps>;
}

/**
 * Custom React hook for generating and managing dynamic forms.
 * It handles state, validation, and provides field props for rendering.
 */
export const useFormGenerator = (
  config: FormConfig
): UseFormGeneratorReturn => {
  // Initialize formData with default values from the config
  const initialData = useMemo(
    () =>
      config.fields.reduce(
        (acc: Record<string, unknown>, field: FieldConfig) => {
          acc[field.name] =
            field.defaultValue !== undefined ? field.defaultValue : "";
          // Special handling for checkbox/radio if needed, default to false or first option
          if (field.type === "checkbox")
            acc[field.name] = field.defaultValue || false;
          if (
            field.type === "radio" &&
            field.options &&
            field.options.length > 0
          ) {
            acc[field.name] = field.defaultValue || field.options[0].value;
          }
          return acc;
        },
        {}
      ),
    [config.fields]
  );

  const [formData, setFormData] =
    useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Effect to re-initialize form data if config changes
  useEffect(() => {
    setFormData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  /**
   * Validates a single field based on its configuration.
   */
  const validateField = useCallback(
    (name: string, value: unknown): string | null => {
      const fieldConfig = config.fields.find(
        (f: FieldConfig) => f.name === name
      );
      if (!fieldConfig || !fieldConfig.validation) return null;

      const validation = fieldConfig.validation;

      // Required validation
      if (
        validation.required &&
        (value === "" ||
          value === null ||
          value === undefined ||
          (typeof value === "boolean" && value === false))
      ) {
        return `${fieldConfig.label} is required.`;
      }

      // Type-specific validations
      switch (fieldConfig.type) {
        case "text":
        case "textarea":
        case "email":
        case "password":
          if (typeof value === "string") {
            if (validation.minlength && value.length < validation.minlength) {
              return `${fieldConfig.label} must be at least ${validation.minlength} characters.`;
            }
            if (validation.maxlength && value.length > validation.maxlength) {
              return `${fieldConfig.label} must be at most ${validation.maxlength} characters.`;
            }
            if (
              validation.pattern &&
              !new RegExp(validation.pattern).test(value)
            ) {
              return `${fieldConfig.label} format is invalid.`;
            }
            if (validation.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return `Please enter a valid email address.`;
            }
          }
          break;
        case "number":
          const numValue = parseFloat(value as string);
          if (validation.required && (value === "" || isNaN(numValue))) {
            return `${fieldConfig.label} must be a number.`;
          }
          if (!isNaN(numValue)) {
            if (validation.min !== undefined && numValue < validation.min) {
              return `${fieldConfig.label} must be at least ${validation.min}.`;
            }
            if (validation.max !== undefined && numValue > validation.max) {
              return `${fieldConfig.label} must be at most ${validation.max}.`;
            }
          }
          break;
        case "date":
          const dateValue = new Date(value as string);
          if (
            validation.required &&
            (value === "" || isNaN(dateValue.getTime()))
          ) {
            return `${fieldConfig.label} must be a valid date.`;
          }
          if (!isNaN(dateValue.getTime())) {
            if (validation.min && dateValue < new Date(validation.min)) {
              return `${fieldConfig.label} must be on or after ${validation.min}.`;
            }
            if (validation.max && dateValue > new Date(validation.max)) {
              return `${fieldConfig.label} must be on or before ${validation.max}.`;
            }
          }
          break;
      }

      // Custom validation
      if (validation.custom) {
        const customError = validation.custom(value);
        if (customError) return customError;
      }

      return null;
    },
    [config.fields]
  );

  /**
   * Validates all fields in the form.
   */
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    config.fields.forEach((field: FieldConfig) => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, config.fields, validateField]);

  /**
   * Handles changes to form input fields.
   */
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const checked = "checked" in e.target ? e.target.checked : false;

      setFormData((prevData: Record<string, unknown>) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
      // Clear error for the field as user starts typing/changing
      setErrors((prevErrors: Record<string, string>) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    },
    []
  );

  /**
   * Handles blur event for form input fields, triggering field-level validation.
   */
  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const checked = "checked" in e.target ? e.target.checked : false;
      const fieldValue = type === "checkbox" ? checked : value;
      const error = validateField(name, fieldValue);

      setErrors((prevErrors: Record<string, string>) => {
        const newErrors = { ...prevErrors };
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    },
    [validateField]
  );

  /**
   * Handles form submission.
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      const isValid = validateForm();

      if (isValid) {
        try {
          if (config.onSubmit) {
            await config.onSubmit(formData);
          }
        } catch (submitError) {
          console.error("Form submission error:", submitError);
        }
      }
      setIsSubmitting(false);
    },
    [formData, validateForm, config.onSubmit]
  );

  /**
   * Resets the form to its initial state.
   */
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  /**
   * Get field props for a specific field by name.
   */
  const getFieldProps = useCallback(
    (fieldName: string): FieldProps | null => {
      const fieldConfig = config.fields.find((f) => f.name === fieldName);
      if (!fieldConfig) return null;

      const value = formData[fieldName];
      const error = errors[fieldName];

      return {
        name: fieldConfig.name,
        type: fieldConfig.type,
        label: fieldConfig.label,
        placeholder: fieldConfig.placeholder,
        value:
          fieldConfig.type === "checkbox" ? false : (value as string | number),
        checked:
          fieldConfig.type === "checkbox" ? (value as boolean) : undefined,
        options: fieldConfig.options,
        required: fieldConfig.validation?.required,
        disabled: isSubmitting,
        error,
        onChange: handleChange,
        onBlur: handleBlur,
      };
    },
    [config.fields, formData, errors, isSubmitting, handleChange, handleBlur]
  );

  /**
   * Get all field props as an object.
   */
  const getAllFieldsProps = useCallback((): Record<string, FieldProps> => {
    const allProps: Record<string, FieldProps> = {};

    config.fields.forEach((field) => {
      const props = getFieldProps(field.name);
      if (props) {
        allProps[field.name] = props;
      }
    });

    return allProps;
  }, [config.fields, getFieldProps]);

  return {
    formData,
    errors,
    isSubmitting,
    resetForm,
    handleSubmit,
    validateField,
    validateForm,
    getFieldProps,
    getAllFieldsProps,
  };
};

export type {
  FieldConfig,
  FormConfig,
  FieldValidation,
  FieldOption,
  UseFormGeneratorReturn,
  FieldProps,
};
