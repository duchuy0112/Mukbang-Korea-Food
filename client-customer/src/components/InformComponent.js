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
            background-color: #fff;
            padding: 0 50px;
            color: #333;
            font-family: 'Inter', sans-serif;
            border-bottom: 1px solid #f0f0f0;
            position: relative;
            z-index: 9998;
          }

          .inform-wrapper {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 36px;
          }

          .inform-link {
            text-decoration: none;
            color: #666;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            transition: 0.3s;
            padding: 8px 16px;
            border-radius: 50px;
            letter-spacing: 1px;
          }

          .inform-link.active {
            color: #fff !important;
            background: var(--accent-gradient);
            box-shadow: 0 5px 15px rgba(211, 47, 47, 0.2);
          }

          .inform-link:hover:not(.active) {
            color: var(--primary-red);
            background: #fafafa;
          }

          .divider { color: #eee; margin: 0 5px; }

          .auth-links, .user-info {
            display: flex;
            align-items: center;
          }

          .cart-section {
            background: #1a1a1a;
            border-radius: 50px;
            padding: 3px 5px;
            display: flex;
            align-items: center;
          }

          .cart-status {
            font-size: 10px;
            font-weight: 800;
            color: #fff !important;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 0 10px;
            height: 28px;
            text-decoration: none;
          }

          .cart-count {
            background: var(--primary-red);
            color: #fff;
            padding: 1px 8px;
            border-radius: 50px;
            min-width: 24px;
            text-align: center;
            font-size: 11px;
          }

          .user-name {
            color: var(--primary-red);
            font-weight: 900;
            margin: 0 5px;
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