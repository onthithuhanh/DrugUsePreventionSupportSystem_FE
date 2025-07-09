"use client"
import React, { SyntheticEvent, useState } from 'react'
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { authApi } from '@/api/auth'

export default function auth() {

    const router = useRouter()    
    const [authMessage, setAuthMessage] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        try {
            const response = await authApi.login({email, password})
            localStorage.setItem("user", JSON.stringify(response)) 
            console.log(response)               
            router.push("/")   
        } catch (error) {            
            setAuthMessage("Đăng nhập thất bại: Email hoặc mật khẩu không đúng")            
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
                    <div className="col-md-6 col-lg-5">
                        <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-5">
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle" 
                                             style={{ width: '60px', height: '60px' }}>
                                            <i className="fas fa-shield-alt text-white" style={{ fontSize: '24px' }}></i>
                                        </div>
                                    </div>
                                    <h2 className="fw-bold text-dark mb-2">Đăng nhập</h2>
                                    <p className="text-muted mb-0">Hệ thống hỗ trợ phòng ngừa sử dụng ma túy</p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text border-0 bg-light">
                                                <i className="fas fa-envelope text-muted"></i>
                                            </span>
                                            <input 
                                                type="text" 
                                                className="form-control border-0 bg-light py-3" 
                                                placeholder="Nhập email"
                                                value={email} 
                                                onChange={(event) => setEmail(event.target.value)}
                                                required
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="input-group">
                                            <span className="input-group-text border-0 bg-light">
                                                <i className="fas fa-lock text-muted"></i>
                                            </span>
                                            <input 
                                                type="password" 
                                                className="form-control border-0 bg-light py-3" 
                                                placeholder="Nhập mật khẩu"
                                                value={password} 
                                                onChange={(event) => setPassword(event.target.value)}
                                                required
                                                style={{ fontSize: '16px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id="rememberMe"
                                            />
                                            <label className="form-check-label text-muted" htmlFor="rememberMe">
                                                Ghi nhớ đăng nhập
                                            </label>
                                        </div>
                                        <Link 
                                            href="/forgot-password" 
                                            className="text-decoration-none text-primary"
                                            style={{ fontSize: '14px' }}
                                        >
                                            Quên mật khẩu?
                                        </Link>
                                    </div>

                                    {/* Error Message */}
                                    {authMessage && (
                                        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            <div>{authMessage}</div>
                                        </div>
                                    )}

                                    {/* Login Button */}
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
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Đăng nhập
                                    </button>
                                </form>

                                {/* Registration Link */}
                                <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
                                    <p className="text-muted mb-0">
                                        Chưa có tài khoản?{' '}
                                        <Link 
                                            href="/register" 
                                            className="text-decoration-none text-primary fw-semibold"
                                        >
                                            Đăng ký ngay
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
