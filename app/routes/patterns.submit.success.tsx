import { Link } from "@remix-run/react";
import Layout from "~/components/Layout";
import { useEffect } from "react";

export default function SubmitPatternSuccess() {
  // Log when the success page renders
  useEffect(() => {
    console.log("===== SUCCESS PAGE: Pattern submission success page rendered =====");
  }, []);

  return (
    <Layout title="Submission Successful">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl mb-4">Thank You for Your Submission!</h2>
          <p className="mb-6">
            Your accessibility pattern has been successfully submitted for review. We&apos;ll review it and add it to the directory if it meets our criteria.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/patterns" className="button">
              Browse Patterns
            </Link>
            <Link to="/patterns/submit" className="button">
              Submit Another Pattern
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
} 