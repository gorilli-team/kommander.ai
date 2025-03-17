"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Main from "./components/Main";

export default function Page() {
  const [selectedPage, setSelectedPage] = useState("Widget");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="flex h-screen text-white">
        <Sidebar 
          selectedPage={selectedPage} 
          setSelectedPage={setSelectedPage}
        />
        <div className="flex-1 flex flex-col">
          <Header />
          <Main 
            selectedPage={selectedPage}
          />
        </div>
      </div>
    </>
  );
}