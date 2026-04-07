import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';

class Home extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      totalSales: 14250000,
      totalOrders: 0,
      newCustomers: 342,
      topSelling: null,
      trendingProducts: [],
      recentOrders: []
    };
  }

  componentDidMount() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    // Lấy số lượng đơn hàng
    axios.get('/api/admin/orders', { headers: { 'x-access-token': this.context.token } })
      .then((res) => {
        const orders = Array.isArray(res.data) ? res.data : [];
        this.setState({
          totalOrders: orders.length,
          recentOrders: orders.slice(0, 5) // Lấy 5 đơn hàng gần nhất
        });
      });

    // Lấy danh sách sản phẩm để tìm món bán chạy nhất (giả lập dựa trên danh sách thật)
    axios.get('/api/admin/products', { headers: { 'x-access-token': this.context.token } })
      .then((res) => {
        const prods = Array.isArray(res.data) ? res.data : [];
        this.setState({
          topSelling: prods[0] || null,
          trendingProducts: prods.slice(1, 4) // Lấy 3 món tiếp theo
        });
      });
  }

  render() {
    return (
      <div className="admin-dashboard-container">
        <style>{`
          .admin-dashboard-container {
            animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
            padding-top: 10px;
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .welcome-row {
            margin-bottom: 40px;
            display: flex;
            flex-direction: column;
          }

          .welcome-title {
            font-size: 36px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0;
            letter-spacing: -1.5px;
            background: linear-gradient(90deg, #1a1a1a 0%, #d32f2f 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .welcome-sub {
            color: #777;
            font-size: 15px;
            margin-top: 8px;
            font-weight: 600;
          }

          /* DASHBOARD STATS */
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1.2fr;
            gap: 25px;
            margin-bottom: 45px;
          }

          .stat-card {
            padding: 28px;
            border-radius: 30px;
            color: white;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 200px;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(255,255,255,0.1);
          }

          .stat-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 30px 60px rgba(0,0,0,0.12);
          }

          .stat-inner-label { 
            font-size: 12px; 
            font-weight: 900; 
            text-transform: uppercase; 
            letter-spacing: 1.8px; 
            opacity: 0.85; 
          }
          
          .stat-value { 
            font-size: 34px; 
            font-weight: 900; 
            margin: 12px 0; 
            display: flex;
            align-items: baseline;
            gap: 5px;
          }
          .stat-value small { font-size: 20px; opacity: 0.8; }

          .stat-badge {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            padding: 6px 14px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 800;
            width: fit-content;
            border: 1px solid rgba(255,255,255,0.2);
          }

          .card-sales { background: linear-gradient(135deg, #c32d20 0%, #f44336 100%); }
          .card-orders { background: linear-gradient(135deg, #e65100 0%, #ff9800 100%); }
          .card-customers { background: #ffffff; color: #1a1a1a; border: 1px solid #f0f0f0; }
          .card-customers .stat-inner-label { color: #333; } /* Chữ đậm hơn để tăng độ tương phản */
          .card-customers .stat-badge { background: #fdf5f5; border: 1px solid #fee2e2; color: #d32f2f; }

          .top-selling-card {
            background: #fff;
            padding: 28px;
            border-radius: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.04);
            display: flex;
            align-items: center;
            gap: 22px;
            border: 1px solid #f8f8f8;
            transition: 0.3s;
          }
          .top-selling-card:hover { border-color: #fee2e2; transform: translateY(-5px); }

          .prod-img-mini {
            width: 85px; height: 85px;
            border-radius: 22px;
            background: #fdf5f5;
            display: flex; align-items: center; justify-content: center;
            font-size: 32px;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(211,47,47,0.05);
            border: 1px solid #fef2f2;
          }
          .prod-img-mini img { width: 100%; height: 100%; object-fit: cover; }

          /* DATA VISUALIZATION */
          .dashboard-main-row {
            display: grid;
            grid-template-columns: 2.2fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
          }

          .chart-panel {
            background: #fff;
            padding: 35px;
            border-radius: 35px;
            box-shadow: 0 15px 45px rgba(0,0,0,0.03);
            min-height: 420px;
            display: flex;
            flex-direction: column;
            border: 1px solid #f5f5f5;
          }

          .trending-panel {
            background: #fffafa;
            padding: 35px;
            border-radius: 35px;
            box-shadow: 0 15px 45px rgba(0,0,0,0.03);
            border: 1px solid #fff0f0;
          }

          .panel-title { font-size: 22px; font-weight: 900; color: #1a1a1a; margin: 0 0 8px; }
          .panel-sub { font-size: 14px; color: #888; margin-bottom: 30px; font-weight: 500; }

          .revenue-legend {
             display: flex; gap: 20px; justify-content: flex-end; margin-bottom: 25px;
          }
          .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; color: #666; }
          .dot { width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

          .trend-item {
            background: #fff;
            padding: 18px;
            border-radius: 24px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 18px;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
            border: 1.5px solid #f9f9f9;
            text-decoration: none;
            color: inherit;
          }
          .trend-item:hover { transform: translateX(8px); border-color: #ff9f43; box-shadow: 0 10px 25px rgba(255,159,67,0.1); }

          .btn-view-all {
            width: 100%;
            padding: 16px;
            background: #b3261e; /* Chuyển sang Solid button */
            border: none;
            border-radius: 18px;
            color: #fff;
            font-weight: 800;
            font-size: 14px;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s;
            box-shadow: 0 8px 25px rgba(179,38,30,0.15);
          }
          .btn-view-all:hover { 
            background: #991f19; 
            transform: translateY(-3px); 
            box-shadow: 0 12px 30px rgba(179,38,30,0.3); 
          }

          /* TABLE STYLING */
          .recent-orders-panel {
            background: #fff;
            padding: 35px;
            border-radius: 35px;
            box-shadow: 0 15px 45px rgba(0,0,0,0.03);
            border: 1px solid #f5f5f5;
          }
          .order-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; margin-top: 15px; }
          .order-table th { text-align: left; padding: 10px 20px; color: #aaa; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
          .order-table td { padding: 20px; font-size: 14px; background: #fafafa; transition: 0.2s; font-weight: 600; }
          .order-table tr td:first-child { border-radius: 15px 0 0 15px; }
          .order-table tr td:last-child { border-radius: 0 15px 15px 0; }
          .order-table tr:hover td { background: #fff5f5; color: #b3261e; }
          
          .status-chip { padding: 6px 14px; border-radius: 50px; font-weight: 900; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }

          .chart-container-svg {
            flex: 1;
            width: 100%;
            height: 250px;
            margin-top: 20px;
          }
        `}</style>

        <div className="welcome-row">
          <h1 className="welcome-title">Xin chào, {this.context.username}!</h1>
          <div className="welcome-sub">Đây là tổng quan hoạt động kinh doanh tại <strong>Mukbang Korea</strong> ngày hôm nay.</div>
        </div>

        {/* DASHBOARD TOP CARDS */}
        <div className="stats-grid">
          <div className="stat-card card-sales">
            <div className="stat-inner-label">TỔNG DOANH THU</div>
            <div className="stat-value">
              {this.state.totalSales?.toLocaleString()} <small>đ</small>
            </div>
            <div className="stat-badge">+12.5% <small>so với tháng trước</small></div>
            <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', opacity: 0.1, fontSize: '80px' }}>💰</div>
          </div>

          <div className="stat-card card-orders">
            <div className="stat-inner-label">TỔNG ĐƠN HÀNG</div>
            <div className="stat-value">{this.state.totalOrders?.toLocaleString()}</div>
            <div className="stat-badge">
              {this.state.totalOrders > 0 ? "+8.2%" : "0%"} <small>tăng trưởng</small>
            </div>
            <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', opacity: 0.1, fontSize: '80px' }}>🛍️</div>
          </div>

          <div className="stat-card card-customers">
            <div className="stat-inner-label">KHÁCH HÀNG MỚI</div>
            <div className="stat-value">{this.state.newCustomers}</div>
            <div className="stat-badge" style={{ color: '#c32d20' }}>+15% <small>tăng trưởng</small></div>
            <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', opacity: 0.1, fontSize: '60px' }}>👥</div>
          </div>

          <div className="top-selling-card">
            <div className="prod-img-mini">
              {this.state.topSelling ? (
                <img src={'data:image/jpg;base64,' + this.state.topSelling.image} alt="Product" />
              ) : "🍱"}
            </div>
            <div style={{ lineHeight: 1.2 }}>
            <div className="stat-inner-label" style={{ color: '#333' }}>BÁN CHẠY NHẤT</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#1a1a1a', margin: '4px 0' }}>
                {this.state.topSelling?.name || "Kimchi Jjigae"}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#b3261e', background: '#fff5f5', padding: '4px 10px', borderRadius: '50px', width: 'fit-content' }}>
                452 đơn <small style={{ fontWeight: 700 }}>tuần này</small>
              </div>
            </div>
          </div>
        </div>

        {/* CHART & TRENDING ROW */}
        <div className="dashboard-main-row">
          <div className="chart-panel">
            <div className="panel-title">Tăng trưởng doanh thu</div>
            <div className="panel-sub">Theo dõi hiệu suất doanh thu hàng tháng</div>

            <div className="revenue-legend">
              <div className="legend-item"><div className="dot" style={{ background: '#c32d20' }}></div> Trực tuyến</div>
              <div className="legend-item"><div className="dot" style={{ background: '#8b4513' }}></div> Mang về</div>
            </div>

            <div className="chart-container-svg">
              <svg width="100%" height="100%" viewBox="0 0 600 220" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="homeWaveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(195,45,32,0.3)" />
                    <stop offset="100%" stopColor="rgba(195,45,32,0)" />
                  </linearGradient>
                  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                    <feOffset dx="0" dy="8" result="offsetblur" />
                    <feComponentTransfer><feFuncA type="linear" slope="0.2" /></feComponentTransfer>
                    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Decorative Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
                  <line key={i} x1="0" y1={200 - 180 * f} x2="600" y2={200 - 180 * f} stroke="#f0f0f0" strokeWidth="1" strokeDasharray="5,5" />
                ))}

                {/* Wave Path for Online (Red) */}
                <path d="M 0 160 C 100 160, 150 80, 200 80 C 250 80, 300 180, 400 120 C 500 60, 550 40, 600 50 L 600 200 L 0 200 Z" fill="url(#homeWaveGrad)" />
                <path d="M 0 160 C 100 160, 150 80, 200 80 C 250 80, 300 180, 400 120 C 500 60, 550 40, 600 50" fill="none" stroke="#c32d20" strokeWidth="4" strokeLinecap="round" filter="url(#softShadow)" />

                {/* Second Path for Takeaway (Brown) */}
                <path d="M 0 180 C 100 180, 200 150, 300 160 C 400 170, 500 110, 600 130" fill="none" stroke="#8b4513" strokeWidth="4" strokeDasharray="8,5" opacity="0.6" strokeLinecap="round" />

                {/* Animated Dots for primary path */}
                <circle cx="200" cy="80" r="5" fill="#fff" stroke="#c32d20" strokeWidth="2.5" />
                <circle cx="400" cy="120" r="5" fill="#fff" stroke="#c32d20" strokeWidth="2.5" />
                <circle cx="600" cy="50" r="5" fill="#fff" stroke="#c32d20" strokeWidth="2.5" />

                {/* Month Labels */}
                {['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((m, i) => (
                  <text key={i} x={i * 120} y="215" textAnchor="middle" fill="#999" fontSize="12" fontWeight="800">{m}</text>
                ))}
              </svg>
            </div>
          </div>

          <div className="trending-panel">
            <div className="panel-title">Món ăn thịnh hành</div>
            <div className="panel-sub">Khách hàng đang ưu tiên đặt món nào?</div>

            {this.state.trendingProducts.map((p, idx) => (
              <a href="#" key={p._id} className="trend-item">
                <div className="prod-img-mini" style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                  <img src={'data:image/jpg;base64,' + p.image} alt={p.name} />
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 800, fontSize: '14px' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>124 đơn hàng hôm nay</div>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#ff8f2d', marginTop: '3px' }}>
                    {p.price?.toLocaleString()} đ
                  </div>
                </div>
              </a>
            ))}

            <button className="btn-view-all">Xem tất cả sản phẩm</button>
          </div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="recent-orders-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="panel-title">Đơn hàng gần nhất</div>
            <a href="/admin/order" style={{ color: '#b3261e', textDecoration: 'none', fontSize: '13px', fontWeight: 800 }}>Xem tất cả lịch sử →</a>
          </div>

          <table className="order-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {this.state.recentOrders.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontWeight: 800, color: '#333' }}>#{o._id.substring(o._id.length - 8)}</td>
                  <td style={{ fontWeight: 700 }}>{o.customer?.name}</td>
                  <td style={{ color: '#666' }}>{new Date(o.cdate).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 900, color: '#1a1a1a' }}>{o.total.toLocaleString()}đ</td>
                  <td>
                    <span className="status-chip" style={{
                      background: o.status === 'PENDING' ? '#fff8e1' : (o.status === 'APPROVED' ? '#e8f5e9' : '#ffebee'),
                      color: o.status === 'PENDING' ? '#f57f17' : (o.status === 'APPROVED' ? '#2e7d32' : '#c62828')
                    }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Home;