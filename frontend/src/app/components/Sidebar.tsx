"use client";
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleKommanderClick = () => {
    router.push('/dashboard');
  };

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
            <Link href="/dashboard/widgets" passHref>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 ${
                  pathname === "/dashboard/widgets" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-regular fa-newspaper pr-2"></i>
                <span>Widget</span>
              </button>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/analytics" passHref>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 ${
                  pathname === "/dashboard/analytics" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-brain pr-2"></i>
                <span>Analytics</span>
              </button>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/help" passHref>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 ${
                  pathname === "/dashboard/help" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-chart-simple pr-2"></i>
                <span>Help</span>
              </button>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/docs" passHref>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 ${
                  pathname === "/dashboard/docs" ? "bg-gray-700" : ""
                }`}
              >
                <i className="fa-solid fa-faucet pr-2"></i>
                <span>Docs</span>
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}