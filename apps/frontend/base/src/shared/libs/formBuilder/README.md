# useFormGenerator Hook

A powerful and flexible React hook for generating dynamic forms with built-in validation, state management, and customizable layouts.

## Features

- ✅ **Dynamic Form Generation**: Create forms from configuration objects
- ✅ **Built-in Validation**: Required, min/max, pattern, email, and custom validation
- ✅ **Real-time Validation**: Validate on blur and submit
- ✅ **Flexible Layouts**: Arrange form fields however you want
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Multiple Field Types**: text, number, email, password, textarea, select, checkbox, radio
- ✅ **State Management**: Automatic state handling with reset functionality
- ✅ **Error Handling**: Comprehensive error management and display

## Installation

```bash
# The hook is already in your project at:
# src/shared/hooks/useFormGenerator.tsx
```

## Basic Usage

```tsx
import { useFormGenerator } from "../hooks/useFormGenerator";

const MyForm = () => {
  const formConfig = {
    formName: "myForm",
    fields: [
      {
        name: "amount",
        type: "number",
        label: "Amount",
        placeholder: "Enter amount",
        validation: {
          min: 0.01,
          required: true,
          max: 1000000,
        },
      },
      {
        name: "description",
        type: "text",
        label: "Description",
        placeholder: "Enter description",
        validation: {
          required: true,
          minlength: 3,
          maxlength: 255,
        },
      },
    ],
    onSubmit: (data: Record<string, unknown>) => {
      console.log("Form submitted:", data);
    },
  };

  const { Form, fields, formData, errors, isSubmitting, resetForm } =
    useFormGenerator(formConfig);

  return (
    <Form className="space-y-4">
      <fields.amount />
      <fields.description />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
      <button type="button" onClick={resetForm}>
        Reset
      </button>
    </Form>
  );
};
```

## Configuration Options

### FormConfig

```typescript
interface FormConfig {
  formName: string; // Unique identifier for the form
  fields: FieldConfig[]; // Array of field configurations
  onSubmit: (data: Record<string, unknown>) => void; // Submit handler
}
```

### FieldConfig

```typescript
interface FieldConfig {
  name: string; // Field name (used as key)
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
  label: string; // Display label
  placeholder?: string; // Placeholder text
  defaultValue?: string | number | boolean; // Default value
  options?: FieldOption[]; // Options for select/radio
  validation?: FieldValidation; // Validation rules
}
```

### FieldValidation

```typescript
interface FieldValidation {
  required?: boolean; // Field is required
  min?: number; // Minimum value (for numbers/dates)
  max?: number; // Maximum value (for numbers/dates)
  minlength?: number; // Minimum length (for strings)
  maxlength?: number; // Maximum length (for strings)
  pattern?: string; // RegExp pattern
  email?: boolean; // Email validation
  custom?: (value: unknown) => string | null; // Custom validation function
}
```

## Field Types

### Text Fields

```typescript
{
  name: "username",
  type: "text",
  label: "Username",
  placeholder: "Enter username",
  validation: {
    required: true,
    minlength: 3,
    maxlength: 20,
    pattern: "^[a-zA-Z0-9_]+$"
  }
}
```

### Number Fields

```typescript
{
  name: "amount",
  type: "number",
  label: "Amount",
  validation: {
    required: true,
    min: 0.01,
    max: 1000000
  }
}
```

### Select Fields

```typescript
{
  name: "category",
  type: "select",
  label: "Category",
  options: [
    { value: "food", label: "Food" },
    { value: "transport", label: "Transport" },
  ],
  validation: {
    required: true
  }
}
```

### Checkbox Fields

```typescript
{
  name: "isRecurring",
  type: "checkbox",
  label: "Is Recurring",
  defaultValue: false
}
```

### Radio Fields

```typescript
{
  name: "priority",
  type: "radio",
  label: "Priority",
  options: [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ],
  defaultValue: "medium"
}
```

## Advanced Usage

### Custom Layouts

```tsx
const { Form, fields } = useFormGenerator(config);

return (
  <Form className="max-w-2xl mx-auto">
    {/* Grid layout */}
    <div className="grid grid-cols-2 gap-4">
      <fields.firstName className="col-span-1" />
      <fields.lastName className="col-span-1" />
    </div>

    {/* Full width */}
    <fields.email className="w-full" />

    {/* Inline layout */}
    <div className="flex gap-4">
      <fields.amount className="flex-1" />
      <fields.currency className="w-24" />
    </div>
  </Form>
);
```

### Custom Validation

```typescript
{
  name: "password",
  type: "password",
  label: "Password",
  validation: {
    required: true,
    minlength: 8,
    custom: (value) => {
      const password = value as string;
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      }
      return null;
    }
  }
}
```

### Form State Access

```tsx
const { formData, errors, isSubmitting, resetForm } = useFormGenerator(config);

// Access form data
console.log(formData.amount);

// Check for errors
if (errors.amount) {
  console.log("Amount error:", errors.amount);
}

// Reset form
const handleReset = () => {
  resetForm();
};
```

## Return Values

The hook returns an object with the following properties:

```typescript
interface UseFormGeneratorReturn {
  formData: Record<string, unknown>; // Current form data
  errors: Record<string, string>; // Current validation errors
  isSubmitting: boolean; // Whether form is being submitted
  resetForm: () => void; // Function to reset form
  handleChange: (e: ChangeEvent) => void; // Change handler (for custom fields)
  handleBlur: (e: FocusEvent) => void; // Blur handler (for custom fields)
  handleSubmit: (e: FormEvent) => void; // Submit handler (for custom forms)
  validateField: (name: string, value: unknown) => string | null; // Validate single field
  validateForm: () => boolean; // Validate entire form
  Form: React.ComponentType; // Form wrapper component
  fields: Record<string, React.ComponentType>; // Individual field components
}
```

## Styling

The hook generates semantic HTML with CSS classes that you can style:

```css
.field-container {
  /* Container for each field */
}

.field-label {
  /* Label styling */
}

.field-label .required {
  /* Required asterisk styling */
}

.field-error {
  /* Error message styling */
}

.radio-group {
  /* Radio button group container */
}

.radio-option {
  /* Individual radio option */
}

/* Error state */
.error {
  /* Applied to fields with errors */
}
```

## Example: Complete Transaction Form

See `src/shared/examples/TransactionForm.tsx` for a complete example with:

- Multiple field types
- Custom layouts
- Error handling
- Form state display
- Submit and reset functionality

## Best Practices

1. **Use TypeScript**: The hook is fully typed for better development experience
2. **Validate Early**: Use `validation.required` and other built-in validators
3. **Custom Validation**: Use `validation.custom` for complex business logic
4. **Layout Flexibility**: Use the individual field components for custom layouts
5. **Error Handling**: Always handle errors in your `onSubmit` function
6. **Performance**: The hook uses React.memo and useCallback for optimal performance

## Contributing

When adding new field types or validation rules:

1. Update the `FieldConfig` type
2. Add the new case in the field rendering logic
3. Add validation logic in `validateField`
4. Update this documentation
5. Add tests for the new functionality
