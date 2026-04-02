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
    };
  }

  render() {
    if (this.context.token === "") {
      return <Navigate replace to="/login" />;
    }

    return (
      <div className="korea-profile-container">
        <style>{`
          .korea-profile-container {
            padding: 60px 20px;
            min-height: 80vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
            font-family: 'Inter', sans-serif;
          }

          .profile-card {
            background: white;
            padding: 40px;
            border-radius: 30px;
            box-shadow: 0 20px 50px rgba(211, 47, 47, 0.1);
            border: 2px solid #ff9f43;
            width: 100%;
            max-width: 550px;
            position: relative;
          }

          .profile-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 8px;
            background: linear-gradient(90deg, #d32f2f, #ff9f43, #d32f2f);
            border-radius: 30px 30px 0 0;
          }

          .profile-title {
            color: #d32f2f;
            text-align: center;
            font-weight: 900;
            font-size: 28px;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .profile-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .full-width { grid-column: span 2; }

          .form-group { margin-bottom: 5px; }

          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 700;
            color: #555;
            font-size: 13px;
            text-transform: uppercase;
          }

          .k-input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #eee;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            transition: 0.3s;
            outline: none;
            box-sizing: border-box;
          }

          .k-input:focus {
            border-color: #ff9f43;
            box-shadow: 0 0 15px rgba(255, 159, 67, 0.15);
            background: #fffcf9;
          }

          .k-input:disabled {
            background: #f9f9f9;
            color: #999;
            cursor: not-allowed;
          }

          .btn-update {
            grid-column: span 2;
            padding: 16px;
            margin-top: 20px;
            background: linear-gradient(135deg, #d32f2f 0%, #ff8c00 100%);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 900;
            cursor: pointer;
            transition: 0.4s;
            text-transform: uppercase;
            box-shadow: 0 10px 20px rgba(211, 47, 47, 0.2);
          }

          .btn-update:hover {
            transform: translateY(-3px);
            filter: brightness(1.1);
            box-shadow: 0 15px 30px rgba(211, 47, 47, 0.3);
          }

          .profile-badge {
            text-align: center;
            margin-bottom: 25px;
          }

          .user-icon {
            background: #fff5f5;
            color: #d32f2f;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 35px;
            border: 2px solid #ff9f43;
            font-weight: bold;
          }
        `}</style>

        <div className="profile-card">
          <div className="profile-badge">
            <div className="user-icon">{this.state.txtName ? this.state.txtName.charAt(0).toUpperCase() : 'U'}</div>
          </div>
          
          <h2 className="profile-title">Thông Tin Cá Nhân</h2>

          <form className="profile-form" onSubmit={(e) => this.btnUpdateClick(e)}>
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input
                className="k-input"
                type="text"
                value={this.state.txtUsername}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input
                className="k-input"
                type="password"
                placeholder="Nhập mật khẩu mới..."
                value={this.state.txtPassword}
                onChange={(e) => this.setState({ txtPassword: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Họ và tên</label>
              <input
                className="k-input"
                type="text"
                value={this.state.txtName}
                onChange={(e) => this.setState({ txtName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                className="k-input"
                type="tel"
                value={this.state.txtPhone}
                onChange={(e) => this.setState({ txtPhone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email liên hệ</label>
              <input
                className="k-input"
                type="email"
                value={this.state.txtEmail}
                onChange={(e) => this.setState({ txtEmail: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-update">
              Cập Nhật Hồ Sơ 
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
      });
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;

    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const customer = {
        username: txtUsername,
        password: txtPassword,
        name: txtName,
        phone: txtPhone,
        email: txtEmail,
      };
      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      alert("Vui lòng không để trống bất kỳ thông tin nào!");
    }
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