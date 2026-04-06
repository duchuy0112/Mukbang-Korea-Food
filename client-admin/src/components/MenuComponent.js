import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

  componentDidUpdate() {
    if (window.location.pathname !== this.state.activePath) {
      this.setState({ activePath: window.location.pathname });
    }
  }

  render() {
    const currentPath = this.state.activePath;

    const menuItems = [
      { path: '/admin/home', label: 'Trang chủ', icon: '🏠' },
      { path: '/admin/order', label: 'Đơn hàng', icon: '🛒' },
      { path: '/admin/customer', label: 'Khách hàng', icon: '👥' },
      { path: '/admin/category', label: 'Danh mục', icon: '📁' },
      { path: '/admin/product', label: 'Sản phẩm', icon: '🍱' },
      { path: '/admin/revenue', label: 'Doanh thu', icon: '💰' },
    ];

    return (
      <div className="admin-sidebar" role="navigation" aria-label="Menu quản trị">
        <style>{`
          .admin-sidebar {
            width: 280px;
            background: #fff;
            border-right: 1px solid #f0f0f0;
            display: flex;
            flex-direction: column;
            padding: 30px 0;
            flex-shrink: 0;
          }

          .sidebar-brand {
            padding: 0 30px 40px;
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .brand-main {
            font-size: 24px;
            font-weight: 900;
            color: #b3261e;
            letter-spacing: -0.5px;
          }

          .brand-sub {
            font-size: 11px;
            font-weight: 800;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .sidebar-menu {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .menu-item-link {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 14px 30px;
            text-decoration: none;
            color: #666;
            font-weight: 700;
            font-size: 15px;
            transition: all 0.2s ease;
            position: relative;
          }

          .menu-item-link:hover {
            color: #b3261e;
            background: #fdf5f5;
          }

          .menu-item-link.active {
            color: #b3261e;
            background: #fdf5f5;
          }

          .menu-item-link.active::after {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #b3261e;
            border-radius: 4px 0 0 4px;
          }

          .sidebar-footer {
            padding: 20px 20px;
            margin-top: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            border-top: 1px solid #f0f0f0;
          }

          .btn-add-new {
            background: #b3261e;
            color: white;
            border: none;
            padding: 15px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: 0.3s;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(179, 38, 30, 0.2);
          }

          .btn-add-new:hover {
            background: #991f19;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(179, 38, 30, 0.3);
          }

          .secondary-nav {
             display: flex;
             flex-direction: column;
             gap: 2px;
             margin-top: 10px;
          }

          .sec-nav-link {
            padding: 10px 30px;
            color: #888;
            font-size: 14px;
            text-decoration: none;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .sec-nav-link:hover {
            color: #333;
          }
        `}</style>

        <div className="sidebar-brand">
          <div className="brand-main">Mukbang Admin</div>
          <div className="brand-sub">Hệ Thống Quản Trị</div>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`menu-item-link ${currentPath === item.path ? 'active' : ''}`}
                onClick={() => this.handleItemClick(item.path)}
              >
                <span style={{fontSize: '18px'}}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">

<div className="secondary-nav">
             <Link 
                to="/admin/home" 
                className="sec-nav-link"
                onClick={() => this.lnkLogoutClick()}
             >
                ↪️ Đăng xuất
             </Link>
          </div>
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