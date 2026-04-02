import axios from 'axios';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: ''
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  btnSearchClick(e) {
    e.preventDefault();
    if (this.state.txtKeyword.trim()) {
      this.props.navigate('/product/search/' + this.state.txtKeyword);
    }
  }

  apiGetCategories() {
    axios.get('/api/customer/categories').then((res) => {
      this.setState({ categories: res.data || [] });
    });
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <li key={item._id} className="menu-item">
        <NavLink to={'/product/category/' + item._id} aria-label={`Danh mục ${item.name}`}>
          {item.name}
        </NavLink>
      </li>
    ));

    return (
      <nav className="k-nav-main" role="navigation" aria-label="Menu chính">
        <style>{`
          .k-nav-main {
            background: #ffffff;
            padding: 0 40px;
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 3px solid #d32f2f;
            font-family: 'Inter', sans-serif;
            gap: 24px;
          }

          /* ===== LOGO ===== */
          .nav-logo {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            flex-shrink: 0;
          }

          .nav-logo-icon {
            font-size: 28px;
          }

          .nav-logo-text {
            font-size: 16px;
            font-weight: 900;
            color: #d32f2f;
            letter-spacing: -0.5px;
            line-height: 1.1;
          }

          .nav-logo-sub {
            font-size: 10px;
            font-weight: 600;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }

          /* ===== MENU LINKS ===== */
          .nav-menu-list {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 4px;
            align-items: center;
          }

          .menu-item a {
            text-decoration: none;
            color: #444;
            font-weight: 700;
            font-size: 13px;
            padding: 8px 18px;
            border-radius: 8px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            transition: all 0.25s ease;
            display: inline-block;
            white-space: nowrap;
          }

          .menu-item a:hover:not(.active) {
            background: rgba(211, 47, 47, 0.08);
            color: #d32f2f;
          }

          .menu-item a.active {
            color: #fff;
            background: #d32f2f;
            box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
          }

          .menu-item a:focus-visible {
            outline: 2px solid #d32f2f;
            outline-offset: 2px;
          }

          /* ===== SEARCH ===== */
          .nav-search-form {
            display: flex;
            background: #f5f5f5;
            border: 2px solid transparent;
            border-radius: 40px;
            padding: 4px 4px 4px 20px;
            transition: all 0.3s;
            flex: 1;
            max-width: 420px;
            min-width: 200px;
          }

          .nav-search-form:focus-within {
            border-color: #d32f2f;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
          }

          .nav-search-input {
            border: none;
            background: transparent;
            padding: 8px 12px;
            outline: none;
            font-weight: 600;
            font-size: 14px;
            color: #333;
            flex: 1;
            min-width: 0;
          }

          .nav-search-input::placeholder {
            color: #999;
            font-weight: 500;
          }

          .nav-search-btn {
            background: #d32f2f;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 30px;
            font-weight: 800;
            font-size: 12px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.2s;
            white-space: nowrap;
          }

          .nav-search-btn:hover {
            background: #b71c1c;
            transform: scale(1.03);
          }

          .nav-search-btn:focus-visible {
            outline: 2px solid #ff9f43;
            outline-offset: 2px;
          }

          /* ===== RESPONSIVE ===== */
          @media (max-width: 1024px) {
            .k-nav-main {
              padding: 0 20px;
              height: auto;
              flex-wrap: wrap;
              gap: 12px;
              padding: 12px 20px;
            }
            .nav-search-form {
              max-width: 100%;
              order: 3;
              flex-basis: 100%;
            }
          }

          @media (max-width: 600px) {
            .nav-menu-list {
              flex-wrap: wrap;
              gap: 2px;
            }
            .menu-item a {
              font-size: 11px;
              padding: 6px 12px;
            }
          }
        `}</style>

        {/* LOGO */}
        <NavLink to="/home" className="nav-logo" aria-label="Về trang chủ Mukbang Korea Food">
          <span className="nav-logo-icon" role="img" aria-hidden="true">🍜</span>
          <div>
            <div className="nav-logo-text">Korea Food</div>
            <div className="nav-logo-sub">Mukbang Online</div>
          </div>
        </NavLink>

        {/* CATEGORY MENU */}
        <ul className="nav-menu-list" role="menubar">
          <li className="menu-item" role="none">
            <NavLink to="/home" role="menuitem">Trang Chủ</NavLink>
          </li>
          {cates}
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
            Tìm kiếm
          </button>
        </form>
      </nav>
    );
  }
}

export default withRouter(Menu);