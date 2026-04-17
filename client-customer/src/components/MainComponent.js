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
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@700;900&display=swap');

          /* ============ GLOBAL RESET & TYPOGRAPHY ============ */
          *, *::before, *::after { box-sizing: border-box; }

          :root {
            --primary-red: #D32F2F;
            --primary-orange: #FF6D00;
            --accent-gradient: linear-gradient(135deg, #FF6D00 0%, #D32F2F 100%);
            --bg-soft: #FDFBFA;
            --text-main: #1A1A1A;
            --text-muted: #666666;
            --card-shadow: 0 10px 30px rgba(0,0,0,0.05);
            --card-shadow-hover: 0 20px 50px rgba(0,0,0,0.1);
          }

          .body-customer-premium {
            min-height: 100vh;
            background: var(--bg-soft);
            font-family: 'Inter', sans-serif;
            color: var(--text-main);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }

          h1, h2, h3, h4 { font-family: 'Montserrat', 'Noto Sans KR', sans-serif; font-weight: 900; }

          /* ============ SKIP TO CONTENT ============ */
          .skip-to-content {
            position: absolute; top: -100%; left: 50%; transform: translateX(-50%);
            background: var(--primary-red); color: #fff; padding: 12px 24px;
            border-radius: 0 0 8px 8px; font-weight: 700; z-index: 99999;
            text-decoration: none; transition: top 0.3s;
          }
          .skip-to-content:focus { top: 0; }

          /* ============ HEADER ============ */
          .header-main-sticky {
            position: sticky; top: 0; z-index: 9999;
            background: #fdfaf6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            height: 75px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.03);
            border-bottom: 1px solid #f5eee8;
          }

          /* ============ HOT BAR ============ */
          .hot-bar-container {
            background: var(--accent-gradient); padding: 12px 0; overflow: hidden;
          }
          .hot-marquee { display: flex; animation: marquee 30s linear infinite; }
          .hot-item {
            color: #fff; font-size: 13px; font-weight: 800;
            text-transform: uppercase; padding: 0 40px; letter-spacing: 1px;
            display: flex; align-items: center; gap: 10px;
          }
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

          /* ============ MAIN CONTENT ============ */
          .main-content-flow { max-width: 1300px; margin: 0 auto; padding: 40px 24px; min-height: 80vh; }

          /* ============ FOOTER ============ */
          .site-footer {
            background: #131110;
            color: #fff;
            margin-top: 100px;
          }

          .footer-inner {
            max-width: 1300px;
            margin: 0 auto;
            padding: 40px 24px 25px;
          }

          .footer-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
            gap: 60px;
            padding-bottom: 50px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }

          .footer-brand h3 {
            font-size: 18px;
            margin-bottom: 8px;
            color: var(--primary-orange);
          }

          .footer-brand-sub {
            color: #ff9f43;
            font-weight: 600;
            margin-bottom: 15px;
            display: block;
          }

          .footer-brand p {
            font-size: 15px;
            color: #aaa;
            line-height: 1.8;
          }

          .footer-col h4 {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
            color: #fff;
            position: relative;
          }

          .footer-col h4::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 40px;
            height: 3px;
            background: var(--primary-red);
            border-radius: 10px;
          }

          .footer-col ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .footer-col li {
            margin-bottom: 12px;
          }

          .footer-col a {
            color: #888;
            text-decoration: none;
            font-size: 15px;
            transition: 0.3s;
          }

          .footer-col a:hover {
            color: var(--primary-orange);
            padding-left: 8px;
          }

          .footer-contact-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 15px;
            color: #aaa;
          }

          .footer-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 30px;
            font-size: 14px;
            color: #555;
          }

          .footer-social {
            display: flex;
            gap: 15px;
          }

          .footer-social a {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255,255,255,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 18px;
            transition: 0.3s;
          }

          .footer-social a:hover {
            background: var(--primary-red);
            transform: translateY(-5px);
          }

          /* ============ RESPONSIVE ============ */
          @media (max-width: 1024px) {
            .footer-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 40px;
            }
          }

          @media (max-width: 768px) {
            .footer-grid {
              grid-template-columns: 1fr;
            }
            .footer-bottom {
              flex-direction: column;
              gap: 20px;
              text-align: center;
            }
          }
        `}</style>

        {/* ACCESSIBILITY: Skip-to-content link */}
        <a href="#main-content" className="skip-to-content">
          Bỏ qua đến nội dung chính
        </a>

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
                <h3>🇰🇷 Mukbang Store - Korea Food</h3>
                <p className="footer-brand-sub">Ẩm Thực Hàn Quốc Chính Hiệu</p>
                <p>
                  Mang đến cho bạn trải nghiệm ẩm thực Hàn Quốc đích thực với nguyên liệu
                  nhập khẩu trực tiếp. Từ Bibimbap, Kimbap đến Lẩu Kim Chi – mỗi món ăn đều
                  được chế biến với tình yêu và sự tận tâm.
                </p>
              </div>

              {/* Quick Links */}
              <div className="footer-col">
                <h4>Liên Kết Nhanh</h4>
                <ul>
                  <li><Link to="/home" onClick={() => window.scrollTo(0, 0)}>Trang Chủ</Link></li>
                  <li><Link to="/product/category/all" onClick={() => window.scrollTo(0, 0)}>Thực Đơn</Link></li>
                  <li><Link to="/home" onClick={() => window.scrollTo(0, 0)}>Bán Chạy</Link></li>
                </ul>
              </div>

              {/* Account */}
              <div className="footer-col">
                <h4>Tài khoản</h4>
                <ul>
                  <li><Link to="/login" onClick={() => window.scrollTo(0, 0)}>Đăng nhập</Link></li>
                  <li><Link to="/signup" onClick={() => window.scrollTo(0, 0)}>Đăng ký</Link></li>
                  <li><Link to="/mycart" onClick={() => window.scrollTo(0, 0)}>Giỏ hàng</Link></li>
                  <li><Link to="/myorders" onClick={() => window.scrollTo(0, 0)}>Đơn hàng</Link></li>
                </ul>
              </div>

              {/* Support & Legal */}
              <div className="footer-col">
                <h4>Thông Tin</h4>
                <ul>
                  <li><Link to="/home" onClick={() => window.scrollTo(0, 0)}>Chính sách bảo mật</Link></li>
                  <li><Link to="/home" onClick={() => window.scrollTo(0, 0)}>Điều khoản dịch vụ</Link></li>
                  <li><Link to="/home" onClick={() => window.scrollTo(0, 0)}>Liên hệ</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
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