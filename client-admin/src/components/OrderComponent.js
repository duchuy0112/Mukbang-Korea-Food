import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
      activeFilter: 'ALL',
      currentPage: 1,
      ordersPerPage: 10,
      sortBy: 'newest',
      dateRange: '30',
      showAddModal: false,
      allProducts: [],
      searchProduct: '',
      newOrderCustomer: { name: 'Khách vãng lai', phone: '', email: 'guest@mukbang.com', address: 'Dùng tại quán' },
      newOrderItems: []
    };
  }

  getFilteredOrders() {
    const { orders, activeFilter } = this.state;
    if (activeFilter === 'ALL') return orders;
    return orders.filter(o => o.status === activeFilter);
  }

  getPaginatedOrders() {
    const filtered = this.getFilteredOrders();
    const { currentPage, ordersPerPage } = this.state;
    const start = (currentPage - 1) * ordersPerPage;
    return filtered.slice(start, start + ordersPerPage);
  }

  getTotalPages() {
    const filtered = this.getFilteredOrders();
    return Math.max(1, Math.ceil(filtered.length / this.state.ordersPerPage));
  }

  getInitials(name) {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getAvatarColor(name) {
    const colors = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784', '#aed581', '#ff8a65', '#a1887f'];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getStatusLabel(status) {
    switch (status) {
      case 'PENDING': return 'Đang xử lý';
      case 'APPROVED': return 'Đã giao';
      case 'CANCELED': return 'Đã hủy';
      default: return status;
    }
  }

  getStatusStyle(status) {
    switch (status) {
      case 'PENDING': return { background: '#fff3e0', color: '#e65100', border: '1px solid #ffe0b2' };
      case 'APPROVED': return { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9' };
      case 'CANCELED': return { background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2' };
      default: return { background: '#f5f5f5', color: '#666' };
    }
  }

  getPaymentMethod(index) {
    const methods = [
      { icon: '💳', label: 'Thẻ tín dụng' },
      { icon: '📱', label: 'Ví điện tử' },
      { icon: '🚚', label: 'Thanh toán khi nhận hàng' },
      { icon: '🏦', label: 'Chuyển khoản' }
    ];
    return methods[index % methods.length];
  }

  render() {
    const filteredOrders = this.getFilteredOrders();
    const paginatedOrders = this.getPaginatedOrders();
    const totalPages = this.getTotalPages();
    const { currentPage, activeFilter } = this.state;

    const filterTabs = [
      { key: 'ALL', label: 'Tất cả đơn hàng' },
      { key: 'PENDING', label: 'Đang xử lý' },
      { key: 'APPROVED', label: 'Đã giao' },
      { key: 'CANCELED', label: 'Đã hủy' }
    ];

    const pendingCount = this.state.orders.filter(o => o.status === 'PENDING').length;

    // Chi tiết đơn hàng
    let detailItems = null;
    if (this.state.order) {
      detailItems = this.state.order.items.map((item, index) => (
        <tr key={item.product._id} className="ord-detail-row">
          <td>{index + 1}</td>
          <td className="ord-id-mono">{item.product._id.substring(0,8)}</td>
          <td style={{ fontWeight: 700 }}>{item.product.name}</td>
          <td>
            <img src={"data:image/jpg;base64," + item.product.image} className="ord-prod-thumb" alt="" />
          </td>
          <td>{item.product.price?.toLocaleString()} đ</td>
          <td><span className="ord-qty-chip">{item.quantity}</span></td>
          <td className="ord-price-bold">{(item.product.price * item.quantity).toLocaleString()} đ</td>
        </tr>
      ));
    }

    // Tính toán thống kê
    const totalOrderValue = this.state.orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderValue = this.state.orders.length > 0 ? Math.round(totalOrderValue / this.state.orders.length) : 0;

    return (
      <div className="ord-page">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

          .ord-page {
            padding: 10px 0 40px;
            font-family: 'Inter', sans-serif;
            animation: ord-fadeIn 0.6s ease-out;
          }

          @keyframes ord-fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* HEADER */
          .ord-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
          }

          .ord-header-left h1 {
            font-size: 32px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0 0 8px;
            letter-spacing: -1px;
          }

          .ord-header-subtitle {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #777;
            font-weight: 500;
          }

          .ord-dot-orange {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ff9800;
            display: inline-block;
            animation: ord-pulse 2s infinite;
          }

          @keyframes ord-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.3); }
          }

          .ord-header-actions {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .ord-date-filter {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 22px;
            background: #fff;
            border: 1.5px solid #e8e8e8;
            border-radius: 14px;
            font-size: 14px;
            font-weight: 700;
            color: #444;
            cursor: pointer;
            transition: all 0.3s;
          }

          .ord-date-filter:hover {
            border-color: #d32f2f;
            background: #fffafa;
          }

          .ord-date-select {
            border: none;
            outline: none;
            background: transparent;
            font-size: 14px;
            font-weight: 700;
            color: #444;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            padding-right: 18px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 0 center;
            font-family: 'Inter', sans-serif;
          }

          .ord-btn-add {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 26px;
            background: linear-gradient(135deg, #c62828 0%, #d32f2f 100%);
            color: white;
            border: none;
            border-radius: 14px;
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 6px 20px rgba(211,47,47,0.25);
          }

          .ord-btn-add:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(211,47,47,0.35);
          }

          /* FILTER BAR */
          .ord-filter-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            background: #fff;
            padding: 8px 12px 8px 20px;
            border-radius: 16px;
            border: 1px solid #f0f0f0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          }

          .ord-filter-left {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .ord-filter-label {
            font-size: 13px;
            font-weight: 700;
            color: #999;
            margin-right: 8px;
          }

          .ord-filter-tab {
            padding: 10px 20px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
            color: #777;
            cursor: pointer;
            transition: all 0.25s;
            border: 1.5px solid transparent;
            background: transparent;
          }

          .ord-filter-tab:hover {
            color: #d32f2f;
            background: #fff5f5;
          }

          .ord-filter-tab.active {
            color: #c62828;
            background: #fff;
            border-color: #d32f2f;
            box-shadow: 0 4px 15px rgba(211,47,47,0.1);
          }

          .ord-sort-section {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .ord-sort-label {
            font-size: 12px;
            font-weight: 700;
            color: #bbb;
          }

          .ord-sort-select {
            padding: 8px 16px;
            border: 1.5px solid #eee;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 800;
            color: #c62828;
            background: #fff;
            cursor: pointer;
            outline: none;
            appearance: none;
            -webkit-appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 32px;
          }

          /* TABLE CONTAINER */
          .ord-table-wrapper {
            background: #fff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 8px 35px rgba(0,0,0,0.04);
            border: 1px solid #f0f0f0;
            margin-bottom: 24px;
          }

          .ord-table {
            width: 100%;
            border-collapse: collapse;
          }

          .ord-table th {
            padding: 18px 20px;
            text-align: left;
            font-size: 11px;
            font-weight: 900;
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: #fafafa;
            border-bottom: 1px solid #f0f0f0;
          }

          .ord-table tbody tr {
            border-bottom: 1px solid #f5f5f5;
            cursor: pointer;
            transition: all 0.25s;
          }

          .ord-table tbody tr:last-child {
            border-bottom: none;
          }

          .ord-table tbody tr:hover {
            background: #fffaf5;
          }

          .ord-table tbody tr.ord-active-row {
            background: #fff8f5 !important;
          }

          .ord-table td {
            padding: 18px 20px;
            font-size: 14px;
            color: #555;
            font-weight: 500;
            vertical-align: middle;
          }

          .ord-id-cell {
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-weight: 800;
            color: #c62828;
            font-size: 13px;
          }

          /* Customer cell with avatar */
          .ord-customer-cell {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .ord-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 900;
            color: #fff;
            flex-shrink: 0;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          }

          .ord-customer-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .ord-customer-name {
            font-weight: 800;
            color: #1a1a1a;
            font-size: 14px;
          }

          .ord-customer-email {
            font-size: 12px;
            color: #999;
            font-weight: 500;
          }

          .ord-date-cell {
            font-size: 13px;
            color: #777;
            font-weight: 600;
          }

          .ord-total-cell {
            font-weight: 900;
            color: #1a1a1a;
            font-size: 15px;
          }

          .ord-payment-cell {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #666;
            font-weight: 600;
          }

          .ord-status-badge {
            padding: 6px 16px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 800;
            display: inline-block;
            white-space: nowrap;
          }

          .ord-action-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: #f5f5f5;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.2s;
            color: #999;
          }

          .ord-action-btn:hover {
            background: #fee2e2;
            color: #c62828;
          }

          /* Approve/Cancel popover */
          .ord-action-popover {
            display: flex;
            gap: 6px;
          }

          .ord-btn-approve, .ord-btn-cancel {
            padding: 6px 14px;
            border: none;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.25s;
          }

          .ord-btn-approve {
            background: #e8f5e9;
            color: #2e7d32;
          }

          .ord-btn-approve:hover {
            background: #2e7d32;
            color: #fff;
            transform: scale(1.05);
          }

          .ord-btn-cancel {
            background: #ffebee;
            color: #c62828;
          }

          .ord-btn-cancel:hover {
            background: #c62828;
            color: #fff;
            transform: scale(1.05);
          }

          /* PAGINATION */
          .ord-pagination-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            margin-bottom: 30px;
          }

          .ord-pagination-info {
            font-size: 13px;
            color: #999;
            font-weight: 600;
          }

          .ord-pagination-controls {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .ord-page-btn {
            width: 38px;
            height: 38px;
            border: 1.5px solid #e8e8e8;
            background: #fff;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 700;
            color: #555;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .ord-page-btn:hover {
            border-color: #d32f2f;
            color: #d32f2f;
            background: #fff5f5;
          }

          .ord-page-btn.active {
            background: #c62828;
            color: #fff;
            border-color: #c62828;
            box-shadow: 0 4px 15px rgba(198,40,40,0.3);
          }

          .ord-page-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }

          .ord-page-ellipsis {
            font-size: 14px;
            color: #ccc;
            padding: 0 4px;
            font-weight: 700;
          }

          /* BOTTOM STATS */
          .ord-bottom-stats {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
          }

          .ord-stat-card {
            padding: 28px;
            border-radius: 24px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s;
          }

          .ord-stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.1);
          }

          .ord-stat-card-1 {
            background: linear-gradient(135deg, #c62828 0%, #e53935 100%);
            color: #fff;
          }

          .ord-stat-card-2 {
            background: linear-gradient(135deg, #bf360c 0%, #e64a19 100%);
            color: #fff;
          }

          .ord-stat-card-3 {
            background: linear-gradient(135deg, #d84315 0%, #ff5722 100%);
            color: #fff;
          }

          .ord-stat-title {
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            opacity: 0.85;
            margin-bottom: 10px;
          }

          .ord-stat-value {
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 8px;
            letter-spacing: -1px;
          }

          .ord-stat-sub {
            font-size: 12px;
            font-weight: 600;
            opacity: 0.8;
          }

          .ord-stat-icon {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 42px;
            opacity: 0.15;
          }

          .ord-stat-trend {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 700;
            margin-top: 4px;
          }

          /* DETAIL SECTION */
          .ord-detail-overlay {
            background: #fff;
            border-radius: 24px;
            padding: 30px;
            margin-bottom: 24px;
            border: 2px solid #ff9800;
            box-shadow: 0 10px 40px rgba(255,152,0,0.08);
            animation: ord-slideIn 0.4s ease-out;
          }

          @keyframes ord-slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .ord-detail-title {
            font-size: 20px;
            font-weight: 900;
            color: #c62828;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 2px solid #ff9800;
            padding-bottom: 12px;
          }

          .ord-detail-table {
            width: 100%;
            border-collapse: collapse;
          }

          .ord-detail-table th {
            padding: 14px 18px;
            text-align: left;
            font-size: 11px;
            font-weight: 900;
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: #fafafa;
            border-bottom: 1px solid #f0f0f0;
          }

          .ord-detail-row td {
            padding: 14px 18px;
            font-size: 14px;
            border-bottom: 1px solid #f5f5f5;
            font-weight: 500;
          }

          .ord-id-mono {
            font-family: monospace;
            color: #888;
            font-weight: 700;
            font-size: 12px;
          }

          .ord-prod-thumb {
            width: 48px;
            height: 48px;
            object-fit: cover;
            border-radius: 12px;
            border: 1px solid #eee;
          }

          .ord-qty-chip {
            background: #f0f0f0;
            padding: 4px 12px;
            border-radius: 50px;
            font-weight: 800;
            font-size: 13px;
          }

          .ord-price-bold {
            font-weight: 900;
            color: #c62828;
          }

          .ord-close-detail {
            float: right;
            background: #f5f5f5;
            border: none;
            padding: 6px 14px;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s;
            font-size: 13px;
            color: #888;
          }

          .ord-close-detail:hover {
            background: #ffebee;
            color: #c62828;
          }

          /* Empty state */
          .ord-empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #ccc;
          }

          .ord-empty-icon {
            font-size: 48px;
            margin-bottom: 15px;
          }

          .ord-empty-text {
            font-size: 16px;
            font-weight: 700;
            color: #bbb;
          }
        `}</style>

        {/* HEADER */}
        <div className="ord-header">
          <div className="ord-header-left">
            <h1>Quản lý đơn hàng</h1>
            <div className="ord-header-subtitle">
              <span className="ord-dot-orange"></span>
              {pendingCount} đơn hàng mới được xử lý hôm nay
            </div>
          </div>
          <div className="ord-header-actions">
            <div className="ord-date-filter">
              📅
              <select
                className="ord-date-select"
                value={this.state.dateRange}
                onChange={(e) => this.setState({ dateRange: e.target.value })}
              >
                <option value="7">7 ngày qua</option>
                <option value="14">14 ngày qua</option>
                <option value="30">30 ngày qua</option>
                <option value="90">90 ngày qua</option>
                <option value="all">Tất cả</option>
              </select>
            </div>
            <button className="ord-btn-add" onClick={this.openAddModal}>
              + Đơn hàng thủ công
            </button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="ord-filter-bar">
          <div className="ord-filter-left">
            <span className="ord-filter-label">Bộ lọc:</span>
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                className={`ord-filter-tab ${activeFilter === tab.key ? 'active' : ''}`}
                onClick={() => this.setState({ activeFilter: tab.key, currentPage: 1 })}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="ord-sort-section">
            <span className="ord-sort-label">Sắp xếp theo:</span>
            <select
              className="ord-sort-select"
              value={this.state.sortBy}
              onChange={(e) => this.setState({ sortBy: e.target.value })}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="highest">Giá cao nhất</option>
              <option value="lowest">Giá thấp nhất</option>
            </select>
          </div>
        </div>

        {/* ORDER DETAIL (if selected) */}
        {this.state.order && (
          <div className="ord-detail-overlay">
            <div className="ord-detail-title">
              🔍 Chi tiết đơn hàng #{this.state.order._id.substring(0, 8)}
              <button className="ord-close-detail" onClick={() => this.setState({ order: null })}>✕ Đóng</button>
            </div>
            <table className="ord-detail-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã SP</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Hình Ảnh</th>
                  <th>Đơn Giá</th>
                  <th>Số Lượng</th>
                  <th>Thành Tiền</th>
                </tr>
              </thead>
              <tbody>
                {detailItems}
              </tbody>
            </table>
          </div>
        )}

        {/* ORDER TABLE */}
        <div className="ord-table-wrapper">
          <table className="ord-table">
            <thead>
              <tr>
                <th>ID Đơn hàng</th>
                <th>Khách hàng</th>
                <th>Ngày & Giờ</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? paginatedOrders.map((item, idx) => {
                const isActive = this.state.order?._id === item._id;
                const initials = this.getInitials(item.customer?.name);
                const avatarBg = this.getAvatarColor(item.customer?.name);
                const statusStyle = this.getStatusStyle(item.status);
                const payment = this.getPaymentMethod(idx);
                const orderDate = new Date(item.cdate);

                return (
                  <tr 
                    key={item._id}
                    className={isActive ? 'ord-active-row' : ''}
                    onClick={() => this.trItemClick(item)}
                  >
                    <td>
                      <span className="ord-id-cell">#MK-{item._id.substring(item._id.length - 5).toUpperCase()}</span>
                    </td>
                    <td>
                      <div className="ord-customer-cell">
                        <div className="ord-avatar" style={{ background: avatarBg }}>
                          {initials}
                        </div>
                        <div className="ord-customer-info">
                          <div className="ord-customer-name">{item.customer?.name || 'N/A'}</div>
                          <div className="ord-customer-email">{item.customer?.phone || item.customer?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="ord-date-cell">
                      {orderDate.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' })} • {orderDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="ord-total-cell">
                      {item.total?.toLocaleString()} đ
                    </td>
                    <td>
                      <div className="ord-payment-cell">
                        <span>{payment.icon}</span>
                        {payment.label}
                      </div>
                    </td>
                    <td>
                      <span className="ord-status-badge" style={statusStyle}>
                        {this.getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {item.status === 'PENDING' ? (
                        <div className="ord-action-popover">
                          <button className="ord-btn-approve" onClick={() => this.lnkApproveClick(item._id)}>✓ DUYỆT</button>
                          <button className="ord-btn-cancel" onClick={() => this.lnkCancelClick(item._id)}>✕ HỦY</button>
                        </div>
                      ) : (
                        <button className="ord-action-btn">⋮</button>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="7">
                    <div className="ord-empty-state">
                      <div className="ord-empty-icon">📦</div>
                      <div className="ord-empty-text">Không có đơn hàng nào</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="ord-pagination-bar">
          <div className="ord-pagination-info">
            Hiển thị {Math.min((currentPage - 1) * this.state.ordersPerPage + 1, filteredOrders.length)}-{Math.min(currentPage * this.state.ordersPerPage, filteredOrders.length)} trong số {filteredOrders.length.toLocaleString()} đơn hàng
          </div>
          <div className="ord-pagination-controls">
            <button 
              className="ord-page-btn" 
              disabled={currentPage === 1}
              onClick={() => this.setState({ currentPage: currentPage - 1 })}
            >
              ‹
            </button>
            {this.renderPageButtons(totalPages, currentPage)}
            <button 
              className="ord-page-btn" 
              disabled={currentPage === totalPages}
              onClick={() => this.setState({ currentPage: currentPage + 1 })}
            >
              ›
            </button>
          </div>
        </div>

        {/* BOTTOM STATS */}
        <div className="ord-bottom-stats">
          <div className="ord-stat-card ord-stat-card-1">
            <div className="ord-stat-title">Giá trị đơn hàng trung bình</div>
            <div className="ord-stat-value">{avgOrderValue.toLocaleString()} đ</div>
            <div className="ord-stat-trend">
              📈 +12% so với tháng trước
            </div>
            <div className="ord-stat-icon">💰</div>
          </div>
          <div className="ord-stat-card ord-stat-card-2">
            <div className="ord-stat-title">Khu vực bán chạy nhất</div>
            <div className="ord-stat-value">Quận 1</div>
            <div className="ord-stat-sub">24% tổng số đơn giao hôm nay</div>
            <div className="ord-stat-icon">📍</div>
          </div>
          <div className="ord-stat-card ord-stat-card-3">
            <div className="ord-stat-title">Giờ cao điểm</div>
            <div className="ord-stat-value">12:30 PM</div>
            <div className="ord-stat-sub">Lượng khách giờ trưa ổn định</div>
            <div className="ord-stat-icon">🕐</div>
          </div>
        </div>
        {/* ADD MANUAL ORDER MODAL */}
        {this.state.showAddModal && (
          <div className="ord-detail-overlay" style={{ zIndex: 1000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', inset: 0 }}>
            <div className="ord-detail-card" style={{ width: '900px', maxWidth: '95vw', maxHeight: '90vh', background: '#fff', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="ord-detail-title" style={{ padding: '24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 900 }}>Tạo đơn hàng thủ công</span>
                <button className="ord-close-detail" onClick={this.closeAddModal}>✕ Đóng</button>
              </div>
              
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left: Product List */}
                <div style={{ flex: 1, padding: '24px', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
                  <input type="text" placeholder="Tìm kiếm món ăn..." 
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '16px', fontFamily: 'Inter' }}
                    value={this.state.searchProduct} onChange={e => this.setState({ searchProduct: e.target.value })}
                  />
                  <div style={{ overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingRight: '4px' }}>
                    {this.state.allProducts.filter(p => (p.name||'').toLowerCase().includes(this.state.searchProduct.toLowerCase())).map(p => (
                      <div key={p._id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #eee', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => this.handleManualItemAdd(p)}>
                        <img src={'data:image/jpg;base64,' + p.image} alt="" style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: '13px', color: '#333' }}>{p.name}</div>
                          <div style={{ color: '#d32f2f', fontWeight: 900, fontSize: '14px', marginTop: '4px' }}>{p.price.toLocaleString()}đ</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Cart & Form */}
                <div style={{ width: '400px', padding: '24px', display: 'flex', flexDirection: 'column', background: '#fff' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#666', marginBottom: '8px' }}>THÔNG TIN KHÁCH HÀNG</div>
                    <input type="text" placeholder="Tên khách hàng" value={this.state.newOrderCustomer.name} 
                      onChange={e => this.setState({ newOrderCustomer: { ...this.state.newOrderCustomer, name: e.target.value }})}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '8px', fontFamily: 'Inter' }} />
                    <input type="text" placeholder="Số điện thoại" value={this.state.newOrderCustomer.phone} 
                      onChange={e => this.setState({ newOrderCustomer: { ...this.state.newOrderCustomer, phone: e.target.value }})}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '8px', fontFamily: 'Inter' }} />
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#666', marginBottom: '8px' }}>MÓN ĐÃ CHỌN</div>
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {this.state.newOrderItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px dashed #eee' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '14px' }}>{item.product.name}</div>
                          <div style={{ color: '#d32f2f', fontWeight: 800, fontSize: '13px' }}>{(item.product.price * item.quantity).toLocaleString()}đ</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden' }}>
                          <button style={{ border: 'none', background: 'transparent', padding: '6px 10px', cursor: 'pointer', fontWeight: 900 }} onClick={() => this.handleManualItemQty(idx, -1)}>-</button>
                          <span style={{ fontSize: '14px', fontWeight: 700, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button style={{ border: 'none', background: 'transparent', padding: '6px 10px', cursor: 'pointer', fontWeight: 900 }} onClick={() => this.handleManualItemQty(idx, 1)}>+</button>
                        </div>
                        <button style={{ border: 'none', background: '#ffeeee', color: '#c62828', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 900 }} onClick={() => this.handleManualItemRemove(idx)}>✕</button>
                      </div>
                    ))}
                    {this.state.newOrderItems.length === 0 && <div style={{ textAlign: 'center', padding: '30px 0', color: '#ccc', fontStyle: 'italic', fontSize: '13px' }}>Chưa chọn món nào</div>}
                  </div>

                  <div style={{ marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontWeight: 800, color: '#555' }}>Tổng cộng:</span>
                      <span style={{ fontWeight: 900, fontSize: '24px', color: '#1a1a1a' }}>
                        {this.state.newOrderItems.reduce((s, i) => s + i.product.price * i.quantity, 0).toLocaleString()}đ
                      </span>
                    </div>
                    <button 
                      onClick={this.submitManualOrder}
                      style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #c62828 0%, #d32f2f 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(198,40,40,0.2)' }}
                    >
                      TẠO ĐƠN HÀNG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  renderPageButtons(totalPages, currentPage) {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`ord-page-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => this.setState({ currentPage: i })}
          >
            {i}
          </button>
        );
      }
    } else {
      pages.push(
        <button
          key={1}
          className={`ord-page-btn ${currentPage === 1 ? 'active' : ''}`}
          onClick={() => this.setState({ currentPage: 1 })}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        pages.push(<span key="e1" className="ord-page-ellipsis">…</span>);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            className={`ord-page-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => this.setState({ currentPage: i })}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(<span key="e2" className="ord-page-ellipsis">…</span>);
      }

      pages.push(
        <button
          key={totalPages}
          className={`ord-page-btn ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => this.setState({ currentPage: totalPages })}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  }

  // --- THỦ CÔNG ---
  openAddModal = () => {
    this.setState({
      showAddModal: true,
      newOrderCustomer: { name: 'Khách vãng lai', phone: '', email: 'guest@mukbang.com', address: 'Dùng tại quán' },
      newOrderItems: [],
      searchProduct: ''
    });
    // fetch toàn bộ sản phẩm nếu chưa có
    if (this.state.allProducts.length === 0) {
      axios.get('/api/admin/all-products', { headers: { 'x-access-token': this.context.token } })
        .then((res) => {
          const prods = Array.isArray(res.data) ? res.data : (res.data.products || []);
          this.setState({ allProducts: prods });
        })
        .catch(() => {
          this.setState({ allProducts: [] });
        });
    }
  }

  closeAddModal = () => {
    this.setState({ showAddModal: false });
  }

  handleManualItemAdd = (prod) => {
    const items = [...this.state.newOrderItems];
    const ex = items.find(i => i.product._id === prod._id);
    if(ex) ex.quantity += 1;
    else items.push({ product: prod, quantity: 1 });
    this.setState({ newOrderItems: items });
  }

  handleManualItemRemove = (idx) => {
    const items = [...this.state.newOrderItems];
    items.splice(idx, 1);
    this.setState({ newOrderItems: items });
  }

  handleManualItemQty = (idx, step) => {
    const items = [...this.state.newOrderItems];
    items[idx].quantity += step;
    if(items[idx].quantity <= 0) items.splice(idx, 1);
    this.setState({ newOrderItems: items });
  }

  submitManualOrder = () => {
    const { newOrderItems, newOrderCustomer } = this.state;
    if(newOrderItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm!');
      return;
    }
    const total = newOrderItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
    const body = {
      customer: newOrderCustomer,
      items: newOrderItems,
      total: total,
      status: 'APPROVED'
    };
    axios.post('/api/admin/orders', body, { headers: { 'x-access-token': this.context.token } })
      .then(res => {
        if(res.data) {
          alert('Tạo đơn hàng thủ công thành công!');
          this.closeAddModal();
          this.apiGetOrders();
        } else {
          alert('Có lỗi xảy ra!');
        }
      });
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  lnkApproveClick(id) {
    if (window.confirm('Bạn có chắc chắn muốn DUYỆT đơn hàng này không?')) {
      this.apiPutOrderStatus(id, 'APPROVED');
    }
  }

  lnkCancelClick(id) {
    if (window.confirm('Bạn có chắc chắn muốn HỦY đơn hàng này không?')) {
      this.apiPutOrderStatus(id, 'CANCELED');
    }
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetOrders();
        this.setState({ order: null });
      } else {
        alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!');
      }
    });
  }

  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      this.setState({ orders: res.data || [] });
    });
  }
}

export default Order;