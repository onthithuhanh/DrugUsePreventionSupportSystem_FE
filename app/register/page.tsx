"use client"
import React, { SyntheticEvent, useState } from 'react'
import { useRouter } from "next/navigation"
import Link from 'next/link'

export default function Register() {
    const router = useRouter()    
    const [authMessage, setAuthMessage] = useState("")
    const [formData, setFormData] = useState({
        fullName: "",
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
            setAuthMessage("Mật khẩu xác nhận không khớp")
            return
        }

        // Validate password length
        if (formData.password.length < 6) {
            setAuthMessage("Mật khẩu phải có ít nhất 6 ký tự")
            return
        }

        try {
            // Here you would call your registration API
            // const response = await authApi.register(formData)
            console.log("Registration data:", formData)
            setAuthMessage("Đăng ký thành công! Vui lòng đăng nhập.")
            // router.push("/auth")
        } catch (error) {            
            setAuthMessage("Đăng ký thất bại: Email đã được sử dụng hoặc thông tin không hợp lệ")            
            console.log(error) 
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

                                    {/* Date of Birth */}
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text border-0 bg-light">
                                                <i className="fas fa-calendar text-muted"></i>
                                            </span>
                                            <input 
                                                type="date" 
                                                className="form-control border-0 bg-light py-3" 
                                                placeholder="Chọn ngày sinh"
                                                value={formData.dateOfBirth} 
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                max={new Date().toISOString().split('T')[0]}
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
                                    {authMessage && (
                                        <div className={`alert ${authMessage.includes('thành công') ? 'alert-success' : 'alert-danger'} d-flex align-items-center mb-4`} role="alert">
                                            <i className={`fas ${authMessage.includes('thành công') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                                            <div>{authMessage}</div>
                                        </div>
                                    )}

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
