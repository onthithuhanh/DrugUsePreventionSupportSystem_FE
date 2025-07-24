"use client";
import { Layout, Menu } from "antd";
import Link from "next/link";
import UserNav from "@/components/UserNav";

const { Sider, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
     
      <Sider breakpoint="xl" collapsedWidth="0" width={230} style={{ backgroundColor: "#001529" }}>
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
          <Menu.Item key="age-group">
            <Link href="/admin/ageGroup">Quản lý nhóm tuổi</Link>
          </Menu.Item>
          <Menu.Item key="AssessmentType">
            <Link href="/admin/AssessmentType">Quản lý loại đánh giá</Link>
          </Menu.Item>
          <Menu.Item key="Assessment">
            <Link href="/admin/Assessment">Quản lý đánh giá</Link>
          </Menu.Item>
          <Menu.Item key="AssessmentQuestion">
            <Link href="/admin/AssessmentQuestion">Quản lý câu hỏi đánh giá</Link>
          </Menu.Item>
          <Menu.Item key="AssessmentOption">
            <Link href="/admin/AssessmentOption">Quản lý lựa chọn đánh giá</Link>
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
