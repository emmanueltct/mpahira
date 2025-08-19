'use client';
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import LoadingSkeloton from "../loadingSkeloton";

// Fetch all users
const fetchUserList = async () => {
  const { data } = await axiosInstance.get(`/auth/users`);
  return data.users;
};

// Fetch all roles
const fetchUserRole = async () => {
  const { data } = await axiosInstance.get(`/roles`);
  return data;
};

// Update user role
const updateUserRole = async (userId: string, roleId: string) => {
  try {
    const { data } = await axiosInstance.patch(`/auth/users/${userId}`, { roleId });
    return data;
  } catch (error: any) {
    console.error("Error updating user role:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    return null;
  }
};

export default function UsersListPage() {
  const queryClient = useQueryClient();

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>("All"); // Role filter

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserList,
  });

  const { data: roles, isLoading: rolesLoading, error: rolesError } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchUserRole,
  });

  if (usersLoading || rolesLoading) return <div><LoadingSkeloton/></div>;
  if (usersError) toast.error("Error fetching users");
  if (rolesError) toast.error("Error fetching roles");

  // Ensure users is always an array
  const usersArray = Array.isArray(users) ? users : [];

  // Filter users by role
const filteredUsers =
  selectedRole === "All"
    ? usersArray
    : usersArray.filter((user: any) => {
        return user.role?.id === selectedRole;
      });
  // Pagination logic
  const totalPages = filteredUsers.length
    ? Math.ceil(filteredUsers.length / itemsPerPage)
    : 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRoleChange = async (userId: string, roleId: string) => {
    await updateUserRole(userId, roleId);
    queryClient.invalidateQueries(["users"]);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <span>Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded p-2"
        >
          {[5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <span>Filter by Role:</span>
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded p-2"
        >
          <option value="All">All Roles</option>
          {roles.map((role: any) => (
            <option key={role.id} value={role.id}>{role.role}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className=" w-full overflow-x-auto rounded-lg shadow-sm border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telephone</TableHead>
               <TableHead>Authentication</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user, i) => (
              <TableRow key={user.id}>
                <TableCell>{i + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.telephone}</TableCell>
                 <TableHead>{user.provider}</TableHead>
                <TableCell>
                  <select
                    className="border rounded p-1"
                    value={user.roleId || ""}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    {roles.map((role: any) => (
                      <option key={role.id} value={role.id}>{role.role}</option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRoleChange(user.id, user.roleId)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-primary text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
