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
      { 
        path: '/admin/home', 
        label: 'Trang chủ', 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      },
      { 
        path: '/admin/order', 
        label: 'Đơn hàng', 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      },
      { 
        path: '/admin/customer', 
        label: 'Khách hàng', 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      },
      { 
        path: '/admin/category', 
        label: 'Danh mục', 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
      },
      { 
        path: '/admin/product', 
        label: 'Sản phẩm', 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3m18 0v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8m18 0-9 6-9-6"/></svg>
      },
      { 
        path: '/admin/revenue', 
        label: 'Doanh thu', 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      },
    ];

    return (
      <div className="admin-sidebar" role="navigation" aria-label="Menu quản trị">
        <style>{`
          .admin-sidebar {
            width: 270px;
            background: #fff;
            border-right: 1px solid #f2f2f2;
            display: flex;
            flex-direction: column;
            padding: 35px 0;
            flex-shrink: 0;
            box-shadow: 4px 0 15px rgba(0,0,0,0.01);
          }

          .sidebar-brand {
            padding: 0 32px 45px;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .brand-main {
            font-size: 26px;
            font-weight: 900;
            color: #b3261e;
            letter-spacing: -1px;
          }

          .brand-sub {
            font-size: 10px;
            font-weight: 800;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          .sidebar-menu {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .menu-item-link {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 11px 24px;
            text-decoration: none;
            color: #555;
            font-weight: 700;
            font-size: 14.5px;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            margin: 0 14px;
            border-radius: 12px;
          }

          .menu-icon-wrapper {
             width: 24px;
             height: 24px;
             display: flex;
             align-items: center;
             justify-content: center;
             flex-shrink: 0;
          }

          .menu-item-link:hover {
            color: #b3261e;
            background: #fff8f8;
          }

          .menu-item-link.active {
            color: #b3261e;
            background: #fdf2f2;
            box-shadow: 0 4px 12px rgba(179, 38, 30, 0.08);
          }

          .menu-item-link.active::after {
            content: '';
            position: absolute;
            left: -14px;
            top: 20%;
            bottom: 20%;
            width: 4px;
            background: #b3261e;
            border-radius: 0 4px 4px 0;
          }

          .sidebar-footer {
            padding: 25px 20px 0;
            margin-top: auto;
            border-top: 1px solid #f5f5f5;
          }

          .sec-nav-link {
            padding: 12px 24px;
            color: #888;
            font-size: 14px;
            text-decoration: none;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 15px;
            border-radius: 12px;
            transition: 0.3s;
          }

          .sec-nav-link:hover {
            background: #f8f8f8;
            color: #1a1a1a;
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
                <div className="menu-icon-wrapper">{item.icon}</div>
                <span className="menu-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <Link 
            to="/admin/home" 
            className="sec-nav-link"
            onClick={() => this.lnkLogoutClick()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
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