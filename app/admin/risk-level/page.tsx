"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Typography } from "antd";
import { authApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

const { Title } = Typography;

interface RiskLevel {
    riskId?: number;
  riskLevel1: string;
  riskDescription: string;
}

export default function RiskLevelAdminPage() {
  const [data, setData] = useState<RiskLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RiskLevel | null>(null);
  const [form] = Form.useForm();
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await authApi.getAllRiskLevels();
      setData(Array.isArray(res) ? res : res.items || []);
    } catch {
      toast({ title: "Lỗi", description: "Lỗi tải dữ liệu", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: RiskLevel) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id?: number) => {
    console.log(123,id);
    
    if (!id) return;
    try {
      await authApi.deleteRiskLevel(id);
      toast({ title: "Thành công", description: "Đã xóa thành công" });
      fetchData();
    } catch {
      toast({ title: "Lỗi", description: "Xóa thất bại", variant: "destructive" });
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing && editing.riskId) {
        await authApi.updateRiskLevel(editing.riskId, values);
        toast({ title: "Thành công", description: "Cập nhật thành công" });
      } else {
        await authApi.createRiskLevel(values);
        toast({ title: "Thành công", description: "Thêm mới thành công" });
      }
      setModalOpen(false);
      setEditing(null); // <-- thêm dòng này
      fetchData();
    } catch {
      // validation error
    }
  };

  const columns = [
    { title: "Tên mức độ rủi ro", dataIndex: "riskLevel1", key: "riskLevel1" },
    { title: "Mô tả", dataIndex: "riskDescription", key: "riskDescription" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: RiskLevel) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.riskId)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>
      <Title level={2} style={{ marginBottom: 24 }}>Quản lý mức độ rủi ro</Title>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>Thêm mức độ rủi ro</Button>
      <Table rowKey="riskLevelId" columns={columns} dataSource={data} loading={loading} pagination={false} />
      <Modal
        open={modalOpen}
        title={editing ? "Cập nhật mức độ rủi ro" : "Thêm mức độ rủi ro"}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null); // <-- thêm dòng này
        }}
        onOk={handleOk}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="riskLevel1" label="Tên mức độ rủi ro" rules={[{ required: true, message: "Nhập tên mức độ rủi ro" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="riskDescription" label="Mô tả" rules={[{ required: true, message: "Nhập mô tả" }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 