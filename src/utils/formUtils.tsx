import { useState, useEffect, useCallback, useRef } from "react";
import { z } from "zod";

/**
 * Custom hook for handling accessible form validation
 * - Validates on submit (client-side)
 * - Clears errors on blur only if the value has changed
 * - Tracks form values for controlled inputs
 * - Integrates with validation errors
 * - Focuses error summary on validation failure
 */
export function useAccessibleForm<T extends Record<string, unknown>>(
  initialValues: T,
  validationSchema?: z.ZodSchema,
  serverErrors?: Record<string, string>
) {
  if (typeof window !== 'undefined') {
    window.console.log("🔍 FORM HOOK INITIALIZED OR RE-RENDERED");
    window.console.log("🔍 serverErrors:", serverErrors);
  }
  
  // Make a local copy of server errors
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  
  // State to track form values
  const [formValues, setFormValues] = useState<T>(initialValues);
  
  // State to track original values for comparison
  const [originalValues, setOriginalValues] = useState<T>(initialValues);
  
  // State to track if form has been submitted (for error display)
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Ref for the error summary
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  
  // Update local errors when serverErrors changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.console.log("⚡ SERVER ERRORS CHANGED", serverErrors);
    }
    
    if (serverErrors) {
      setLocalErrors(serverErrors);
      setIsSubmitted(true);
      
      // Scroll to top and focus error summary after server validation failure
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const errorSummary = document.getElementById('error-summary');
          if (errorSummary) {
            errorSummary.focus();
            window.console.log("🔍 Focusing error summary after server validation");
          }
        }
      }, 100);
    }
  }, [serverErrors]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (typeof window !== 'undefined') {
      window.console.log(`🔄 Input change: ${name} = ${value}`);
    }
    
    // Note: We're NOT clearing errors on change, only on blur
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      const checkboxValue = target.value;
      
      setFormValues(prev => {
        // Make sure current values is always an array
        const currentValues = Array.isArray(prev[name]) 
          ? [...prev[name] as unknown[]] 
          : [];
          
        if (target.checked) {
          return {
            ...prev,
            [name]: [...currentValues, checkboxValue]
          };
        } else {
          return {
            ...prev,
            [name]: currentValues.filter(v => v !== checkboxValue)
          };
        }
      });
    } else {
      setFormValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle blur events - only remove the error if the value has changed
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (typeof window !== 'undefined') {
      window.console.log("👀 BLUR EVENT ON FIELD:", name);
      window.console.log("👀 Current errors:", localErrors);
    }
    
    // For checkboxes, we don't clear errors on blur
    if (type === 'checkbox') {
      return;
    }
    
    // For other fields, check if the value has changed from the original
    const originalValue = originalValues[name] === undefined ? '' : String(originalValues[name]);
    const currentValue = value === undefined ? '' : String(value);
    
    if (typeof window !== 'undefined') {
      window.console.log("👀 Original value:", originalValue, "Current value:", currentValue);
    }
    
    // Only clear error if the value has changed from original
    const hasValueChanged = originalValue !== currentValue;
    
    if (hasValueChanged) {
      // Remove the error for this field if it exists
      setLocalErrors(prev => {
        // Skip if no error exists for this field
        if (!prev[name]) return prev;
        
        // Create new error object without this field
        const newErrors = { ...prev };
        delete newErrors[name];
        
        if (typeof window !== 'undefined') {
          window.console.log("✨ Value changed, removed error for:", name);
          window.console.log("✨ New errors:", newErrors);
        }
        
        return newErrors;
      });
      
      // Update the original value to the current value
      setOriginalValues(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (typeof window !== 'undefined') {
      window.console.log("⚠️ Value unchanged, keeping error for:", name);
    }
  }, [localErrors, originalValues]);
  
  // Client-side validation function
  const validateForm = useCallback(() => {
    if (!validationSchema) return true;
    
    if (typeof window !== 'undefined') {
      window.console.log("🔍 VALIDATING FORM DATA:", formValues);
    }
    
    try {
      validationSchema.parse(formValues);
      if (typeof window !== 'undefined') {
        window.console.log("✅ VALIDATION SUCCESSFUL");
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        
        error.errors.forEach(err => {
          const fieldName = err.path[0] as string;
          newErrors[fieldName] = err.message;
        });
        
        if (typeof window !== 'undefined') {
          window.console.log("❌ VALIDATION FAILED:", newErrors);
        }
        
        // Set the local errors - this will add new errors 
        // but won't remove any existing ones
        setLocalErrors(prevErrors => ({
          ...prevErrors,
          ...newErrors
        }));
        
        // Update original values to match current values to prevent immediate error clearing on blur
        setOriginalValues({...formValues});
        
        return false;
      }
      
      // Handle unexpected validation errors
      setLocalErrors(prevErrors => ({
        ...prevErrors,
        _form: "An unexpected error occurred. Please try again."
      }));
      return false;
    }
  }, [formValues, validationSchema]);
  
  // Handle form submission with client-side validation
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    if (typeof window !== 'undefined') {
      window.console.log("📝 FORM SUBMIT EVENT");
    }
    
    setIsSubmitted(true);
    
    if (validationSchema) {
      const isValid = validateForm();
      
      if (!isValid) {
        e.preventDefault(); // Prevent submission if validation fails
        
        // Scroll to top and focus the error summary
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          // Focus the error summary after a short delay to ensure it's rendered
          setTimeout(() => {
            const errorSummary = document.getElementById('error-summary');
            if (errorSummary) {
              errorSummary.focus();
              window.console.log("🔍 Focusing error summary after client validation");
            } else {
              // If error summary not found, try focusing the first field with an error
              const firstErrorField = Object.keys(localErrors)[0];
              if (firstErrorField && firstErrorField !== '_form') {
                const element = document.getElementById(firstErrorField);
                if (element) {
                  element.focus();
                  window.console.log(`🔍 Focusing first error field: ${firstErrorField}`);
                }
              }
            }
          }, 100);
        }
        
        return false; // Form is invalid
      } else if (typeof window !== 'undefined') {
        // Form is valid - allow the form to submit naturally
        window.console.log("✅ VALIDATION SUCCESSFUL - SUBMITTING FORM");
        return true; // Form is valid
      }
      
      return isValid; // Return validation result
    } else {
      // No validation schema provided, allow form to submit
      if (typeof window !== 'undefined') {
        window.console.log("⚠️ NO VALIDATION SCHEMA - SUBMITTING FORM AS IS");
      }
      return true; // No validation schema, so form is considered valid
    }
  }, [validateForm, localErrors, validationSchema]);
  
  // Expose filtered errors and form state
  return {
    formValues,
    formErrors: localErrors,
    isSubmitted,
    hasErrors: Object.keys(localErrors).length > 0,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    errorSummaryRef
  };
}

