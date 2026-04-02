import React, { Component } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import Menu from './MenuComponent';
import Inform from './InformComponent';
import Home from './HomeComponent';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import Signup from './SignupComponent';
import Active from './ActiveComponent';
import Login from './LoginComponent';
import Myprofile from './MyprofileComponent';
import Mycart from './MycartComponent';
import Myorders from './MyordersComponent';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hotprods: []
    };
  }

  componentDidMount() {
    fetch('/api/customer/products/hot')
      .then((res) => res.json())
      .then((data) => {
        this.setState({ hotprods: Array.isArray(data) ? data : [] });
      })
      .catch(() => this.setState({ hotprods: [] }));
  }

  render() {
    const { hotprods } = this.state;

    return (
      <div className="body-customer-premium">
        <style>{`
          /* ============ GLOBAL RESET & TYPOGRAPHY ============ */
          *, *::before, *::after { box-sizing: border-box; }

          .body-customer-premium {
            min-height: 100vh;
            background: #ffffff;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #1a1a1a;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* ============ SKIP TO CONTENT (Accessibility) ============ */
          .skip-to-content {
            position: absolute;
            top: -100%;
            left: 50%;
            transform: translateX(-50%);
            background: #d32f2f;
            color: #fff;
            padding: 12px 24px;
            border-radius: 0 0 8px 8px;
            font-weight: 700;
            z-index: 99999;
            text-decoration: none;
            transition: top 0.3s;
          }
          .skip-to-content:focus {
            top: 0;
          }

          /* ============ HEADER ============ */
          .header-main-sticky {
            position: sticky;
            top: 0;
            z-index: 1000;
            background: white;
            box-shadow: 0 2px 20px rgba(0,0,0,0.06);
          }

          /* ============ HOT PRODUCTS MARQUEE ============ */
          .hot-bar-container {
            background: linear-gradient(90deg, #d32f2f 0%, #e53935 50%, #ff5722 100%);
            padding: 10px 0;
            overflow: hidden;
            display: flex;
            align-items: center;
          }

          .hot-marquee {
            display: flex;
            white-space: nowrap;
            animation: marqueeEffect 25s linear infinite;
          }

          .hot-item {
            color: rgba(255,255,255,0.95);
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 0 32px;
            letter-spacing: 1.5px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .hot-item::before {
            content: '🔥';
            font-size: 14px;
          }

          @keyframes marqueeEffect {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          /* ============ MAIN CONTENT ============ */
          .main-content-flow {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
            animation: fadeInUp 0.6s ease-out;
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* ============ FOOTER ============ */
          .site-footer {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: rgba(255,255,255,0.85);
            margin-top: 80px;
          }

          .footer-inner {
            max-width: 1280px;
            margin: 0 auto;
            padding: 60px 24px 30px;
          }

          .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
            gap: 40px;
            padding-bottom: 40px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }

          .footer-brand h3 {
            font-size: 24px;
            font-weight: 900;
            color: #fff;
            margin: 0 0 4px;
            letter-spacing: -0.5px;
          }

          .footer-brand-sub {
            font-size: 13px;
            color: #ff9f43;
            font-weight: 600;
            margin: 0 0 16px;
          }

          .footer-brand p {
            font-size: 14px;
            line-height: 1.7;
            color: rgba(255,255,255,0.65);
            margin: 0;
          }

          .footer-col h4 {
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #fff;
            margin: 0 0 20px;
            position: relative;
            padding-bottom: 10px;
          }

          .footer-col h4::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 30px;
            height: 2px;
            background: #d32f2f;
            border-radius: 2px;
          }

          .footer-col ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .footer-col li {
            margin-bottom: 10px;
          }

          .footer-col a {
            color: rgba(255,255,255,0.6);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            display: inline-block;
          }

          .footer-col a:hover {
            color: #ff9f43;
            transform: translateX(4px);
          }

          .footer-contact-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 14px;
            font-size: 14px;
            color: rgba(255,255,255,0.65);
          }

          .footer-contact-item span:first-child {
            font-size: 18px;
            flex-shrink: 0;
          }

          .footer-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 24px;
            font-size: 13px;
            color: rgba(255,255,255,0.4);
          }

          .footer-social {
            display: flex;
            gap: 12px;
          }

          .footer-social a {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255,255,255,0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 16px;
            transition: all 0.3s;
          }

          .footer-social a:hover {
            background: #d32f2f;
            transform: translateY(-3px);
          }

          /* ============ RESPONSIVE ============ */
          @media (max-width: 768px) {
            .footer-grid {
              grid-template-columns: 1fr;
              gap: 30px;
            }
            .footer-bottom {
              flex-direction: column;
              gap: 16px;
              text-align: center;
            }
            .main-content-flow {
              padding: 0 16px;
            }
          }
        `}</style>

        {/* ACCESSIBILITY: Skip-to-content link */}
        <a href="#main-content" className="skip-to-content">
          Bỏ qua đến nội dung chính
        </a>

        {/* ============ HEADER ============ */}
        <header className="header-main-sticky" role="banner">
          <Menu />
          <Inform />
        </header>

        {/* HOT PRODUCTS MARQUEE */}
        {Array.isArray(hotprods) && hotprods.length > 0 && (
          <aside className="hot-bar-container" aria-label="Sản phẩm bán chạy">
            <div className="hot-marquee">
              {[...hotprods, ...hotprods].map((prod, index) => (
                <div key={`${prod._id}-${index}`} className="hot-item">
                  {prod.name}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* ============ MAIN CONTENT ============ */}
        <main id="main-content" className="main-content-flow" role="main">
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home hotprods={hotprods} />} />
            <Route path="/product/category/:cid" element={<Product />} />
            <Route path="/product/search/:keyword" element={<Product />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/active' element={<Active />} />
            <Route path='/login' element={<Login />} />
            <Route path='/myprofile' element={<Myprofile />} />
            <Route path='/mycart' element={<Mycart />} />
            <Route path='/myorders' element={<Myorders />} />
          </Routes>
        </main>

        {/* ============ FOOTER ============ */}
        <footer className="site-footer" role="contentinfo">
          <div className="footer-inner">
            <div className="footer-grid">
              {/* Brand */}
              <div className="footer-brand">
                <h3>🇰🇷 Korea Food Mukbang Store</h3>
                <p className="footer-brand-sub">Ẩm Thực Hàn Quốc Chính Hiệu</p>
                <p>
                  Mang đến cho bạn trải nghiệm ẩm thực Hàn Quốc đích thực với nguyên liệu
                  nhập khẩu trực tiếp. Từ Bibimbap, Kimbap đến Lẩu Kim Chi – mỗi món ăn đều
                  được chế biến với tình yêu và sự tận tâm.
                </p>
              </div>

              {/* Quick Links */}
              <div className="footer-col">
                <h4>Thực đơn</h4>
                <ul>
                  <li><Link to="/home">Trang Chủ</Link></li>
                  <li><Link to="/home">Món Mới</Link></li>
                  <li><Link to="/home">Bán Chạy</Link></li>
                </ul>
              </div>

              {/* Account */}
              <div className="footer-col">
                <h4>Tài khoản</h4>
                <ul>
                  <li><Link to="/login">Đăng nhập</Link></li>
                  <li><Link to="/signup">Đăng ký</Link></li>
                  <li><Link to="/mycart">Giỏ hàng</Link></li>
                  <li><Link to="/myorders">Đơn hàng</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div className="footer-col">
                <h4>Liên hệ</h4>
                <div className="footer-contact-item">
                  <span>📍</span>
                  <span>123 Nguyễn Văn Cừ, Quận 5, TP.HCM</span>
                </div>
                <div className="footer-contact-item">
                  <span>📞</span>
                  <span>0384 939 293</span>
                </div>
                <div className="footer-contact-item">
                  <span>✉️</span>
                  <span>info@koreafoodonline.com</span>
                </div>
                <div className="footer-contact-item">
                  <span>🕐</span>
                  <span>09:00 – 22:00 (Thứ 2 – CN)</span>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="footer-bottom">
              <span>© 2026 Mukbang Korea Food. All rights reserved.</span>
              <div className="footer-social" aria-label="Mạng xã hội">
                <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">📘</a>
                <a href="https://instagram.com/KoreaFoodOnline" aria-label="Instagram" target="_blank" rel="noopener noreferrer">📸</a>
                <a href="https://tiktok.com" aria-label="TikTok" target="_blank" rel="noopener noreferrer">🎵</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Main;