import UserNav from "@/components/UserNav";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main> 
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
      {/* Hero Section */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <p className="lead mb-4 fs-5">
                Chúng tôi cung cấp dịch vụ tư vấn tâm lý, giáo dục nhận thức và hỗ trợ phục hồi toàn diện.
                Đồng hành cùng bạn và gia đình trong hành trình xây dựng cuộc sống tích cực,
                khỏe mạnh và tránh xa tệ nạn xã hội.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button className="btn btn-light btn-lg px-4 py-2 fw-semibold">
                  🚀 Bắt đầu hành trình
                </button>
                <button className="btn btn-outline-light btn-lg px-4 py-2 fw-semibold">
                  📞 Liên hệ tư vấn
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - 6 cards in 2 rows */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            {/* Row 1 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="bg-primary bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3">
                    <span className="fs-1 p-3">📅</span>
                  </div>
                  <h5 className="card-title text-dark mb-3">Lịch hẹn</h5>
                  <p className="card-text text-muted mb-4">
                    Đặt lịch hẹn với chuyên gia tư vấn dễ dàng và nhanh chóng
                  </p>
                  <button className="btn btn-outline-primary w-100 fw-semibold">
                    Đặt lịch ngay →
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="bg-success bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3">
                    <span className="fs-1 p-3">💝</span>
                  </div>
                  <h5 className="card-title text-dark mb-3">Tư vấn</h5>
                  <p className="card-text text-muted mb-4">
                    Nhận tư vấn chuyên nghiệp từ đội ngũ chuyên gia kinh nghiệm
                  </p>
                  <button className="btn btn-outline-success w-100 fw-semibold">
                    Tư vấn ngay →
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="bg-warning bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3">
                    <span className="fs-1 p-3">📚</span>
                  </div>
                  <h5 className="card-title text-dark mb-3">Khóa học</h5>
                  <p className="card-text text-muted mb-4">
                    Tham gia các khóa học giáo dục và nâng cao nhận thức
                  </p>
                 <Link href={"/course"}>
                    <button className="btn btn-outline-warning w-100 fw-semibold">
                      Xem khóa học →
                    </button>
                 </Link>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="bg-info bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3">
                    <span className="fs-1 p-3">📄</span>
                  </div>
                  <h5 className="card-title text-dark mb-3">Tài liệu</h5>
                  <p className="card-text text-muted mb-4">
                    Truy cập thư viện tài liệu phong phú
                  </p>
                  <button className="btn btn-outline-info w-100 fw-semibold">
                    Xem tài liệu →
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="bg-secondary bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3">
                    <span className="fs-1 p-3">🤝</span>
                  </div>
                  <h5 className="card-title text-dark mb-3">Cộng đồng</h5>
                  <p className="card-text text-muted mb-4">
                    Kết nối và chia sẻ kinh nghiệm
                  </p>
                  <Link href='/blog'>
                    <button className="btn btn-outline-secondary w-100 fw-semibold">
                      Tham gia →
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body p-4">
                  <div className="bg-danger bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3">
                    <span className="fs-1 p-3">💬</span>
                  </div>
                  <h5 className="card-title text-dark mb-3">Hỗ trợ 24/7</h5>
                  <p className="card-text text-muted mb-4">
                    Đường dây nóng hỗ trợ 24/7
                  </p>
                  <button className="btn btn-outline-danger w-100 fw-semibold">
                    Liên hệ ngay →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-dark text-white py-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-3">
                💪 Hãy mạnh mẽ chọn lựa tương lai tươi sáng
              </h2>
              <p className="lead mb-4">
                Mọi hành trình đều bắt đầu từ một bước đi. Chúng tôi sẵn sàng đồng hành cùng bạn
                trong việc xây dựng cuộc sống tích cực và khỏe mạnh.
              </p>
              {/* <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button className="btn btn-primary btn-lg px-4 fw-semibold">
                  🔐 Đăng nhập hệ thống
                </button>
                <button className="btn btn-outline-light btn-lg px-4 fw-semibold">
                  📝 Tạo tài khoản mới
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </section>
      <footer>
        <p>&copy; 2025 Drug-Free Path. All rights reserved.</p>
      </footer>
    </main>
  );
}
