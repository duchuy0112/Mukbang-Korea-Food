import axios from 'axios';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import withRouter from '../utils/withRouter';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtKeyword: ''
    };
  }

  btnSearchClick(e) {
    e.preventDefault();
    if (this.state.txtKeyword.trim()) {
      this.props.navigate('/product/search/' + this.state.txtKeyword);
    }
  }

  render() {
    return (
      <nav className="k-nav-main" role="navigation" aria-label="Menu chính">
        <style>{`
          .k-nav-main {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(15px);
            padding: 0 50px;
            height: 68px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #f0f0f0;
            gap: 30px;
            z-index: 2000;
          }

          /* ===== LOGO ===== */
          .nav-logo { display: flex; align-items: center; gap: 15px; text-decoration: none; flex-shrink: 0; }
          .nav-logo-icon { font-size: 36px; filter: drop-shadow(0 4px 10px rgba(211, 47, 47, 0.2)); }
          .nav-logo-text { font-size: 20px; font-weight: 900; color: #1a1a1a; letter-spacing: -0.5px; }
          .nav-logo-sub { font-size: 11px; font-weight: 800; color: var(--primary-red); text-transform: uppercase; letter-spacing: 2.5px; margin-top: -2px; }

          /* ===== MENU LINKS ===== */
          .nav-menu-list { display: flex; list-style: none; margin: 0; padding: 0; gap: 8px; align-items: center; }
          .menu-item a {
            text-decoration: none; color: #555; font-weight: 700; font-size: 15px;
            padding: 12px 22px; border-radius: 50px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex; align-items: center; gap: 10px;
          }
          .menu-item a:hover:not(.active) { background: #fafafa; color: var(--primary-red); transform: translateY(-2px); }
          .menu-item a.active { color: #fff; background: var(--accent-gradient); box-shadow: 0 10px 25px rgba(211, 47, 47, 0.3); }

          /* ===== SEARCH ===== */
          .nav-search-form {
            display: flex; background: #f5f5f5; border-radius: 50px; padding: 5px 5px 5px 25px;
            transition: 0.4s; flex: 1; max-width: 320px; border: 1.5px solid transparent;
          }
          .nav-search-form:focus-within { background: #fff; border-color: var(--primary-orange); box-shadow: 0 10px 30px rgba(255, 109, 0, 0.08); max-width: 350px; }
          .nav-search-input { border: none; background: transparent; padding: 8px 12px; outline: none; font-weight: 600; font-size: 14px; color: #1a1a1a; flex: 1; }
          .nav-search-btn { background: none; border: none; padding: 8px 15px; font-size: 20px; cursor: pointer; transition: 0.3s; opacity: 0.6; }
          .nav-search-btn:hover { color: var(--primary-red); transform: scale(1.15); opacity: 1; }

          @media (max-width: 768px) {
            .k-nav-main { padding: 0 20px; }
            .nav-menu-list { display: none; }
          }
        `}</style>

        {/* LOGO */}
        <NavLink to="/home" className="nav-logo" aria-label="Về trang chủ Mukbang Korea Food" onClick={() => window.scrollTo(0, 0)}>
          <span className="nav-logo-icon" role="img" aria-hidden="true">🍜</span>
          <div>
            <div className="nav-logo-text">Korea Food </div>
            <div className="nav-logo-sub">Mukbang Store</div>
          </div>
        </NavLink>

        {/* MENU LINKS */}
        <ul className="nav-menu-list" role="menubar">
          <li className="menu-item" role="none">
            <NavLink to="/home" role="menuitem" onClick={() => window.scrollTo(0, 0)}>Trang Chủ</NavLink>
          </li>
          <li className="menu-item" role="none">
            <NavLink to="/product/category/all" role="menuitem" onClick={() => window.scrollTo(0, 0)}>Thực Đơn</NavLink>
          </li>
          <li className="menu-item" role="none">
            <HashLink
              smooth
              to="/home#about"
              role="menuitem"
              scroll={(el) => {
                const offset = 100;
                const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
              }}
            >
              Về Chúng Tôi
            </HashLink>
          </li>
          <li className="menu-item" role="none">
            <HashLink
              smooth
              to="/home#locations"
              role="menuitem"
              scroll={(el) => {
                const offset = 100;
                const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
              }}
            >
              Cửa Hàng
            </HashLink>
          </li>
        </ul>

        {/* SEARCH */}
        <form
          className="nav-search-form"
          onSubmit={(e) => this.btnSearchClick(e)}
          role="search"
          aria-label="Tìm kiếm món ăn"
        >
          <input
            type="search"
            placeholder="Tìm món ăn..."
            className="nav-search-input"
            aria-label="Nhập tên món ăn cần tìm"
            value={this.state.txtKeyword}
            onChange={(e) => this.setState({ txtKeyword: e.target.value })}
          />
          <button type="submit" className="nav-search-btn" aria-label="Tìm kiếm">
            🔍
          </button>
        </form>
      </nav>
    );
  }
}

export default withRouter(Menu);