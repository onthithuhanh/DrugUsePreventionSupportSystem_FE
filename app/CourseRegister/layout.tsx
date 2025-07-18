
import Link from "next/link";
import UserNav from "@/components/UserNav";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#fafbfc",
            marginBottom: "0.8rem",
          }}
        >
          🛡️ Hệ thống hỗ trợ <br /> Phòng ngừa sử dụng ma túy
        </h1>
        <nav>
          <Link href="/">Trang chủ</Link>
          <Link href="/appointments">Lịch hẹn</Link>
          <Link href="/">Tư vấn</Link>
          <Link href="/courses">Khóa học</Link>
          <Link href="/">Tài liệu</Link>
          <Link href="/">Cộng đồng</Link>
          <UserNav />
        </nav>
      </header>
      <div>
        {children}
      </div>
      <footer>
        <p>&copy; 2025 Drug-Free Path. All rights reserved.</p>
      </footer>
    </div>
  );
}
