import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
      activeLocationIndex: 0,
      locations: [
        {
          name: "Korea Food - Quận 1",
          address: "123 Lê Lợi, P. Bến Thành, Quận 1, TP. HCM",
          phone: "028 3822 1234",
          time: "09:00 - 22:00 (Hàng ngày)",
          mapUrl: "https://maps.google.com/maps?q=123%20Lê%20Lợi,%20Bến%20Thành,%20Quận%201,%20Hồ%20Chí%20Minh&output=embed"
        },
        {
          name: "Korea Food - Quận 5",
          address: "123 Nguyễn Văn Cừ, P. An Phú, Q. 5, TP. HCM",
          phone: "028 5411 5678",
          time: "10:00 - 22:30 (Hàng ngày)",
          mapUrl: "https://maps.google.com/maps?q=123%20Nguyễn%20Văn%20Cừ,%20An%20Phú,%20Quận%205,%20Hồ%20Chí%20Minh&output=embed"
        }
      ]
    };
  }

  handleLocationClick(index) {
    this.setState({ activeLocationIndex: index });
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  render() {
    return (
      <div className="luxury-home-container">
        <style>{`
          :root {
            --primary-red: #d32f2f;
            --primary-orange: #e25a36;
            --bg-soft: #fcfcfc;
            --card-shadow: 0 20px 40px rgba(0,0,0,0.05);
            --card-shadow-hover: 0 30px 60px rgba(0,0,0,0.1);
            --accent-gradient: linear-gradient(135deg, #d32f2f 0%, #e25a36 100%);
          }

          .luxury-home-container {
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
            background: var(--bg-soft);
          }

          /* HERO SECTION */
          .hero-banner-section { width: 100%; padding: 30px 40px; display: flex; justify-content: center; }
          .hero-frame { width: 100%; max-width: 1400px; border-radius: 35px; overflow: hidden; box-shadow: 0 30px 70px rgba(0,0,0,0.1); position: relative; }
          .hero-main-img { width: 100%; display: block; transition: 1s; }

          /* TITLES */
          .section-header-box { max-width: 1250px; margin: 0 auto 35px; padding: 0 32px; display: flex; justify-content: space-between; align-items: flex-end; }
          .sub-text { font-size: 11px; font-weight: 800; color: var(--primary-red); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; display: block; }
          .main-title { font-size: 38px; font-weight: 900; color: #1a1a1a; margin: 0; letter-spacing: -1px; line-height: 1.1; }
          .highlight-orange { color: var(--primary-orange); }
          .view-all-link { text-decoration: none; color: #666; font-size: 14px; font-weight: 700; transition: 0.3s; }
          .view-all-link:hover { color: var(--primary-red); }

          /* CARDS */
          .premium-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 30px; max-width: 1250px; margin: 0 auto; padding: 0 32px; }
          .premium-card {
            background: #fff; border-radius: 24px; overflow: hidden; box-shadow: var(--card-shadow); border: 1px solid #f0f0f0;
            transition: all 0.3s; position: relative; height: 100%; display: flex; flex-direction: column;
          }
          .premium-card:hover { transform: translateY(-8px); box-shadow: var(--card-shadow-hover); }
          .premium-img-box { height: 220px; overflow: hidden; position: relative; }
          .premium-food-img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s; }
          .premium-card:hover .premium-food-img { transform: scale(1.1); }
          .luxury-tag { position: absolute; top: 15px; left: 15px; background: rgba(255,255,255,0.9); color: var(--primary-red); padding: 4px 12px; font-size: 10px; font-weight: 900; border-radius: 50px; }
          .premium-info { padding: 25px; flex-grow: 1; display: flex; flex-direction: column; }
          .premium-food-name { font-size: 18px; font-weight: 800; color: #1a1a1a; margin-bottom: 6px; }
          .premium-food-desc { font-size: 13px; color: #777; line-height: 1.5; margin-bottom: 18px; height: 40px; overflow: hidden; }
          .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
          .price-val { font-size: 20px; font-weight: 900; color: var(--primary-red); }
          .btn-plus { width: 36px; height: 36px; background: #222; border: none; border-radius: 10px; color: #fff; font-size: 18px; cursor: pointer; transition: 0.3s; }
          .premium-card:hover .btn-plus { background: var(--accent-gradient); }

          /* LOCATIONS */
          .locations-container { background: #fff; padding: 70px 0; }
          .locations-content { max-width: 1250px; margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px; }
          .location-card {
            background: #fff; padding: 25px; border-radius: 18px; border: 1.5px solid #f0f0f0; transition: 0.3s; cursor: pointer; margin-bottom: 15px;
          }
          .location-card.active { border-color: var(--primary-orange); background: #fffaf7; }
          .loc-name { font-size: 18px; font-weight: 900; margin-bottom: 6px; }
          .loc-detail { font-size: 14px; color: #666; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
          .btn-direction { margin-top: 12px; width: 100%; background: #222; color: #fff; border: none; padding: 12px; border-radius: 12px; font-weight: 800; cursor: pointer; font-size: 14px; }

          /* ABOUT */
          .about-us-section { padding: 70px 0; background: #fafafa; border-top: 1px solid #eee; }
          .about-container { max-width: 1250px; margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 70px; align-items: center; }
          .restaurant-img { width: 100%; border-radius: 25px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
          .about-title { font-size: 34px; font-weight: 900; margin: 12px 0 22px; line-height: 1.2; }
          .about-p { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 20px; }

          @media (max-width: 900px) {
            .about-container, .locations-content { grid-template-columns: 1fr; }
            .hero-banner-section { padding: 20px; }
          }
        `}</style>

        <Helmet>
          <title>Korea Food | Ẩm Thực Hàn Quốc</title>
        </Helmet>

        {/* HERO */}
        <section className="hero-banner-section">
          <div className="hero-frame">
            <img src="/images/hero-bg.png" alt="Hero" className="hero-main-img" />
          </div>
        </section>

        {/* SECTION 1: ABOUT US */}
        <section id="about" className="about-us-section">
          <div className="about-container">
            <div className="about-left">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="About US" className="restaurant-img" />
            </div>
            <div className="about-right">
              <span className="sub-text">VỀ CHÚNG TÔI</span>
              <h2 className="about-title">Mukbang Korea Food - Tinh hoa ẩm thực <span className="highlight-orange">Hàn Quốc</span></h2>
              <p className="about-p">
                Mukbang Korea Food tự hào mang đến cho thực khách những trải nghiệm ẩm thực Hàn Quốc đích thực ngay tại Việt Nam. 
              </p>
              <p className="about-p">
                Với đội ngũ đầu bếp tâm huyết và nguồn nguyên liệu chất lượng, chúng tôi không ngừng nỗ lực để mang đến những bữa ăn ngon miệng, ấm cúng cho bạn và gia đình.
              </p>
              <Link to="/product/category/all" className="view-all-link" style={{ color: 'var(--primary-red)' }} onClick={() => window.scrollTo(0, 0)}>KHÁM PHÁ THỰC ĐƠN ➔</Link>
            </div>
          </div>
        </section>

        {/* SECTION 2: HOT PRODUCTS (HƯƠNG VỊ GÂY NGHIỆN) */}
        <section style={{ padding: '80px 0', background: '#fff' }}>
          <div className="section-header-box">
            <div className="title-group">
              <span className="sub-text">Thực đơn đặc sắc</span>
              <h2 className="main-title">Hương vị <span className="highlight-orange">Gây Nghiện</span></h2>
            </div>
            <Link to="/product/category/all" className="view-all-link" onClick={() => window.scrollTo(0, 0)}>Xem tất cả ➔</Link>
          </div>

          <div className="premium-grid">
            {(() => {
              const allItems = [...this.state.hotprods, ...this.state.newprods];
              const uniqueItems = allItems.filter((v, i, a) => a.findIndex(t => t._id === v._id) === i);
              return uniqueItems.slice(0, 4).map((item) => (
                <div key={item._id} className="premium-card">
                  <Link to={'/product/' + item._id} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => window.scrollTo(0, 0)}>
                    <div className="premium-img-box">
                      <img src={'data:image/jpg;base64,' + item.image} alt={item.name} className="premium-food-img" />
                      <div className="luxury-tag">POPULAR</div>
                    </div>
                    <div className="premium-info">
                      <h3 className="premium-food-name">{item.name}</h3>
                      <p className="premium-food-desc">
                        {item.description || "Món ăn chuẩn vị Hàn Quốc, được chế biến tâm huyết bởi đầu bếp chuyên nghiệp."}
                      </p>
                      <div className="card-footer">
                        <span className="price-val">{item.price?.toLocaleString()}đ</span>
                        <button className="btn-plus">+</button>
                      </div>
                    </div>
                  </Link>
                </div>
              ));
            })()}
          </div>
        </section>

        {/* SECTION 3: LOCATIONS (BẢN ĐỒ CHI NHÁNH) */}
        <section id="locations" className="locations-container" style={{ background: '#fafafa', borderTop: '1px solid #eee' }}>
          <div className="section-header-box">
            <div className="title-group">
              <span className="sub-text">Hệ thống chi nhánh</span>
              <h2 className="main-title">Gần bạn <span className="highlight-orange">Luôn Sẵn Sàng</span></h2>
            </div>
          </div>

          <div className="locations-content">
            <div className="location-cards">
              {this.state.locations.map((loc, index) => (
                <div
                  key={index}
                  className={`location-card ${this.state.activeLocationIndex === index ? 'active' : ''}`}
                  onClick={() => this.handleLocationClick(index)}
                >
                  <h4 className="loc-name">{loc.name}</h4>
                  <div className="loc-detail"><span>📍</span> {loc.address}</div>
                  <div className="loc-detail"><span>📞</span> {loc.phone}</div>
                  <button className="btn-direction">Xem bản đồ</button>
                </div>
              ))}
            </div>
            <div style={{ borderRadius: '25px', overflow: 'hidden', height: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
              <iframe
                title="Google Map"
                src={this.state.locations[this.state.activeLocationIndex].mapUrl}
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    );
  }

  apiGetNewProducts() {
    axios.get('/api/customer/products/new').then((res) => {
      this.setState({ newprods: res.data || [] });
    });
  }

  apiGetHotProducts() {
    axios.get('/api/customer/products/hot').then((res) => {
      this.setState({ hotprods: res.data || [] });
    });
  }
}

export default Home;