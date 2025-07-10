"use client";
import React, { useEffect, useCallback, useState } from "react";
import { coursesApi } from "@/api/courses";
import Link from "next/link";

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);

  const fetchCourses = useCallback(async () => {
    try {
      // Gọi API để lấy danh sách khóa học
      const data = await coursesApi.getAllCourses();
      setCourses(data);
      console.log("Courses fetched successfully:", data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
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

      {/* Stats Section */}
      <div className="container my-5">
        <div className="row g-4 mb-5">
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

        {/* Course List Section */}
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0">
                <i className="fas fa-list-ul me-2 text-primary"></i>
                Danh sách khóa học
              </h2>
              <span className="badge bg-primary fs-6 px-3 py-2">
                {courses.length} khóa học
              </span>
            </div>

            {/* Course Cards */}
            {courses.length > 0 ? (
              <div className="row g-4">
                {courses.map((course: any, index: number) => (
                  <div key={course.courseId} className="col-lg-6 col-xl-4">
                    <div className="card h-100 shadow-sm border-0">
                      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">
                          <i className="fas fa-graduation-cap me-2"></i>
                          Khóa học {index + 1}
                        </h5>
                        <span className="badge bg-light text-primary">
                          {index % 3 === 0 ? 'Cơ bản' : index % 3 === 1 ? 'Nâng cao' : 'Chuyên sâu'}
                        </span>
                      </div>
                      <div className="card-body">
                        <h6 className="card-subtitle mb-3 text-muted">
                          <i className="fas fa-tag me-1"></i>
                          Phòng ngừa ma túy
                        </h6>
                        <h5 className="card-title text-primary mb-3">
                          {course.title}
                        </h5>
                        <p className="card-text text-muted mb-4">
                          {course.description || 'Khóa học này cung cấp kiến thức và kỹ năng cần thiết để phòng ngừa sử dụng ma túy trong cộng đồng.'}
                        </p>
                        <div className="d-flex flex-wrap gap-2 mb-4">
                          <span className="badge bg-primary-subtle text-primary">
                            <i className="fas fa-check me-1"></i>
                            Miễn phí
                          </span>
                          <span className="badge bg-success-subtle text-success">
                            <i className="fas fa-certificate me-1"></i>
                            Chứng chỉ
                          </span>
                          <span className="badge bg-warning-subtle text-warning">
                            <i className="fas fa-comments me-1"></i>
                            Tương tác
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <i className="fas fa-clock me-1"></i>
                            Thời lượng: 2-3 tuần
                          </small>
                          <small className="text-muted">
                            <i className="fas fa-signal me-1"></i>
                            {index % 3 === 0 ? 'Dễ' : index % 3 === 1 ? 'Trung bình' : 'Khó'}
                          </small>
                        </div>
                      </div>
                      <div className="card-footer bg-transparent border-top-0">
                        <Link
                          href={`/courses/read/${course.courseId}`}
                          className="btn btn-primary w-100"
                        >
                          <i className="fas fa-play me-2"></i>
                          Bắt đầu học ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-body py-5">
                    <i className="fas fa-book-open display-1 text-muted mb-4"></i>
                    <h3 className="text-muted mb-3">Chưa có khóa học nào</h3>
                    <p className="text-muted mb-4">
                      Các khóa học đang được cập nhật. Vui lòng quay lại sau!
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => window.location.reload()}
                    >
                      <i className="fas fa-sync-alt me-2"></i>
                      Tải lại trang
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
