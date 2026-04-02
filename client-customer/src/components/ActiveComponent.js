import axios from "axios";
import React, { Component } from "react";

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: "",
      txtToken: "",
    };
  }

  render() {
    return (
      <div className="korea-active-container">
        <style>{`
          .korea-active-container {
            padding: 80px 20px;
            min-height: 70vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
            font-family: 'Inter', sans-serif;
          }

          .active-card {
            background: white;
            padding: 45px;
            border-radius: 30px;
            box-shadow: 0 20px 50px rgba(211, 47, 47, 0.1);
            border: 2px solid #ff9f43;
            width: 100%;
            max-width: 450px;
            position: relative;
          }

          .active-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 8px;
            background: linear-gradient(90deg, #d32f2f, #ff9f43, #d32f2f);
            border-radius: 30px 30px 0 0;
          }

          .active-title {
            color: #d32f2f;
            text-align: center;
            font-weight: 900;
            font-size: 26px;
            margin-bottom: 35px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }

          .form-group {
            margin-bottom: 25px;
          }

          .form-group label {
            display: block;
            margin-bottom: 10px;
            font-weight: 800;
            color: #444;
            font-size: 13px;
            text-transform: uppercase;
          }

          .k-input {
            width: 100%;
            padding: 14px 20px;
            border: 2px solid #eee;
            border-radius: 15px;
            font-size: 16px;
            font-weight: 600;
            transition: 0.3s;
            outline: none;
            box-sizing: border-box;
            background: #fdfdfd;
          }

          .k-input:focus {
            border-color: #ff9f43;
            box-shadow: 0 0 15px rgba(255, 159, 67, 0.2);
            background: #fff;
          }

          .btn-active {
            width: 100%;
            padding: 16px;
            margin-top: 15px;
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

          .btn-active:hover {
            transform: translateY(-3px);
            filter: brightness(1.1);
            box-shadow: 0 15px 30px rgba(211, 47, 47, 0.3);
          }

          .active-info {
            text-align: center;
            margin-top: 25px;
            font-size: 13px;
            color: #888;
            line-height: 1.6;
          }
        `}</style>

        <div className="active-card">
          <h2 className="active-title">Kích Hoạt Tài Khoản</h2>

          <form onSubmit={(e) => this.btnActiveClick(e)}>
            <div className="form-group">
              <label>Mã định danh (ID)</label>
              <input
                className="k-input"
                type="text"
                placeholder="Nhập mã ID từ email..."
                value={this.state.txtID}
                onChange={(e) => {
                  this.setState({ txtID: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
              <label>Mã xác thực (Token)</label>
              <input
                className="k-input"
                type="text"
                placeholder="Nhập token xác thực..."
                value={this.state.txtToken}
                onChange={(e) => {
                  this.setState({ txtToken: e.target.value });
                }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-active"
            >
              Kích Hoạt Ngay
            </button>
          </form>

          <p className="active-info">
            Vui lòng kiểm tra hòm thư Email (bao gồm cả thư rác) để lấy mã kích hoạt.
          </p>
        </div>
      </div>
    );
  }

  btnActiveClick(e) {
    e.preventDefault();

    const id = this.state.txtID;
    const token = this.state.txtToken;

    if (id && token) {
      this.apiActive(id, token);
    } else {
      alert("Vui lòng nhập đầy đủ ID và Token!");
    }
  }

  apiActive(id, token) {
    const body = { id: id, token: token };

    axios.post("/api/customer/active", body).then((res) => {
      const result = res.data;

      if (result) {
        alert("XÁC THỰC THÀNH CÔNG! Chào mừng bạn gia nhập gia đình Korea Food.");
      } else {
        alert("XÁC THỰC THẤT BẠI! Vui lòng kiểm tra lại mã ID hoặc Token.");
      }
    });
  }
}

export default Active;