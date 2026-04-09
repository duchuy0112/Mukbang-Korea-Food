import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import withRouter from '../utils/withRouter';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      txtAddress: '',
      step: 1, // 1 = form, 2 = OTP verify
      otpDigits: ['', '', '', '', '', ''],
      isSubmitting: false,
    };
    this.otpRefs = Array.from({ length: 6 }, () => React.createRef());
  }

  render() {
    const { step } = this.state;

    return (
      <div className="auth-page">
        <Helmet>
          <title>Đăng Ký Tài Khoản | Mukbang Korea Food</title>
          <meta name="description" content="Đăng ký ngay tài khoản Mukbang Korea Food để nhận ưu đãi thành viên." />
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

          .auth-form-panel {
            width: 500px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 40px 50px;
            background: #fff;
            overflow-y: auto;
          }

          .auth-form-title {
            font-family: 'Playfair Display', serif;
            font-size: 30px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0 0 8px;
            line-height: 1.2;
          }

          .auth-form-sub {
            color: #999;
            font-size: 14px;
            margin: 0 0 28px;
            font-weight: 500;
            font-style: italic;
          }

          .auth-field {
            margin-bottom: 18px;
          }

          .auth-label {
            display: block;
            font-size: 13px;
            font-weight: 700;
            color: #333;
            margin-bottom: 6px;
          }

          .auth-input {
            width: 100%;
            padding: 14px 16px;
            border-radius: 12px;
            border: 1.5px solid #e5e5e5;
            font-size: 14px;
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
            box-shadow: 0 0 0 3px rgba(198,40,40,0.06);
          }

          .auth-input::placeholder {
            color: #bbb;
          }

          .auth-row {
            display: flex;
            gap: 12px;
          }

          .auth-row .auth-field {
            flex: 1;
          }

          .auth-submit {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 14px;
            background: linear-gradient(135deg, #c62828 0%, #d32f2f 100%);
            color: white;
            font-size: 15px;
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

          .auth-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .auth-switch {
            text-align: center;
            margin-top: 24px;
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
            padding-top: 24px;
            font-size: 12px;
            color: #bbb;
          }

          .auth-footer a {
            color: #999;
            text-decoration: none;
            font-weight: 600;
          }

          /* OTP STEP */
          .otp-section {
            text-align: center;
            animation: slideUp 0.5s ease-out;
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .otp-icon {
            font-size: 52px;
            margin-bottom: 20px;
          }

          .otp-title {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0 0 10px;
          }

          .otp-desc {
            font-size: 14px;
            color: #888;
            margin: 0 0 32px;
            line-height: 1.6;
          }

          .otp-desc strong {
            color: #c62828;
          }

          .otp-inputs {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-bottom: 32px;
          }

          .otp-digit {
            width: 52px;
            height: 60px;
            border-radius: 14px;
            border: 2px solid #e5e5e5;
            text-align: center;
            font-size: 24px;
            font-weight: 900;
            font-family: 'Inter', sans-serif;
            color: #1a1a1a;
            outline: none;
            transition: all 0.2s;
            background: #fafafa;
          }

          .otp-digit:focus {
            border-color: #c62828;
            background: #fff;
            box-shadow: 0 0 0 4px rgba(198,40,40,0.1);
            transform: scale(1.05);
          }

          .otp-digit.otp-filled {
            border-color: #c62828;
            background: #fff;
            color: #c62828;
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(198,40,40,0.12);
          }

          .otp-resend {
            margin-top: 16px;
            font-size: 13px;
            color: #888;
          }

          .otp-resend button {
            background: none;
            border: none;
            color: #c62828;
            font-weight: 800;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
          }

          .otp-resend button:hover {
            text-decoration: underline;
          }

          @media (max-width: 900px) {
            .auth-page { flex-direction: column; }
            .auth-visual { min-height: 260px; }
            .auth-form-panel { width: 100%; padding: 30px 24px; }
          }
        `}</style>

        {/* LEFT: IMAGE */}
        <div className="auth-visual">
          <img src="/images/login_new.jpg" alt="Mukbang Korea Food" />



          <div className="visual-content">
            <div className="visual-label"></div>
            <h2 className="visual-title">Mukbang Store</h2>
            <p className="visual-desc">
              Trải nghiệm tinh hoa ẩm thực xứ Kim Chi trong không gian sang trọng và ấm cúng.
            </p>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="auth-form-panel">
          {step === 1 && this.renderSignupForm()}
          {step === 2 && this.renderOtpStep()}
        </div>
      </div>
    );
  }

  renderSignupForm() {
    return (
      <>
        <h1 className="auth-form-title">Đăng ký tài khoản</h1>
        <p className="auth-form-sub">Tạo tài khoản để bắt đầu đặt hàng dễ dàng.</p>

        <form onSubmit={(e) => this.btnSignupClick(e)}>
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">Tên đăng nhập *</label>
              <input type="text" className="auth-input" placeholder="username"
                value={this.state.txtUsername} onChange={e => this.setState({ txtUsername: e.target.value })} required />
            </div>
            <div className="auth-field">
              <label className="auth-label">Mật khẩu *</label>
              <input type="password" className="auth-input" placeholder="••••••••"
                value={this.state.txtPassword} onChange={e => this.setState({ txtPassword: e.target.value })} required />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Họ và tên *</label>
            <input type="text" className="auth-input" placeholder="Nguyễn Văn A"
              value={this.state.txtName} onChange={e => this.setState({ txtName: e.target.value })} required />
          </div>

          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label">Số điện thoại *</label>
              <input type="tel" className="auth-input" placeholder="0384 939 293"
                value={this.state.txtPhone} onChange={e => this.setState({ txtPhone: e.target.value })} required />
            </div>
            <div className="auth-field">
              <label className="auth-label">Email *</label>
              <input type="email" className="auth-input" placeholder="name@example.com"
                value={this.state.txtEmail} onChange={e => this.setState({ txtEmail: e.target.value })} required />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">Địa chỉ giao hàng *</label>
            <input type="text" className="auth-input" placeholder="Số nhà, đường, quận..."
              value={this.state.txtAddress} onChange={e => this.setState({ txtAddress: e.target.value })} required />
          </div>

          <button type="submit" className="auth-submit" disabled={this.state.isSubmitting}>
            {this.state.isSubmitting ? 'Đang gửi mã OTP...' : 'Đăng ký & Nhận mã OTP →'}
          </button>
        </form>

        <div className="auth-switch">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>

        <div className="auth-footer">
          <span>© 2024 MUKBANG KOREA</span>
          <div>
            <a href="#">BẢO MẬT</a>&nbsp;&nbsp;&nbsp;<a href="#">ĐIỀU KHOẢN</a>
          </div>
        </div>
      </>
    );
  }

  renderOtpStep() {
    const { otpDigits } = this.state;

    return (
      <div className="otp-section">
        <div className="otp-icon">🔐</div>
        <h2 className="otp-title">Xác thực OTP</h2>
        <p className="otp-desc">
          Chúng tôi đã gửi mã 6 số đến email<br />
          <strong>{this.state.txtEmail}</strong>
        </p>

        <div className="otp-inputs">
          {otpDigits.map((d, i) => (
            <input
              key={i}
              ref={this.otpRefs[i]}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength="1"
              className={`otp-digit${d ? ' otp-filled' : ''}`}
              value={d}
              onInput={(e) => this.handleOtpInput(i, e)}
              onKeyDown={(e) => this.handleOtpKeyDown(i, e)}
              onPaste={(e) => this.handleOtpPaste(e)}
              onFocus={(e) => e.target.select()}
              autoFocus={i === 0}
            />
          ))}
        </div>

        <button className="auth-submit" onClick={() => this.btnVerifyOtpClick()} disabled={this.state.isSubmitting}>
          {this.state.isSubmitting ? 'Đang xác thực...' : 'Xác nhận'}
        </button>

        <div className="otp-resend">
          Không nhận được mã? <button onClick={() => this.btnSignupClick()}>Gửi lại</button>
        </div>

        <div className="auth-switch" style={{ marginTop: 20 }}>
          <Link to="/login">← Quay lại đăng nhập</Link>
        </div>
      </div>
    );
  }

  handleOtpInput(index, e) {
    const raw = e.target.value;
    // Get the last digit entered (to allow overwriting)
    const lastDigit = raw.split('').reverse().find(char => /\d/.test(char)) || '';

    const digits = [...this.state.otpDigits];
    digits[index] = lastDigit;
    
    this.setState({ otpDigits: digits }, () => {
      // Auto-focus next input if a digit was entered
      if (lastDigit && index < 5) {
        this.otpRefs[index + 1].current.focus();
      }
    });
  }

  handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const digits = [...this.state.otpDigits];
      if (digits[index]) {
        // Clear current digit
        digits[index] = '';
        this.setState({ otpDigits: digits });
      } else if (index > 0) {
        // Clear previous digit and move focus back
        digits[index - 1] = '';
        this.setState({ otpDigits: digits }, () => {
          this.otpRefs[index - 1].current.focus();
        });
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      this.otpRefs[index - 1].current.focus();
      this.otpRefs[index - 1].current.select();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      this.otpRefs[index + 1].current.focus();
      this.otpRefs[index + 1].current.select();
    }
  }

  handleOtpPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;

    const digits = [...this.state.otpDigits];
    for (let i = 0; i < 6; i++) {
      digits[i] = pasted[i] || '';
    }
    this.setState({ otpDigits: digits }, () => {
      // Focus the next empty input, or the last one
      const nextEmpty = digits.findIndex(d => !d);
      const focusIdx = nextEmpty === -1 ? 5 : nextEmpty;
      this.otpRefs[focusIdx].current.focus();
    });
  }

  btnSignupClick(e) {
    if (e) e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail, txtAddress } = this.state;

    if (!txtUsername || !txtPassword || !txtName || !txtPhone || !txtEmail || !txtAddress) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    this.setState({ isSubmitting: true });

    const account = {
      username: txtUsername,
      password: txtPassword,
      name: txtName,
      phone: txtPhone,
      email: txtEmail,
      address: txtAddress
    };

    axios.post('/api/customer/signup', account).then((res) => {
      const result = res.data;
      this.setState({ isSubmitting: false });

      if (result.success && result.requireOtp) {
        // Move to OTP step
        this.setState({ step: 2, otpDigits: ['', '', '', '', '', ''] });
      } else {
        alert(result.message);
      }
    }).catch(() => {
      this.setState({ isSubmitting: false });
      alert('Đã có lỗi xảy ra!');
    });
  }

  btnVerifyOtpClick() {
    const otp = this.state.otpDigits.join('');

    if (otp.length !== 6) {
      alert('Vui lòng nhập đầy đủ 6 số OTP!');
      return;
    }

    this.setState({ isSubmitting: true });

    axios.post('/api/customer/verify-otp', {
      email: this.state.txtEmail,
      otp: otp
    }).then((res) => {
      this.setState({ isSubmitting: false });
      const result = res.data;

      if (result.success) {
        alert('🎉 ' + result.message);
        this.props.navigate('/login');
      } else {
        alert(result.message);
      }
    }).catch(() => {
      this.setState({ isSubmitting: false });
      alert('Đã có lỗi xảy ra!');
    });
  }
}

export default withRouter(Signup);
