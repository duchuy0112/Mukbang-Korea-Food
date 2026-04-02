import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Menu extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      activePath: window.location.pathname
    };
  }

  handleItemClick(path) {
    this.setState({ activePath: path });
  }

  componentDidUpdate(prevProps, prevState) {
    // Sửa lỗi vòng lặp vô hạn
    if (window.location.pathname !== this.state.activePath) {
      this.setState({ activePath: window.location.pathname });
    }
  }

  render() {
    const currentPath = this.state.activePath;

    const menuItems = [
      { path: '/admin/home', label: 'Trang Chủ' },
      { path: '/admin/order', label: 'Đơn Hàng' },
      { path: '/admin/customer', label: 'Khách Hàng' },
      { path: '/admin/category', label: 'Danh Mục' },
      { path: '/admin/product', label: 'Sản Phẩm' },
      { path: '/admin/revenue', label: 'Doanh Thu' },
    ];

    return (
      <div className="admin-navbar-premium">
        <style>{`
          .admin-navbar-premium {
            background: #ffffff;
            padding: 0 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 75px;
            box-shadow: 0 4px 25px rgba(211, 47, 47, 0.1);
            position: sticky;
            top: 0;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            border-bottom: 3px solid #ff9f43;
          }

          .logo-admin {
            font-weight: 900; /* Cực đậm cho Logo */
            font-size: 20px;
            color: #d32f2f;
            display: flex;
            align-items: center;
            gap: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-decoration: none;
          }

          .menu-wrapper {
            display: flex;
            align-items: center;
            height: 100%;
            flex-grow: 1;
            justify-content: center;
          }

          ul.menu {
            list-style: none;
            display: flex;
            margin: 0;
            padding: 0;
            gap: 8px;
          }

          li.menu a {
            text-decoration: none;
            color: #333;
            font-weight: 800; /* Tăng độ đậm cho chữ Menu */
            font-size: 14px;
            padding: 10px 20px;
            border-radius: 10px;
            transition: all 0.2s ease;
            text-transform: uppercase;
          }

          li.menu a.active-link {
            background: linear-gradient(135deg, #ff9f43 0%, #d32f2f 100%);
            color: white !important;
            box-shadow: 0 5px 12px rgba(211, 47, 47, 0.3);
          }

          li.menu a:hover:not(.active-link) {
            color: #d32f2f;
            background: #fff0f0;
          }

          .user-profile-section {
            display: flex;
            align-items: center;
            background: #fff5ee;
            padding: 8px 18px;
            border-radius: 12px;
            border: 1px solid #ffd8b1;
            gap: 15px;
          }

          .user-name-highlight {
            color: #d32f2f;
            font-weight: 900; /* In đậm tên quản trị viên */
            text-decoration: underline;
          }

          .logout-btn {
            text-decoration: none;
            color: white;
            background: #222;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 900; /* In đậm nút đăng xuất */
            text-transform: uppercase;
            transition: 0.3s;
          }

          .logout-btn:hover {
            background: #d32f2f;
          }
          
          .nav-logo-text { font-weight: 900; line-height: 1; }
          .nav-logo-sub { font-size: 11px; font-weight: 700; color: #666; }
        `}</style>

        <NavLink to="/admin/home" className="logo-admin">
          <span style={{ fontSize: '27px' }}>🍜</span>
          <div>
            <div className="nav-logo-text">KOREA FOOD</div>
            <div className="nav-logo-sub">MUKBANG FOR ADMIN</div>
          </div>
        </NavLink>

        <div className="menu-wrapper">
          <ul className="menu">
            {menuItems.map((item) => (
              <li className="menu" key={item.path}>
                <Link
                  to={item.path}
                  className={currentPath === item.path ? 'active-link' : ''}
                  onClick={() => this.handleItemClick(item.path)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="user-profile-section">
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            Quản trị: <b className="user-name-highlight">{this.context.username}</b>
          </span>
          <Link
            className="logout-btn"
            to="/admin/home"
            onClick={() => {
              this.lnkLogoutClick();
              this.handleItemClick('/admin/home');
            }}
          >
            Đăng xuất
          </Link>
        </div>
      </div>
    );
  }

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}

export default Menu;