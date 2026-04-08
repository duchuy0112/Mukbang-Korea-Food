import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import { Routes, Route, Navigate } from 'react-router-dom';
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';
import RevenueReport from './RevenueReportComponent';

class Main extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    if (this.context.token !== '') {
      return (
        <div className="admin-layout-wrapper">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

            .admin-layout-wrapper {
              display: flex;
              min-height: 100vh;
              background: #fdfaf7;
              font-family: 'Inter', sans-serif;
            }
            .admin-main-view {
              flex: 1;
              padding: 0 36px 40px;
              max-height: 100vh;
              overflow-y: auto;
            }

            /* Scrollbar styling */
            .admin-main-view::-webkit-scrollbar {
              width: 6px;
            }
            .admin-main-view::-webkit-scrollbar-track {
              background: transparent;
            }
            .admin-main-view::-webkit-scrollbar-thumb {
              background: #ddd;
              border-radius: 10px;
            }
            .admin-main-view::-webkit-scrollbar-thumb:hover {
              background: #bbb;
            }

            .admin-top-bar {
              height: 78px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: transparent;
              margin-bottom: 10px;
              position: sticky;
              top: 0;
              z-index: 100;
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              background: rgba(253, 250, 247, 0.85);
            }

            .admin-search-box {
              background: #fff;
              border-radius: 14px;
              padding: 11px 24px;
              display: flex;
              align-items: center;
              width: 380px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.04);
              border: 1.5px solid #eee;
              transition: all 0.3s ease;
            }
            .admin-search-box:focus-within {
              border-color: #d32f2f;
              box-shadow: 0 8px 25px rgba(211,47,47,0.08);
              width: 420px;
            }
            .admin-search-box input {
              border: none;
              outline: none;
              margin-left: 10px;
              width: 100%;
              font-size: 14px;
              font-weight: 600;
              color: #1a1a1a;
              background: transparent;
            }
            .admin-search-box input::placeholder {
              color: #bbb;
              font-weight: 500;
            }
            .admin-search-icon {
              color: #bbb;
              flex-shrink: 0;
            }

            .admin-top-actions {
              display: flex;
              align-items: center;
              gap: 16px;
            }

            .admin-top-icon-btn {
              width: 42px;
              height: 42px;
              border-radius: 12px;
              background: #fff;
              border: 1.5px solid #f0f0f0;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.25s;
              position: relative;
              color: #888;
            }

            .admin-top-icon-btn:hover {
              background: #fff5f5;
              border-color: #fecaca;
              color: #c62828;
              transform: translateY(-2px);
              box-shadow: 0 6px 15px rgba(198,40,40,0.08);
            }

            .admin-notif-dot {
              position: absolute;
              top: 8px;
              right: 8px;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #c62828;
              border: 2px solid #fff;
            }

            .admin-profile-mini {
              display: flex;
              align-items: center;
              gap: 14px;
              background: linear-gradient(135deg, #c62828 0%, #d32f2f 100%);
              padding: 6px 20px 6px 6px;
              border-radius: 14px;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: 0 6px 20px rgba(198,40,40,0.2);
            }
            .admin-profile-mini:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 30px rgba(198,40,40,0.3);
            }
            .avatar-circle {
              width: 40px;
              height: 40px;
              border-radius: 10px;
              overflow: hidden;
              border: 2px solid rgba(255,255,255,0.3);
            }
            .avatar-circle img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .profile-info {
              display: flex;
              flex-direction: column;
              justify-content: center;
              line-height: 1.3;
            }
            .profile-name {
              font-size: 13px;
              font-weight: 800;
              color: #fff;
            }
            .profile-role {
              font-size: 9px;
              color: rgba(255,255,255,0.75);
              text-transform: uppercase;
              font-weight: 700;
              letter-spacing: 0.5px;
            }
          `}</style>

          <Menu />

          <div className="admin-main-view">
            <div className="admin-top-bar">
              <div className="admin-search-box">
                <svg className="admin-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Tìm kiếm đơn hàng, khách hàng, hoặc mã ID..." />
              </div>

              <div className="admin-top-actions">
                <div className="admin-profile-mini">
                  <div className="avatar-circle">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=fff&color=c62828&bold=true" alt="Admin" />
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">Hồ sơ Admin</div>
                    <div className="profile-role">Quản trị viên cấp cao</div>
                  </div>
                </div>
              </div>
            </div>

            <Routes>
              <Route path="/admin" element={<Navigate replace to="/admin/home" />} />
              <Route path="/admin/home" element={<Home />} />
              <Route path='/admin/category' element={<Category />} />
              <Route path='/admin/product' element={<Product />} />
              <Route path='/admin/order' element={<Order />} />
              <Route path='/admin/customer' element={<Customer />} />
              <Route path='/admin/revenue' element={<RevenueReport />} />
            </Routes>
          </div>
        </div>
      );
    }

    return <div />;
  }
}

export default Main;