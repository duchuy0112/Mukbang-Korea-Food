import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
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
            background-color: transparent;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 250px;
            flex-shrink: 0;
          }

          .right-actions {
            display: flex;
            align-items: center;
            gap: 24px;
          }

          .icon-link {
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: #444;
            transition: 0.2s;
            position: relative;
          }

          .icon-link:hover {
            color: #cc2b2b;
          }

          .icon-link svg {
            width: 18px;
            height: 18px;
          }
            
          /* Hide all old text links to keep minimalist UI */
          .auth-links, .user-info {
             display: none;
          }
        `}</style>

        <div className="right-actions">
          {/* Cart Icon */}
          <NavLink className="icon-link" to='/mycart' aria-label="Giỏ hàng" onClick={() => window.scrollTo(0, 0)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </NavLink>

          {/* User Icon & Logout (if logged in) */}
          {this.context.token === '' ? (
            <NavLink className="icon-link" to='/login' aria-label="Đăng nhập" onClick={() => window.scrollTo(0, 0)}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </NavLink>
          ) : (
            <>
              <NavLink className="icon-link" to='/myprofile' aria-label="Hồ sơ" onClick={() => window.scrollTo(0, 0)}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: '#cc2b2b' }}>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </NavLink>
              
              <Link className="icon-link" to='/home' aria-label="Đăng xuất" onClick={() => { this.lnkLogoutClick(); window.scrollTo(0, 0); }} title="Đăng xuất">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width: '16px', height: '16px'}}>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Inform;