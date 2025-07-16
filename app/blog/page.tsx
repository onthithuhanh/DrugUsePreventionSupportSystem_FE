"use client";
import React, { useEffect, useState } from "react";
import { List, Card, Typography, Skeleton, Avatar } from "antd";
import { authApi } from "@/api/auth";
import Link from "next/link";

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

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const data = await authApi.getAllApprovedBlogs();
        setBlogs(data);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>Blog cộng đồng</Title>
      <List
        grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }}
        dataSource={blogs}
        loading={loading}
        renderItem={item => (
          <List.Item>
            <Link href={`/blog/${item.blogId}`} style={{ textDecoration: "none" }}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  minHeight: 280,
                  boxShadow: "0 4px 24px #0002",
                  transition: "box-shadow 0.3s, transform 0.3s",
                  marginBottom: 8,
                  cursor: "pointer",
                }}
                bodyStyle={{ padding: 28 }}
                cover={
                  <div style={{
                    background: "linear-gradient(90deg, #2563eb11 0%, #fff 100%)",
                    padding: "18px 24px 0 24px",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}>
                    <Title level={4} style={{ marginBottom: 0, color: "#2563eb", fontWeight: 700, fontSize: 22, lineHeight: 1.3 }}>
                      {item.title}
                    </Title>
                  </div>
                }
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
                  <Avatar style={{ backgroundColor: "#2563eb", marginRight: 10, fontWeight: 600 }}>
                    {item.authorFullName?.[0] || "A"}
                  </Avatar>
                  <Text strong style={{ fontSize: 16 }}>{item.authorFullName}</Text>
                  <Text type="secondary" style={{ marginLeft: 14, fontSize: 13 }}>
                    {new Date(item.publishedDate).toLocaleDateString("vi-VN")}
                  </Text>
                </div>
                <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 18, color: "#444", fontSize: 16 }}>
                  {item.content}
                </Paragraph>
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    color: "#2563eb",
                    fontWeight: 600,
                    fontSize: 15,
                    border: "1px solid #2563eb33",
                    borderRadius: 8,
                    padding: "4px 16px",
                    background: "#f4f8ff",
                    transition: "background 0.2s"
                  }}>
                    Xem chi tiết →
                  </span>
                </div>
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
} 