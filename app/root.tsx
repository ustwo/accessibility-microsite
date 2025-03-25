import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/server-runtime";

export const links: LinksFunction = () => [
  /* CSS files ordered by importance and dependency */
  { rel: "stylesheet", href: "/styles/variables.css" },
  { rel: "stylesheet", href: "/styles/variables-extras.css" },
  { rel: "stylesheet", href: "/styles/reset.css" },
  { rel: "stylesheet", href: "/styles/typography.css" },
  { rel: "stylesheet", href: "/styles/layout.css" },
  { rel: "stylesheet", href: "/styles/grid.css" },
  { rel: "stylesheet", href: "/styles/components.css" },
  { rel: "stylesheet", href: "/styles/theme-dark.css" },
  { rel: "stylesheet", href: "/styles/sections.css" },
  { rel: "stylesheet", href: "/styles/utilities.css" },
  /* Google fonts */
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
