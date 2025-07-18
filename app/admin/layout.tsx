"use client";
import { Layout, Menu } from "antd";
import Link from "next/link";
import UserNav from "@/components/UserNav";

const { Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
     
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: "white", fontWeight: "bold", fontSize: 22, padding: 16, textAlign: "center" }}>
          Admin Panel
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["users"]}>
          <Menu.Item key="users">
            <Link href="/admin/user">Quản lý người dùng</Link>
          </Menu.Item>
          <Menu.Item key="blog">
            <Link href="/admin/blog">Quản lý blog</Link>
          </Menu.Item>
          <Menu.Item key="course">
            <Link href="/admin/course">Quản lý khóa học</Link>
          </Menu.Item>
          <Menu.Item key="course-question">
            <Link href="/admin/course-question">Quản lý câu hỏi khóa học</Link>
          </Menu.Item>
          <Menu.Item key="risk-level">
            <Link href="/admin/risk-level">Quản lý risk level</Link>
          </Menu.Item>
          {/* Thêm các menu khác nếu cần */}
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
