import { ActionFunctionArgs, json } from "@remix-run/server-runtime";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import Layout from "~/components/Layout";
import { z } from "zod";
import { useAccessibleForm, ErrorSummary, ErrorMessage } from "~/utils/formUtils";
import { submitNewItem } from "~/utils/edgeGoogleSheets";
import { useEffect } from "react";

// Define validation schema using Zod
const PatternSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  where: z.string().min(1, "Please specify where this pattern applies"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  // Using linkyDinks instead of simple link
  linkTitles: z.string().optional(),
  linkUrls: z.string().optional(),
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
  console.log("===== SERVER: patterns.submit action function starting =====");
  
  try {
    // Get form data
    const formData = await request.formData();
    const formValues = Object.fromEntries(formData);
    
    // Validate the form data
    const result = PatternSchema.safeParse(formValues);
    
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
    
    // Process linkyDinks from the form data
    const linkTitles = result.data.linkTitles ? result.data.linkTitles.split('\n').filter(Boolean) : [];
    const linkUrls = result.data.linkUrls ? result.data.linkUrls.split('\n').filter(Boolean) : [];
    
    // Create linkyDinks array
    const linkyDinks = linkTitles.map((title, index) => ({
      title,
      url: index < linkUrls.length ? linkUrls[index] : `https://www.google.com/search?q=${encodeURIComponent(title)}`
    }));
    
    // Prepare the data for submission
    const pattern = {
      name: result.data.name,
      category: result.data.category,
      where: result.data.where,
      description: result.data.description,
      linkyDinks: linkyDinks,
      // For backward compatibility
      link: linkyDinks.length > 0 ? 
        linkyDinks.map(link => link.title).join(', ') : '',
      tags: [],
    };
    
    // Submit the data
    const success = await submitNewItem('pattern', pattern);
    
    if (success) {
      console.log("===== SERVER: Submission successful, redirecting to success page =====");
      return json<SuccessResponse>({
        success: true,
        redirect: '/patterns/submit/success',
      });
    } else {
      console.log("===== SERVER: Submission failed =====");
      return json<ErrorResponse>({
        success: false,
        errors: {
          form: "Failed to submit the pattern. Please try again later."
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

export default function SubmitPattern() {
  console.log("===== CLIENT: SubmitPattern component rendering =====");
  
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
      category: "",
      where: "",
      description: "",
      linkTitles: "",
      linkUrls: "",
    },
    PatternSchema, // Pass the Zod schema for client-side validation
    actionData
  );
  
  // Categories for the dropdown
  const categories = [
    "General patterns to follow",
    "Patterns for good forms",
    "Patterns for interactions",
    "Patterns for components",
  ];

  // Where options for the dropdown
  const whereOptions = [
    "all",
    "web",
    "mob"
  ];
  
  return (
    <Layout title="Submit an Accessibile Pattern">
      <section className="content-section">
        <div className="container container-content">
          <p className="mb-6 subtitle">
            Share an accessibile pattern with the community. Your submission will be reviewed before being added to the library.
          </p>
          
          {/* Show error summary if there are form errors */}
          {hasErrors && (
            <ErrorSummary errors={formErrors} />
          )}
          
          <Form method="post" onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="form-group">
              <label htmlFor="name" id="name-label">Pattern Name</label>
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
              <label htmlFor="where" id="where-label">Where does this pattern apply?</label>
              <select
                id="where"
                name="where"
                value={formValues.where}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={formErrors.where ? "where-error" : undefined}
                aria-invalid={formErrors.where ? "true" : undefined}
                className={formErrors.where ? "input-error" : ""}
              >
                <option value="">Select where this applies</option>
                {whereOptions.map(option => (
                  <option key={option} value={option}>{option === "all" ? "All platforms" : option === "web" ? "Web only" : "Mobile only"}</option>
                ))}
              </select>
              <ErrorMessage id="where-error" error={formErrors.where} />
            </div>

            <div className="form-group">
              <label htmlFor="description" id="description-label">What, why, how?</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formValues.description}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={formErrors.description ? "description-error" : undefined}
                aria-invalid={formErrors.description ? "true" : undefined}
                className={formErrors.description ? "input-error" : ""}
              ></textarea>
              <ErrorMessage id="description-error" error={formErrors.description} />
              <div className="text-sm text-gray-600 mt-1">
                Describe the pattern, why it matters for accessibility, and how to implement it.
              </div>
            </div>
            
            {/* Linky Dinks section */}
            <div className="form-group">
              <label htmlFor="linkTitles" id="linkTitles-label">Linky Dinks - Titles</label>
              <div className="text-sm text-gray-600 mb-2">
                Add link titles (one per line)
              </div>
              <textarea
                id="linkTitles"
                name="linkTitles"
                rows={3}
                value={formValues.linkTitles}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={formErrors.linkTitles ? "linkTitles-error" : undefined}
                aria-invalid={formErrors.linkTitles ? "true" : undefined}
                className={formErrors.linkTitles ? "input-error" : ""}
                placeholder="YouTube: How a blind person uses a website"
              ></textarea>
              <ErrorMessage id="linkTitles-error" error={formErrors.linkTitles} />
            </div>
            
            <div className="form-group">
              <label htmlFor="linkUrls" id="linkUrls-label">Linky Dinks - URLs (optional)</label>
              <div className="text-sm text-gray-600 mb-2">
                Add corresponding URLs (one per line). If left empty, we&apos;ll create search links from the titles.
              </div>
              <textarea
                id="linkUrls"
                name="linkUrls"
                rows={3}
                value={formValues.linkUrls}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={formErrors.linkUrls ? "linkUrls-error" : undefined}
                aria-invalid={formErrors.linkUrls ? "true" : undefined}
                className={formErrors.linkUrls ? "input-error" : ""}
                placeholder="https://www.youtube.com/watch?v=example"
              ></textarea>
              <ErrorMessage id="linkUrls-error" error={formErrors.linkUrls} />
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                className="button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Pattern"}
              </button>
            </div>
          </Form>
        </div>
      </section>
    </Layout>
  );
} 