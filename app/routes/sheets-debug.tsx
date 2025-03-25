import { Link } from "@remix-run/react";

export default function SheetsDebugIndex() {
  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Google Sheets API Debug Tools</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <a href="/" style={{ 
          display: 'inline-block', 
          marginBottom: '1rem',
          color: '#0066cc',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          &larr; Back to main site
        </a>
      </div>
      
      <p style={{ marginBottom: '2rem' }}>
        Use these tools to debug the Google Sheets API connection.
      </p>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem'
      }}>
        <DebugCard
          title="Permissions Check"
          description="Check if your service account has access to the Google Sheets documents. This is a common issue that causes API errors."
          link="/test-permissions"
          primary
        />
        
        <DebugCard
          title="Step-by-Step Test"
          description="Tests each individual step of the Google Sheets authentication and API connection. Best for identifying exactly where the problem is."
          link="/test-steps"
        />
        
        <DebugCard
          title="JWT Token Test"
          description="Tests only the JWT token generation process."
          link="/test-jwt"
        />
        
        <DebugCard
          title="Full Sheets Connection Test"
          description="Tests the complete end-to-end Google Sheets data fetching process."
          link="/test-sheets"
        />
      </div>
    </div>
  );
}

interface DebugCardProps {
  title: string;
  description: string;
  link: string;
  primary?: boolean;
}

function DebugCard({ title, description, link, primary }: DebugCardProps) {
  return (
    <div style={{
      border: `1px solid ${primary ? '#0066cc' : '#ccc'}`,
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: primary ? '#f0f7ff' : '#f8f8f8'
    }}>
      <h2 style={{ 
        margin: '0 0 1rem 0',
        color: primary ? '#0066cc' : '#333'
      }}>
        {title}
      </h2>
      
      <p style={{ margin: '0 0 1.5rem 0' }}>
        {description}
      </p>
      
      <Link to={link} style={{
        display: 'inline-block',
        padding: '0.5rem 1rem',
        backgroundColor: primary ? '#0066cc' : '#f1f1f1',
        color: primary ? 'white' : '#333',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'bold'
      }}>
        Run Test &rarr;
      </Link>
    </div>
  );
} 