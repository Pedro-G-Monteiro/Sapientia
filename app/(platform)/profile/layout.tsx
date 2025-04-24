import "@ant-design/v5-patch-for-react-19";
import { Metadata } from "next";

// Metadados da aplicação
export const metadata: Metadata = {
  title: "My Profile | Sapientia",
  description: "Manage your profile",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
