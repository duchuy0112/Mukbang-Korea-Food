import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom'; // Dùng NavLink để giữ màu nút đang chọn
import MyContext from '../contexts/MyContext';

class Inform extends Component {
  static contextType = MyContext;

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }

  render() {
    return (
      <div className="korea-inform-luxury">
        <style>{`
          .korea-inform-luxury {
            background-color: #f8f9fa;
            background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
            padding: 5px 60px;
            color: #333;
            font-family: 'Inter', sans-serif;
            border-bottom: 2px solid #ff9f43;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            position: relative;
            z-index: 9998;
          }

          .inform-wrapper {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
          }

          /* STYLE CHO CÁC NÚT THÔNG TIN */
          .inform-link {
            text-decoration: none;
            color: #444;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            transition: 0.3s;
            padding: 6px 14px;
            border-radius: 8px;
            letter-spacing: 0.5px;
            display: inline-block;
          }

          /* TÍNH NĂNG GIỮ MÀU KHI ĐANG Ở TRANG ĐÓ (ACTIVE) */
          .inform-link.active {
            color: #fff !important;
            background: linear-gradient(135deg, #d32f2f 0%, #ff8c00 100%) !important;
            box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
          }

          .inform-link:hover:not(.active) {
            color: #d32f2f;
            background: rgba(211, 47, 47, 0.08);
          }

          .divider {
            color: #ddd;
            margin: 0 2px;
          }

          /* GIỎ HÀNG NỔI BẬT */
          .cart-section {
            background: #fff;
            padding: 2px 5px;
            border-radius: 50px;
            border: 1.5px solid #ff9f43;
          }

          .cart-status {
            font-size: 11px;
            font-weight: 900;
            color: #d32f2f !important;
          }

          .cart-count {
            color: #fff;
            background: linear-gradient(135deg, #d32f2f 0%, #ff8c00 100%);
            padding: 2px 10px;
            border-radius: 20px;
            margin-left: 5px;
            display: inline-block;
            animation: pulseGlow 2s infinite;
            border: 1px solid #fff;
          }

          @keyframes pulseGlow {
            0% { transform: scale(1); box-shadow: 0 0 0px rgba(211, 47, 47, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 10px rgba(211, 47, 47, 0.6); }
            100% { transform: scale(1); box-shadow: 0 0 0px rgba(211, 47, 47, 0.4); }
          }

          .user-name {
            color: #d32f2f;
            text-transform: uppercase;
            font-weight: 900;
            margin-left: 5px;
          }
        `}</style>

        <div className="inform-wrapper">
          <div className="auth-section">
            {this.context.token === '' ? (
              <div className="auth-links">
                {/* Dùng NavLink để tự động bắt trạng thái Active */}
                <NavLink className="inform-link" to='/login'>Đăng nhập</NavLink>
                <span className="divider">|</span>
                <NavLink className="inform-link" to='/signup'>Đăng ký</NavLink>
                <span className="divider">|</span>
                <NavLink className="inform-link" to='/active'>Kích hoạt</NavLink>
              </div>
            ) : (
              <div className="user-info">
                <span className="inform-link" style={{cursor: 'default', background: 'none'}}>
                  Xin chào, <span className="user-name">{this.context.customer.name}</span>
                </span>
                <span className="divider">|</span>
                {/* Logout dùng Link vì nó thực hiện hành động xóa session, không cần giữ màu */}
                <Link className="inform-link" to='/home' onClick={() => this.lnkLogoutClick()}>Đăng xuất</Link>
                <span className="divider">|</span>
                <NavLink className="inform-link" to='/myprofile'>Hồ sơ của tôi</NavLink>
                <span className="divider">|</span>
                <NavLink className="inform-link" to='/myorders'>Đơn hàng đã đặt</NavLink>
              </div>
            )}
          </div>

          <div className="cart-section">
            <NavLink className="inform-link cart-status" to='/mycart'>
              GIỎ HÀNG CỦA BẠN <span className="cart-count">{this.context.mycart.length}</span>
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}

export default Inform;