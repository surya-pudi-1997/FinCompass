import { useState, useCallback } from "react";

// TypeScript interface definitions
interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  email?: boolean;
  custom?: (
    formData: Record<string, unknown>,
    error: string | null,
    errorList: string[]
  ) => {
    error: string | null;
    errorList: string[];
  };
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
  initialValues?: Record<string, unknown>;
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
  // Initialize default values from field configs
  // useMemo(() => {
  //   return config.fields.reduce(
  //     (acc: Record<string, unknown>, field: FieldConfig) => {
  //       if (field.type === "checkbox") {
  //         acc[field.name] = field.defaultValue ?? false;
  //       } else if (
  //         field.type === "radio" &&
  //         field.options &&
  //         field.options.length > 0
  //       ) {
  //         acc[field.name] = field.defaultValue ?? field.options[0].value;
  //       } else {
  //         acc[field.name] = field.defaultValue ?? "";
  //       }
  //       return acc;
  //     },
  //     {}
  //   );
  // }, [config.fields]); // Only depends on fields config

  const [formData, setFormData] = useState<Record<string, unknown>>(
    config.initialValues || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Effect to update form data when initialValues change
  // useEffect(() => {
  //   if (config.initialValues) {
  //     setFormData({
  //       // ...defaultValues,
  //       // ...config.initialValues,
  //     });
  //     setErrors({});
  //   }
  // }, [config.initialValues]);

  /**
   * Validates a single field based on its configuration.
   */
  const validateField = useCallback(
    (
      name: string,
      value: unknown,
      formData: Record<string, unknown>
    ): string | null => {
      const fieldConfig = config.fields.find(
        (f: FieldConfig) => f.name === name
      );
      if (!fieldConfig || !fieldConfig.validation) return null;

      const validation = fieldConfig.validation;

      let errorList = [];
      let error: string | null = null;

      // Required validation
      if (
        validation.required &&
        (value === "" ||
          value === null ||
          value === undefined ||
          (typeof value === "boolean" && value === false))
      ) {
        errorList.push(`${fieldConfig.label} is required.`);
        error = `${fieldConfig.label} is required.`;
      }

      // Type-specific validations
      switch (fieldConfig.type) {
        case "text":
        case "textarea":
        case "email":
        case "password":
          if (typeof value === "string") {
            if (validation.minlength && value.length < validation.minlength) {
              errorList.push(
                `${fieldConfig.label} must be at least ${validation.minlength} characters.`
              );
              error = `${fieldConfig.label} must be at least ${validation.minlength} characters.`;
            }
            if (validation.maxlength && value.length > validation.maxlength) {
              errorList.push(
                `${fieldConfig.label} must be at most ${validation.maxlength} characters.`
              );
              error = `${fieldConfig.label} must be at most ${validation.maxlength} characters.`;
            }
            if (
              validation.pattern &&
              !new RegExp(validation.pattern).test(value)
            ) {
              errorList.push(`${fieldConfig.label} format is invalid.`);
              error = `${fieldConfig.label} format is invalid.`;
            }
            if (validation.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              errorList.push(`Please enter a valid email address.`);
              error = `Please enter a valid email address.`;
            }
          }
          break;
        case "number":
          const numValue = parseFloat(value as string);
          if (validation.required && (value === "" || isNaN(numValue))) {
            errorList.push(`${fieldConfig.label} must be a number.`);
            error = `${fieldConfig.label} must be a number.`;
          }
          if (!isNaN(numValue)) {
            if (validation.min !== undefined && numValue < validation.min) {
              errorList.push(
                `${fieldConfig.label} must be at least ${validation.min}.`
              );
              error = `${fieldConfig.label} must be at least ${validation.min}.`;
            }
            if (validation.max !== undefined && numValue > validation.max) {
              errorList.push(
                `${fieldConfig.label} must be at most ${validation.max}.`
              );
              error = `${fieldConfig.label} must be at most ${validation.max}.`;
            }
          }
          break;
        case "date":
          const dateValue = new Date(value as string);
          if (
            validation.required &&
            (value === "" || isNaN(dateValue.getTime()))
          ) {
            errorList.push(`${fieldConfig.label} must be a valid date.`);
            error = `${fieldConfig.label} must be a valid date.`;
          }
          if (!isNaN(dateValue.getTime())) {
            if (validation.min && dateValue < new Date(validation.min)) {
              errorList.push(
                `${fieldConfig.label} must be on or after ${validation.min}.`
              );
              error = `${fieldConfig.label} must be on or after ${validation.min}.`;
            }
            if (validation.max && dateValue > new Date(validation.max)) {
              errorList.push(
                `${fieldConfig.label} must be on or before ${validation.max}.`
              );
              error = `${fieldConfig.label} must be on or before ${validation.max}.`;
            }
          }
          break;
      }

      // Custom validation
      if (validation.custom) {
        ({ error, errorList } = validation.custom(formData, error, errorList));
      }

      if (error) {
        return error;
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
      const error = validateField(field.name, formData[field.name], formData);
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
      const error = validateField(name, fieldValue, formData);

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
    setFormData({
      ...(config.initialValues || {}),
    });
    setErrors({});
    setIsSubmitting(false);
  }, [config.initialValues]);

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
          fieldConfig.type === "checkbox"
            ? Boolean(value)
            : (value as string | number),
        checked: fieldConfig.type === "checkbox" ? Boolean(value) : undefined,
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
