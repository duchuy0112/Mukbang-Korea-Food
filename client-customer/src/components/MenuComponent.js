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
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;
          }

          /* ===== LOGO ===== */
          .nav-logo { 
            text-decoration: none; 
            flex-shrink: 0; 
            width: 250px;
          }
          .nav-logo-text { 
            font-size: 26px; 
            font-weight: 800; 
            color: #cc2b2b; 
            font-style: italic; 
            letter-spacing: -0.5px; 
            font-family: 'Inter', sans-serif;
          }

          /* ===== MENU LINKS ===== */
          .nav-menu-wrapper {
            flex: 1;
            display: flex;
            justify-content: center;
          }

          .nav-menu-list { 
            display: flex; 
            list-style: none; 
            margin: 0; 
            padding: 0; 
            gap: 30px; 
            align-items: center; 
          }

          .menu-item a {
            text-decoration: none; 
            color: #777; 
            font-weight: 600; 
            font-size: 13px;
            letter-spacing: 0.3px;
            transition: 0.2s;
          }
          
          .menu-item a:hover { 
            color: #222; 
          }
          
          .menu-item a.active { 
            color: #222; 
          }

          /* ===== SEARCH (Hidden) ===== */
          .nav-search-form {
            display: none;
          }
        `}</style>

        {/* LOGO */}
        <NavLink to="/home" className="nav-logo" aria-label="Về trang chủ Mukbang Korea Food" onClick={() => window.scrollTo(0, 0)}>
          <div className="nav-logo-text">Mukbang Korea</div>
        </NavLink>

        {/* MENU LINKS */}
        <div className="nav-menu-wrapper">
          <ul className="nav-menu-list" role="menubar">
            <li className="menu-item" role="none">
              <NavLink to="/home" role="menuitem" onClick={() => window.scrollTo(0, 0)}>Home</NavLink>
            </li>
            <li className="menu-item" role="none">
              <NavLink to="/product/category/all" role="menuitem" onClick={() => window.scrollTo(0, 0)}>Menu</NavLink>
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
                About
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
                Locations
              </HashLink>
            </li>
          </ul>
        </div>
        
        {/* Hidden internal UI to keep state alive without showing */}
        <form className="nav-search-form" onSubmit={(e) => this.btnSearchClick(e)}>
          <input type="search" value={this.state.txtKeyword} onChange={(e) => this.setState({ txtKeyword: e.target.value })} />
        </form>
      </nav>
    );
  }
}

export default withRouter(Menu);