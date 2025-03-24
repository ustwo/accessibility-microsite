import { json, redirect, ActionFunctionArgs } from "@remix-run/server-runtime";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import Layout from "~/components/Layout";
import { submitNewItem } from "~/utils/googleSheets";
import { z } from "zod";

// Define validation schema using Zod
const ToolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  url: z.string().url("Must be a valid URL").min(1, "URL is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().min(1, "At least one tag is required"),
  cost: z.string().min(1, "Cost information is required"),
  platforms: z.string().min(1, "At least one platform is required")
});

// Define types for our form
type ToolFormData = z.infer<typeof ToolSchema>;
type FormValues = Partial<ToolFormData> & {
  _action?: string;
  fieldName?: string;
  dismissedErrors?: string;
};

// Define the type for our form errors
type FormErrors = {
  _form?: string;
  name?: string;
  description?: string;
  url?: string;
  category?: string;
  tags?: string;
  cost?: string;
  platforms?: string;
};

// Define the ActionData type
type ActionData = {
  success: boolean;
  formValues: FormValues;
  errors: FormErrors;
  dismissedErrors: string[];
};

export async function action({ request }: ActionFunctionArgs) {
  console.log('===== SERVER: Action function called =====');
  const formData = await request.formData();
  const rawFormData = Object.fromEntries(formData);
  
  console.log('===== SERVER: Form data received =====', rawFormData);
  
  // Check if we're dismissing an error
  if (rawFormData._action === "dismiss_error" && rawFormData.fieldName) {
    const fieldName = rawFormData.fieldName as string;
    const currentFormValues = { ...rawFormData } as FormValues;
    
    // Remove action fields
    delete currentFormValues._action;
    delete currentFormValues.fieldName;
    delete currentFormValues.dismissedErrors;
    
    // Get the current dismissed errors
    let dismissedErrors: string[] = [];
    if (typeof rawFormData.dismissedErrors === 'string') {
      try {
        dismissedErrors = JSON.parse(rawFormData.dismissedErrors);
      } catch (e) {
        console.error("Error parsing dismissed errors:", e);
      }
    }
    
    // Add the current field to dismissed errors
    if (!dismissedErrors.includes(fieldName)) {
      dismissedErrors.push(fieldName);
    }
    
    console.log("===== SERVER: Dismissing error for field:", fieldName);
    console.log("===== SERVER: Dismissed errors:", dismissedErrors);
    
    try {
      // Validate the form (to get errors)
      ToolSchema.parse(currentFormValues);
      // If validation passes, we have no errors to dismiss, so redirect
      return redirect("/tools/submit/success");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const allErrors = error.errors.reduce((acc, curr) => {
          const fieldName = curr.path[0];
          acc[fieldName as keyof FormErrors] = curr.message;
          return acc;
        }, {} as FormErrors);
        
        // Filter out dismissed errors
        const remainingErrors: FormErrors = {};
        Object.entries(allErrors).forEach(([key, value]) => {
          if (!dismissedErrors.includes(key)) {
            remainingErrors[key as keyof FormErrors] = value;
          }
        });
        
        // Return the form values and errors
        return json<ActionData>({
          success: false,
          formValues: currentFormValues,
          errors: remainingErrors,
          dismissedErrors
        });
      }
    }
  }
  
  // Check if we're dismissing all errors
  if (rawFormData._action === "dismiss_all_errors") {
    const currentFormValues = { ...rawFormData } as FormValues;
    
    // Remove action fields
    delete currentFormValues._action;
    delete currentFormValues.dismissedErrors;
    
    try {
      // Validate the form to get all possible error fields
      ToolSchema.parse(currentFormValues);
      // If validation passes, we have no errors to dismiss, so redirect
      return redirect("/tools/submit/success");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Get all error fields to dismiss them
        const allErrorFields = error.errors.map(err => err.path[0] as string);
        
        console.log("===== SERVER: Dismissing all errors:", allErrorFields);
        
        // Return with no errors but with dismissed errors
        return json<ActionData>({
          success: false,
          formValues: currentFormValues,
          errors: {},
          dismissedErrors: allErrorFields
        });
      }
    }
  }
  
  // Normal form submission
  if (rawFormData._action === "submit") {
    // Get dismissed errors, if any
    let dismissedErrors: string[] = [];
    if (typeof rawFormData.dismissedErrors === 'string') {
      try {
        dismissedErrors = JSON.parse(rawFormData.dismissedErrors);
      } catch (e) {
        console.error("Error parsing dismissed errors:", e);
      }
    }
    
    // Remove the action and dismissed errors fields from validation
    const dataToValidate = { ...rawFormData } as FormValues;
    delete dataToValidate._action;
    delete dataToValidate.dismissedErrors;
    
    try {
      const validatedData = ToolSchema.parse(dataToValidate);
      console.log('===== SERVER: Validation successful =====');
      
      // Format the data for the API
      const submissionData = {
        name: validatedData.name,
        description: validatedData.description,
        url: validatedData.url,
        category: validatedData.category,
        tags: validatedData.tags.split(",").map(tag => tag.trim()),
        cost: validatedData.cost,
        platforms: validatedData.platforms.split(",").map(platform => platform.trim())
      };
      
      // Submit to Google Sheets
      const success = await submitNewItem("tool", submissionData);
      
      if (success) {
        console.log('===== SERVER: Submission successful, redirecting =====');
        return redirect("/tools/submit/success");
      } else {
        console.log('===== SERVER: Submission failed =====');
        return json<ActionData>({
          success: false,
          formValues: dataToValidate,
          errors: { _form: "Failed to submit the tool. Please try again." },
          dismissedErrors
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const allErrors = error.errors.reduce((acc, curr) => {
          const fieldName = curr.path[0];
          acc[fieldName as keyof FormErrors] = curr.message;
          return acc;
        }, {} as FormErrors);
        
        // Filter out dismissed errors
        const remainingErrors: FormErrors = {};
        Object.entries(allErrors).forEach(([key, value]) => {
          if (!dismissedErrors.includes(key)) {
            remainingErrors[key as keyof FormErrors] = value;
          }
        });
        
        console.log("===== SERVER: Validation errors =====", remainingErrors);
        console.log("===== SERVER: Dismissed errors =====", dismissedErrors);
        
        return json<ActionData>({
          success: false,
          formValues: dataToValidate,
          errors: remainingErrors,
          dismissedErrors
        });
      }
      
      console.log("===== SERVER: Unexpected error =====", error);
      
      return json<ActionData>({
        success: false,
        formValues: dataToValidate,
        errors: { _form: "An unexpected error occurred. Please try again." },
        dismissedErrors
      });
    }
  }
  
  // If we get here, something went wrong - return a default response
  return json<ActionData>({
    success: false,
    formValues: {},
    errors: { _form: "Invalid form submission" },
    dismissedErrors: []
  });
}

// Simple function to render an error message with a dismiss form
function ErrorMessage({ 
  id, 
  error, 
  fieldName,
  formValues,
  dismissedErrors
}: { 
  id: string; 
  error?: string;
  fieldName: string;
  formValues: FormValues;
  dismissedErrors: string[];
}) {
  if (!error) return null;
  
  return (
    <div id={id} className="error-message flex items-center">
      <span>{error}</span>
      <Form method="post" className="ml-2">
        {/* Hidden fields to maintain form state */}
        {Object.entries(formValues).map(([key, value]) => (
          <input 
            key={key} 
            type="hidden" 
            name={key} 
            value={typeof value === 'string' ? value : ''}
          />
        ))}
        
        {/* Dismissed errors */}
        <input 
          type="hidden" 
          name="dismissedErrors" 
          value={JSON.stringify(dismissedErrors)} 
        />
        
        {/* Action and field to dismiss */}
        <input type="hidden" name="_action" value="dismiss_error" />
        <input type="hidden" name="fieldName" value={fieldName} />
        
        <button 
          type="submit"
          className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
          aria-label={`Dismiss ${id} error`}
        >
          Dismiss
        </button>
      </Form>
    </div>
  );
}

export default function SubmitTool() {
  console.log("===== CLIENT: SubmitTool component rendering =====");
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  console.log("===== CLIENT: Current actionData =====", actionData);
  
  // Get form values and errors from action data
  const formValues: FormValues = actionData?.formValues || {};
  const errors: FormErrors = actionData?.errors || {};
  const dismissedErrors: string[] = actionData?.dismissedErrors || [];
  
  // Check if there are any errors
  const hasErrors = Object.keys(errors).length > 0;
  
  return (
    <Layout title="Submit an Accessibility Tool">
      <div className="max-w-2xl mx-auto">
        <p className="mb-6">
          Share an accessibility tool with the community. Your submission will be reviewed before being added to the directory.
        </p>
        
        {/* Status message */}
        <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded">
          <p><strong>Note:</strong> You can dismiss any validation error by clicking the &quot;Dismiss&quot; button next to it.</p>
          {hasErrors && (
            <Form method="post" className="mt-2">
              {/* Maintain form state */}
              {Object.entries(formValues).map(([key, value]) => (
                <input 
                  key={key} 
                  type="hidden" 
                  name={key} 
                  value={typeof value === 'string' ? value : ''}
                />
              ))}
              
              {/* Dismissed errors */}
              <input 
                type="hidden" 
                name="dismissedErrors" 
                value={JSON.stringify(dismissedErrors)} 
              />
              
              {/* Action */}
              <input type="hidden" name="_action" value="dismiss_all_errors" />
              
              <button 
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Dismiss All Errors
              </button>
            </Form>
          )}
          <p className="text-sm mt-2">
            Dismissed errors: {dismissedErrors.join(', ') || 'None'}
          </p>
        </div>
        
        {/* Error summary - only shown when there are errors */}
        {hasErrors && (
          <div className="error-summary mb-6" aria-labelledby="error-summary-title" tabIndex={-1}>
            <h2 id="error-summary-title" className="text-lg font-bold text-red-600">There is a problem</h2>
            <ul className="error-summary__list list-disc pl-5 mt-2">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field} className="text-red-600">
                  {field === "_form" ? (
                    <span>{message}</span>
                  ) : (
                    <a href={`#${field}`} className="underline">{message}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Form method="post" noValidate className="space-y-6">
          {/* Hidden values to maintain form state */}
          <input 
            type="hidden" 
            name="dismissedErrors" 
            value={JSON.stringify(dismissedErrors)} 
          />
          <input type="hidden" name="_action" value="submit" />
          
          <div className="form-group">
            <label htmlFor="name" id="name-label" className="block mb-1 font-medium">Tool Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={formValues.name || ''}
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={errors.name ? "true" : undefined}
              className={`w-full p-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            <ErrorMessage 
              id="name-error" 
              error={errors.name} 
              fieldName="name"
              formValues={formValues}
              dismissedErrors={dismissedErrors}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description" id="description-label" className="block mb-1 font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={formValues.description || ''}
              rows={4}
              aria-describedby={errors.description ? "description-error" : undefined}
              aria-invalid={errors.description ? "true" : undefined}
              className={`w-full p-2 border rounded ${errors.description ? "border-red-500" : "border-gray-300"}`}
            ></textarea>
            <ErrorMessage 
              id="description-error" 
              error={errors.description} 
              fieldName="description"
              formValues={formValues}
              dismissedErrors={dismissedErrors}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="url" id="url-label" className="block mb-1 font-medium">Website URL</label>
            <input
              type="url"
              id="url"
              name="url"
              defaultValue={formValues.url || ''}
              placeholder="https://example.com"
              aria-describedby={errors.url ? "url-error" : undefined}
              aria-invalid={errors.url ? "true" : undefined}
              className={`w-full p-2 border rounded ${errors.url ? "border-red-500" : "border-gray-300"}`}
            />
            <ErrorMessage 
              id="url-error" 
              error={errors.url} 
              fieldName="url"
              formValues={formValues}
              dismissedErrors={dismissedErrors}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category" id="category-label" className="block mb-1 font-medium">Category</label>
            <select
              id="category"
              name="category"
              defaultValue={formValues.category || ''}
              aria-describedby={errors.category ? "category-error" : undefined}
              aria-invalid={errors.category ? "true" : undefined}
              className={`w-full p-2 border rounded ${errors.category ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select a category</option>
              <option value="Evaluation">Evaluation</option>
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
              <option value="Screen Reader">Screen Reader</option>
              <option value="Color">Color</option>
              <option value="Other">Other</option>
            </select>
            <ErrorMessage 
              id="category-error" 
              error={errors.category} 
              fieldName="category"
              formValues={formValues}
              dismissedErrors={dismissedErrors}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags" id="tags-label" className="block mb-1 font-medium">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              defaultValue={formValues.tags || ''}
              placeholder="Automated testing, Browser extension, Open source"
              aria-describedby={errors.tags ? "tags-error" : undefined}
              aria-invalid={errors.tags ? "true" : undefined}
              className={`w-full p-2 border rounded ${errors.tags ? "border-red-500" : "border-gray-300"}`}
            />
            <ErrorMessage 
              id="tags-error" 
              error={errors.tags} 
              fieldName="tags"
              formValues={formValues}
              dismissedErrors={dismissedErrors}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cost" id="cost-label" className="block mb-1 font-medium">Cost</label>
            <select
              id="cost"
              name="cost"
              defaultValue={formValues.cost || ''}
              aria-describedby={errors.cost ? "cost-error" : undefined}
              aria-invalid={errors.cost ? "true" : undefined}
              className={`w-full p-2 border rounded ${errors.cost ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select cost</option>
              <option value="Free">Free</option>
              <option value="Freemium">Freemium</option>
              <option value="Paid">Paid</option>
              <option value="Free / Paid">Free / Paid</option>
              <option value="Free Trial">Free Trial</option>
              <option value="Subscription">Subscription</option>
            </select>
            <ErrorMessage 
              id="cost-error" 
              error={errors.cost} 
              fieldName="cost"
              formValues={formValues}
              dismissedErrors={dismissedErrors}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="platforms" id="platforms-label" className="block mb-1 font-medium">Platforms (comma-separated)</label>
            <input
              type="text"
              id="platforms"
              name="platforms"
              defaultValue={formValues.platforms || ''}
              placeholder="Web, macOS, Windows, Chrome, Firefox"
              aria-describedby={errors.platforms ? "platforms-error" : undefined}
              aria-invalid={errors.platforms ? "true" : undefined}
              className={`w-full p-2 border rounded ${errors.platforms ? "border-red-500" : "border-gray-300"}`}
            />
            <ErrorMessage 
              id="platforms-error" 
              error={errors.platforms} 
              fieldName="platforms"
              formValues={formValues}
              dismissedErrors={dismissedErrors}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Submitting..." : "Submit Tool"}
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
} 