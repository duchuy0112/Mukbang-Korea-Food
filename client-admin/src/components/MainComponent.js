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
            .admin-layout-wrapper {
              display: flex;
              min-height: 100vh;
              background: #fdfaf7;
              font-family: 'Inter', sans-serif;
            }
            .admin-main-view {
              flex: 1;
              padding: 0 40px 40px;
              max-height: 100vh;
              overflow-y: auto;
            }
            .admin-top-bar {
              height: 80px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: transparent;
              margin-bottom: 20px;
              position: sticky;
              top: 0;
              z-index: 100;
            }
            .admin-search-box {
              background: #fff;
              border-radius: 50px;
              padding: 12px 28px;
              display: flex;
              align-items: center;
              width: 450px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08); /* Tăng đổ bóng */
              border: 1.5px solid #eee; /* Đường viền rõ ràng hơn */
              transition: all 0.3s ease;
            }
            .admin-search-box:focus-within {
              border-color: #d32f2f;
              box-shadow: 0 10px 30px rgba(211,47,47,0.12);
              width: 480px;
              background: #fff;
            }
            .admin-search-box input {
              border: none;
              outline: none;
              margin-left: 12px;
              width: 100%;
              font-size: 15px;
              font-weight: 600;
              color: #1a1a1a;
            }
            .admin-top-actions {
              display: flex;
              align-items: center;
              gap: 25px;
            }
            .admin-profile-mini {
              display: flex;
              align-items: center;
              gap: 15px;
              background: #fff;
              padding: 6px 25px 6px 6px;
              border-radius: 50px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.05);
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              border: 1px solid #f5f5f5;
            }
            .admin-profile-mini:hover {
              background: #fffafa;
              transform: translateY(-3px) scale(1.02);
              box-shadow: 0 15px 35px rgba(211,47,47,0.1);
              border-color: #fecaca;
            }
            .avatar-circle {
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: linear-gradient(135deg, #eee 0%, #ddd 100%);
              overflow: hidden;
              border: 2px solid #fff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
          `}</style>

          <Menu />

          <div className="admin-main-view">
            <div className="admin-top-bar">
              <div className="admin-search-box">
                <span style={{color: '#999'}}>🔍</span>
                <input type="text" placeholder="Tìm đơn hàng, khách hàng..." />
              </div>

              <div className="admin-top-actions">
                <div className="admin-profile-mini">
                  <div className="avatar-circle">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=d32f2f&color=fff" alt="Admin" style={{width:'100%'}} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: '1.4' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a' }}>Hồ sơ quản trị</div>
                    <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Quản lý cao cấp</div>
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