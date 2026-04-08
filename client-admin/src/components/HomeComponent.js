import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

    // Lấy danh sách sản phẩm để tìm món bán chạy nhất
    // API trả về { products, noPages, curPage } nên cần lấy .products
    axios.get('/api/admin/products?page=1', { headers: { 'x-access-token': this.context.token } })
      .then((res) => {
        // Xử lý cả 2 dạng: array thuần hoặc object phân trang
        const prods = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.products) ? res.data.products : []);
        // Lọc bỏ sản phẩm không có category
        const validProds = prods.filter(p => p.category !== null);
        this.setState({
          topSelling: validProds[0] || null,
          trendingProducts: validProds.slice(1, 4) // Lấy 3 món tiếp theo
        });
      });
  }

  render() {
    return (
      <div className="admin-dashboard-container">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

          .admin-dashboard-container {
            animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
            padding-top: 10px;
            font-family: 'Inter', sans-serif;
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .welcome-row {
            margin-bottom: 32px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }

          .welcome-title {
            font-size: 30px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0 0 6px;
            letter-spacing: -1px;
          }

          .welcome-sub {
            color: #999;
            font-size: 14px;
            margin-top: 0;
            font-weight: 500;
          }

          /* DASHBOARD STATS */
          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1.2fr;
            gap: 20px;
            margin-bottom: 24px;
          }

          .stat-card {
            padding: 24px;
            border-radius: 24px;
            color: white;
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 165px;
            transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(255,255,255,0.1);
          }

          .stat-card:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 20px 50px rgba(0,0,0,0.12);
          }

          .stat-inner-label {
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1.8px;
            opacity: 0.85;
          }

          .stat-value {
            font-size: 28px;
            font-weight: 900;
            margin: 8px 0;
            display: flex;
            align-items: baseline;
            gap: 5px;
          }
          .stat-value small { font-size: 16px; opacity: 0.8; }

          .stat-badge {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            padding: 5px 12px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 800;
            width: fit-content;
            border: 1px solid rgba(255,255,255,0.2);
          }

          .card-sales { background: linear-gradient(135deg, #c32d20 0%, #f44336 100%); }
          .card-orders { background: linear-gradient(135deg, #e65100 0%, #ff9800 100%); }
          .card-customers { background: #ffffff; color: #1a1a1a; border: 1px solid #f0f0f0; box-shadow: 0 8px 30px rgba(0,0,0,0.04); }
          .card-customers .stat-inner-label { color: #555; }
          .card-customers .stat-badge { background: #fdf5f5; border: 1px solid #fee2e2; color: #d32f2f; }

          .top-selling-card {
            background: #fff;
            padding: 24px;
            border-radius: 24px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.04);
            display: flex;
            align-items: center;
            gap: 18px;
            border: 1px solid #f0f0f0;
            transition: 0.3s;
            min-height: 165px;
          }
          .top-selling-card:hover { border-color: #fecaca; transform: translateY(-4px); box-shadow: 0 12px 35px rgba(0,0,0,0.06); }

          .prod-img-mini {
            width: 68px; height: 68px;
            border-radius: 16px;
            background: #fdf5f5;
            display: flex; align-items: center; justify-content: center;
            font-size: 26px;
            overflow: hidden;
            box-shadow: 0 6px 16px rgba(211,47,47,0.06);
            border: 1px solid #fef2f2;
            flex-shrink: 0;
          }
          .prod-img-mini img { width: 100%; height: 100%; object-fit: cover; }

          /* DATA VISUALIZATION */
          .dashboard-main-row {
            display: grid;
            grid-template-columns: 2.2fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          .chart-panel {
            background: #fff;
            padding: 28px;
            border-radius: 24px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.04);
            min-height: 360px;
            display: flex;
            flex-direction: column;
            border: 1px solid #f0f0f0;
          }

          .trending-panel {
            background: #fff;
            padding: 28px;
            border-radius: 24px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.04);
            border: 1px solid #f0f0f0;
          }

          .panel-title { font-size: 17px; font-weight: 900; color: #1a1a1a; margin: 0 0 4px; }
          .panel-sub { font-size: 13px; color: #aaa; margin-bottom: 18px; font-weight: 500; }

          .revenue-legend {
            display: flex; gap: 16px; justify-content: flex-end; margin-bottom: 14px;
          }
          .legend-item { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; color: #777; }
          .dot { width: 10px; height: 10px; border-radius: 50%; }

          .trend-item {
            background: #fafafa;
            padding: 13px 15px;
            border-radius: 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 14px;
            transition: all 0.3s;
            border: 1.5px solid #f0f0f0;
            text-decoration: none;
            color: inherit;
          }
          .trend-item:hover { transform: translateX(6px); border-color: #ff9f43; background: #fffaf5; box-shadow: 0 6px 18px rgba(255,159,67,0.08); }

          .btn-view-all {
            width: 100%;
            padding: 13px;
            background: linear-gradient(135deg, #c62828 0%, #d32f2f 100%);
            border: none;
            border-radius: 14px;
            color: #fff;
            font-weight: 800;
            font-size: 13px;
            cursor: pointer;
            margin-top: 14px;
            transition: all 0.3s;
            box-shadow: 0 6px 20px rgba(198,40,40,0.2);
            font-family: 'Inter', sans-serif;
          }
          .btn-view-all:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 28px rgba(198,40,40,0.3);
          }

          /* TABLE STYLING */
          .recent-orders-panel {
            background: #fff;
            padding: 28px;
            border-radius: 24px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.04);
            border: 1px solid #f0f0f0;
          }
          .order-table { width: 100%; border-collapse: collapse; margin-top: 14px; }
          .order-table th { text-align: left; padding: 12px 16px; color: #aaa; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #f0f0f0; }
          .order-table td { padding: 15px 16px; font-size: 13px; border-bottom: 1px solid #f8f8f8; font-weight: 600; color: #555; transition: 0.2s; }
          .order-table tr:last-child td { border-bottom: none; }
          .order-table tbody tr:hover td { background: #fff8f5; color: #c62828; }

          .status-chip { padding: 5px 12px; border-radius: 50px; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }

          .chart-container-svg {
            flex: 1;
            width: 100%;
            height: 230px;
            margin-top: 8px;
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
              <div className="legend-item"><div className="dot" style={{ background: '#ff416c' }}></div> Trực tuyến</div>
              <div className="legend-item"><div className="dot" style={{ background: '#f5af19' }}></div> Mang về</div>
            </div>

            <div className="chart-container-svg">
              <svg width="100%" height="100%" viewBox="0 0 600 230" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255, 65, 108, 0.4)" />
                    <stop offset="100%" stopColor="rgba(255, 65, 108, 0)" />
                  </linearGradient>
                  <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                    <feOffset dx="0" dy="8" result="offsetblur" />
                    <feComponentTransfer><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
                    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Grid Lines */}
                {[0, 1, 2, 3].map((f) => (
                  <g key={f}>
                    <line x1="0" y1={40 + f * 50} x2="600" y2={40 + f * 50} stroke="#f5f5f5" strokeWidth="1.5" strokeDasharray="6,6" />
                  </g>
                ))}

                {/* X-axis labels */}
                {['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6'].map((m, i) => (
                  <text key={i} x={i * 100 + 50} y="220" textAnchor="middle" fill="#999" fontSize="13" fontWeight="800">{m}</text>
                ))}

                {/* Area Fill */}
                <path 
                  d="M 50 140 C 80 140, 120 80, 150 80 C 180 80, 220 120, 250 120 C 280 120, 320 50, 350 50 C 380 50, 420 100, 450 100 C 480 100, 520 20, 550 20 L 550 190 L 50 190 Z" 
                  fill="url(#bgGrad)" 
                />

                {/* Secondary Line (Takeaway) */}
                <path 
                  d="M 50 160 C 80 160, 120 140, 150 140 C 180 140, 220 150, 250 150 C 280 150, 320 110, 350 110 C 380 110, 420 130, 450 130 C 480 130, 520 100, 550 100" 
                  fill="none" 
                  stroke="#f5af19" 
                  strokeWidth="3.5" 
                  strokeDasharray="8,6" 
                  strokeLinecap="round"
                />

                {/* Primary Line (Online) */}
                <path 
                  d="M 50 140 C 80 140, 120 80, 150 80 C 180 80, 220 120, 250 120 C 280 120, 320 50, 350 50 C 380 50, 420 100, 450 100 C 480 100, 520 20, 550 20" 
                  fill="none" 
                  stroke="#ff416c" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  filter="url(#lineGlow)" 
                />

                {/* Data Points */}
                {[{x:50, y:140}, {x:150, y:80}, {x:250, y:120}, {x:350, y:50}, {x:450, y:100}, {x:550, y:20}].map((p, idx) => (
                  <circle key={idx} cx={p.x} cy={p.y} r="6" fill="#fff" stroke="#ff416c" strokeWidth="3.5" />
                ))}

                {/* Tooltip on the highest point (Thg 6) */}
                <g transform="translate(550, 20)">
                  <rect x="-42" y="-38" width="84" height="28" rx="8" fill="#1a1a1a" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
                  <polygon points="0,-10 -6,-16 6,-16" fill="#1a1a1a" />
                  <text x="0" y="-19" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle">18.5M đ</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="trending-panel">
            <div className="panel-title">Món ăn thịnh hành</div>
            <div className="panel-sub">Khách hàng đang ưu tiên đặt món nào?</div>

            {this.state.trendingProducts.map((p, idx) => (
              <Link to="/admin/product" key={p._id} className="trend-item">
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
              </Link>
            ))}

            <Link to="/admin/product" className="btn-view-all" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Xem tất cả sản phẩm →</Link>
          </div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="recent-orders-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="panel-title">Đơn hàng gần nhất</div>
            <Link to="/admin/order" style={{ color: '#b3261e', textDecoration: 'none', fontSize: '13px', fontWeight: 800 }}>Xem tất cả lịch sử →</Link>
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