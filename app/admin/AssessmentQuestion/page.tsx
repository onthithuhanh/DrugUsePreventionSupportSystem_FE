"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Form, Input, Modal, Select } from "antd";
import { authApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

interface AssessmentQuestion {
  questionId: number;
  questionText: string;
  questionType: string;
  assessmentTitle: string;
}

export default function AssessmentQuestionAdminPage() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<AssessmentQuestion | null>(null);
  const [form] = Form.useForm();
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    reload();
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const data = await authApi.getAllAssessments();
      setAssessments(Array.isArray(data) ? data : []);
    } catch {}
  };

  const reload = async () => {
    setLoading(true);
    try {
      const data = await authApi.getAllAssessmentQuestions();
      setQuestions(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await authApi.deleteAssessmentQuestion(id);
      toast({ title: "Thành công", description: "Đã xóa câu hỏi!" });
      reload();
    } catch (err: any) {
      toast({ title: "Lỗi", description: err?.response?.data?.message || "Lỗi khi xóa câu hỏi", variant: "destructive" });
    }
  };

  const handleEdit = (record: AssessmentQuestion) => {
    setEditing(record);
    // Tìm assessmentId từ assessmentTitle
    const assessment = assessments.find(a => a.title === record.assessmentTitle);
    form.setFieldsValue({
      ...record,
      assessmentId: assessment ? assessment.assessmentId : undefined,
    });
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await authApi.updateAssessmentQuestion(editing.questionId, values);
        toast({ title: "Thành công", description: "Đã cập nhật câu hỏi!" });
      } else {
        await authApi.createAssessmentQuestion(values);
        toast({ title: "Thành công", description: "Đã thêm câu hỏi!" });
      }
      setModalVisible(false);
      reload();
    } catch (err: any) {
      // validation error
      console.log(err);
      toast({ title: "Lỗi", description: err?.response?.data?.message || "Cập nhật thất bại", variant: "destructive" });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "questionId", key: "questionId" },
    { title: "Câu hỏi", dataIndex: "questionText", key: "questionText" },
    { title: "Loại câu hỏi", dataIndex: "questionType", key: "questionType" },
    { title: "Bài đánh giá", dataIndex: "assessmentTitle", key: "assessmentTitle" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: AssessmentQuestion) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record.questionId)} okText="Xóa" cancelText="Hủy">
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Quản lý câu hỏi đánh giá</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm câu hỏi</Button>
      <Table rowKey="questionId" columns={columns} dataSource={questions} loading={loading} bordered />
      <Modal
        title={editing ? "Sửa câu hỏi" : "Thêm câu hỏi"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText={editing ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="assessmentId" label="Bài đánh giá" rules={[{ required: true, message: "Chọn bài đánh giá" }]}>
            <Select options={assessments.map(a => ({ label: a.title, value: a.assessmentId }))} placeholder="Chọn bài đánh giá" />
          </Form.Item>
          <Form.Item name="questionText" label="Câu hỏi" rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="questionType" label="Loại câu hỏi" rules={[{ required: true, message: "Chọn loại câu hỏi" }]}>
            <Select options={[{ label: "Single choice", value: "single choice" }, { label: "Multiple choice", value: "multiple choice" }]} placeholder="Chọn loại câu hỏi" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 