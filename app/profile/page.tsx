"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Descriptions, Skeleton, message } from "antd";
import { authApi } from "@/api/auth";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        message.error("Không thể tải thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 16 }}>
      <Card title="Thông tin cá nhân" bordered>
        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : profile ? (
          <Descriptions column={1}>
            <Descriptions.Item label="Họ tên">{profile.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{profile.address}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{profile.dateOfBirth}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo tài khoản">{profile.createdDate && new Date(profile.createdDate).toLocaleString("vi-VN")}</Descriptions.Item>
          </Descriptions>
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </Card>
    </div>
  );
} 