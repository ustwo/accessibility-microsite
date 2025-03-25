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

// Type definition for errors
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
      category: result.data.category,
      tags: result.data.tags ? result.data.tags.split(',').map(tag => tag.trim()) : [],
      cost: result.data.cost,
      platforms: result.data.platforms ? result.data.platforms.split(',').map(platform => platform.trim()) : [],
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
      category: "",
      tags: "",
      cost: "",
      platforms: ""
    },
    ToolSchema, // Pass the Zod schema for client-side validation
    actionData
  );

  // Categories for the dropdown
  const categories = [
    "Evaluation",
    "Screen Reader",
    "Design",
    "Developer",
    "Browser Extension",
    "Testing"
  ];

  // Cost options
  const costOptions = [
    "Free",
    "Paid",
    "Free / Paid",
    "Free (Built-in)",
    "Free Trial"
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
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
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
                placeholder="Automated testing, Browser extension, Visual feedback"
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
                <option value="">Select cost option</option>
                {costOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
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
                placeholder="Web, Chrome, iOS, Android, Windows, macOS"
                aria-describedby={formErrors.platforms ? "platforms-error" : undefined}
                aria-invalid={formErrors.platforms ? "true" : undefined}
                className={formErrors.platforms ? "input-error" : ""}
              />
              <ErrorMessage id="platforms-error" error={formErrors.platforms} />
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