"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, Typography, Tag, Button, Skeleton, Divider, Collapse, List } from "antd";
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

interface CourseQuestionOption {
  optionId: number;
  questionId: number;
  optionText: string;
  optionValue: number;
  displayOrder: number;
}

interface CourseQuestion {
  questionId: number;
  courseId: number;
  questionText: string;
  displayOrder: number;
  isRequired: boolean;
  courseQuestionOptions: CourseQuestionOption[];
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<CourseQuestion[]>([]);
  const [questionLoading, setQuestionLoading] = useState(false);
  // State cho xem thêm câu hỏi
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  // State cho xem thêm đáp án từng câu hỏi (dùng object để lưu trạng thái từng câu)
  const [showAllAnswers, setShowAllAnswers] = useState<{ [questionId: number]: boolean }>({});

  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await authApi.getCourses();
        const found = Array.isArray(data) ? data.find((c: Course) => c.courseId === Number(id)) : null;
        setCourse(found || null);
      } finally {
        setLoading(false);
      }
    };
    const fetchQuestions = async () => {
      setQuestionLoading(true);
      try {
        let data = await authApi.getCourseQuestions();
        if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
        setQuestions(data.filter((q: CourseQuestion) => q.courseId === Number(id)));
      } finally {
        setQuestionLoading(false);
      }
    };
    fetchCourse();
    fetchQuestions();
  }, [id]);

  if (loading || !course) return <div style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}><Skeleton active paragraph={{ rows: 8 }} /></div>;

  function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 0" }}>
      <Button type="link" href="/course" style={{ marginBottom: 24, paddingLeft: 0 }}>
        ← Quay lại danh sách khóa học
      </Button>
      {/* HEADER SECTION */}
      <section style={{ marginBottom: 32 }}>
        <Title level={1} style={{ color: "#2563eb", fontWeight: 800, marginBottom: 8 }}>{course.title}</Title>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", marginBottom: 16 }}>
          <Tag color="blue" style={{ fontSize: 16, padding: "6px 18px" }}>{course.category?.name}</Tag>
          <Text type="secondary">Thời lượng: <b>{course.duration} phút</b></Text>
          <Text type="secondary">Ngày tạo: <b>{new Date(course.createdAt).toLocaleDateString("vi-VN")}</b></Text>
          <Text type="secondary">Độ tuổi: <b>{course.category?.age}</b></Text>
        </div>
        <Paragraph style={{ fontSize: 18, marginBottom: 0, color: "#444" }}>{course.description}</Paragraph>
      </section>
      {/* VIDEO & DOC SECTION */}
      <section style={{ marginBottom: 32, display: "flex", flexWrap: "wrap", gap: 32 }}>
        {course.videoUrl && (
          <div style={{ flex: 1, minWidth: 320, maxWidth: 480 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Video bài học:</div>
            <div style={{ background: "#e8f0fe", borderRadius: 12, padding: 16, textAlign: "center" }}>
              {getYouTubeId(course.videoUrl) ? (
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 8, boxShadow: "0 2px 8px #2563eb22" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(course.videoUrl)}`}
                    title="YouTube video demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0, borderRadius: 8 }}
                  />
                </div>
              ) : (
                <a href={course.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontWeight: 600 }}>Xem video</a>
              )}
            </div>
          </div>
        )}
        {course.documentContent && (
          <div style={{ flex: 2, minWidth: 280 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Tài liệu học:</div>
            <div style={{ background: "#f4f8ff", borderRadius: 12, padding: 18, color: "#222", minHeight: 80 }}>{course.documentContent}</div>
          </div>
        )}
      </section>
      {/* CÂU HỎI VÀ ĐÁP ÁN */}
      <section style={{ marginTop: 32 }}>
        <Title level={3} style={{ color: "#2563eb", marginBottom: 20 }}>Câu hỏi & Đáp án</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {(showAllQuestions ? questions : questions.slice(0, 3)).map(q => {
            const showAll = showAllAnswers[q.questionId];
            const options = showAll ? q.courseQuestionOptions : q.courseQuestionOptions.slice(0, 3);
            return (
              <div key={q.questionId} style={{ border: "1.5px solid #e3e8f0", borderRadius: 14, background: "#fafdff", padding: 0, boxShadow: "0 2px 8px #2563eb11" }}>
                {/* USER QUESTION */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "20px 24px 12px 24px" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#2563eb", fontSize: 20 }}>
                    <span>U</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17, color: "#2563eb", marginBottom: 2 }}>{q.questionText} {q.isRequired && <Tag color="red">Bắt buộc</Tag>}</div>
                    <div style={{ color: "#888", fontSize: 13 }}>Người hỏi: <b>Người dùng</b></div>
                  </div>
                </div>
                {/* ADMIN ANSWERS */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 24px 20px 72px" }}>
                  {q.courseQuestionOptions.length === 0 ? (
                    <div style={{ color: "#aaa", fontStyle: "italic" }}>Chưa có trả lời từ admin.</div>
                  ) : (
                    <>
                      {options.map(opt => (
                        <div key={opt.optionId} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#0891b2", fontSize: 18, marginTop: 2 }}>
                            <span>A</span>
                          </div>
                          <div style={{ background: "#f4f8ff", borderRadius: 8, padding: "10px 16px", minWidth: 120, boxShadow: "0 1px 4px #2563eb08" }}>
                            <span style={{ fontWeight: 500 }}>{opt.optionText}</span>
                            {/* <Tag color="blue" style={{ marginLeft: 10 }}>Giá trị: {opt.optionValue}</Tag>
                            <Tag style={{ marginLeft: 4 }}>Mã: {opt.optionId}</Tag> */}
                          </div>
                        </div>
                      ))}
                      {q.courseQuestionOptions.length > 3 && (
                        <Button type="link" size="small" style={{ paddingLeft: 0 }} onClick={() => setShowAllAnswers(prev => ({ ...prev, [q.questionId]: !showAll }))}>
                          {showAll ? "Thu gọn đáp án" : `Xem thêm đáp án (${q.courseQuestionOptions.length - 3})`}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {questions.length > 3 && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button type="link" onClick={() => setShowAllQuestions(v => !v)}>
              {showAllQuestions ? "Thu gọn câu hỏi" : `Xem thêm câu hỏi (${questions.length - 3})`}
            </Button>
          </div>
        )}
      </section>
      <div style={{ textAlign: "right", marginTop: 40 }}>
        <Button type="primary" size="large" style={{ borderRadius: 8 }}>Đăng ký khóa học</Button>
      </div>
    </div>
  );
} 