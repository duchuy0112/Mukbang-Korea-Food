import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

// Dùng functional component + useLocation để luôn sync đúng active path
function Menu() {
  const context = React.useContext(MyContext);
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      path: '/admin/home',
      label: 'Trang chủ',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    },
    {
      path: '/admin/order',
      label: 'Đơn hàng',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
    },
    {
      path: '/admin/customer',
      label: 'Khách hàng',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    },
    {
      path: '/admin/category',
      label: 'Danh mục',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
    },
    {
      path: '/admin/product',
      label: 'Sản phẩm',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3m18 0v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8m18 0-9 6-9-6" /></svg>
    },
    {
      path: '/admin/revenue',
      label: 'Doanh thu',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
    },
  ];

  function handleLogout() {
    context.setToken('');
    context.setUsername('');
  }

  return (
    <div className="admin-sidebar" role="navigation" aria-label="Menu quản trị">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .admin-sidebar {
          width: 260px;
          background: #fff;
          border-right: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          padding: 0;
          flex-shrink: 0;
          box-shadow: 4px 0 20px rgba(0,0,0,0.02);
          height: 100vh;
          position: sticky;
          top: 0;
          font-family: 'Inter', sans-serif;
        }

        .sidebar-brand {
          padding: 24px 22px 22px;
          display: flex;
          align-items: center;
          gap: 13px;
          border-bottom: 1px solid #f5f5f5;
        }

        .brand-logo {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(198,40,40,0.2);
        }

        .brand-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand-main {
          font-size: 17px;
          font-weight: 900;
          color: #1a1a1a;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .brand-sub {
          font-size: 10px;
          font-weight: 700;
          color: #bbb;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .sidebar-menu {
          list-style: none;
          padding: 14px 0;
          margin: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .menu-item-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 20px;
          text-decoration: none;
          color: #777;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.2s ease;
          position: relative;
          margin: 0 12px;
          border-radius: 12px;
        }

        .menu-icon-wrapper {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .menu-item-link:hover {
          color: #c62828;
          background: #fff5f5;
        }

        .menu-item-link.active {
          color: #fff !important;
          background: linear-gradient(135deg, #c62828 0%, #e53935 100%);
          box-shadow: 0 6px 18px rgba(198,40,40,0.28);
        }

        .menu-item-link.active svg {
          stroke: #fff;
        }

        .menu-item-link.active:hover {
          color: #fff;
          background: linear-gradient(135deg, #b71c1c 0%, #c62828 100%);
        }

        .sidebar-footer {
          padding: 12px 12px 18px;
          border-top: 1px solid #f5f5f5;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sec-nav-link {
          padding: 10px 20px;
          color: #999;
          font-size: 13px;
          text-decoration: none;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 11px;
          border-radius: 12px;
          transition: 0.2s;
          cursor: pointer;
          border: none;
          background: none;
          font-family: 'Inter', sans-serif;
        }

        .sec-nav-link:hover {
          background: #f8f8f8;
          color: #333;
        }

        .sec-nav-link.download-btn {
          background: #fff5f5;
          color: #c62828;
          border: 1.5px solid #fee2e2;
          margin: 0 0 4px;
          justify-content: center;
          font-size: 13px;
        }

        .sec-nav-link.download-btn:hover {
          background: linear-gradient(135deg, #c62828 0%, #d32f2f 100%);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(198,40,40,0.25);
        }

        .sec-nav-link.logout-link {
          color: #f44336;
        }

        .sec-nav-link.logout-link:hover {
          background: #ffebee;
          color: #c62828;
        }
      `}</style>

      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <img
            src="https://ui-avatars.com/api/?name=MK&background=c62828&color=fff&bold=true&size=96"
            alt="Mukbang Korea Logo"
          />
        </div>
        <div className="brand-text">
          <div className="brand-main">Mukbang Korea</div>
          <div className="brand-sub">ADMIN</div>
        </div>
      </div>

      {/* MENU ITEMS */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`menu-item-link ${currentPath === item.path || currentPath.startsWith(item.path + '/') ? 'active' : ''}`}
            >
              <div className="menu-icon-wrapper">{item.icon}</div>
              <span className="menu-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <a href="#" className="sec-nav-link download-btn" onClick={(e) => e.preventDefault()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Tải báo cáo
        </a>

        <a href="#" className="sec-nav-link" onClick={(e) => e.preventDefault()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          Trung tâm hỗ trợ
        </a>

        <Link
          to="/admin/home"
          className="sec-nav-link logout-link"
          onClick={handleLogout}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Đăng xuất
        </Link>
      </div>
    </div>
  );
}

export default Menu;