import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCOM — Système de Gestion Commerciale",
  description:
    "Documentation du projet SCOM : deux backends Spring Boot (Hibernate + JPA, JDK 25) et un frontend React/Vite branchés sur MySQL/WAMP.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
