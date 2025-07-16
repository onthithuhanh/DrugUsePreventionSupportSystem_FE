"use client";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { authApi } from "@/api/auth";

interface User {
  userId: number;
  fullName: string;
  address: string;
  email: string;
  dateOfBirth: string;
  password: string;
  createdDate: string;
  roleId: number;
}

export default function UserAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await authApi.getAllUsers();
        setUsers(data);
      } catch (error) {
        // Xử lý lỗi nếu cần
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "userId", key: "userId" },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Ngày sinh", dataIndex: "dateOfBirth", key: "dateOfBirth" },
    { title: "Ngày tạo", dataIndex: "createdDate", key: "createdDate" },
    // { title: "Role ID", dataIndex: "roleId", key: "roleId" },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Danh sách người dùng</h2>
      <Table rowKey="userId" columns={columns} dataSource={users} loading={loading} bordered />
    </div>
  );
}
