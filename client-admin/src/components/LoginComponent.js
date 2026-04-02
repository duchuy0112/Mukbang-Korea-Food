import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }

  render() {
    if (this.context.token === '') {
      return (
        <div className="login-page">
          <style>{`
            .login-page {
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              background: linear-gradient(135deg, #ff4d4d 0%, #f9ca24 100%);
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            .login-wrapper {
              display: flex;
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.3);
              overflow: hidden;
              width: 90%;
              max-width: 1000px; /* Độ rộng lớn hơn để chứa cả ảnh */
              min-height: 550px;
            }
            /* KHU VỰC DÀNH CHO ẢNH CỬA HÀNG */
            .login-image-section {
              flex: 1;
              background-color: #f8f9fa;
              display: flex;
              justify-content: center;
              align-items: center;
              border-right: 1px solid #eee;
              position: relative;
              background-image: url('${process.env.PUBLIC_URL}/images/login_new.jpg');
              background-size: cover;
              background-position: center;
            }
            .login-image-section::before {
                content: ""; /* Text này sẽ mất khi bạn dán link ảnh */
                color: #ccc;
                font-size: 24px;
                font-weight: bold;
                z-index: 0;
            }
            /* KHU VỰC FORM LOGIN */
            .login-form-section {
              flex: 1;
              padding: 50px;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .login-form-section h2 {
              color: #d32f2f;
              margin-bottom: 35px;
              font-size: 32px; /* Chữ tiêu đề to hơn */
              font-weight: 800;
              text-align: center;
              text-transform: uppercase;
            }
            .form-group {
              margin-bottom: 25px;
            }
            .form-group label {
              display: block;
              margin-bottom: 10px;
              color: #333;
              font-weight: 700;
              font-size: 18px; /* Label to rõ */
            }
            .form-group input {
              width: 100%;
              padding: 18px; /* Ô input cao ráo */
              border: 2px solid #ddd;
              border-radius: 12px;
              outline: none;
              font-size: 18px; /* Chữ gõ vào rất to */
              transition: all 0.3s;
              box-sizing: border-box;
            }
            .form-group input:focus {
              border-color: #ff4d4d;
              box-shadow: 0 0 10px rgba(255, 77, 77, 0.2);
            }
            .btn-login {
              width: 100%;
              padding: 18px;
              background: linear-gradient(to right, #ff4d4d, #eb4d4b);
              color: white;
              border: none;
              border-radius: 12px;
              font-weight: 800;
              cursor: pointer;
              font-size: 20px; /* Chữ trên nút to */
              transition: all 0.3s;
              margin-top: 15px;
            }
            .btn-login:hover {
              transform: scale(1.02);
              box-shadow: 0 8px 20px rgba(235, 77, 75, 0.4);
            }
          `}</style>

          <div className="login-wrapper">
            {/* Phía bên trái để dán ảnh */}
            <div className="login-image-section">
              {/* Bạn có thể chèn thẻ img vào đây hoặc dùng background-image trong CSS */}

            </div>

            {/* Phía bên phải là Form */}
            <div className="login-form-section">
              <h2>ADMIN KOREA FOOD</h2>
              <form onSubmit={(e) => this.btnLoginClick(e)}>
                <div className="form-group">
                  <label>Tài khoản</label>
                  <input
                    type="text"
                    placeholder="Username của bạn..."
                    value={this.state.txtUsername}
                    onChange={(e) => this.setState({ txtUsername: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Password của bạn..."
                    value={this.state.txtPassword}
                    onChange={(e) => this.setState({ txtPassword: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-login">
                  XÁC NHẬN ĐĂNG NHẬP
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
    return <div />;
  }

  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;

    if (username && password) {
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      alert('Vui lòng nhập đầy đủ Username và Password!');
    }
  }

  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        alert(result.message);
      }
    });
  }
}

export default Login;
