import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Menu extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      // Dùng state để ép Menu render lại khi click
      activePath: window.location.pathname
    };
  }

  // Cập nhật lại state khi người dùng nhấn vào các mục menu
  handleItemClick(path) {
    this.setState({ activePath: path });
  }

  // 👉 THÊM MỚI: tự cập nhật khi URL thay đổi (fix lỗi không active đúng)
  componentDidUpdate(prevProps, prevState) {
    if (window.location.pathname !== this.state.activePath) {
      this.setState({ activePath: window.location.pathname });
    }
  }

  render() {
    // Ưu tiên lấy đường dẫn từ state để hiển thị màu ngay lập tức
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
            font-weight: 900;
            font-size: 18px;
            color: #d32f2f;
            display: flex;
            align-items: center;
            gap: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            min-width: 250px;
          }

          .logo-admin span {
            background: #d32f2f;
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 14px;
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
            gap: 12px;
          }

          li.menu {
            position: relative;
          }

          li.menu a {
            text-decoration: none;
            color: #555;
            font-weight: 700;
            font-size: 13px;
            padding: 10px 22px;
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            display: block;
          }

          li.menu a.active-link {
            background: linear-gradient(135deg, #ff9f43 0%, #d32f2f 100%);
            color: white !important;
            box-shadow: 0 6px 15px rgba(211, 47, 47, 0.3);
            transform: translateY(-2px);
          }

          li.menu a:hover:not(.active-link) {
            color: #d32f2f;
            background: #fff5f5;
            transform: translateY(-1px);
          }

          .user-profile-section {
            display: flex;
            align-items: center;
            background: #fffaf5;
            padding: 6px 15px;
            border-radius: 15px;
            border: 1px solid #ffe8d6;
            gap: 15px;
          }

          .user-greeting {
            font-size: 13px;
            color: #444;
          }

          .user-name-highlight {
            color: #d32f2f;
            font-weight: 800;
            text-decoration: underline;
            text-underline-offset: 4px;
          }

          .logout-btn {
            text-decoration: none;
            color: white;
            background: #333;
            padding: 8px 15px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 800;
            transition: 0.3s;
            text-transform: uppercase;
          }

          .logout-btn:hover {
            background: #d32f2f;
            box-shadow: 0 4px 10px rgba(211, 47, 47, 0.2);
          }
        `}</style>

        <div className="logo-admin">
          <span>K-FOOD</span> KOREA FOOD ADMIN
        </div>

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
          <span className="user-greeting">
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