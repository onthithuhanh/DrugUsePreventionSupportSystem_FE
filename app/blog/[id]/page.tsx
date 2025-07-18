"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, Typography, Skeleton, Avatar, Button, List, Input, Form, Popconfirm, message } from "antd";
import { authApi } from "@/api/auth";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const { Title, Paragraph, Text } = Typography;

interface Blog {
  blogId: number;
  title: string;
  content: string;
  authorId: number;
  publishedDate: string;
  status: string;
  authorFullName: string;
}

interface Comment {
  commentId: number;
  blogId: number;
  content: string;
  postDate: string;
  authorFullName: string;
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const data = await authApi.getBlogById(Number(id));
        setBlog(data);
      } finally {
        setLoading(false);
      }
    };
    const fetchComments = async () => {
      setCommentLoading(true);
      try {
        let data = await authApi.getCommentsByBlogId(Number(id));
        if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
        setComments(data || []);
      } finally {
        setCommentLoading(false);
      }
    };
    fetchBlog();
    fetchComments();
  }, [id]);

  const handleAddComment = async (values: { content: string }) => {
    setSubmitting(true);
    try {
      await authApi.createComment(Number(id), values.content);
      toast({ title: "Thành công", description: "Đã thêm bình luận!" });
      form.resetFields();
      let data = await authApi.getCommentsByBlogId(Number(id));
      if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
      setComments(data || []);
    } catch {
      toast({ title: "Lỗi", description: "Lỗi khi thêm bình luận", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingId(comment.commentId);
    setEditingContent(comment.content);
  };

  const handleUpdateComment = async (commentId: number) => {
    try {
      await authApi.updateComment(commentId, editingContent);
      toast({ title: "Thành công", description: "Đã cập nhật bình luận!" });
      setEditingId(null);
      setEditingContent("");
      let data = await authApi.getCommentsByBlogId(Number(id));
      if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
      setComments(data || []);
    } catch {
      toast({ title: "Lỗi", description: "Lỗi khi cập nhật bình luận", variant: "destructive" });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await authApi.deleteComment(commentId);
      toast({ title: "Thành công", description: "Đã xóa bình luận!" });
      let data = await authApi.getCommentsByBlogId(Number(id));
      if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
      setComments(data || []);
    } catch {
      toast({ title: "Lỗi", description: "Lỗi khi xóa bình luận", variant: "destructive" });
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 16px" }}>
      <Button type="link" href="/blog" style={{ marginBottom: 24, paddingLeft: 0 }}>
        ← Quay lại danh sách blog
      </Button>
      <Card
        loading={loading}
        style={{ borderRadius: 20, boxShadow: "0 6px 32px #2563eb22", border: "1.5px solid #e3e8f0", marginBottom: 32 }}
        styles={{ body: { padding: 40 } }}
      >
        {blog && (
          <>
            <Title level={2} style={{ color: "#2563eb", marginBottom: 12, fontWeight: 800, fontSize: 34, lineHeight: 1.2 }}>{blog.title}</Title>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
              <Avatar style={{ backgroundColor: "#2563eb", marginRight: 14, fontWeight: 700, width: 54, height: 54, fontSize: 26 }}>
                {blog.authorFullName?.[0] || "A"}
              </Avatar>
              <div>
                <Text strong style={{ fontSize: 18 }}>{blog.authorFullName}</Text>
                <div style={{ color: "#888", fontSize: 15, marginTop: 2 }}>
                  {new Date(blog.publishedDate).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
            <Paragraph style={{ fontSize: 20, lineHeight: 1.8, marginBottom: 0, whiteSpace: "pre-line", color: "#222" }}>
              {blog.content}
            </Paragraph>
          </>
        )}
      </Card>
      {/* COMMENT SECTION */}
      <div style={{ maxWidth: 700, margin: "32px auto 0", background: "#f4f8ff", borderRadius: 18, padding: 28, boxShadow: "0 2px 12px #2563eb11", border: "1.5px solid #e3e8f0" }}>
        <Title level={4} style={{ marginBottom: 18, color: "#2563eb", fontWeight: 700 }}>Bình luận</Title>
        <Form form={form} onFinish={handleAddComment} layout="inline" style={{ marginBottom: 24 }}>
          <Form.Item name="content" rules={[{ required: true, message: "Nhập bình luận..." }]} style={{ flex: 1, marginRight: 8 }}>
            <Input.TextArea rows={2} placeholder="Viết bình luận..." autoSize={{ minRows: 2, maxRows: 4 }} style={{ borderRadius: 8, fontSize: 16 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} style={{ borderRadius: 8, fontWeight: 600, height: 40, fontSize: 16 }}>
              Gửi
            </Button>
          </Form.Item>
        </Form>
        <List
          loading={commentLoading}
          dataSource={comments}
          locale={{ emptyText: "Chưa có bình luận nào." }}
          renderItem={item => (
            <List.Item
              style={{ borderBottom: "1px solid #e3e8f0", padding: "18px 0" }}
              actions={[
                editingId === item.commentId ? (
                  <>
                    <Button type="link" size="small" onClick={() => handleUpdateComment(item.commentId)} style={{ padding: 0, fontWeight: 600 }}>Lưu</Button>
                    <Button type="link" size="small" onClick={() => { setEditingId(null); setEditingContent(""); }} style={{ padding: 0 }}>Hủy</Button>
                  </>
                ) : (
                  <>
                    <Button type="link" size="small" onClick={() => handleEditComment(item)} style={{ padding: 0 }}>Sửa</Button>
                    <Popconfirm title="Xóa bình luận này?" onConfirm={() => handleDeleteComment(item.commentId)} okText="Xóa" cancelText="Hủy">
                      <Button type="link" size="small" danger style={{ padding: 0 }}>Xóa</Button>
                    </Popconfirm>
                  </>
                )
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: "#2563eb", width: 40, height: 40, fontSize: 18 }}>{item.authorFullName?.[0] || "U"}</Avatar>}
                title={<Text strong style={{ fontSize: 16 }}>{item.authorFullName}</Text>}
                description={
                  editingId === item.commentId ? (
                    <Input.TextArea
                      value={editingContent}
                      onChange={e => setEditingContent(e.target.value)}
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      style={{ borderRadius: 8, marginTop: 8, fontSize: 15 }}
                    />
                  ) : (
                    <span style={{ fontSize: 16 }}>{item.content}</span>
                  )
                }
              />
              <div style={{ color: "#888", fontSize: 13, marginLeft: 12 }}>
                {new Date(item.postDate).toLocaleString("vi-VN")}
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
} 