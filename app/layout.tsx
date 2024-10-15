import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Components/Navbar"
import { Providers } from "./Components/Providers"
export const metadata: Metadata = {
    title: "Ughh",
    description: "A image sharing platform",
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <Navbar />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
