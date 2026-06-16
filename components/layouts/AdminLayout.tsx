import React from "react";
import Notification from "../general/Notification";
import SideBarAdmin from "../SideBarAdmin";

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex h-screen">
      <Notification />
      <SideBarAdmin />
      <div className=" w-full px-10 mt-16">{children}</div>
    </div>
  );
};

export default AdminLayout;
