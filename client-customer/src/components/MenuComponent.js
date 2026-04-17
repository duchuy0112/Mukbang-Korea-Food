import axios from 'axios';
import React, { Component, createRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import withRouter from '../utils/withRouter';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtKeyword: '',
      searchOpen: false,
      suggestions: [],
      showSuggestions: false,
      selectedIndex: -1,
      searchLoading: false
    };
    this.searchInputRef = createRef();
    this.searchContainerRef = createRef();
    this.debounceTimer = null;
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }

  handleClickOutside(e) {
    if (this.searchContainerRef.current && !this.searchContainerRef.current.contains(e.target)) {
      this.setState({ searchOpen: false, showSuggestions: false, selectedIndex: -1 });
    }
  }

  toggleSearch() {
    this.setState(prev => {
      const opening = !prev.searchOpen;
      if (opening) {
        setTimeout(() => {
          if (this.searchInputRef.current) this.searchInputRef.current.focus();
        }, 300);
      }
      return {
        searchOpen: opening,
        showSuggestions: false,
        selectedIndex: -1,
        ...(opening ? {} : { txtKeyword: '', suggestions: [] })
      };
    });
  }

  onSearchChange(value) {
    this.setState({ txtKeyword: value, selectedIndex: -1 });
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    if (value.trim().length < 2) {
      this.setState({ suggestions: [], showSuggestions: false });
      return;
    }

    this.setState({ searchLoading: true });
    this.debounceTimer = setTimeout(() => {
      axios.get('/api/customer/products/search/' + encodeURIComponent(value.trim()))
        .then(res => {
          const data = Array.isArray(res.data) ? res.data.slice(0, 6) : [];
          this.setState({ suggestions: data, showSuggestions: data.length > 0, searchLoading: false });
        })
        .catch(() => this.setState({ suggestions: [], showSuggestions: false, searchLoading: false }));
    }, 300);
  }

  onSearchKeyDown(e) {
    const { suggestions, selectedIndex } = this.state;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.setState(prev => ({
        selectedIndex: prev.selectedIndex < prev.suggestions.length - 1 ? prev.selectedIndex + 1 : 0
      }));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.setState(prev => ({
        selectedIndex: prev.selectedIndex > 0 ? prev.selectedIndex - 1 : prev.suggestions.length - 1
      }));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        this.navigateToProduct(suggestions[selectedIndex]._id);
      } else if (this.state.txtKeyword.trim()) {
        this.performSearch();
      }
    } else if (e.key === 'Escape') {
      this.setState({ searchOpen: false, showSuggestions: false, txtKeyword: '', suggestions: [], selectedIndex: -1 });
    }
  }

  performSearch() {
    if (this.state.txtKeyword.trim()) {
      this.props.navigate('/product/search/' + encodeURIComponent(this.state.txtKeyword.trim()));
      this.setState({ searchOpen: false, showSuggestions: false, selectedIndex: -1 });
      window.scrollTo(0, 0);
    }
  }

  navigateToProduct(id) {
    this.props.navigate('/product/' + id);
    this.setState({ searchOpen: false, showSuggestions: false, txtKeyword: '', suggestions: [], selectedIndex: -1 });
    window.scrollTo(0, 0);
  }

  btnSearchClick(e) {
    e.preventDefault();
    this.performSearch();
  }

  render() {
    const { searchOpen, txtKeyword, suggestions, showSuggestions, selectedIndex, searchLoading } = this.state;

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

          /* ===== SEARCH SYSTEM ===== */
          .nav-search-container {
            position: relative;
            display: flex;
            align-items: center;
            margin-left: 60px;
            margin-right: 8px;
          }

          .search-toggle-btn {
            width: 38px;
            height: 38px;
            border: none;
            background: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: #555;
            position: relative;
            z-index: 12;
            flex-shrink: 0;
          }

          .search-toggle-btn:hover {
            background: rgba(204, 43, 43, 0.06);
            color: #cc2b2b;
          }

          .search-toggle-btn.active {
            color: #cc2b2b;
            background: rgba(204, 43, 43, 0.08);
          }

          .search-toggle-btn svg {
            width: 18px;
            height: 18px;
            transition: transform 0.3s;
          }

          .search-toggle-btn:hover svg {
            transform: scale(1.1);
          }

          /* ===== SEARCH INPUT AREA ===== */
          .search-input-wrapper {
            position: absolute;
            right: -60px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1.5px solid #f0e8e2;
            border-radius: 50px;
            overflow: hidden;
            width: 0;
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 11;
            box-shadow: none;
          }

          .search-input-wrapper.open {
            width: 360px;
            opacity: 1;
            pointer-events: auto;
            box-shadow: 0 8px 32px rgba(204, 43, 43, 0.08), 0 2px 8px rgba(0,0,0,0.04);
            border-color: #e8d6cc;
          }

          .search-icon-inside {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 0 0 16px;
            color: #bbb;
            flex-shrink: 0;
          }

          .search-icon-inside svg {
            width: 16px;
            height: 16px;
          }

          .search-input-field {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            padding: 12px 14px;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            color: #333;
            letter-spacing: 0.2px;
          }

          .search-input-field::placeholder {
            color: #bbb;
            font-weight: 400;
            letter-spacing: 0.3px;
          }

          .search-submit-btn {
            border: none;
            background: linear-gradient(135deg, #FF6D00 0%, #D32F2F 100%);
            color: #fff;
            padding: 0 18px;
            height: 100%;
            min-height: 42px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            flex-shrink: 0;
          }

          .search-submit-btn:hover {
            filter: brightness(1.1);
          }

          .search-submit-btn svg {
            width: 16px;
            height: 16px;
          }

          .search-close-btn {
            border: none;
            background: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 12px;
            color: #bbb;
            transition: color 0.2s;
            flex-shrink: 0;
          }

          .search-close-btn:hover {
            color: #cc2b2b;
          }

          .search-close-btn svg {
            width: 14px;
            height: 14px;
          }

          /* ===== SUGGESTIONS DROPDOWN ===== */
          .search-suggestions-dropdown {
            position: absolute;
            top: calc(100% + 10px);
            right: -60px;
            width: 360px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid #f0e8e2;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0,0,0,0.04);
            z-index: 1001;
            animation: suggestSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          @keyframes suggestSlideIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .suggestions-header {
            padding: 14px 20px 10px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #bbb;
            border-bottom: 1px solid #f5f0ed;
          }

          .suggestion-item {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            color: inherit;
            gap: 14px;
          }

          .suggestion-item:hover,
          .suggestion-item.selected {
            background: linear-gradient(135deg, rgba(255, 109, 0, 0.04), rgba(211, 47, 47, 0.04));
          }

          .suggestion-item.selected {
            background: linear-gradient(135deg, rgba(255, 109, 0, 0.08), rgba(211, 47, 47, 0.06));
          }

          .suggestion-img {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            object-fit: cover;
            flex-shrink: 0;
            border: 1px solid #f0e8e2;
          }

          .suggestion-info {
            flex: 1;
            min-width: 0;
          }

          .suggestion-name {
            font-size: 14px;
            font-weight: 700;
            color: #222;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 3px;
          }

          .suggestion-price {
            font-size: 13px;
            font-weight: 800;
            color: #D32F2F;
          }

          .suggestion-arrow {
            color: #ccc;
            flex-shrink: 0;
            transition: transform 0.2s;
          }

          .suggestion-item:hover .suggestion-arrow,
          .suggestion-item.selected .suggestion-arrow {
            color: #D32F2F;
            transform: translateX(3px);
          }

          .suggestion-arrow svg {
            width: 14px;
            height: 14px;
          }

          .suggestions-footer {
            padding: 12px 20px;
            border-top: 1px solid #f5f0ed;
            text-align: center;
          }

          .suggestions-footer button {
            border: none;
            background: transparent;
            color: #D32F2F;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            padding: 6px 16px;
            border-radius: 8px;
            transition: all 0.2s;
            font-family: 'Inter', sans-serif;
          }

          .suggestions-footer button:hover {
            background: rgba(211, 47, 47, 0.06);
          }

          /* ===== SEARCH LOADING ===== */
          .search-loading-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 14px;
            flex-shrink: 0;
          }

          .search-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #f0e8e2;
            border-top-color: #D32F2F;
            border-radius: 50%;
            animation: searchSpin 0.6s linear infinite;
          }

          @keyframes searchSpin {
            to { transform: rotate(360deg); }
          }



          /* ===== RESPONSIVE ===== */
          @media (max-width: 768px) {
            .search-input-wrapper.open {
              width: 260px;
            }
            .search-suggestions-dropdown {
              width: 280px;
            }
            .nav-logo {
              width: auto;
            }
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
        
        {/* ===== SEARCH SYSTEM ===== */}
        <div className="nav-search-container" ref={this.searchContainerRef}>
          {/* Search Toggle Icon */}
          <button
            className={`search-toggle-btn ${searchOpen ? 'active' : ''}`}
            onClick={() => this.toggleSearch()}
            aria-label="Tìm kiếm"
            title="Tìm kiếm món ăn"
            id="search-toggle-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Expandable Search Input */}
          <form
            className={`search-input-wrapper ${searchOpen ? 'open' : ''}`}
            onSubmit={(e) => this.btnSearchClick(e)}
          >
            <div className="search-icon-inside">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <input
              ref={this.searchInputRef}
              type="search"
              className="search-input-field"
              placeholder="Tìm món ăn bạn muốn..."
              value={txtKeyword}
              onChange={(e) => this.onSearchChange(e.target.value)}
              onKeyDown={(e) => this.onSearchKeyDown(e)}
              id="search-input-field"
              autoComplete="off"
              aria-label="Nhập từ khóa tìm kiếm"
            />

            {searchLoading && (
              <div className="search-loading-indicator">
                <div className="search-spinner" />
              </div>
            )}

            {txtKeyword && (
              <button
                type="button"
                className="search-close-btn"
                onClick={() => {
                  this.setState({ txtKeyword: '', suggestions: [], showSuggestions: false, selectedIndex: -1 });
                  if (this.searchInputRef.current) this.searchInputRef.current.focus();
                }}
                aria-label="Xóa từ khóa"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}

            <button type="submit" className="search-submit-btn" aria-label="Tìm kiếm" id="search-submit-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {/* Suggestions Dropdown */}
          {searchOpen && showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions-dropdown">
              <div className="suggestions-header">Gợi ý cho bạn</div>
              {suggestions.map((item, index) => (
                <div
                  key={item._id}
                  className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => this.navigateToProduct(item._id)}
                  onMouseEnter={() => this.setState({ selectedIndex: index })}
                >
                  <img
                    src={'data:image/jpg;base64,' + item.image}
                    alt={item.name}
                    className="suggestion-img"
                  />
                  <div className="suggestion-info">
                    <div className="suggestion-name">{item.name}</div>
                    <div className="suggestion-price">{item.price?.toLocaleString()} VNĐ</div>
                  </div>
                  <div className="suggestion-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              ))}
              <div className="suggestions-footer">
                <button type="button" onClick={() => this.performSearch()}>
                  Xem tất cả kết quả →
                </button>
              </div>
            </div>
          )}
        </div>


      </nav>
    );
  }
}

export default withRouter(Menu);