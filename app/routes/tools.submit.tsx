import { ActionFunctionArgs, json } from "@remix-run/server-runtime";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import Layout from "~/components/Layout";
import { z } from "zod";
import { useAccessibleForm, ErrorSummary, ErrorMessage, formatZodErrors } from "~/utils/formUtils";
import { handleFormSubmission } from "~/utils/formSubmission";
import { useEffect } from "react";

// Define validation schema using Zod
const ToolSchema = z.object({
  name: z.string().min(1, "Please enter a tool name"),
  description: z.string().min(1, "Please provide a description"),
  url: z.string().url("Please enter a valid URL"),
  category: z.string().min(1, "Please select a category"),
  tags: z.string(),
  cost: z.string().min(1, "Please select a cost option"),
  platforms: z.string()
});

// Type definition for successful response
type SuccessResponse = {
  success: true;
  redirect: string;
};

// Type definition for error response
type ErrorResponse = {
  success: false;
  errors: Record<string, string>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("===== SERVER: Tool form submission received =====");

  try {
    // Parse the form data
    const formData = await request.formData();
    console.log("===== SERVER: Form data received:", Object.fromEntries(formData));

    // Validate the form data using Zod
    const validationResult = ToolSchema.safeParse(Object.fromEntries(formData));
    
    if (!validationResult.success) {
      console.log("===== SERVER: Validation errors:", validationResult.error.format());
      return json<ErrorResponse>({ 
        success: false, 
        errors: formatZodErrors(validationResult.error.format()) 
      });
    }
    
    // Submit to Google Sheet
    await handleFormSubmission({
      formData: formData,
      schema: ToolSchema,
      type: "tool",
      successPath: "/tools/submit/success",
      formatData: (data) => ({
        "Tool Name": data.name,
        "Description": data.description,
        "URL": data.url,
        "Category": data.category,
        "Tags": data.tags,
        "Cost": data.cost,
        "Platforms": data.platforms,
        "Timestamp": new Date().toISOString()
      })
    });
    
    // We shouldn't reach here if handleFormSubmission does its job
    // but add this as a fallback
    return json<SuccessResponse>({
      success: true,
      redirect: "/tools/submit/success"
    });
  } catch (error) {
    console.error("===== SERVER: Error submitting tool form:", error);
    return json<ErrorResponse>({ 
      success: false, 
      errors: { _form: "An unexpected error occurred. Please try again." } 
    });
  }
};

export default function SubmitTool() {
  console.log("===== CLIENT: SubmitTool component rendering =====");
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  // Handle successful submission by redirecting client-side
  useEffect(() => {
    if (actionData?.success) {
      const successData = actionData as SuccessResponse;
      console.log("===== CLIENT: Successful submission, redirecting to", successData.redirect);
      window.location.href = successData.redirect;
    }
  }, [actionData]);
  
  // Use the accessible form hook with client-side validation
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
      description: "",
      url: "",
      category: "",
      tags: "",
      cost: "",
      platforms: ""
    },
    ToolSchema, // Pass the Zod schema for client-side validation
    actionData
  );
  
  return (
    <Layout title="Submit an Accessibility Tool">
      <section className="content-section">
        <div className="container container-content">
          <p className="mb-6">
            Share an accessibility tool with the community. Your submission will be reviewed before being added to the directory.
          </p>
          
          {/* Show error summary if there are form errors */}
          {hasErrors && (
            <ErrorSummary errors={formErrors} />
          )}
          
          <Form method="post" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name" id="name-label">Tool Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={formErrors.name ? "name-error" : undefined}
                aria-invalid={formErrors.name ? "true" : undefined}
                className={formErrors.name ? "input-error" : ""}
              />
              <ErrorMessage id="name-error" error={formErrors.name} />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" id="description-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                aria-describedby={formErrors.description ? "description-error" : undefined}
                aria-invalid={formErrors.description ? "true" : undefined}
                className={formErrors.description ? "input-error" : ""}
              ></textarea>
              <ErrorMessage id="description-error" error={formErrors.description} />
            </div>
            
            <div className="form-group">
              <label htmlFor="url" id="url-label">Website URL</label>
              <input
                type="url"
                id="url"
                name="url"
                value={formValues.url}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://example.com"
                aria-describedby={formErrors.url ? "url-error" : undefined}
                aria-invalid={formErrors.url ? "true" : undefined}
                className={formErrors.url ? "input-error" : ""}
              />
              <ErrorMessage id="url-error" error={formErrors.url} />
            </div>
            
            <div className="form-group">
              <label htmlFor="category" id="category-label">Category</label>
              <select
                id="category"
                name="category"
                value={formValues.category}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={formErrors.category ? "category-error" : undefined}
                aria-invalid={formErrors.category ? "true" : undefined}
                className={formErrors.category ? "input-error" : ""}
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
              <ErrorMessage id="category-error" error={formErrors.category} />
            </div>
            
            <div className="form-group">
              <label htmlFor="tags" id="tags-label">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formValues.tags}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Automated testing, Browser extension, Open source"
                aria-describedby={formErrors.tags ? "tags-error" : undefined}
                aria-invalid={formErrors.tags ? "true" : undefined}
                className={formErrors.tags ? "input-error" : ""}
              />
              <ErrorMessage id="tags-error" error={formErrors.tags} />
            </div>
            
            <div className="form-group">
              <label htmlFor="cost" id="cost-label">Cost</label>
              <select
                id="cost"
                name="cost"
                value={formValues.cost}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={formErrors.cost ? "cost-error" : undefined}
                aria-invalid={formErrors.cost ? "true" : undefined}
                className={formErrors.cost ? "input-error" : ""}
              >
                <option value="">Select cost</option>
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
                <option value="Free / Paid">Free / Paid</option>
                <option value="Free Trial">Free Trial</option>
                <option value="Subscription">Subscription</option>
              </select>
              <ErrorMessage id="cost-error" error={formErrors.cost} />
            </div>
            
            <div className="form-group">
              <label htmlFor="platforms" id="platforms-label">Platforms (comma-separated)</label>
              <input
                type="text"
                id="platforms"
                name="platforms"
                value={formValues.platforms}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Web, macOS, Windows, Chrome, Firefox"
                aria-describedby={formErrors.platforms ? "platforms-error" : undefined}
                aria-invalid={formErrors.platforms ? "true" : undefined}
                className={formErrors.platforms ? "input-error" : ""}
              />
              <ErrorMessage id="platforms-error" error={formErrors.platforms} />
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="button"
              >
                {isSubmitting ? "Submitting..." : "Submit Tool"}
              </button>
            </div>
          </Form>
        </div>
      </section>
    </Layout>
  );
} 