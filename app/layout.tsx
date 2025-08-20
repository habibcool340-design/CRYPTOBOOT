import "./../styles/globals.css";
import { ReactNode } from "react";
export const metadata = { title: "ROAR – Mini App", description: "Roar Points Mining App" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
