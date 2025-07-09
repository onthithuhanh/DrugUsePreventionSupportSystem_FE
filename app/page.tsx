import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          textAlign: "center",
          padding: "2.5rem 2rem",
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          marginBottom: "1rem",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#1e40af",
            marginBottom: "0.8rem",
          }}
        >
          Hệ thống hỗ trợ phòng ngừa sử dụng ma túy
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#64748b",
            marginBottom: "1.5rem",
            maxWidth: "500px",
            margin: "0 auto 1.5rem",
          }}
        >
          Dịch vụ tư vấn, hỗ trợ và giáo dục chuyên nghiệp
        </p>
        <button
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Khám phá dịch vụ →
        </button>
      </section>
      {/* Services Grid - 2 rows layout */}
      <section
        style={{
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: "1rem",
          width: "100%",
        }}
      >
        {/* Row 1 */}
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#dbeafe",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "28px",
            }}
          >
            📅
          </div>
          <h3
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              color: "#1f2937",
            }}
          >
            Lịch hẹn
          </h3>
          <p
            style={{
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
              color: "#6b7280",
              lineHeight: "1.5",
            }}
          >
            Đặt lịch hẹn với chuyên gia tư vấn dễ dàng và nhanh chóng
          </p>
          <button
            style={{
              width: "100%",
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: "#2563eb",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Đặt lịch ngay →
          </button>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#dbeafe",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "28px",
            }}
          >
            ♡
          </div>
          <h3
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              color: "#1f2937",
            }}
          >
            Tư vấn
          </h3>
          <p
            style={{
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
              color: "#6b7280",
              lineHeight: "1.5",
            }}
          >
            Nhận tư vấn chuyên nghiệp từ đội ngũ chuyên gia kinh nghiệm
          </p>
          <button
            style={{
              width: "100%",
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: "#10b981",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Tư vấn ngay →
          </button>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#dbeafe",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "28px",
            }}
          >
            📖
          </div>
          <h3
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              color: "#1f2937",
            }}
          >
            Khóa học
          </h3>
          <p
            style={{
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
              color: "#6b7280",
              lineHeight: "1.5",
            }}
          >
            Tham gia các khóa học giáo dục và nâng cao nhận thức
          </p>
          <button
            style={{
              width: "100%",
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: "#7c3aed",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Xem khóa học →
          </button>
        </div>

        {/* Row 2 */}
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#dbeafe",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "28px",
            }}
          >
            📋
          </div>
          <h3
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              color: "#1f2937",
            }}
          >
            Tài liệu
          </h3>
          <p
            style={{
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
              color: "#6b7280",
              lineHeight: "1.5",
            }}
          >
            Truy cập thư viện tài liệu phong phú và cập nhật
          </p>
          <button
            style={{
              width: "100%",
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: "#ea580c",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Xem tài liệu →
          </button>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#dbeafe",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "28px",
            }}
          >
            🤝
          </div>
          <h3
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              color: "#1f2937",
            }}
          >
            Cộng đồng
          </h3>
          <p
            style={{
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
              color: "#6b7280",
              lineHeight: "1.5",
            }}
          >
            Kết nối và chia sẻ kinh nghiệm với cộng đồng hỗ trợ
          </p>
          <button
            style={{
              width: "100%",
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: "#ec4899",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Tham gia →
          </button>
        </div>

        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#dbeafe",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "28px",
            }}
          >
            💬
          </div>
          <h3
            style={{
              fontSize: "1.2rem",
              marginBottom: "1rem",
              color: "#1f2937",
            }}
          >
            Hỗ trợ 24/7
          </h3>
          <p
            style={{
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
              color: "#6b7280",
              lineHeight: "1.5",
            }}
          >
            Đường dây nóng hỗ trợ 24/7
          </p>
          <button
            style={{
              width: "100%",
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: "#dc2626",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Liên hệ ngay →
          </button>
        </div>
      </section>
    </main>
  );
}
