"use client";
import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, Modal, Form, InputNumber, Input, message, Button } from "antd";
import { authApi } from "@/api/auth";

const { Title } = Typography;

interface CourseQuestion {
  questionId: number;
  courseId: number;
  questionText: string;
  displayOrder: number;
  isRequired: boolean;
  courseQuestionOptions: any[];
}

export default function CourseQuestionPage() {
  const [questions, setQuestions] = useState<CourseQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<any>(null);
  const [optionForm] = Form.useForm();
  const [optionLoading, setOptionLoading] = useState(false);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [answeringQuestion, setAnsweringQuestion] = useState<any>(null);
  const [answerForm] = Form.useForm();
  const [answerLoading, setAnswerLoading] = useState(false);
console.log(answerForm);
console.log(123,optionForm);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        let data = await authApi.getCourseQuestions();
        if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
        setQuestions(data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

 
  const handleOptionOk = async () => {
    try {
      setOptionLoading(true);
      const values = await optionForm.validateFields();
      await authApi.updateCourseOption(editingOption.optionId, values);
      message.success("Đã cập nhật câu trả lời!");
      setOptionModalOpen(false);
      setEditingOption(null);
      // reload questions
      let data = await authApi.getCourseQuestions();
      if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
      setQuestions(data || []);
    } catch {
      message.error("Lỗi khi cập nhật câu trả lời");
    } finally {
      setOptionLoading(false);
    }
  };

  const handleAnswerQuestion = (question: any) => {
    setAnsweringQuestion(question);
    setAnswerModalOpen(true);
    answerForm.resetFields(); // Form luôn trống, không lấy giá trị cũ
  };
  const handleAnswerSave = async () => {
    try {
      setAnswerLoading(true);
      const values = await answerForm.validateFields();
      console.log('Giá trị submit:', values);
      // Gọi API POST để trả lời mới cho câu hỏi (POST /CourseOption với dữ liệu form và courseId)
      await authApi.createCourseOption(answeringQuestion.questionId, values);
      message.success("Đã gửi câu trả lời!");
      setAnswerModalOpen(false);
      setAnsweringQuestion(null);
      let data = await authApi.getCourseQuestions();
      if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
      setQuestions(data || []);
    } catch {
      message.error("Lỗi khi gửi câu trả lời");
    } finally {
      setAnswerLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "questionId", key: "questionId", width: 60 },
    { title: "ID Khóa học", dataIndex: "courseId", key: "courseId", width: 100 },
    { title: "Câu hỏi", dataIndex: "questionText", key: "questionText" },
    { title: "Thứ tự", dataIndex: "displayOrder", key: "displayOrder", width: 80 },
    { title: "Bắt buộc", dataIndex: "isRequired", key: "isRequired", width: 100, render: (v: boolean) => v ? <Tag color="red">Bắt buộc</Tag> : <Tag color="green">Tùy chọn</Tag> },
    {
      title: "Trả lời",
      key: "answer",
      width: 120,
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleAnswerQuestion(record)} style={{ padding: 0 }}>Trả lời</Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>
      <Title level={2} style={{ marginBottom: 32, color: "#2563eb" }}>Danh sách câu hỏi các khóa học</Title>
      <Table
        columns={columns}
        dataSource={questions}
        rowKey="questionId"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record: any) => (
            <div style={{ padding: 8 }}>
              <b>Đáp án/Câu trả lời:</b>
              <Table
                columns={[
                  { title: "ID", dataIndex: "optionId", key: "optionId", width: 60 },
                  { title: "Nội dung", dataIndex: "optionText", key: "optionText" },
                  { title: "Giá trị", dataIndex: "optionValue", key: "optionValue", width: 80 },
                  { title: "Thứ tự", dataIndex: "displayOrder", key: "displayOrder", width: 80 },
                ]}
                dataSource={record.courseQuestionOptions}
                rowKey="optionId"
                pagination={false}
                size="small"
                style={{ marginTop: 8 }}
              />
            </div>
          ),
        }}
      />
      <Modal
        title="Sửa câu trả lời"
        open={optionModalOpen}
        onOk={handleOptionOk}
        onCancel={() => setOptionModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={optionLoading}
        destroyOnClose
      >
        <Form form={optionForm} layout="vertical">
          <Form.Item name="optionText" label="Nội dung" rules={[{ required: true, message: "Nhập nội dung" }]}> <Input /> </Form.Item>
          <Form.Item name="optionValue" label="Giá trị" rules={[{ required: true, message: "Nhập giá trị" }]}> <InputNumber style={{ width: "100%" }} /> </Form.Item>
          <Form.Item name="displayOrder" label="Thứ tự" rules={[{ required: true, message: "Nhập thứ tự" }]}> <InputNumber style={{ width: "100%" }} /> </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`Trả lời cho câu hỏi: ${answeringQuestion?.questionText || ''}`}
        open={answerModalOpen}
        onOk={handleAnswerSave}
        onCancel={() => {
          setAnswerModalOpen(false);
          setAnsweringQuestion(null);
          answerForm.resetFields();
        }}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={answerLoading}
        destroyOnClose
      >
        <Form form={answerForm} layout="vertical">
          <Form.Item name="optionText" label="Nội dung" rules={[{ required: true, message: "Nhập nội dung" }]}>
            <Input placeholder="Nội dung" />
          </Form.Item>
          <Form.Item name="optionValue" label="Giá trị" rules={[{ required: true, message: "Nhập giá trị" }]}>
            <InputNumber style={{ width: "100%" }} placeholder="Giá trị" />
          </Form.Item>
          <Form.Item name="displayOrder" label="Thứ tự" rules={[{ required: true, message: "Nhập thứ tự" }]}>
            <InputNumber style={{ width: "100%" }} placeholder="Thứ tự" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
