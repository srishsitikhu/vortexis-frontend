import React from "react";
import Navbar from "../Navbar";
import Notification from "../general/Notification";
import Footer from "../Footer";

const EndUserLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Notification />
      <header className="flex fixed z-[100] w-full h-20 bg-white top-0">
        <Navbar />
      </header>
      <main className="flex-1 pt-24">
        <div className="mx-auto w-[1580px] px-4">{children}</div>
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default EndUserLayout;
