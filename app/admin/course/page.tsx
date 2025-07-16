"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Typography, Space } from "antd";
import { authApi } from "@/api/auth";

const { Title } = Typography;

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

export default function CourseAdminPage() {
  // CATEGORY STATE
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catEdit, setCatEdit] = useState<CourseCategory | null>(null);
  const [catForm] = Form.useForm();
  const [catLoading, setCatLoading] = useState(false);

  // COURSE STATE
  const [courses, setCourses] = useState<Course[]>([]);
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [editCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [addCourseForm] = Form.useForm();
  const [editCourseForm] = Form.useForm();
  const [courseLoading, setCourseLoading] = useState(false);

  // LOAD DATA
  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      let data = await authApi.getCourseCategories();
      if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
      setCategories(data || []);
    } finally {
      setCatLoading(false);
    }
  };
  const fetchCourses = async () => {
    setCourseLoading(true);
    try {
      let data = await authApi.getCourses();
      if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
      setCourses(data || []);
    } finally {
      setCourseLoading(false);
    }
  };

  // CATEGORY HANDLERS
  const openCatModal = (cat?: CourseCategory) => {
    setCatEdit(cat || null);
    setCatModalOpen(true);
    if (cat) catForm.setFieldsValue(cat);
    else catForm.resetFields();
  };
  const handleCatOk = async () => {
    try {
      const values = await catForm.validateFields();
      if (catEdit) {
        await authApi.updateCourseCategory(catEdit.categoryId, values);
        message.success("Đã cập nhật thể loại!");
      } else {
        await authApi.createCourseCategory(values);
        message.success("Đã thêm thể loại!");
      }
      setCatModalOpen(false);
      fetchCategories();
    } catch { }
  };

  // COURSE HANDLERS
  const openAddCourseModal = () => {
    setAddCourseModalOpen(true);
    addCourseForm.resetFields();
  };
  const openEditCourseModal = (course: Course) => {
    setEditCourse(course);
    setEditCourseModalOpen(true);
    editCourseForm.setFieldsValue({
      ...course,
      categoryId: course.category?.categoryId,
    });
  };
  const handleAddCourseOk = async () => {
    try {
      const values = await addCourseForm.validateFields();
      const submitValues = { ...values, category: values.categoryId };
  
      await authApi.createCourse(submitValues);
      message.success("Đã thêm khóa học!");
      setAddCourseModalOpen(false);
      fetchCourses();
    } catch {}
  };
  const handleEditCourseOk = async () => {
    try {
      const values = await editCourseForm.validateFields();
      const submitValues = { ...values, categoryId: values.categoryId };
     
      if (editCourse) {
        await authApi.updateCourse(editCourse.courseId, submitValues);
        message.success("Đã cập nhật khóa học!");
      }
      setEditCourseModalOpen(false);
      fetchCourses();
    } catch {}
  };
  const handleDeleteCourse = async (id: number) => {
    await authApi.deleteCourse(id);
    message.success("Đã xóa khóa học!");
    fetchCourses();
  };

  // TABLES
  const catColumns = [
    { title: "ID", dataIndex: "categoryId", key: "categoryId", width: 60 },
    { title: "Tên thể loại", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Độ tuổi", dataIndex: "age", key: "age", width: 100 },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_: any, record: CourseCategory) => (
        <Button type="link" onClick={() => openCatModal(record)} style={{ padding: 0 }}>Sửa</Button>
      ),
    },
  ];

  const courseColumns = [
    { title: "ID", dataIndex: "courseId", key: "courseId", width: 60 },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Mô tả", dataIndex: "description", key: "description", ellipsis: true },
    { title: "Thời lượng", dataIndex: "duration", key: "duration", width: 100, render: (v: number) => v + " phút" },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", width: 140, render: (v: string) => new Date(v).toLocaleDateString("vi-VN") },
    { title: "Thể loại", dataIndex: "category", key: "category", width: 140, render: (v: any) => (<p>{v?.name}</p>) },
    { title: "Video", dataIndex: "videoUrl", key: "videoUrl", width: 120, render: (v: string) => v ? <a href={v} target="_blank" rel="noopener noreferrer">Xem video</a> : <span style={{ color: '#aaa' }}>-</span> },
    { title: "Tài liệu", dataIndex: "documentContent", key: "documentContent", width: 120, render: (v: string) => v ? v.slice(0, 30) + (v.length > 30 ? "..." : "") : <span style={{ color: '#aaa' }}>-</span> },
    { title: "Số câu hỏi", dataIndex: "courseQuestions", key: "courseQuestions", width: 100, render: (v: any[]) => v?.length ?? 0 },
    {
      title: "Hành động",
      key: "action",
      width: 160,
      render: (_: any, record: Course) => (
        <Space>
          <Button type="link" onClick={() => openEditCourseModal(record)} style={{ padding: 0 }}>Sửa</Button>
          <Popconfirm title="Xóa khóa học này?" onConfirm={() => handleDeleteCourse(record.courseId)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger style={{ padding: 0 }}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
      <Title level={2} style={{ marginBottom: 32, color: "#2563eb" }}>Quản lý khóa học</Title>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Thể loại khóa học</Title>
          <Button type="primary" onClick={() => openCatModal()} style={{ borderRadius: 8, fontWeight: 600 }}>Thêm thể loại</Button>
        </div>
        <Table
          columns={catColumns}
          dataSource={categories}
          rowKey="categoryId"
          loading={catLoading}
          bordered
          pagination={false}
          style={{ marginBottom: 32 }}
        />
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Danh sách khóa học</Title>
          <Button type="primary" onClick={openAddCourseModal} style={{ borderRadius: 8, fontWeight: 600 }}>Thêm khóa học</Button>
        </div>
        <Table
          columns={courseColumns}
          dataSource={courses}
          rowKey="courseId"
          loading={courseLoading}
          bordered
        />
      </div>
      {/* CATEGORY MODAL */}
      <Modal
        title={catEdit ? "Sửa thể loại" : "Thêm thể loại"}
        open={catModalOpen}
        onOk={handleCatOk}
        onCancel={() => setCatModalOpen(false)}
        okText={catEdit ? "Lưu" : "Thêm"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={catForm} layout="vertical" initialValues={{ name: "", description: "", age: "" }}>
          <Form.Item name="name" label="Tên thể loại" rules={[{ required: true, message: "Nhập tên thể loại" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="age" label="Độ tuổi" rules={[{ required: true, message: "Nhập độ tuổi" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* ADD COURSE MODAL */}
      <Modal
        title="Thêm khóa học"
        open={addCourseModalOpen}
        onOk={handleAddCourseOk}
        onCancel={() => setAddCourseModalOpen(false)}
        okText="Thêm"
        cancelText="Hủy"
        destroyOnClose
        width={700}
      >
        <Form form={addCourseForm} layout="vertical" initialValues={{ title: "", description: "", duration: 0, videoUrl: "", documentContent: "", categoryId: undefined }}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Nhập mô tả" }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: "Nhập thời lượng" }]}>
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item name="videoUrl" label="Video URL">
            <Input />
          </Form.Item>
          <Form.Item name="documentContent" label="Tài liệu">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="categoryId" label="Thể loại" rules={[{ required: true, message: "Chọn thể loại" }]}>
            <Select
              options={categories.map(cat => ({ label: cat.name, value: cat.categoryId }))}
              placeholder="Chọn thể loại"
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* EDIT COURSE MODAL */}
      <Modal
        title="Sửa khóa học"
        open={editCourseModalOpen}
        onOk={handleEditCourseOk}
        onCancel={() => setEditCourseModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
        width={700}
      >
        <Form form={editCourseForm} layout="vertical" initialValues={{ title: "", description: "", duration: 0, videoUrl: "", documentContent: "", categoryId: undefined }}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Nhập mô tả" }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: "Nhập thời lượng" }]}>
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item name="videoUrl" label="Video URL">
            <Input />
          </Form.Item>
          <Form.Item name="documentContent" label="Tài liệu">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="categoryId" label="Thể loại" rules={[{ required: true, message: "Chọn thể loại" }]}>
            <Select
              options={categories.map(cat => ({ label: cat.name, value: cat.categoryId }))}
              placeholder="Chọn thể loại"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 