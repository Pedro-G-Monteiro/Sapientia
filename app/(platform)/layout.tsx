import "@ant-design/v5-patch-for-react-19";
import { Metadata } from "next";
import "../globals.css";
import AppLayout from "@/components/ui/Layout/AppLayout";

// Metadados da aplicação
export const metadata: Metadata = {
  title: "Sapientia",
  description: "Expand your knowledge with Sapientia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
