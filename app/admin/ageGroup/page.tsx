"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Form, Input, Modal, InputNumber } from "antd";
import { authApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

interface AgeGroup {
  groupId: number;
  name: string;
  description: string;
  minAge: number;
  maxAge: number;
}

export default function AgeGroupAdminPage() {
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<AgeGroup | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await authApi.getAllAgeGroups();
      setAgeGroups(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await authApi.deleteAgeGroup(id);
      toast({ title: "Thành công", description: "Đã xóa nhóm tuổi!" });
      reload();
    } catch {
      toast({ title: "Lỗi", description: "Lỗi khi xóa nhóm tuổi", variant: "destructive" });
    }
  };

  const handleEdit = (record: AgeGroup) => {
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
        await authApi.updateAgeGroup(editing.groupId, values);
        toast({ title: "Thành công", description: "Đã cập nhật nhóm tuổi!" });
      } else {
        await authApi.createAgeGroup(values);
        toast({ title: "Thành công", description: "Đã thêm nhóm tuổi!" });
      }
      setModalVisible(false);
      reload();
    } catch (err:any) {
      // validation error
      console.log(err);
      toast({ title: "Lỗi", description: err?.response?.data?.message || "Cập nhật thất bại", variant: "destructive" });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "groupId", key: "groupId" },
    { title: "Tên nhóm", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Tuổi tối thiểu", dataIndex: "minAge", key: "minAge" },
    { title: "Tuổi tối đa", dataIndex: "maxAge", key: "maxAge" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: AgeGroup) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record.groupId)} okText="Xóa" cancelText="Hủy">
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Quản lý nhóm tuổi</h2>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm nhóm tuổi</Button>
      <Table rowKey="groupId" columns={columns} dataSource={ageGroups} loading={loading} bordered />
      <Modal
        title={editing ? "Sửa nhóm tuổi" : "Thêm nhóm tuổi"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText={editing ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên nhóm" rules={[{ required: true, message: "Vui lòng nhập tên nhóm" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="minAge" label="Tuổi tối thiểu" rules={[{ required: true, message: "Vui lòng nhập tuổi tối thiểu" }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="maxAge" label="Tuổi tối đa" rules={[{ required: true, message: "Vui lòng nhập tuổi tối đa" }]}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
} 