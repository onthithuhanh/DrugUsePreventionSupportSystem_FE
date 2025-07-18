"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Row, Col, Tag } from "antd";
import { authApi } from "@/api/auth";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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

  const handleRegisterCourse = async (courseId: number) => {
    try {
      await authApi.registerCourse(courseId);
      toast({ title: "Thành công", description: "Đăng ký thành công!" });
    } catch (error: any) {
      let msg = "Đã xảy ra lỗi";
      if (error?.response?.data?.error) {
        msg = error.response.data.error;
      } else if (error?.message) {
        msg = error.message;
      }
      toast({ title: "Lỗi", description: msg, variant: "destructive" });
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold mb-3">
                <i className="fas fa-graduation-cap me-3"></i>
                Khóa học phòng ngừa
              </h1>
              <p className="lead mb-4">
                Nâng cao nhận thức và kỹ năng phòng ngừa sử dụng ma túy qua các khóa học chuyên nghiệp
              </p>
              <div className="d-flex justify-content-center gap-3">
                <span className="badge bg-light text-primary fs-6 px-3 py-2">
                  <i className="fas fa-check-circle me-1"></i>
                  100% Miễn phí
                </span>
                <span className="badge bg-light text-primary fs-6 px-3 py-2">
                  <i className="fas fa-certificate me-1"></i>
                  Có chứng chỉ
                </span>
                <span className="badge bg-light text-primary fs-6 px-3 py-2">
                  <i className="fas fa-clock me-1"></i>
                  24/7 truy cập
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 mb-5 mt-10">
        <div className="col-md-4">
          <div className="card bg-primary text-white h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="fas fa-book-open display-4 mb-3"></i>
              <h3 className="display-6 fw-bold">{courses.length}</h3>
              <p className="card-text">Khóa học có sẵn</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="fas fa-users display-4 mb-3"></i>
              <h3 className="display-6 fw-bold">1000+</h3>
              <p className="card-text">Học viên đã tham gia</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="fas fa-star display-4 mb-3"></i>
              <h3 className="display-6 fw-bold">4.9</h3>
              <p className="card-text">Đánh giá trung bình</p>
            </div>
          </div>
        </div>
      </div>
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
                <Button style={{ borderRadius: 8 }} type="default" onClick={() => handleRegisterCourse(course.courseId)}>Đăng ký</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
} 