# Form Utilities Documentation

This document provides an overview of the form utilities created for the accessibility microsite project, focusing on accessible form handling with client-side and server-side validation.

## Key Components & Functions

### 1. `formatZodErrors`

A utility function for converting Zod validation errors into a format compatible with our form components.

```typescript
const formatZodErrors = (errors: z.ZodFormattedError<unknown>) => {
  const formattedErrors: Record<string, string> = {};

  // Safe way to extract field errors from the Zod validation error object
  for (const [key, value] of Object.entries(errors)) {
    // Skip the top-level _errors array
    if (key === "_errors") continue;
    
    // Check if this is a field with errors
    if (value && typeof value === 'object' && '_errors' in value) {
      // Get the first error message for this field
      const fieldErrors = value._errors as string[];
      if (fieldErrors && fieldErrors.length > 0) {
        formattedErrors[key] = fieldErrors[0];
      }
    }
  }
  
  return formattedErrors;
};
```

Usage example:
```typescript
// In your action function
if (!validationResult.success) {
  return json({ 
    success: false, 
    errors: formatZodErrors(validationResult.error.format()) 
  });
}
```

### 2. `useAccessibleForm` Hook

A custom React hook for managing form state, validation, and error handling in an accessible way.

Features:
- Client-side validation using Zod schemas
- Integration with server-side validation errors
- Error clearing on field blur (only when the value has changed)
- Automatic focusing of the error summary on validation failure
- Controlled form input management

```typescript
function useAccessibleForm<T extends Record<string, unknown>>(
  initialValues: T,
  validationSchema?: z.ZodSchema,
  actionData?: { success?: boolean; errors?: Record<string, string> }
) {
  // Implementation details in formUtils.tsx
  
  return {
    formValues,
    formErrors,
    isSubmitted,
    hasErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    errorSummaryRef
  };
}
```

Usage example:
```tsx
const {
  formValues,
  formErrors,
  hasErrors,
  handleChange,
  handleBlur,
  handleSubmit
} = useAccessibleForm(
  {
    name: "",
    email: "",
    message: ""
  },
  validationSchema,
  actionData
);
```

### 3. `ErrorSummary` Component

A component that displays a summary of all form errors at the top of the form, with links to the corresponding fields.

Features:
- Focus management for keyboard users
- Links to individual form fields
- Accessible heading structure
- Skip links for form-level errors

```tsx
function ErrorSummary({ 
  errors, 
  className = "error-summary" 
}: { 
  errors: Record<string, string>; 
  className?: string;
}) {
  // Implementation details in formUtils.tsx
}
```

Usage example:
```tsx
{hasErrors && <ErrorSummary errors={formErrors} />}
```

### 4. `ErrorMessage` Component

A component for displaying individual field-level error messages.

```tsx
function ErrorMessage({ id, error }: { id: string; error?: string }) {
  // Implementation details in formUtils.tsx
}
```

Usage example:
```tsx
<ErrorMessage id="name-error" error={formErrors.name} />
```

## Form Setup Pattern

Here's the recommended pattern for setting up accessible forms:

1. Define a validation schema using Zod:
```typescript
const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(10, "Message must be at least 10 characters")
});
```

2. Create a form action that handles validation:
```typescript
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  // Validate the form data using Zod
  const validationResult = FormSchema.safeParse(Object.fromEntries(formData));
  
  if (!validationResult.success) {
    return json({ 
      success: false, 
      errors: formatZodErrors(validationResult.error.format()) 
    });
  }
  
  const validatedData = validationResult.data;
  
  // Process the validated data...
  
  return json({
    success: true,
    redirect: "/success-page"
  });
}
```

3. Set up the form component with the hook:
```tsx
export default function MyForm() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  // Handle successful submission by redirecting client-side
  useEffect(() => {
    if (actionData?.success && 'redirect' in (actionData || {})) {
      window.location.href = actionData.redirect as string;
    }
  }, [actionData]);
  
  // Use the accessible form hook
  const {
    formValues,
    formErrors,
    hasErrors,
    handleChange,
    handleBlur,
    handleSubmit
  } = useAccessibleForm(
    {
      name: "",
      email: "",
      message: ""
    },
    FormSchema,
    actionData
  );
  
  return (
    <Form method="post" noValidate onSubmit={handleSubmit}>
      {/* Error summary - only shown when there are errors */}
      {hasErrors && <ErrorSummary errors={formErrors} />}
      
      {/* Form fields with error messages */}
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={formErrors.name ? "name-error" : undefined}
          aria-invalid={formErrors.name ? "true" : undefined}
        />
        <ErrorMessage id="name-error" error={formErrors.name} />
      </div>
      
      {/* Additional fields... */}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </Form>
  );
}
```

## Accessibility Features

Our form utilities incorporate these accessibility best practices:

1. **Error Summary**
   - The error summary is keyboard focusable
   - It contains links to each field with an error
   - It's announced to screen readers when validation fails

2. **Field-Level Errors**
   - Connected to inputs via aria-describedby
   - Proper aria-invalid state on inputs with errors
   - Unique error message IDs for each field

3. **Focus Management**
   - Focus moves to error summary on validation failure
   - Clicking error links moves focus to the corresponding field
   - Smooth scrolling to fields when error links are activated

4. **Validation Behavior**
   - Errors only clear on blur when the value has changed
   - Form validation happens on submit, not while typing
   - No unnecessary error messages during form completion

## Testing

The form utilities include comprehensive unit tests covering all main components and functions. Tests include:

- Formatting Zod validation errors
- ErrorMessage component rendering and behavior 
- ErrorSummary component rendering, links, and interactions
- useAccessibleForm hook functionality for validation, error handling, and state management

To run the tests:
```
npm run test app/utils/formUtils.test.tsx
```

## CSS Requirements

The styles for these components should include:

```css
.error-summary {
  /* Error summary styles */
  padding: 1rem;
  border: 4px solid #d4351c;
  margin-bottom: 2rem;
}

.error-summary__list {
  margin-top: 0.5rem;
  list-style-type: none;
  padding-left: 0;
}

.error-summary__list a {
  color: #d4351c;
  font-weight: bold;
  text-decoration: underline;
}

.error-message {
  color: #d4351c;
  font-weight: bold;
  margin-top: 0.25rem;
}

.input-error {
  border: 2px solid #d4351c;
}
``` 