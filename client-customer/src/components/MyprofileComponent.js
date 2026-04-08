import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myprofile extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "",
      txtPassword: "",
      txtName: "",
      txtPhone: "",
      txtEmail: "",
      txtAddress: "",
    };
  }

  render() {
    if (this.context.token === "") {
      return <Navigate replace to="/login" />;
    }

    return (
      <div className="auth-page">
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
            background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
          }

          .visual-content {
            position: relative;
            z-index: 2;
            padding: 60px;
            color: #fff;
          }

          .visual-label {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 20px;
            color: rgba(255,255,255,0.8);
          }

          .visual-title {
            font-family: 'Playfair Display', serif;
            font-size: 54px;
            font-weight: 800;
            line-height: 1.1;
            margin: 0 0 20px;
          }

          .visual-desc {
            font-size: 16px;
            line-height: 1.6;
            color: rgba(255,255,255,0.9);
            max-width: 400px;
          }

          .auth-form-panel {
            width: 580px;
            background: #fff;
            padding: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            overflow-y: auto;
          }

          .auth-form-title {
            font-size: 32px;
            font-weight: 900;
            color: #1a1a1a;
            letter-spacing: -1px;
            margin: 0 0 10px;
          }

          .auth-form-sub {
            font-size: 15px;
            color: #666;
            margin: 0 0 40px;
            line-height: 1.5;
          }

          .auth-row {
            display: flex;
            gap: 20px;
          }

          .auth-row > div {
            flex: 1;
          }

          .auth-field {
            margin-bottom: 24px;
          }

          .auth-label {
            display: block;
            font-size: 13px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 8px;
          }

          .auth-input {
            width: 100%;
            height: 52px;
            padding: 0 16px;
            border: 1.5px solid #e5e5e5;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
            color: #1a1a1a;
            outline: none;
            transition: all 0.2s ease;
            box-sizing: border-box;
            background: #fafafa;
          }

          .auth-input:focus {
            border-color: #c62828;
            background: #fff;
            box-shadow: 0 0 0 4px rgba(198, 40, 40, 0.1);
          }

          .auth-input:disabled {
            background: #f5f5f5;
            color: #999;
            cursor: not-allowed;
          }

          .auth-submit {
            width: 100%;
            height: 56px;
            background: #c62828;
            color: #fff;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            margin-top: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .auth-submit:hover {
            background: #b71c1c;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(198, 40, 40, 0.25);
          }

          @media (max-width: 900px) {
            .auth-page { flex-direction: column; }
            .auth-visual { min-height: 260px; }
            .auth-form-panel { width: 100%; padding: 30px 24px; }
            .auth-row { flex-direction: column; gap: 0; }
          }
        `}</style>

        {/* LEFT: IMAGE */}
        <div className="auth-visual">
          <img src="/images/login_new.jpg" alt="Mukbang Korea Food Profile" />
          <div className="visual-content">
            <div className="visual-label">TÀI KHOẢN CÁ NHÂN</div>
            <h2 className="visual-title">Xin chào,<br/>{this.state.txtName || 'Hội viên'}</h2>
            <p className="visual-desc">
              Quản lý thông tin giao hàng và bảo mật tài khoản của bạn tại Mukbang Korea Food để có trải nghiệm tốt nhất.
            </p>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="auth-form-panel">
          <h1 className="auth-form-title">Hồ sơ của tôi</h1>
          <p className="auth-form-sub">Cập nhật thông tin giao hàng & liên hệ.</p>

          <form onSubmit={(e) => this.btnUpdateClick(e)}>
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label">Tên đăng nhập</label>
                <input
                  type="text"
                  className="auth-input"
                  value={this.state.txtUsername}
                  disabled
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Để trống nếu không đổi..."
                  value={this.state.txtPassword}
                  onChange={(e) => this.setState({ txtPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Họ và tên *</label>
              <input
                type="text"
                className="auth-input"
                placeholder="Nhập họ và tên đầy đủ..."
                value={this.state.txtName}
                onChange={(e) => this.setState({ txtName: e.target.value })}
                required
              />
            </div>

            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label">Số điện thoại *</label>
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="090..."
                  value={this.state.txtPhone}
                  onChange={(e) => this.setState({ txtPhone: e.target.value })}
                  required
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Email liên hệ *</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={this.state.txtEmail}
                  onChange={(e) => this.setState({ txtEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Địa chỉ giao hàng mặc định *</label>
              <input
                type="text"
                className="auth-input"
                placeholder="Số nhà, đường, quận/huyện..."
                value={this.state.txtAddress}
                onChange={(e) => this.setState({ txtAddress: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="auth-submit">
              Cập nhật hồ sơ <span>→</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (this.context.customer) {
      this.setState({
        txtUsername: this.context.customer.username,
        txtPassword: this.context.customer.password,
        txtName: this.context.customer.name,
        txtPhone: this.context.customer.phone,
        txtEmail: this.context.customer.email,
        txtAddress: this.context.customer.address || "",
      });
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail, txtAddress } = this.state;

    if (!txtName || txtName.trim() === '') {
      alert('VUI LÒNG NHẬP HỌ VÀ TÊN!');
      return;
    }
    if (!txtPhone || txtPhone.trim() === '') {
      alert('VUI LÒNG NHẬP SỐ ĐIỆN THOẠI!');
      return;
    }
    if (!txtEmail || txtEmail.trim() === '') {
      alert('VUI LÒNG NHẬP EMAIL!');
      return;
    }
    if (!txtAddress || txtAddress.trim() === '') {
      alert('VUI LÒNG NHẬP ĐỊA CHỈ!');
      return;
    }

    const customer = {
      username: txtUsername,
      password: txtPassword,
      name: txtName,
      phone: txtPhone,
      email: txtEmail,
      address: txtAddress,
    };
    this.apiPutCustomer(this.context.customer._id, customer);
  }

  apiPutCustomer(id, customer) {
    const config = { headers: { "x-access-token": this.context.token } };

    axios.put("/api/customer/customers/" + id, customer, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Cập nhật thông tin thành công!");
        this.context.setCustomer(result);
      } else {
        alert("Có lỗi xảy ra, vui lòng kiểm tra lại!");
      }
    });
  }
}

export default Myprofile;