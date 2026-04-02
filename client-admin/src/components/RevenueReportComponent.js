import React, { Component } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import MyContext from '../contexts/MyContext';

class RevenueReport extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.state = {
      orders: [],
      filterMode: 'month',   // 'all' | 'month' | 'custom'
      dateFrom: this.toDateString(firstDay),
      dateTo: this.toDateString(now),
    };
  }

  toDateString(d) {
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      this.setState({ orders: res.data || [] });
    });
  }

  // ─── FILTER LOGIC ───
  setFilter(mode) {
    const now = new Date();
    let from, to;
    switch (mode) {
      case 'today':
        from = to = this.toDateString(now);
        break;
      case 'week': {
        const w = new Date(now);
        w.setDate(now.getDate() - 7);
        from = this.toDateString(w);
        to = this.toDateString(now);
        break;
      }
      case 'month': {
        from = this.toDateString(new Date(now.getFullYear(), now.getMonth(), 1));
        to = this.toDateString(now);
        break;
      }
      case 'quarter': {
        const qMonth = Math.floor(now.getMonth() / 3) * 3;
        from = this.toDateString(new Date(now.getFullYear(), qMonth, 1));
        to = this.toDateString(now);
        break;
      }
      case 'year': {
        from = this.toDateString(new Date(now.getFullYear(), 0, 1));
        to = this.toDateString(now);
        break;
      }
      case 'all':
        from = '2020-01-01';
        to = this.toDateString(now);
        break;
      default:
        return;
    }
    this.setState({ filterMode: mode, dateFrom: from, dateTo: to });
  }

  getFilteredOrders() {
    const { orders, dateFrom, dateTo, filterMode } = this.state;
    if (filterMode === 'all') return orders;
    const from = new Date(dateFrom + 'T00:00:00').getTime();
    const to = new Date(dateTo + 'T23:59:59').getTime();
    return orders.filter(o => o.cdate >= from && o.cdate <= to);
  }

  // ─── HELPERS ───
  getMonthlyData(approvedOrders) {
    const monthMap = {};
    approvedOrders.forEach(o => {
      const d = new Date(o.cdate);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      if (!monthMap[key]) monthMap[key] = { revenue: 0, count: 0 };
      monthMap[key].revenue += o.total;
      monthMap[key].count += 1;
    });
    const entries = Object.entries(monthMap).sort((a, b) => {
      const [mA, yA] = a[0].split('/').map(Number);
      const [mB, yB] = b[0].split('/').map(Number);
      return yA !== yB ? yA - yB : mA - mB;
    });
    return entries.slice(-6);
  }

  getTopProducts(approvedOrders) {
    const prodMap = {};
    approvedOrders.forEach(o => {
      (o.items || []).forEach(item => {
        const name = item.product?.name || 'Không rõ';
        if (!prodMap[name]) prodMap[name] = { qty: 0, revenue: 0 };
        prodMap[name].qty += item.quantity;
        prodMap[name].revenue += (item.product?.price || 0) * item.quantity;
      });
    });
    return Object.entries(prodMap)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5);
  }

  getTopCustomers(approvedOrders) {
    const custMap = {};
    approvedOrders.forEach(o => {
      const name = o.customer?.name || 'Ẩn danh';
      if (!custMap[name]) custMap[name] = { total: 0, count: 0 };
      custMap[name].total += o.total;
      custMap[name].count += 1;
    });
    return Object.entries(custMap)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5);
  }

  // ─── SVG BAR CHART ───
  renderBarChart(data, width = 700, height = 260) {
    if (data.length === 0) return <p style={{ textAlign: 'center', color: '#999' }}>Chưa có dữ liệu</p>;
    const maxVal = Math.max(...data.map(d => d[1].revenue));
    const barWidth = Math.min(60, (width - 80) / data.length - 12);
    const chartH = height - 65; /* Khống chế lại chiều cao để dư nhiều đỉnh phía trên hơn */

    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Biểu đồ doanh thu theo tháng">
        <title>Biểu đồ cột doanh thu theo tháng</title>
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
          <g key={i}>
            <line x1="60" y1={chartH - chartH * f + 25} x2={width - 10} y2={chartH - chartH * f + 25} stroke="#f0f0f0" strokeWidth="1" />
            <text x="55" y={chartH - chartH * f + 29} textAnchor="end" fill="#bbb" fontSize="10">
              {(maxVal * f / 1000).toFixed(0)}k
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const barH = maxVal > 0 ? (d[1].revenue / maxVal) * chartH : 0;
          const x = 70 + i * ((width - 90) / data.length);
          const y = chartH - barH + 25; /* Hệ số Dịch đồ thị xuống 25px */
          return (
            <g key={i}>
              <defs>
                <linearGradient id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff9f43" />
                  <stop offset="100%" stopColor="#d32f2f" />
                </linearGradient>
              </defs>
              <rect x={x} y={y} width={barWidth} height={barH} rx="6" ry="6" fill={`url(#bar-grad-${i})`}>
                <animate attributeName="height" from="0" to={barH} dur="0.6s" fill="freeze" />
                <animate attributeName="y" from={chartH + 25} to={y} dur="0.6s" fill="freeze" />
              </rect>
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="#d32f2f" fontSize="11" fontWeight="800">
                {(d[1].revenue / 1000).toFixed(0)}k
              </text>
              <text x={x + barWidth / 2} y={chartH + 43} textAnchor="middle" fill="#666" fontSize="11" fontWeight="600">
                {d[0]}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // ─── DONUT CHART ───
  renderDonutChart(allOrders) {
    const approved = allOrders.filter(o => o.status === 'APPROVED').length;
    const pending = allOrders.filter(o => o.status === 'PENDING').length;
    const canceled = allOrders.filter(o => o.status === 'CANCELED').length;
    const total = allOrders.length || 1;
    const r = 60;
    const cx = 80;
    const cy = 80;
    const circ = 2 * Math.PI * r;

    const segments = [
      { label: 'Đã duyệt', count: approved, color: '#16a34a', pct: approved / total },
      { label: 'Chờ duyệt', count: pending, color: '#f59e0b', pct: pending / total },
      { label: 'Đã hủy', count: canceled, color: '#dc2626', pct: canceled / total },
    ];

    let offset = 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="Biểu đồ tròn trạng thái đơn hàng">
          <title>Biểu đồ tròn phân bố trạng thái đơn hàng</title>
          {segments.map((seg, i) => {
            const dash = seg.pct * circ;
            const gap = circ - dash;
            const currentOffset = offset;
            offset += dash;
            return (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="20"
                strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-currentOffset}
                transform={`rotate(-90 ${cx} ${cy})`}>
                <animate attributeName="stroke-dasharray" from={`0 ${circ}`} to={`${dash} ${gap}`} dur="0.8s" fill="freeze" />
              </circle>
            );
          })}
          <text x={cx} y={cy - 4} textAnchor="middle" fill="#333" fontSize="22" fontWeight="900">{total}</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="#999" fontSize="11">đơn hàng</text>
        </svg>
        <div>
          {segments.map((seg, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: seg.color, display: 'inline-block' }}></span>
              <span style={{ fontWeight: 700, color: '#333', minWidth: '80px' }}>{seg.label}</span>
              <span style={{ color: '#777' }}>{seg.count} ({(seg.pct * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const filteredOrders = this.getFilteredOrders();
    const allOrders = filteredOrders;
    const approvedOrders = allOrders.filter(o => o.status === 'APPROVED');
    const pendingOrders = allOrders.filter(o => o.status === 'PENDING');
    const canceledOrders = allOrders.filter(o => o.status === 'CANCELED');
    const totalRevenue = approvedOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = approvedOrders.length > 0 ? totalRevenue / approvedOrders.length : 0;
    const pendingRevenue = pendingOrders.reduce((sum, o) => sum + o.total, 0);

    const monthlyData = this.getMonthlyData(approvedOrders);
    const topProducts = this.getTopProducts(approvedOrders);
    const topCustomers = this.getTopCustomers(approvedOrders);
    const topProdMax = topProducts.length > 0 ? topProducts[0][1].revenue : 1;

    const { filterMode, dateFrom, dateTo } = this.state;
    const filterButtons = [
      { key: 'today', label: 'Hôm nay' },
      { key: 'week', label: '7 ngày' },
      { key: 'month', label: 'Tháng này' },
      { key: 'quarter', label: 'Quý này' },
      { key: 'year', label: 'Năm nay' },
      { key: 'all', label: 'Tất cả' },
    ];

    const orderRows = approvedOrders.map((item, index) => (
      <tr key={item._id}>
        <td>{index + 1}</td>
        <td className="rv-id-cell">#{item._id.substring(item._id.length - 8)}</td>
        <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
        <td className="rv-bold">{item.customer?.name}</td>
        <td className="rv-price">{item.total?.toLocaleString()} đ</td>
      </tr>
    ));

    return (
      <div className="rv-page">
        <Helmet>
          <title>Báo Cáo Doanh Thu | MUKBANG KOREA FOOD ADMIN</title>
          <meta name="description" content="Bảng báo cáo doanh thu chi tiết cửa hàng Mukbang Korea Food. Biểu đồ thống kê, sản phẩm bán chạy, và phân tích khách hàng." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <style>{`
          .rv-page { padding: 28px 32px; min-height: 92vh; font-family: 'Inter','Segoe UI',sans-serif; background: linear-gradient(135deg,#fafafa 0%,#fff5f0 100%); }
          .rv-page *, .rv-page *::before, .rv-page *::after { box-sizing: border-box; }

          /* HEADER */
          .rv-header { text-align:center; margin-bottom:12px; }
          .rv-title { color:#d32f2f; font-size:30px; font-weight:900; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 6px; }
          .rv-subtitle { color:#888; font-size:14px; margin:0; }

          /* FILTER BAR */
          .rv-filter-bar { background:#fff; border-radius:16px; padding:18px 24px; margin-bottom:24px; box-shadow:0 4px 16px rgba(0,0,0,.04); border:1px solid #f0f0f0; display:flex; flex-wrap:wrap; align-items:center; gap:12px; }
          .rv-filter-label { font-weight:800; font-size:13px; color:#555; text-transform:uppercase; letter-spacing:.5px; margin-right:4px; }
          .rv-filter-btns { display:flex; gap:6px; flex-wrap:wrap; }
          .rv-fbtn { border:1.5px solid #e5e5e5; background:#fafafa; color:#666; padding:7px 16px; border-radius:10px; cursor:pointer; font-size:12px; font-weight:700; transition:all .25s; }
          .rv-fbtn:hover { border-color:#ff9f43; color:#d32f2f; background:#fff5f0; }
          .rv-fbtn.active { background:linear-gradient(135deg,#ff9f43,#d32f2f); color:white; border-color:transparent; box-shadow:0 4px 12px rgba(211,47,47,.25); }
          .rv-filter-dates { display:flex; align-items:center; gap:8px; margin-left:auto; }
          .rv-filter-dates label { font-size:12px; font-weight:600; color:#777; }
          .rv-date-input { border:1.5px solid #e5e5e5; border-radius:8px; padding:6px 10px; font-size:12px; font-family:inherit; color:#333; outline:none; transition:border .2s; }
          .rv-date-input:focus { border-color:#d32f2f; }
          .rv-date-sep { color:#ccc; font-size:12px; }
          .rv-filter-count { font-size:12px; color:#999; margin-left:8px; font-style:italic; }

          /* KPI CARDS */
          .rv-kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; margin-bottom:32px; }
          .rv-kpi { border-radius:18px; padding:22px 24px; color:white; position:relative; overflow:hidden; box-shadow:0 8px 28px rgba(0,0,0,.12); }
          .rv-kpi::after { content:''; position:absolute; top:-30px; right:-30px; width:100px; height:100px; border-radius:50%; background:rgba(255,255,255,.12); }
          .rv-kpi h2 { margin:0 0 8px; font-size:13px; text-transform:uppercase; opacity:.85; letter-spacing:.5px; }
          .rv-kpi p { margin:0; font-size:26px; font-weight:900; }
          .rv-kpi span { display:block; font-size:11px; margin-top:6px; opacity:.7; }
          .rv-kpi-1 { background:linear-gradient(135deg,#16a34a,#15803d); }
          .rv-kpi-2 { background:linear-gradient(135deg,#ff9f43,#d32f2f); }
          .rv-kpi-3 { background:linear-gradient(135deg,#3b82f6,#1d4ed8); }
          .rv-kpi-4 { background:linear-gradient(135deg,#f59e0b,#d97706); }

          /* SECTIONS */
          .rv-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:24px; }
          @media(max-width:900px){ .rv-grid{grid-template-columns:1fr;} .rv-filter-dates{margin-left:0;width:100%;} }
          .rv-card { background:#fff; border-radius:18px; padding:24px 28px; box-shadow:0 6px 24px rgba(0,0,0,.05); border:1px solid #f0f0f0; }
          .rv-card-title { color:#d32f2f; font-size:17px; font-weight:800; margin:0 0 18px; display:flex; align-items:center; gap:8px; border-bottom:2px solid #ff9f43; padding-bottom:10px; text-transform:uppercase; letter-spacing:.3px; }
          .rv-full { grid-column: 1 / -1; }

          /* TOP PRODUCTS BAR */
          .rv-hbar { margin-bottom:14px; }
          .rv-hbar-label { display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px; }
          .rv-hbar-label strong { color:#333; }
          .rv-hbar-label span { color:#16a34a; font-weight:800; }
          .rv-hbar-track { height:22px; background:#f5f5f5; border-radius:11px; overflow:hidden; }
          .rv-hbar-fill { height:100%; border-radius:11px; background:linear-gradient(90deg,#ff9f43,#d32f2f); transition:width .8s ease; display:flex; align-items:center; justify-content:flex-end; padding-right:8px; }
          .rv-hbar-fill span { font-size:10px; color:white; font-weight:700; }

          /* TOP CUSTOMERS */
          .rv-cust-row { display:flex; align-items:center; gap:14px; padding:10px 0; border-bottom:1px solid #f5f5f5; }
          .rv-cust-row:last-child { border-bottom:none; }
          .rv-cust-rank { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:900; color:white; flex-shrink:0; }
          .rv-cust-rank.r1 { background:linear-gradient(135deg,#f59e0b,#d97706); }
          .rv-cust-rank.r2 { background:linear-gradient(135deg,#9ca3af,#6b7280); }
          .rv-cust-rank.r3 { background:linear-gradient(135deg,#b45309,#92400e); }
          .rv-cust-rank.r4,.rv-cust-rank.r5 { background:#e5e7eb; color:#666; }
          .rv-cust-info { flex:1; }
          .rv-cust-info strong { display:block; color:#222; font-size:14px; }
          .rv-cust-info span { color:#999; font-size:12px; }
          .rv-cust-total { font-weight:800; color:#d32f2f; font-size:14px; white-space:nowrap; }

          /* TABLE */
          .rv-table { width:100%; border-collapse:collapse; font-size:14px; }
          .rv-table th { background:#fff5f5; padding:14px 16px; text-align:left; color:#d32f2f; text-transform:uppercase; font-weight:800; font-size:12px; border-bottom:2px solid #d32f2f; }
          .rv-table td { padding:14px 16px; border-bottom:1px solid #f3f3f3; color:#444; }
          .rv-table tbody tr:hover td { background:#fffaf5; }
          .rv-id-cell { font-family:'Fira Code',monospace; font-weight:700; color:#999; font-size:12px; }
          .rv-bold { font-weight:700; color:#222; }
          .rv-price { font-weight:800; color:#16a34a; }
          .rv-empty { text-align:center; padding:40px 16px !important; color:#bbb; font-style:italic; }

          /* SEO & Accessibility Hidden Class */
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          }
        `}</style>

        {/* ── HEADER ── */}
        <header className="rv-header">
          <h1 className="rv-title">📊 Bảng Báo Cáo Doanh Thu</h1>
          <p className="rv-subtitle">Tổng hợp phân tích kinh doanh — Mukbang Korea Food</p>
        </header>

        {/* ── FILTER BAR ── */}
        <div className="rv-filter-bar">
          <span className="rv-filter-label">🔍 Lọc theo:</span>
          <div className="rv-filter-btns">
            {filterButtons.map(fb => (
              <button
                key={fb.key}
                className={`rv-fbtn ${filterMode === fb.key ? 'active' : ''}`}
                onClick={() => this.setFilter(fb.key)}
              >
                {fb.label}
              </button>
            ))}
          </div>
          <div className="rv-filter-dates">
            <label>Từ</label>
            <input
              type="date"
              className="rv-date-input"
              value={dateFrom}
              onChange={(e) => this.setState({ dateFrom: e.target.value, filterMode: 'custom' })}
            />
            <span className="rv-date-sep">→</span>
            <label>Đến</label>
            <input
              type="date"
              className="rv-date-input"
              value={dateTo}
              onChange={(e) => this.setState({ dateTo: e.target.value, filterMode: 'custom' })}
            />
          </div>
          <span className="rv-filter-count">
            ({filteredOrders.length} đơn hàng)
          </span>
        </div>

        {/* ── KPI CARDS ── */}
        <nav className="rv-kpis" aria-label="Chỉ số kinh doanh chính">
          <div className="rv-kpi rv-kpi-1">
            <h2>💰 Tổng Doanh Thu</h2>
            <p>{totalRevenue.toLocaleString()} đ</p>
            <span>Từ {approvedOrders.length} đơn đã duyệt</span>
          </div>
          <div className="rv-kpi rv-kpi-2">
            <h2>📦 Tổng Đơn Hàng</h2>
            <p>{allOrders.length}</p>
            <span>{approvedOrders.length} duyệt · {pendingOrders.length} chờ · {canceledOrders.length} hủy</span>
          </div>
          <div className="rv-kpi rv-kpi-3">
            <h2>📈 Giá Trị TB / Đơn</h2>
            <p>{avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} đ</p>
            <span>Trung bình mỗi đơn duyệt</span>
          </div>
          <div className="rv-kpi rv-kpi-4">
            <h2>⏳ Doanh Thu Chờ Duyệt</h2>
            <p>{pendingRevenue.toLocaleString()} đ</p>
            <span>{pendingOrders.length} đơn đang chờ xử lý</span>
          </div>
        </nav>

        {/* ── CHARTS ROW ── */}
        <div className="rv-grid">
          <article className="rv-card" aria-label="Thống kê doanh thu theo tháng">
            <header>
              <h2 className="rv-card-title">📈 Doanh Thu Theo Tháng</h2>
            </header>
            
            <figure style={{ margin: 0, padding: 0 }}>
              {this.renderBarChart(monthlyData)}
              <figcaption className="sr-only">
                Biểu đồ thể hiện doanh thu theo từng tháng của thương hiệu Mukbang Korea Food
              </figcaption>
            </figure>

            {/* Bảng dữ liệu chuẩn SEO ẩn (Search Engine & Screen Readers) */}
            <table className="sr-only">
              <caption>Dữ liệu chi tiết doanh thu theo tháng</caption>
              <thead>
                <tr>
                  <th scope="col">Tháng / Năm</th>
                  <th scope="col">Doanh thu (VNĐ)</th>
                  <th scope="col">Tổng số đơn</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((d, i) => (
                  <tr key={i}>
                    <td>{d[0]}</td>
                    <td>{d[1].revenue.toLocaleString()} VNĐ</td>
                    <td>{d[1].count} đơn</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <section className="rv-card" aria-label="Phân bố trạng thái đơn hàng">
            <h2 className="rv-card-title">🔄 Trạng Thái Đơn Hàng</h2>
            {this.renderDonutChart(allOrders)}
          </section>
        </div>

        {/* ── TOP PRODUCTS & CUSTOMERS ── */}
        <div className="rv-grid">
          <section className="rv-card" aria-label="Top 5 sản phẩm bán chạy">
            <h2 className="rv-card-title">🏆 Top Sản Phẩm Bán Chạy</h2>
            {topProducts.length > 0 ? topProducts.map((p, i) => (
              <div className="rv-hbar" key={i}>
                <div className="rv-hbar-label">
                  <strong>{i + 1}. {p[0]}</strong>
                  <span>{p[1].revenue.toLocaleString()} đ ({p[1].qty} phần)</span>
                </div>
                <div className="rv-hbar-track">
                  <div className="rv-hbar-fill" style={{ width: `${(p[1].revenue / topProdMax) * 100}%` }}>
                    <span>{((p[1].revenue / topProdMax) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )) : <p style={{ color: '#bbb', textAlign: 'center' }}>Chưa có dữ liệu sản phẩm</p>}
          </section>

          <section className="rv-card" aria-label="Top 5 khách hàng thân thiết">
            <h2 className="rv-card-title">👑 Khách Hàng Thân Thiết</h2>
            {topCustomers.length > 0 ? topCustomers.map((c, i) => (
              <div className="rv-cust-row" key={i}>
                <div className={`rv-cust-rank r${i + 1}`}>{i + 1}</div>
                <div className="rv-cust-info">
                  <strong>{c[0]}</strong>
                  <span>{c[1].count} đơn hàng</span>
                </div>
                <div className="rv-cust-total">{c[1].total.toLocaleString()} đ</div>
              </div>
            )) : <p style={{ color: '#bbb', textAlign: 'center' }}>Chưa có dữ liệu</p>}
          </section>
        </div>

        {/* ── DETAIL TABLE ── */}
        <article className="rv-card rv-full" style={{ marginBottom: '24px' }}>
          <h2 className="rv-card-title">📋 Chi Tiết Đơn Hàng Đã Duyệt</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="rv-table">
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Mã Đơn</th>
                  <th scope="col">Ngày</th>
                  <th scope="col">Khách Hàng</th>
                  <th scope="col">Doanh Thu</th>
                </tr>
              </thead>
              <tbody>
                {orderRows.length > 0 ? orderRows : (
                  <tr><td colSpan="5" className="rv-empty">Chưa có đơn hàng nào được duyệt</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    );
  }
}

export default RevenueReport;
