"use client";
import { useState, useEffect } from "react";
import Image from 'next/image';

interface SidebarProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sidebar({
  selectedPage,
  setSelectedPage,
}: SidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKommanderClick = () => {
    window.location.reload();
  };

  const handlePageChange = (page: string) => {
    setSelectedPage(page);
  };

  if (!mounted) {
    return (
      <aside className="w-64 bg-gray-800 flex text-white flex-col border-r border-gray-600">
        <div className="h-16 text-xl font-bold flex items-center ps-4">
          <Image 
            className="w-12 h-12 rounded-full" 
            src="/globe.svg" 
            alt="logo-kommander" 
            width={24}
            height={24}
          />
          <span>Kommander.ai</span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700">
                <i className="fa-regular fa-newspaper pr-2"></i>
                <span>Widget</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700">
                <i className="fa-solid fa-brain pr-2"></i>
                <span>Analytics</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700">
                <i className="fa-solid fa-chart-simple pr-2"></i>
                <span>Help</span>
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700">
                <i className="fa-solid fa-faucet pr-2"></i>
                <span>Docs</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-600 flex text-white flex-col">
      <div
        className="h-16 text-xl font-bold flex items-center ps-6 cursor-pointer"
        onClick={handleKommanderClick}
      >
        <Image 
          src="/globe.svg" 
          alt="logo-kommander" 
          width={24}
          height={24}
        />
        <span>Kommander.ai</span>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 ${
                selectedPage === "Widget" ? "bg-gray-700" : ""
              }`}
              onClick={() => handlePageChange("Widget")}
            >
              <i className="fa-regular fa-newspaper pr-2"></i>
              <span>Widget</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 ${
                selectedPage === "Analytics" ? "bg-gray-700" : ""
              }`}
              onClick={() => handlePageChange("Analytics")}
            >
              <i className="fa-solid fa-brain pr-2"></i>
              <span>Analytics</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 ${
                selectedPage === "Help" ? "bg-gray-700" : ""
              }`}
              onClick={() => handlePageChange("Help")}
            >
              <i className="fa-solid fa-chart-simple pr-2"></i>
              <span>Help</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 ${
                selectedPage === "Docs" ? "bg-gray-700" : ""
              }`}
              onClick={() => handlePageChange("Docs")}
            >
              <i className="fa-solid fa-faucet pr-2"></i>
              <span>Docs</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}