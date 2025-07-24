"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Form, Input, Modal } from "antd";
import { authApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

interface AssessmentType {
  assessmentTypeId: number;
  name: string;
  description: string;
}

export default function AssessmentTypeAdminPage() {
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<AssessmentType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await authApi.getAllAssessmentTypes();
      setAssessmentTypes(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await authApi.deleteAssessmentType(id);
      toast({ title: "Thành công", description: "Đã xóa loại đánh giá!" });
      reload();
    } catch (err: any) {
      toast({ title: "Lỗi", description: err?.response?.data?.message || "Lỗi khi xóa loại đánh giá", variant: "destructive" });
    }
  };

  const handleEdit = (record: AssessmentType) => {
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
        await authApi.updateAssessmentType(editing.assessmentTypeId, values);
        toast({ title: "Thành công", description: "Đã cập nhật loại đánh giá!" });
      } else {
        await authApi.createAssessmentType(values);
        toast({ title: "Thành công", description: "Đã thêm loại đánh giá!" });
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
    { title: "ID", dataIndex: "assessmentTypeId", key: "assessmentTypeId" },
    { title: "Tên loại đánh giá", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: AssessmentType) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record.assessmentTypeId)} okText="Xóa" cancelText="Hủy">
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Quản lý loại đánh giá</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm loại đánh giá</Button>
      <Table rowKey="assessmentTypeId" columns={columns} dataSource={assessmentTypes} loading={loading} bordered />
      <Modal
        title={editing ? "Sửa loại đánh giá" : "Thêm loại đánh giá"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText={editing ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên loại đánh giá" rules={[{ required: true, message: "Vui lòng nhập tên loại đánh giá" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 