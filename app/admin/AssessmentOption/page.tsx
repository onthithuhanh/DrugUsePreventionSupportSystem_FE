"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Form, Input, Modal, Select, InputNumber } from "antd";
import { authApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

interface AssessmentOption {
  optionId: number;
  questionId: number;
  questionText: string;
  optionText: string;
  optionValue: number;
}

export default function AssessmentOptionAdminPage() {
  const [options, setOptions] = useState<AssessmentOption[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<AssessmentOption | null>(null);
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    reload();
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await authApi.getAllAssessmentQuestions();
      setQuestions(Array.isArray(data) ? data : []);
    } catch {}
  };

  const reload = async () => {
    setLoading(true);
    try {
      const data = await authApi.getAllAssessmentOptions();
      setOptions(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await authApi.deleteAssessmentOption(id);
      toast({ title: "Thành công", description: "Đã xóa lựa chọn!" });
      reload();
    } catch (err: any) {
      toast({ title: "Lỗi", description: err?.response?.data?.message || "Lỗi khi xóa lựa chọn", variant: "destructive" });
    }
  };

  const handleEdit = (record: AssessmentOption) => {
    setEditing(record);
    form.setFieldsValue(record);
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
        await authApi.updateAssessmentOption(editing.optionId, values);
        toast({ title: "Thành công", description: "Đã cập nhật lựa chọn!" });
      } else {
        await authApi.createAssessmentOption(values);
        toast({ title: "Thành công", description: "Đã thêm lựa chọn!" });
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
    { title: "ID", dataIndex: "optionId", key: "optionId" },
    { title: "Câu hỏi", dataIndex: "questionText", key: "questionText" },
    { title: "Lựa chọn", dataIndex: "optionText", key: "optionText" },
    { title: "Giá trị", dataIndex: "optionValue", key: "optionValue" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: AssessmentOption) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record.optionId)} okText="Xóa" cancelText="Hủy">
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Quản lý lựa chọn đánh giá</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm lựa chọn</Button>
      <Table rowKey="optionId" columns={columns} dataSource={options} loading={loading} bordered />
      <Modal
        title={editing ? "Sửa lựa chọn" : "Thêm lựa chọn"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText={editing ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="questionId" label="Câu hỏi" rules={[{ required: true, message: "Chọn câu hỏi" }]}>
            <Select 
              options={questions.map(q => ({ label: q.questionText, value: q.questionId }))} 
              placeholder="Chọn câu hỏi" 
            />
          </Form.Item>
          <Form.Item name="optionText" label="Nội dung lựa chọn" rules={[{ required: true, message: "Vui lòng nhập nội dung lựa chọn" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="optionValue" label="Giá trị" rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
