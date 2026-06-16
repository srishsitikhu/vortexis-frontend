"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/user";
import { Button } from "@/components/general/Button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/general/DataTable";
import { userColumn } from "@/lib/columns/userColumn";
import { User } from "@/types/user";
import Spinner from "@/components/Spinner";
import { useDebounce } from "@/hooks/useDebounce";

const UserTablePage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery<User[]>({
    queryKey: ["users", debouncedSearchTerm],
    queryFn: () => fetchUsers(debouncedSearchTerm),
  });

  return (
    <div className="section-container space-y-8">
      <h1 className="heading-admin">Users Management</h1>

      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search ..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="input-field"
        />
        <Button
          variant="outline"
          icon={<Plus size={18} />}
          text="Add User"
          onClick={() => router.push("/admin/users/add")}
        />
      </div>
      {usersLoading ? (
        <Spinner />
      ) : usersError ? (
        <p className="error-text">Failed to load users.</p>
      ) : (
        <div className="">
          <DataTable columns={userColumn} data={usersData ?? []} />
        </div>
      )}
    </div>
  );
};

export default UserTablePage;
