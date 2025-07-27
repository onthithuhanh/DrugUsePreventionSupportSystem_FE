"use client"
import React, { SyntheticEvent, useState } from 'react'
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/api/auth";

export default function Register() {
    const router = useRouter()    
    const { toast } = useToast();
    const [authMessage, setAuthMessage] = useState("")
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        dateOfBirth: "",
        gender: ""
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast({ title: "Lỗi", description: "Mật khẩu xác nhận không khớp", variant: "destructive" });
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            toast({ title: "Lỗi", description: "Mật khẩu phải có ít nhất 6 ký tự", variant: "destructive" });
            return;
        }

        // Validate required fields
        if (!formData.fullName || !formData.email || !formData.password ||  !formData.address) {
            toast({ title: "Lỗi", description: "Vui lòng nhập đầy đủ thông tin", variant: "destructive" });
            return;
        }
 
       

        try {
            await authApi.register({
                fullName: formData.fullName,
                address: formData.address,
                email: formData.email, 
                password: formData.password
            });
            toast({ title: "Thành công", description: "Đăng ký thành công! Vui lòng đăng nhập." });
            router.push("/auth");
        } catch (error) {
            toast({ title: "Lỗi", description: "Đăng ký thất bại: Email đã được sử dụng hoặc thông tin không hợp lệ", variant: "destructive" });
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center" style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #fdfdfd 100%)',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-5">
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle" 
                                             style={{ width: '60px', height: '60px' }}>
                                            <i className="fas fa-user-plus text-white" style={{ fontSize: '24px' }}></i>
                                        </div>
                                    </div>
                                    <h2 className="fw-bold text-dark mb-2">Đăng ký tài khoản</h2>
                                    <p className="text-muted mb-0">Hệ thống hỗ trợ phòng ngừa sử dụng ma túy</p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit}>
                                    {/* Full Name */}
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text border-0 bg-light">
                                                <i className="fas fa-user text-muted"></i>
                                            </span>
                                            <input 
                                                type="text" 
                                                className="form-control border-0 bg-light py-3" 
                                                placeholder="Nhập họ và tên"
                                                value={formData.fullName} 
                                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                required
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text border-0 bg-light">
                                                <i className="fas fa-envelope text-muted"></i>
                                            </span>
                                            <input 
                                                type="email" 
                                                className="form-control border-0 bg-light py-3" 
                                                placeholder="Nhập email"
                                                value={formData.email} 
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                required
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text border-0 bg-light">
                                                <i className="fas fa-map-marker-alt text-muted"></i>
                                            </span>
                                            <input 
                                                type="text" 
                                                className="form-control border-0 bg-light py-3" 
                                                placeholder="Nhập địa chỉ"
                                                value={formData.address} 
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                required
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text border-0 bg-light">
                                                <i className="fas fa-phone text-muted"></i>
                                            </span>
                                            <input 
                                                type="tel" 
                                                className="form-control border-0 bg-light py-3" 
                                                placeholder="Nhập số điện thoại"
                                                value={formData.phone} 
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                required
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    </div>

                                   

                                    {/* Password */}
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text border-0 bg-light">
                                                <i className="fas fa-lock text-muted"></i>
                                            </span>
                                            <input 
                                                type="password" 
                                                className="form-control border-0 bg-light py-3" 
                                                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                                                value={formData.password} 
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                required
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="mb-4">
                                        <div className="input-group">
                                            <span className="input-group-text border-0 bg-light">
                                                <i className="fas fa-lock text-muted"></i>
                                            </span>
                                            <input 
                                                type="password" 
                                                className="form-control border-0 bg-light py-3" 
                                                placeholder="Nhập lại mật khẩu"
                                                value={formData.confirmPassword} 
                                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                required
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Terms and Conditions */}
                                    <div className="mb-4">
                                        <div className="form-check">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="termsConditions"
                                                required
                                            />
                                            <label className="form-check-label text-muted" htmlFor="termsConditions">
                                                Tôi đồng ý với{' '}
                                                <a href="#" className="text-primary text-decoration-none">
                                                    Điều khoản sử dụng
                                                </a>
                                                {' '}và{' '}
                                                <a href="#" className="text-primary text-decoration-none">
                                                    Chính sách bảo mật
                                                </a>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Success/Error Message */}
                                    {/* Đã chuyển sang toast, có thể xóa đoạn này nếu muốn */}

                                    {/* Register Button */}
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 py-3 fw-semibold"
                                        style={{ 
                                            fontSize: '16px',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #776faa 100%)',
                                            border: 'none'
                                        }}
                                    >
                                        <i className="fas fa-user-plus me-2"></i>
                                        Đăng ký tài khoản
                                    </button>
                                </form>

                                {/* Login Link */}
                                <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
                                    <p className="text-muted mb-0">
                                        Đã có tài khoản?{' '}
                                        <Link 
                                            href="/auth" 
                                            className="text-decoration-none text-primary fw-semibold"
                                        >
                                            Đăng nhập ngay
                                        </Link>
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="text-center mt-4">
                                    <small className="text-muted">
                                        Bảo vệ sức khỏe cộng đồng - Ngăn ngừa tệ nạn xã hội
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
