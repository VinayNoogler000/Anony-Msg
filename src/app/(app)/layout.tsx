import Navbar from "@/components/Navbar";

export default function RootLayout({children}:{children: React.ReactNode}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      {children}
    </div>
  );
}
