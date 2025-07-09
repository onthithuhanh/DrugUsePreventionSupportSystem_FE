"use client"
import React, { SyntheticEvent, useState } from 'react'
import { useRouter } from "next/navigation"
import Link from 'next/link'

export default function ForgotPassword() {
    const router = useRouter()    
    const [authMessage, setAuthMessage] = useState("")
    const [email, setEmail] = useState("")
    const [step, setStep] = useState(1) // 1: enter email, 2: enter code, 3: new password
    const [verificationCode, setVerificationCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [countdown, setCountdown] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const sendResetCode = async (event: SyntheticEvent) => {
        event.preventDefault();
        
        if (!email) {
            setAuthMessage("Vui lòng nhập email")
            return
        }

        try {
            setIsLoading(true)
            setAuthMessage("")
            
            // Here you would call your API to send reset code
            // const response = await authApi.sendResetCode(email)
            
            // Simulate API call
            setTimeout(() => {
                setStep(2)
                setAuthMessage("Mã đặt lại mật khẩu đã được gửi đến email của bạn")
                startCountdown()
                setIsLoading(false)
            }, 2000)
        } catch (error) {
            setAuthMessage("Gửi mã thất bại. Vui lòng kiểm tra email và thử lại")
            setIsLoading(false)
        }
    }

    const verifyResetCode = async (event: SyntheticEvent) => {
        event.preventDefault();
        
        if (!verificationCode) {
            setAuthMessage("Vui lòng nhập mã xác thực")
            return
        }

        try {
            setIsLoading(true)
            setAuthMessage("")
            
            // Here you would call your API to verify reset code
            // const response = await authApi.verifyResetCode(email, verificationCode)
            
            // Simulate verification
            setTimeout(() => {
                if (verificationCode.length === 6) {
                    setStep(3)
                    setAuthMessage("Mã xác thực đúng. Vui lòng nhập mật khẩu mới")
                } else {
                    setAuthMessage("Mã xác thực không đúng. Vui lòng thử lại")
                }
                setIsLoading(false)
            }, 1500)
        } catch (error) {
            setAuthMessage("Xác thực thất bại. Vui lòng thử lại")
            setIsLoading(false)
        }
    }

    const resetPassword = async (event: SyntheticEvent) => {
        event.preventDefault();
        
        if (!newPassword || !confirmPassword) {
            setAuthMessage("Vui lòng nhập đầy đủ thông tin")
            return
        }

        if (newPassword !== confirmPassword) {
            setAuthMessage("Mật khẩu xác nhận không khớp")
            return
        }

        if (newPassword.length < 6) {
            setAuthMessage("Mật khẩu phải có ít nhất 6 ký tự")
            return
        }

        try {
            setIsLoading(true)
            setAuthMessage("")
            
            // Here you would call your API to reset password
            // const response = await authApi.resetPassword(email, verificationCode, newPassword)
            
            // Simulate API call
            setTimeout(() => {
                setAuthMessage("Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...")
                setTimeout(() => {
                    router.push("/auth")
                }, 2000)
                setIsLoading(false)
            }, 2000)
        } catch (error) {
            setAuthMessage("Đặt lại mật khẩu thất bại. Vui lòng thử lại")
            setIsLoading(false)
        }
    }

    const startCountdown = () => {
        setCountdown(60)
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    const resendCode = () => {
        if (countdown === 0) {
            sendResetCode({ preventDefault: () => {} } as SyntheticEvent)
        }
    }

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
                                            <i className="fas fa-key text-white" style={{ fontSize: '24px' }}></i>
                                        </div>
                                    </div>
                                    <h2 className="fw-bold text-dark mb-2">
                                        {step === 1 && "Quên mật khẩu"}
                                        {step === 2 && "Xác thực email"}
                                        {step === 3 && "Đặt lại mật khẩu"}
                                    </h2>
                                    <p className="text-muted mb-0">
                                        {step === 1 && "Nhập email để nhận mã đặt lại mật khẩu"}
                                        {step === 2 && "Nhập mã xác thực đã gửi đến email"}
                                        {step === 3 && "Tạo mật khẩu mới cho tài khoản"}
                                    </p>
                                </div>

                                {/* Step 1: Enter Email */}
                                {step === 1 && (
                                    <form onSubmit={sendResetCode}>
                                        <div className="mb-4">
                                            <div className="input-group">
                                                <span className="input-group-text border-0 bg-light">
                                                    <i className="fas fa-envelope text-muted"></i>
                                                </span>
                                                <input 
                                                    type="email" 
                                                    className="form-control border-0 bg-light py-3" 
                                                    placeholder="Nhập email của bạn"
                                                    value={email} 
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    style={{ fontSize: '16px' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Error/Success Message */}
                                        {authMessage && (
                                            <div className={`alert ${authMessage.includes('thành công') || authMessage.includes('gửi') ? 'alert-success' : 'alert-danger'} d-flex align-items-center mb-4`} role="alert">
                                                <i className={`fas ${authMessage.includes('thành công') || authMessage.includes('gửi') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                                                <div>{authMessage}</div>
                                            </div>
                                        )}

                                        <button 
                                            type="submit" 
                                            className="btn btn-primary w-100 py-3 fw-semibold"
                                            disabled={isLoading}
                                            style={{ 
                                                fontSize: '16px',
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #776faa 100%)',
                                                border: 'none'
                                            }}
                                        >
                                            {isLoading ? (
                                                <><i className="fas fa-spinner fa-spin me-2"></i>Đang gửi...</>
                                            ) : (
                                                <><i className="fas fa-paper-plane me-2"></i>Gửi mã đặt lại</>
                                            )}
                                        </button>
                                    </form>
                                )}

                                {/* Step 2: Enter Verification Code */}
                                {step === 2 && (
                                    <form onSubmit={verifyResetCode}>
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text border-0 bg-light">
                                                    <i className="fas fa-key text-muted"></i>
                                                </span>
                                                <input 
                                                    type="text" 
                                                    className="form-control border-0 bg-light py-3" 
                                                    placeholder="Nhập mã xác thực 6 số"
                                                    value={verificationCode} 
                                                    onChange={(e) => setVerificationCode(e.target.value)}
                                                    maxLength={6}
                                                    required
                                                    style={{ fontSize: '16px' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Resend Code */}
                                        <div className="text-center mb-4">
                                            <small className="text-muted">
                                                Không nhận được mã?{' '}
                                                <button 
                                                    type="button"
                                                    className="btn btn-link p-0 text-primary"
                                                    style={{ fontSize: '14px' }}
                                                    onClick={resendCode}
                                                    disabled={countdown > 0}
                                                >
                                                    {countdown > 0 ? `Gửi lại (${countdown}s)` : 'Gửi lại mã'}
                                                </button>
                                            </small>
                                        </div>

                                        {/* Error/Success Message */}
                                        {authMessage && (
                                            <div className={`alert ${authMessage.includes('đúng') ? 'alert-success' : 'alert-danger'} d-flex align-items-center mb-4`} role="alert">
                                                <i className={`fas ${authMessage.includes('đúng') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                                                <div>{authMessage}</div>
                                            </div>
                                        )}

                                        <button 
                                            type="submit" 
                                            className="btn btn-primary w-100 py-3 fw-semibold"
                                            disabled={isLoading || verificationCode.length !== 6}
                                            style={{ 
                                                fontSize: '16px',
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #776faa 100%)',
                                                border: 'none'
                                            }}
                                        >
                                            {isLoading ? (
                                                <><i className="fas fa-spinner fa-spin me-2"></i>Đang xác thực...</>
                                            ) : (
                                                <><i className="fas fa-check me-2"></i>Xác thực mã</>
                                            )}
                                        </button>
                                    </form>
                                )}

                                {/* Step 3: New Password */}
                                {step === 3 && (
                                    <form onSubmit={resetPassword}>
                                        <div className="mb-3">
                                            <div className="input-group">
                                                <span className="input-group-text border-0 bg-light">
                                                    <i className="fas fa-lock text-muted"></i>
                                                </span>
                                                <input 
                                                    type="password" 
                                                    className="form-control border-0 bg-light py-3" 
                                                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                                    value={newPassword} 
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                    style={{ fontSize: '16px' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="input-group">
                                                <span className="input-group-text border-0 bg-light">
                                                    <i className="fas fa-lock text-muted"></i>
                                                </span>
                                                <input 
                                                    type="password" 
                                                    className="form-control border-0 bg-light py-3" 
                                                    placeholder="Xác nhận mật khẩu mới"
                                                    value={confirmPassword} 
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    style={{ fontSize: '16px' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Error/Success Message */}
                                        {authMessage && (
                                            <div className={`alert ${authMessage.includes('thành công') ? 'alert-success' : 'alert-danger'} d-flex align-items-center mb-4`} role="alert">
                                                <i className={`fas ${authMessage.includes('thành công') ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                                                <div>{authMessage}</div>
                                            </div>
                                        )}

                                        <button 
                                            type="submit" 
                                            className="btn btn-primary w-100 py-3 fw-semibold"
                                            disabled={isLoading}
                                            style={{ 
                                                fontSize: '16px',
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #776faa 100%)',
                                                border: 'none'
                                            }}
                                        >
                                            {isLoading ? (
                                                <><i className="fas fa-spinner fa-spin me-2"></i>Đang cập nhật...</>
                                            ) : (
                                                <><i className="fas fa-save me-2"></i>Đặt lại mật khẩu</>
                                            )}
                                        </button>
                                    </form>
                                )}

                                {/* Back to Login Link */}
                                <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
                                    <p className="text-muted mb-0">
                                        Nhớ lại mật khẩu?{' '}
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
