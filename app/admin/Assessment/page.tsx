"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Form, Input, Modal, Select, DatePicker, Switch } from "antd";
import { authApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";

interface Assessment {
  assessmentId: number;
  title: string;
  description: string;
  assessmentType: string;
  ageGroup: string;
  createdDate: string;
  isActive: boolean;
}

export default function AssessmentAdminPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Assessment | null>(null);
  const [form] = Form.useForm();
  const [assessmentTypes, setAssessmentTypes] = useState<any[]>([]);
  const [ageGroups, setAgeGroups] = useState<any[]>([]);

  useEffect(() => {
    reload();
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [ats, ags] = await Promise.all([
        authApi.getAllAssessmentTypes(),
        authApi.getAllAgeGroups(),
      ]);
      setAssessmentTypes(Array.isArray(ats) ? ats : []);
      setAgeGroups(Array.isArray(ags) ? ags : []);
    } catch {}
  };

  const reload = async () => {
    setLoading(true);
    try {
      const data = await authApi.getAllAssessments();
      setAssessments(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await authApi.deleteAssessment(id);
      toast({ title: "Thành công", description: "Đã xóa bài đánh giá!" });
      reload();
    } catch (err: any) {
      toast({ title: "Lỗi", description: err?.response?.data?.message || "Lỗi khi xóa bài đánh giá", variant: "destructive" });
    }
  };

  const handleEdit = (record: Assessment) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      createdDate: dayjs(record.createdDate),
      isActive: record.isActive,
      assessmentType: assessmentTypes.find((a) => a.name === record.assessmentType)?.assessmentTypeId,
      ageGroup: ageGroups.find((a) => a.name === record.ageGroup)?.groupId,
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
      const payload = {
        ...values,
        createdDate: values.createdDate ? values.createdDate.toISOString() : new Date().toISOString(),
        isActive: !!values.isActive,
      };
      if (editing) {
        await authApi.updateAssessment(editing.assessmentId, payload);
        toast({ title: "Thành công", description: "Đã cập nhật bài đánh giá!" });
      } else {
        await authApi.createAssessment(payload);
        toast({ title: "Thành công", description: "Đã thêm bài đánh giá!" });
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
    { title: "ID", dataIndex: "assessmentId", key: "assessmentId" },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Loại đánh giá", dataIndex: "assessmentType", key: "assessmentType" },
    { title: "Nhóm tuổi", dataIndex: "ageGroup", key: "ageGroup" },
    { title: "Ngày tạo", dataIndex: "createdDate", key: "createdDate", render: (v: string) => dayjs(v).format("YYYY-MM-DD HH:mm") },
    { title: "Kích hoạt", dataIndex: "isActive", key: "isActive", render: (v: boolean) => v ? "Có" : "Không" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Assessment) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record.assessmentId)} okText="Xóa" cancelText="Hủy">
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Quản lý bài đánh giá</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm bài đánh giá</Button>
      <Table rowKey="assessmentId" columns={columns} dataSource={assessments} loading={loading} bordered />
      <Modal
        title={editing ? "Sửa bài đánh giá" : "Thêm bài đánh giá"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText={editing ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="assessmentType" label="Loại đánh giá" rules={[{ required: true, message: "Chọn loại đánh giá" }]}>
            <Select options={assessmentTypes.map(a => ({ label: a.name, value: a.assessmentTypeId }))} placeholder="Chọn loại đánh giá" />
          </Form.Item>
          <Form.Item name="ageGroup" label="Nhóm tuổi" rules={[{ required: true, message: "Chọn nhóm tuổi" }]}>
            <Select options={ageGroups.map(a => ({ label: a.name, value: a.groupId }))} placeholder="Chọn nhóm tuổi" />
          </Form.Item>
          <Form.Item name="createdDate" label="Ngày tạo" rules={[{ required: true, message: "Chọn ngày tạo" }]}>
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 