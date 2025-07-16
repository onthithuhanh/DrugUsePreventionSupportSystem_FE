"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Row, Col, Tag } from "antd";
import { authApi } from "@/api/auth";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

interface CourseCategory {
  categoryId: number;
  name: string;
  description: string;
  age: string;
}

interface Course {
  courseId: number;
  title: string;
  description: string;
  duration: number;
  createdAt: string;
  videoUrl: string;
  documentContent: string;
  category: CourseCategory;
}

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let data = await authApi.getCourses();
        if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
        setCourses(data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
      <Title level={2} style={{ marginBottom: 32, color: "#2563eb", textAlign: "center" }}>Danh sách khóa học</Title>
      <Row gutter={[24, 24]}>
        {courses.map(course => (
          <Col xs={24} sm={12} md={8} lg={8} key={course.courseId}>
            <Card
              hoverable
              style={{ borderRadius: 16, minHeight: 320, boxShadow: "0 2px 12px #0001" }}
              bodyStyle={{ padding: 24 }}
              title={<span style={{ color: "#2563eb", fontWeight: 700 }}>{course.title}</span>}
              extra={<Tag color="blue">{course.category?.name}</Tag>}
            >
              <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 12 }}>{course.description}</Paragraph>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Thời lượng: </Text>
                <Text>{course.duration} phút</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">Ngày tạo: </Text>
                <Text>{new Date(course.createdAt).toLocaleDateString("vi-VN")}</Text>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                <Link href={`/course/${course.courseId}`}>
                  <Button type="primary" style={{ borderRadius: 8 }}>Xem chi tiết</Button>
                </Link>
                <Button style={{ borderRadius: 8 }} type="default">Đăng ký</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
} 