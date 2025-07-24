"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Descriptions, Skeleton, Button, Form, Input, DatePicker } from "antd";
import { authApi } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!userStr) {
      router.replace("/auth");
      return;
    }
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await authApi.getMyProfile();
        setProfile(data);
      } catch (err) {
        toast({ title: "Lỗi", description: "Không thể tải thông tin cá nhân", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleEdit = () => {
    setEditing(true);

    form.resetFields();
    console.log(profile.fullName);
    form.setFieldsValue({
      fullName: profile.fullName || '',
      address: profile.address || '',
      dateOfBirth: (!profile.dateOfBirth || profile.dateOfBirth === '1901-01-01') ? null : dayjs(profile.dateOfBirth),
      email: profile.email || '',
    });

  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // Lấy giá trị dateOfBirth mới nhất từ form (tránh trường hợp values cũ)
      const dateOfBirthValue = form.getFieldValue('dateOfBirth');
      const dateOfBirth = dateOfBirthValue ? dayjs(dateOfBirthValue).format("YYYY-MM-DD") : "";
      await authApi.updateProfile({
        email: profile.email,
        fullName: values.fullName,
        address: values.address,
        dateOfBirth,
      });
      toast({ title: "Thành công", description: "Cập nhật thông tin thành công!" });
      setEditing(false);
      // reload profile
      const data = await authApi.getMyProfile();
      setProfile(data);
    } catch (err: any) {
      toast({ title: "Lỗi", description: err?.response?.data?.error || "Cập nhật thất bại", variant: "destructive" });
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 16 }}>
      <Card title="Thông tin cá nhân" bordered>
        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : profile ? (
          editing ? (
            <Form form={form} layout="vertical">
              <Form.Item label="Email" name="email">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Họ tên" name="fullName" rules={[{ required: true, message: "Nhập họ tên" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Nhập địa chỉ" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true, message: "Chọn ngày sinh" }]}>
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
              <div style={{ textAlign: "right" }}>
                <Button onClick={handleCancel} style={{ marginRight: 8 }}>Hủy</Button>
                <Button type="primary" onClick={handleSave}>Lưu</Button>
              </div>
            </Form>
          ) : (
            <>
              <Descriptions column={1}>
                <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
                <Descriptions.Item label="Họ tên">{profile.fullName}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{profile.address}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{profile.dateOfBirth}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo tài khoản">{profile.createdDate && new Date(profile.createdDate).toLocaleString("vi-VN")}</Descriptions.Item>
              </Descriptions>
              <div style={{ textAlign: "right", marginTop: 16 }}>
                <Button type="primary" onClick={handleEdit}>Sửa</Button>
              </div>
            </>
          )
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </Card>
    </div>
  );
} 