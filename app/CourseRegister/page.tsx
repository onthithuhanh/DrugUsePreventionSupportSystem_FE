"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Skeleton, Empty } from "antd";
import { authApi } from "@/api/auth";
import Link from "next/link";

const { Title, Text } = Typography;

interface RegisteredCourse {
  userId: number;
  courseId: number;
  registerDate: string;
  course?: any;
  user?: any;
}

export default function CourseRegisterPage() {
  const [data, setData] = useState<RegisteredCourse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await authApi.getRegisteredCourses();
        setData(Array.isArray(res) ? res : res.items || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>
      <Title level={2} style={{ marginBottom: 24, color: "#2563eb" }}>Khóa học đã đăng ký</Title>
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : data.length === 0 ? (
        <Empty description="Bạn chưa đăng ký khóa học nào." />
      ) : (
        data.map((item, idx) => (
          <Card key={idx} style={{ marginBottom: 18, borderRadius: 12 }}>
            <Text strong>User ID:</Text> {item.userId} <br />
            <Text strong>Course ID:</Text> {item.courseId} <br />
            <Text strong>Ngày đăng ký:</Text> {new Date(item.registerDate).toLocaleString("vi-VN")}<br />
            <Link href={`/course/${item.courseId}`} style={{ color: "#2563eb", fontWeight: 600, display: "inline-block", marginTop: 8 }}>
              Xem chi tiết khóa học
            </Link>
          </Card>
        ))
      )}
    </div>
  );
} 