import axios from "axios";
import React, { Component } from "react";
import { Helmet } from 'react-helmet-async';
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "nhom2",
      txtPassword: "123",
    };
  }

  render() {
    return (
      <div className="korea-login-extreme">
        <Helmet>
          <title>Đăng Nhập | Mukbang Korea Food</title>
          <meta name="description" content="Đăng nhập vào tài khoản Mukbang Korea Food để đặt những món ăn Hàn Quốc yêu thích ngay hôm nay." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <style>{`
          .korea-login-extreme {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #fcebeb 0%, #fff5f5 100%);
            position: relative;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
          }

          /* Hào quang và hoa văn nền */
          .korea-login-extreme::before {
            content: '';
            position: absolute;
            width: 150%; height: 150%;
            background-image: url('');
            opacity: 0.1;
            animation: rotateBg 60s linear infinite;
          }

          @keyframes rotateBg { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

          .main-card {
            background: white;
            width: 950px;
            display: flex;
            border-radius: 50px;
            overflow: hidden;
            box-shadow: 0 30px 100px rgba(211, 47, 47, 0.25);
            border: 5px solid #d32f2f;
            position: relative;
            z-index: 2;
          }

          /* BÊN TRÁI: ẢNH TRÒN LẤP ĐẦY */
          .side-visual {
            flex: 1;
            background: linear-gradient(45deg, #d32f2f, #ff9f43);
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }

          .circle-frame {
            width: 380px;
            height: 380px;
            border-radius: 50%;
            border: 8px solid white;
            overflow: hidden;
            box-shadow: 0 0 40px rgba(0,0,0,0.3);
            background: white;
          }

          .circle-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover; /* Lấp đầy 100% không còn khúc thừa */
            display: block;
          }

          /* BÊN PHẢI: FORM CHÍNH GIỮA */
          .side-form {
            flex: 1;
            padding: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #fff;
          }

          .admin-header {
            color: #d32f2f;
            font-size: 35px;
            font-weight: 900;
            margin-bottom: 40px;
            text-transform: uppercase;
            text-align: center;
            letter-spacing: 2px;
            text-shadow: 2px 2px 0px #ff9f43;
          }

          /* BẢNG TRONG CHÍNH GIỮA */
          .login-table {
            width: 100%;
            border-spacing: 0 15px;
          }

          .login-table td {
            padding: 5px;
            font-weight: 800;
            color: #444;
            text-transform: uppercase;
            font-size: 14px;
          }

          .input-korea {
            width: 100%;
            padding: 15px 20px;
            border-radius: 15px;
            border: 3px solid #eee;
            font-size: 16px;
            font-weight: 700;
            transition: 0.3s;
            outline: none;
            box-sizing: border-box;
          }

          .input-korea:focus {
            border-color: #d32f2f;
            box-shadow: 0 0 15px rgba(211, 47, 47, 0.2);
          }

          .btn-submit-glow {
            width: 100%;
            padding: 18px;
            border: none;
            border-radius: 15px;
            background: linear-gradient(90deg, #d32f2f, #ff4d4d);
            color: white;
            font-size: 18px;
            font-weight: 900;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(211, 47, 47, 0.4);
            transition: 0.4s;
          }

          .btn-submit-glow:hover {
            transform: scale(1.05);
            background: linear-gradient(90deg, #ff4d4d, #ff9f43);
          }

          /* Icon trang trí Hàn Quốc */
          .k-deco {
            position: absolute;
            font-size: 100px;
            opacity: 0.07;
            color: #d32f2f;
            z-index: -1;
          }
          .k-top { top: 10px; right: 10px; }
          .k-bot { bottom: 10px; left: 10px; }
        `}</style>

        <div className="main-card">
          {/* TRÁI: ẢNH TRÒN ĐẦY ĐẶN */}
          <div className="side-visual">
            <div className="circle-frame">
              <img
                src="/images/login_new.jpg"
                alt="Korea Food"
              />
            </div>
          </div>

          {/* PHẢI: FORM CÂN ĐỐI */}
          <div className="side-form">
            <h1 className="admin-header">MUKBANG KOREA FOOD</h1>

            <form style={{ width: '100%' }}>
              <table className="login-table">
                <tbody>
                  <tr>
                    <td>Tài khoản</td>
                    <td>
                      <input
                        type="text"
                        className="input-korea"
                        value={this.state.txtUsername}
                        onChange={(e) => this.setState({ txtUsername: e.target.value })}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Mật khẩu</td>
                    <td>
                      <input
                        type="password"
                        className="input-korea"
                        value={this.state.txtPassword}
                        onChange={(e) => this.setState({ txtPassword: e.target.value })}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <button
                        className="btn-submit-glow"
                        onClick={(e) => this.btnLoginClick(e)}
                      >
                        Xác nhận đăng nhập
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>

          {/* Icon ẩn hiện tăng độ xịn */}
          <div className="k-deco k-top">🇰🇷</div>
          <div className="k-deco k-bot">🥢</div>
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