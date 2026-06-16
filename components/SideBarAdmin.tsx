"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  FolderOpen,
  ShoppingCart,
  LogOut,
  Star,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axiosinstance";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "User", icon: Users },
    { id: "products", label: "Product", icon: Package },
    { id: "categories", label: "Category", icon: FolderOpen },
    { id: "orders", label: "Order", icon: ShoppingCart },
  ];

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="w-64 bg-primary-800 text-white min-h-screen flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6 text-secondary-400" />
            Vortexis
          </h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname.includes(item.id);

              return (
                <li key={item.id}>
                  <button
                    onClick={() => router.push(`/admin/${item.id}`)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      isActive
                        ? "bg-secondary-600 text-white shadow-lg"
                        : "text-neutral-300 hover:bg-primary-700 hover:text-neutral-500"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left text-red-500 hover:bg-primary-700 hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
