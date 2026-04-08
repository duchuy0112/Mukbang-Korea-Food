import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "",
      txtPassword: "",
      isForgotPasswordMode: false,
    };
  }

  render() {
    return (
      <div className="auth-page">
        <Helmet>
          <title>Đăng Nhập | Mukbang Korea Food</title>
          <meta name="description" content="Đăng nhập vào tài khoản Mukbang Korea Food để đặt những món ăn Hàn Quốc yêu thích ngay hôm nay." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&display=swap');

          .auth-page {
            min-height: 100vh;
            display: flex;
            font-family: 'Inter', sans-serif;
            background: #f5f0ed;
          }

          /* LEFT: IMAGE PANEL */
          .auth-visual {
            flex: 1;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }

          .auth-visual img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .auth-visual::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
          }

          .visual-badge {
            position: absolute;
            top: 28px;
            left: 28px;
            z-index: 2;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            padding: 12px 20px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          }

          .badge-icon {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: #c62828;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
          }

          .badge-text strong {
            display: block;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #999;
            font-weight: 800;
          }

          .badge-text span {
            font-size: 14px;
            font-weight: 800;
            color: #1a1a1a;
          }

          .visual-content {
            position: relative;
            z-index: 2;
            padding: 50px 40px;
            color: white;
          }

          .visual-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 3px;
            opacity: 0.7;
            margin-bottom: 12px;
            font-weight: 700;
          }

          .visual-title {
            font-family: 'Playfair Display', serif;
            font-size: 42px;
            font-weight: 900;
            line-height: 1.1;
            margin: 0 0 16px;
            font-style: italic;
          }

          .visual-desc {
            font-size: 15px;
            line-height: 1.7;
            opacity: 0.8;
            max-width: 380px;
            font-weight: 500;
          }

          /* RIGHT: FORM PANEL */
          .auth-form-panel {
            width: 480px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 60px 50px;
            background: #fff;
          }

          .auth-form-title {
            font-family: 'Playfair Display', serif;
            font-size: 34px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0 0 10px;
            line-height: 1.2;
          }

          .auth-form-sub {
            color: #999;
            font-size: 15px;
            margin: 0 0 40px;
            font-weight: 500;
            font-style: italic;
          }

          .auth-field {
            margin-bottom: 24px;
          }

          .auth-field-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .auth-label {
            font-size: 14px;
            font-weight: 700;
            color: #333;
          }

          .auth-forgot {
            font-size: 13px;
            color: #c62828;
            text-decoration: none;
            font-weight: 700;
          }

          .auth-forgot:hover {
            text-decoration: underline;
          }

          .auth-input {
            width: 100%;
            padding: 16px 18px;
            border-radius: 12px;
            border: 1.5px solid #e5e5e5;
            font-size: 15px;
            font-family: 'Inter', sans-serif;
            color: #333;
            background: #fafafa;
            transition: all 0.2s;
            outline: none;
            box-sizing: border-box;
          }

          .auth-input:focus {
            border-color: #c62828;
            background: #fff;
            box-shadow: 0 0 0 4px rgba(198,40,40,0.06);
          }

          .auth-input::placeholder {
            color: #bbb;
          }

          .auth-submit {
            width: 100%;
            padding: 18px;
            border: none;
            border-radius: 14px;
            background: linear-gradient(135deg, #c62828 0%, #d32f2f 100%);
            color: white;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.3s;
            box-shadow: 0 6px 20px rgba(198,40,40,0.25);
            font-family: 'Inter', sans-serif;
            margin-top: 8px;
          }

          .auth-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(198,40,40,0.35);
          }

          .auth-divider {
            display: flex;
            align-items: center;
            gap: 16px;
            margin: 32px 0;
          }

          .auth-divider-line {
            flex: 1;
            height: 1px;
            background: #eee;
          }

          .auth-divider-text {
            font-size: 12px;
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
          }

          .auth-social-row {
            display: flex;
            gap: 12px;
          }

          .auth-social-btn {
            flex: 1;
            padding: 14px;
            border: 1.5px solid #eee;
            border-radius: 12px;
            background: #fff;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: 0.2s;
            color: #444;
            font-family: 'Inter', sans-serif;
          }

          .auth-social-btn:hover {
            border-color: #ccc;
            background: #fafafa;
          }

          .auth-switch {
            text-align: center;
            margin-top: 32px;
            font-size: 14px;
            color: #888;
            font-weight: 500;
          }

          .auth-switch a {
            color: #c62828;
            font-weight: 800;
            text-decoration: none;
          }

          .auth-switch a:hover {
            text-decoration: underline;
          }

          .auth-footer {
            display: flex;
            justify-content: space-between;
            margin-top: auto;
            padding-top: 30px;
            font-size: 12px;
            color: #bbb;
          }

          .auth-footer a {
            color: #999;
            text-decoration: none;
            font-weight: 600;
          }

          @media (max-width: 900px) {
            .auth-page { flex-direction: column; }
            .auth-visual { min-height: 300px; }
            .auth-form-panel { width: 100%; padding: 40px 30px; }
          }
        `}</style>

        {/* LEFT: IMAGE */}
        <div className="auth-visual">
          <img src="/images/login_new.jpg" alt="Mukbang Korea Food" />



          <div className="visual-content">
            <div className="visual-label">THE FESTIVE CURATOR</div>
            <h2 className="visual-title">Mukbang Korea</h2>
            <p className="visual-desc">
              Trải nghiệm tinh hoa ẩm thực xứ Kim Chi trong không gian sang trọng và ấm cúng.
            </p>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="auth-form-panel">
          <h1 className="auth-form-title">Đăng nhập & Đăng ký</h1>
          <p className="auth-form-sub">Chào mừng bạn quay trở lại với hành trình ẩm thực.</p>

          {this.state.isForgotPasswordMode ? (
            <form onSubmit={(e) => this.btnForgotPasswordClick(e)}>
              <div className="auth-field">
                <div className="auth-field-header">
                  <label className="auth-label">Nhập Email của bạn</label>
                  <a href="#" className="auth-forgot" onClick={e => { e.preventDefault(); this.setState({ isForgotPasswordMode: false }); }}>Quay lại đăng nhập</a>
                </div>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={this.state.txtUsername}
                  onChange={(e) => this.setState({ txtUsername: e.target.value })}
                />
              </div>
              <button type="submit" className="auth-submit">
                Gửi mật khẩu mới <span>→</span>
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => this.btnLoginClick(e)}>
              <div className="auth-field">
                <div className="auth-field-header">
                  <label className="auth-label">Email / Tài khoản</label>
                </div>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={this.state.txtUsername}
                  onChange={(e) => this.setState({ txtUsername: e.target.value })}
                />
              </div>

              <div className="auth-field">
                <div className="auth-field-header">
                  <label className="auth-label">Mật khẩu</label>
                  <a href="#" className="auth-forgot" onClick={e => { e.preventDefault(); this.setState({ isForgotPasswordMode: true }); }}>Quên mật khẩu?</a>
                </div>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={this.state.txtPassword}
                  onChange={(e) => this.setState({ txtPassword: e.target.value })}
                />
              </div>

              <button type="submit" className="auth-submit">
                Đăng nhập <span>→</span>
              </button>
            </form>
          )}

          <div className="auth-divider">
            <div className="auth-divider-line"></div>
            <div className="auth-divider-text">hoặc tiếp tục với</div>
            <div className="auth-divider-line"></div>
          </div>

          <div className="auth-social-row">
            <button className="auth-social-btn" onClick={() => alert('Tính năng đang phát triển')}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button className="auth-social-btn" onClick={() => alert('Tính năng đang phát triển')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <div className="auth-switch">
            Bạn chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
          </div>

          <div className="auth-footer">
            <span>© 2024 MUKBANG KOREA</span>
            <div>
              <a href="#">BẢO MẬT</a>&nbsp;&nbsp;&nbsp;<a href="#">ĐIỀU KHOẢN</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  btnLoginClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;
    if (txtUsername && txtPassword) {
      this.apiLogin({ username: txtUsername, password: txtPassword });
    } else {
      alert("Vui lòng nhập đầy đủ thông tin!");
    }
  }

  btnForgotPasswordClick(e) {
    if (e) e.preventDefault();
    if (!this.state.txtUsername) {
      alert("Vui lòng nhập Email của bạn để nhận mật khẩu mới!");
      return;
    }
    
    axios.post("/api/customer/forgot-password", { email: this.state.txtUsername })
      .then((res) => {
        alert(res.data.message);
        if (res.data.success) {
          this.setState({ isForgotPasswordMode: false });
        }
      })
      .catch(() => alert("Đã có lỗi xảy ra! Không thể kết nối với máy chủ."));
  }

  apiLogin(account) {
    axios.post("/api/customer/login", account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);
        this.props.navigate("/home");
      } else {
        alert(result.message);
      }
    });
  }
}

export default withRouter(Login);