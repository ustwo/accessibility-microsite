import { ActionFunctionArgs, json } from "@remix-run/server-runtime";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import Layout from "~/components/Layout";
import { z } from "zod";
import { useAccessibleForm, ErrorSummary, ErrorMessage } from "~/utils/formUtils";
import { submitNewItem } from "~/utils/edgeGoogleSheets";
import { useEffect } from "react";

// Define validation schema using Zod
const ToolSchema = z.object({
  name: z.string().min(1, "Please enter a tool name"),
  description: z.string().min(1, "Please provide a description"),
  url: z.string().min(1, "Please enter a URL"),
  discipline: z.string().min(1, "Please specify which disciplines this tool is for"),
  source: z.string().min(1, "Please specify the source of the tool"),
  notes: z.string().optional(),
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

export async function action({ request }: ActionFunctionArgs) {
  console.log("===== SERVER: tools.submit action function starting =====");
  
  try {
    // Get form data
    const formData = await request.formData();
    const formValues = Object.fromEntries(formData);
    
    // Validate the form data
    const result = ToolSchema.safeParse(formValues);
    
    if (!result.success) {
      console.log("===== SERVER: Validation failed =====");
      
      // Convert ZodError to a simple Record<string, string>
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        errors[path] = err.message;
      });
      
      return json<ErrorResponse>({
        success: false,
        errors,
      });
    }
    
    // Prepare the data for submission
    const tool = {
      name: result.data.name,
      description: result.data.description,
      url: result.data.url,
      discipline: result.data.discipline.split(',').map(d => d.trim()).filter(Boolean),
      source: result.data.source,
      notes: result.data.notes || '',
    };
    
    // Submit the data
    const success = await submitNewItem('tool', tool);
    
    if (success) {
      console.log("===== SERVER: Submission successful, redirecting to success page =====");
      return json<SuccessResponse>({
        success: true,
        redirect: '/tools/submit/success',
      });
    } else {
      console.log("===== SERVER: Submission failed =====");
      return json<ErrorResponse>({
        success: false,
        errors: {
          form: "Failed to submit the tool. Please try again later."
        }
      });
    }
  } catch (error) {
    console.error("===== SERVER: Error in action function =====", error);
    return json<ErrorResponse>({
      success: false,
      errors: {
        form: "An unexpected error occurred. Please try again later."
      }
    });
  }
}

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
      discipline: "",
      source: "",
      notes: ""
    },
    ToolSchema, // Pass the Zod schema for client-side validation
    actionData
  );

  // Source options for the dropdown
  const sourceOptions = [
    "ustwo",
    "external"
  ];
  
  return (
    <Layout title="Submit an Accessibility Tool">
      <section className="content-section">
        <div className="container container-content">
          <p className="mb-6 subtitle">
            Share an accessibility tool with the community. Your submission will be reviewed before being added to the directory.
          </p>
          
          {/* Show error summary if there are form errors */}
          {hasErrors && (
            <ErrorSummary errors={formErrors} />
          )}
          
          <Form method="post" onSubmit={handleSubmit} noValidate className="space-y-6">
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
              <label htmlFor="discipline" id="discipline-label">Discipline (comma-separated)</label>
              <input
                type="text"
                id="discipline"
                name="discipline"
                value={formValues.discipline}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="All, Design, Tech, QA, Product, Client, Delivery, Strategy"
                aria-describedby={formErrors.discipline ? "discipline-error" : undefined}
                aria-invalid={formErrors.discipline ? "true" : undefined}
                className={formErrors.discipline ? "input-error" : ""}
              />
              <ErrorMessage id="discipline-error" error={formErrors.discipline} />
              <div className="text-sm text-gray-600 mt-1">
                Who is this tool for? E.g., &quot;All&quot; or &quot;Design, Tech, QA&quot;
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="source" id="source-label">Source</label>
              <select
                id="source"
                name="source"
                value={formValues.source}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={formErrors.source ? "source-error" : undefined}
                aria-invalid={formErrors.source ? "true" : undefined}
                className={formErrors.source ? "input-error" : ""}
              >
                <option value="">Select a source</option>
                {sourceOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ErrorMessage id="source-error" error={formErrors.source} />
              <div className="text-sm text-gray-600 mt-1">
                Is this an ustwo tool or an external tool?
              </div>
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
              <label htmlFor="url" id="url-label">URL</label>
              <input
                type="text"
                id="url"
                name="url"
                value={formValues.url}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Link or actual URL"
                aria-describedby={formErrors.url ? "url-error" : undefined}
                aria-invalid={formErrors.url ? "true" : undefined}
                className={formErrors.url ? "input-error" : ""}
              />
              <ErrorMessage id="url-error" error={formErrors.url} />
              <div className="text-sm text-gray-600 mt-1">
                Enter a direct URL or &quot;Link&quot; placeholder for internal links
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes" id="notes-label">Notes (optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formValues.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={2}
                aria-describedby={formErrors.notes ? "notes-error" : undefined}
                aria-invalid={formErrors.notes ? "true" : undefined}
                className={formErrors.notes ? "input-error" : ""}
              ></textarea>
              <ErrorMessage id="notes-error" error={formErrors.notes} />
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                className="button"
                disabled={isSubmitting}
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