"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import { authApi } from "@/api/auth"; 
import { useToast } from "@/hooks/use-toast";

interface Blog {
  blogId: number;
  title: string;
  content: string;
  authorId: number;
  publishedDate: string;
  status: string;
  authorFullName: string;
}

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => { 

    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await authApi.getAllBlogsForAdmin();
        setBlogs(data);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await authApi.approveBlog(id);
      toast({ title: "Thành công", description: "Đã chấp nhận blog!" });
      reload();
    } catch {
      toast({ title: "Lỗi", description: "Lỗi khi chấp nhận blog", variant: "destructive" });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await authApi.rejectBlog(id);
      toast({ title: "Thành công", description: "Đã từ chối blog!" });
      reload();
    } catch {
      toast({ title: "Lỗi", description: "Lỗi khi từ chối blog", variant: "destructive" });
    }
  };

  const reload = async () => {
    setLoading(true);
    try {
      const data = await authApi.getAllBlogsForAdmin();
      setBlogs(data);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "blogId", key: "blogId" },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Nội dung", dataIndex: "content", key: "content" },
    { title: "Tác giả", dataIndex: "authorFullName", key: "authorFullName" },
    { title: "ID Tác giả", dataIndex: "authorId", key: "authorId" },
    { title: "Ngày đăng", dataIndex: "publishedDate", key: "publishedDate" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Blog) =>
        record.status === "Pending" ? (
          <>
            <Popconfirm title="Chắc chắn chấp nhận?" onConfirm={() => handleApprove(record.blogId)} okText="Chấp nhận" cancelText="Hủy">
              <Button type="primary" style={{ marginRight: 8 }}>Chấp nhận</Button>
            </Popconfirm>
            <Popconfirm title="Chắc chắn từ chối?" onConfirm={() => handleReject(record.blogId)} okText="Từ chối" cancelText="Hủy">
              <Button danger>Từ chối</Button>
            </Popconfirm>
          </>
        ) : null,
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Danh sách blog</h2>
      <Table rowKey="blogId" columns={columns} dataSource={blogs} loading={loading} bordered />
    </div>
  );
}