/**
 * Component for displaying error summary banner
 */
export function ErrorSummary({ 
  errors, 
  className = "error-summary" 
}: { 
  errors: Record<string, string>; 
  className?: string;
}) {
  if (typeof window !== 'undefined') {
    window.console.log("🔴 Rendering ErrorSummary with errors:", errors);
  }
  
  if (Object.keys(errors).length === 0) {
    if (typeof window !== 'undefined') {
      window.console.log("🔴 No errors to display in summary");
    }
    return null;
  }
  
  // Handle error link click to scroll to the field
  const handleErrorLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, fieldId: string) => {
    // Let the default behavior happen (move focus via href)
    // But add smooth scrolling
    
    // Small delay to ensure the focus happens first
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const field = document.getElementById(fieldId);
        if (field) {
          // Scroll the field into view with smooth behavior
          field.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          window.console.log(`🔍 Scrolling to field: ${fieldId}`);
        }
      }
    }, 10);
  };
  
  return (
    <div 
      id="error-summary" 
      className={className} 
      aria-labelledby="error-summary-title" 
      tabIndex={-1}
    >
      <h2 id="error-summary-title">There is a problem</h2>
      <ul className="error-summary__list">
        {Object.entries(errors).map(([field, message]) => (
          <li key={field}>
            {field === "_form" ? (
              <span>{message}</span>
            ) : (
              <a 
                href={`#${field}`} 
                onClick={(e) => handleErrorLinkClick(e, field)}
              >
                {message}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Component for displaying field-level error message
 */
export function ErrorMessage({ id, error }: { id: string; error?: string }) {
  if (typeof window !== 'undefined') {
    window.console.log(`🟠 Rendering ErrorMessage for ${id} with error:`, error);
  }
  
  if (!error) return null;
  
  return (
    <div id={id} className="error-message">
      {error}
    </div>
  );
}

/**
 * Formats Zod validation errors into a Record<string, string> format
 * that can be used with our form components
 */
export const formatZodErrors = (errors: z.ZodFormattedError<unknown>) => {
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