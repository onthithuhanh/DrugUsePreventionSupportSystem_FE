"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, Dropdown, Menu } from "antd";

export default function UserNav() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(userStr); // fallback nếu là token string
        }
      } else {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/auth";
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link href="/profile">Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} danger>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return user ? (
    <Dropdown overlay={menu} placement="bottomRight">
      <Avatar style={{ backgroundColor: "#fff", marginLeft: 16, cursor: "pointer", color: "#000" }}>
        {user?.fullName?.[0] || "U"}
      </Avatar>
    </Dropdown>
  ) : (
    <Link href="/auth">Đăng nhập</Link>
  );
} 