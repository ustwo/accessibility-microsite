import { useState } from "react";
import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';
import { useFormSubmission, PatternSchema } from "../../utils/formSubmission";
import { useAccessibleForm, ErrorSummary, ErrorMessage } from "../../utils/formUtils";
import LoadingSpinner from "../../components/LoadingSpinner";

interface FormValues {
  name: string;
  category: string;
  where: string;
  description: string;
  link1Title: string;
  link1Url: string;
  link2Title: string;
  link2Url: string;
  link3Title: string;
  link3Url: string;
}

const initialFormValues: FormValues = {
  name: '',
  category: '',
  where: '',
  description: '',
  link1Title: '',
  link1Url: '',
  link2Title: '',
  link2Url: '',
  link3Title: '',
  link3Url: ''
};

export default function PatternsSubmit() {
  const { handlePatternSubmit, patternErrors, isSubmittingPattern, statusMessage } = useFormSubmission();
  const [categoryOptions] = useState([
    "General patterns to follow", 
    "Patterns for good forms", 
    "Patterns for interactions",
    "Patterns for components"
  ]);
  const [whereOptions] = useState([
    "all", "web", "mobile", "desktop"
  ]);

  // Use the accessible form hook with client-side validation
  const {
    formValues,
    formErrors,
    hasErrors,
    handleChange,
    handleBlur,
    handleSubmit
  } = useAccessibleForm(
    initialFormValues,
    PatternSchema, // Pass the Zod schema for client-side validation
    patternErrors // Pass server errors from form submission
  );

  return (
    <Layout title="Submit a Pattern" theme="patterns">
      <Helmet>
        <title>Submit a Pattern - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Submit your favorite accessibility pattern to be featured on our site."
        />
      </Helmet>

      {/* Live region for screen reader announcements */}
      <div 
        className="sr-only" 
        aria-live="assertive" 
        role="status"
        id="form-submission-status"
      >
        {statusMessage}
      </div>

      <section className="content-section" aria-labelledby="submit-heading">
        <div className="container container-content">
          <p className="intro-text mb-8">
            Share your favorite accessibility pattern with the community. We appreciate your contributions!
          </p>
          
          <div className="form-container">
            {/* Show error summary if there are form errors */}
            {hasErrors && (
              <ErrorSummary errors={formErrors} />
            )}
            
            {/* Show loading spinner during submission */}
            {isSubmittingPattern && (
              <div 
                className="form-loading-overlay"
                aria-labelledby="form-submission-status"
              >
                <LoadingSpinner message="Submitting your pattern..." />
              </div>
            )}
            
            <form 
              onSubmit={(e) => {
                // Prevent default form submission
                e.preventDefault();
                
                // Run client-side validation
                const isValid = handleSubmit(e);
                
                // If the form is valid according to client-side validation, submit to server
                if (isValid) {
                  handlePatternSubmit(e);
                }
              }} 
              className="submission-form" 
              noValidate
              aria-busy={isSubmittingPattern}
            >
              <div className="form-group">
                <label htmlFor="name">
                  Pattern Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className={`form-control ${formErrors.name ? "input-error" : ""}`}
                  placeholder="Enter the name of the pattern"
                  value={formValues.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby={formErrors.name ? "name-error" : undefined}
                  aria-invalid={formErrors.name ? "true" : undefined}
                  disabled={isSubmittingPattern}
                />
                <ErrorMessage id="name-error" error={formErrors.name} />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className={`form-control ${formErrors.category ? "input-error" : ""}`}
                  value={formValues.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby={formErrors.category ? "category-error" : undefined}
                  aria-invalid={formErrors.category ? "true" : undefined}
                  disabled={isSubmittingPattern}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ErrorMessage id="category-error" error={formErrors.category} />
              </div>
              
              <div className="form-group">
                <label htmlFor="where">Where to Apply</label>
                <select
                  id="where"
                  name="where"
                  className={`form-control ${formErrors.where ? "input-error" : ""}`}
                  value={formValues.where}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby={formErrors.where ? "where-error" : undefined}
                  aria-invalid={formErrors.where ? "true" : undefined}
                  disabled={isSubmittingPattern}
                >
                  <option value="">Select where this pattern applies</option>
                  {whereOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ErrorMessage id="where-error" error={formErrors.where} />
                <p className="form-help">Where is this pattern most applicable?</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  className={`form-control ${formErrors.description ? "input-error" : ""}`}
                  placeholder="Describe the pattern and how it improves accessibility"
                  rows={4}
                  value={formValues.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby={formErrors.description ? "description-error" : undefined}
                  aria-invalid={formErrors.description ? "true" : undefined}
                  disabled={isSubmittingPattern}
                ></textarea>
                <ErrorMessage id="description-error" error={formErrors.description} />
              </div>
              
              <div className="form-group">
                <h3 className="form-section-title">Resources & Links (Optional)</h3>
                {[1, 2, 3].map((num) => (
                  <div key={num} className="link-group">
                    <div className="form-row">
                      <div className="form-col">
                        <label htmlFor={`link${num}Title`}>Link {num} Title</label>
                        <input
                          type="text"
                          id={`link${num}Title`}
                          name={`link${num}Title`}
                          className={`form-control ${formErrors[`link${num}Title`] ? "input-error" : ""}`}
                          placeholder="Enter link title"
                          value={formValues[`link${num}Title`] || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-describedby={formErrors[`link${num}Title`] ? `link${num}Title-error` : undefined}
                          aria-invalid={formErrors[`link${num}Title`] ? "true" : undefined}
                          disabled={isSubmittingPattern}
                        />
                        <ErrorMessage id={`link${num}Title-error`} error={formErrors[`link${num}Title`]} />
                      </div>
                      <div className="form-col">
                        <label htmlFor={`link${num}Url`}>Link {num} URL</label>
                        <input
                          type="url"
                          id={`link${num}Url`}
                          name={`link${num}Url`}
                          className={`form-control ${formErrors[`link${num}Url`] ? "input-error" : ""}`}
                          placeholder="Enter URL"
                          value={formValues[`link${num}Url`] || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-describedby={formErrors[`link${num}Url`] ? `link${num}Url-error` : undefined}
                          aria-invalid={formErrors[`link${num}Url`] ? "true" : undefined}
                          disabled={isSubmittingPattern}
                        />
                        <ErrorMessage id={`link${num}Url-error`} error={formErrors[`link${num}Url`]} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="form-actions">
                <button type="submit" className="button" disabled={isSubmittingPattern}>
                  {isSubmittingPattern ? "Submitting..." : "Submit Pattern"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
} 