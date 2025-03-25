import { Link } from "@remix-run/react";

interface BackLinkProps {
  to: string;
  label?: string;
}

export function BackLink({ to, label = "Back to Debug Hub" }: BackLinkProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <Link to={to} style={{ 
        display: 'inline-block', 
        marginBottom: '1rem',
        color: '#0066cc',
        textDecoration: 'none',
        fontWeight: 'bold'
      }}>
        &larr; {label}
      </Link>
    </div>
  );
} 