import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import './CustomerComponent.css';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null,
      selectedCustomer: null
    };
  }

  getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  getAvatarColor(name) {
    const colors = ['#e57373','#f06292','#ba68c8','#9575cd','#7986cb','#64b5f6','#4fc3f7','#4dd0e1','#81c784','#aed581','#ff8a65','#a1887f'];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  render() {
    const customers = this.state.customers.map((item) => {
      const isSelected = this.state.selectedCustomer?._id === item._id;
      const initials = this.getInitials(item.name);
      const color = this.getAvatarColor(item.name);
      return (
        <tr
          key={item._id}
          className={`cust-row ${isSelected ? 'cust-row-active' : ''}`}
          onClick={() => this.trCustomerClick(item)}
        >
          <td>
            <div className="cust-name-cell">
              <div className="cust-avatar" style={{ background: color }}>{initials}</div>
              <div className="cust-name-info">
                <div className="cust-name">{item.name}</div>
                <div className="cust-username">@{item.username}</div>
              </div>
            </div>
          </td>
          <td className="cust-contact">{item.phone}</td>
          <td className="cust-contact">{item.email}</td>
          <td className="cust-address">{item.address || '—'}</td>
          <td>
            <span className={`cust-active-badge ${item.active === 1 ? 'active' : 'inactive'}`}>
              {item.active === 1 ? '● Đã kích hoạt' : '○ Chưa kích hoạt'}
            </span>
          </td>
          <td onClick={(e) => e.stopPropagation()}>
            <button className="cust-btn-delete" onClick={() => this.lnkDeleteClick(item)}>
              🗑 Xóa tài khoản
            </button>
          </td>
        </tr>
      );
    });

    const orders = this.state.orders.map((item) => {
      const statusStyle = item.status === 'PENDING'
        ? { background: '#fff3e0', color: '#e65100', border: '1px solid #ffe0b2' }
        : item.status === 'APPROVED'
        ? { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9' }
        : { background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2' };

      const statusLabel = item.status === 'PENDING' ? 'Đang xử lý'
        : item.status === 'APPROVED' ? 'Đã giao' : 'Đã hủy';

      return (
        <tr
          key={item._id}
          className={`cust-order-row ${this.state.order?._id === item._id ? 'cust-order-active' : ''}`}
          onClick={() => this.trOrderClick(item)}
        >
          <td><span className="cust-order-id">#MK-{item._id.substring(item._id.length - 5).toUpperCase()}</span></td>
          <td className="cust-date">{new Date(item.cdate).toLocaleString('vi-VN')}</td>
          <td className="cust-total">{item.total?.toLocaleString()} đ</td>
          <td><span className="cust-status-badge" style={statusStyle}>{statusLabel}</span></td>
        </tr>
      );
    });

    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id} className="cust-detail-row">
            <td style={{ color: '#aaa', fontWeight: 700 }}>{index + 1}</td>
            <td><span className="cust-order-id">{item.product._id.substring(0, 8)}</span></td>
            <td style={{ fontWeight: 700, color: '#1a1a1a' }}>{item.product.name}</td>
            <td>
              <div className="cust-prod-img-wrap">
                <img src={"data:image/jpg;base64," + item.product.image} alt={item.product.name} />
              </div>
            </td>
            <td style={{ fontWeight: 800, color: '#c62828' }}>{item.product.price?.toLocaleString()} đ</td>
            <td><span className="cust-qty-chip">{item.quantity}</span></td>
            <td style={{ fontWeight: 900, color: '#1a1a1a' }}>{(item.product.price * item.quantity).toLocaleString()} đ</td>
          </tr>
        );
      });
    }

    return (
      <div className="cust-page">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

          .cust-page {
            padding: 10px 0 40px;
            font-family: 'Inter', sans-serif;
            animation: cust-fadeIn 0.6s ease-out;
          }

          @keyframes cust-fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .cust-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 28px;
          }

          .cust-header h1 {
            font-size: 30px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0 0 6px;
            letter-spacing: -1px;
          }

          .cust-header-sub {
            font-size: 14px;
            color: #999;
            font-weight: 500;
          }

          .cust-count-badge {
            background: #fff5f5;
            color: #c62828;
            border: 1.5px solid #fecaca;
            border-radius: 50px;
            padding: 6px 18px;
            font-size: 13px;
            font-weight: 800;
          }

          /* TABLE WRAPPER */
          .cust-table-wrapper {
            background: #fff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 8px 35px rgba(0,0,0,0.04);
            border: 1px solid #f0f0f0;
            margin-bottom: 24px;
            overflow-x: auto;
          }

          .cust-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 900px;
          }

          .cust-table th {
            padding: 16px 20px;
            text-align: left;
            font-size: 11px;
            font-weight: 900;
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: #fafafa;
            border-bottom: 1px solid #f0f0f0;
            white-space: nowrap;
          }

          .cust-row {
            border-bottom: 1px solid #f5f5f5;
            cursor: pointer;
            transition: all 0.25s;
          }

          .cust-row:last-child { border-bottom: none; }
          .cust-row:hover { background: #fffaf5; }
          .cust-row-active { background: #fff8f5 !important; }

          .cust-row td {
            padding: 14px 20px;
            font-size: 13px;
            vertical-align: middle;
          }

          .cust-name-cell {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .cust-avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 900;
            color: #fff;
            flex-shrink: 0;
            box-shadow: 0 3px 8px rgba(0,0,0,0.08);
          }

          .cust-name-info { display: flex; flex-direction: column; gap: 2px; }
          .cust-name { font-weight: 800; color: #1a1a1a; font-size: 14px; }
          .cust-username { font-size: 12px; color: #aaa; font-weight: 500; }

          .cust-contact { color: #666; font-weight: 600; }
          .cust-address { color: #888; font-weight: 500; max-width: 160px; }

          .cust-active-badge {
            font-size: 11px;
            font-weight: 800;
            padding: 5px 12px;
            border-radius: 50px;
            white-space: nowrap;
          }

          .cust-active-badge.active { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
          .cust-active-badge.inactive { background: #fff3e0; color: #e65100; border: 1px solid #ffe0b2; }

          .cust-btn-delete {
            padding: 6px 14px;
            border: none;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.25s;
            white-space: nowrap;
            background: #ffebee; 
            color: #c62828; 
          }
          .cust-btn-delete:hover { background: #c62828; color: #fff; }

          /* ORDERS SECTION */
          .cust-section-title {
            font-size: 18px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0 0 16px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .cust-section-title span {
            background: #fff5f5;
            color: #c62828;
            border: 1px solid #fecaca;
            border-radius: 50px;
            padding: 3px 12px;
            font-size: 12px;
          }

          .cust-order-row {
            border-bottom: 1px solid #f5f5f5;
            cursor: pointer;
            transition: 0.25s;
          }
          .cust-order-row:hover { background: #fffaf5; }
          .cust-order-active { background: #fff8f5 !important; }
          .cust-order-row td { padding: 14px 20px; font-size: 13px; vertical-align: middle; }

          .cust-order-id { font-family: monospace; font-weight: 800; color: #c62828; font-size: 13px; }
          .cust-date { color: #777; font-weight: 600; }
          .cust-total { font-weight: 900; color: #1a1a1a; }
          .cust-status-badge { padding: 5px 14px; border-radius: 50px; font-size: 11px; font-weight: 800; }

          .cust-detail-row td { padding: 14px 20px; border-bottom: 1px solid #f5f5f5; font-size: 13px; vertical-align: middle; }
          .cust-detail-row:last-child td { border-bottom: none; }

          .cust-prod-img-wrap {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #eee;
          }
          .cust-prod-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
          .cust-qty-chip { background: #f0f0f0; padding: 4px 12px; border-radius: 50px; font-weight: 800; font-size: 12px; }

          .cust-detail-panel {
            background: #fff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 8px 35px rgba(0,0,0,0.04);
            border: 2px solid #ff9800;
            margin-bottom: 24px;
            animation: cust-slideIn 0.4s ease-out;
            overflow-x: auto;
          }

          @keyframes cust-slideIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .cust-panel-header {
            padding: 18px 24px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        `}</style>

        {/* HEADER */}
        <div className="cust-header">
          <div>
            <h1>Quản lý Khách hàng</h1>
            <div className="cust-header-sub">Xem thông tin và lịch sử mua hàng của từng khách</div>
          </div>
          <span className="cust-count-badge">{this.state.customers.length} khách hàng</span>
        </div>

        {/* CUSTOMER TABLE */}
        <div className="cust-table-wrapper">
          <table className="cust-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Điện thoại</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>{customers}</tbody>
          </table>
        </div>

        {/* ORDER LIST */}
        {this.state.orders.length > 0 && (
          <div className="cust-detail-panel">
            <div className="cust-panel-header">
              <div className="cust-section-title">
                Lịch sử đơn hàng
                <span>{this.state.orders.length} đơn</span>
              </div>
            </div>
            <table className="cust-table" style={{ minWidth: 'auto' }}>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>{orders}</tbody>
            </table>
          </div>
        )}

        {/* ORDER DETAIL */}
        {this.state.order && (
          <div className="cust-detail-panel">
            <div className="cust-panel-header">
              <div className="cust-section-title">
                Chi tiết đơn hàng
                <span>#MK-{this.state.order._id.substring(this.state.order._id.length - 5).toUpperCase()}</span>
              </div>
            </div>
            <table className="cust-table" style={{ minWidth: 'auto' }}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã SP</th>
                  <th>Tên món</th>
                  <th>Hình ảnh</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>{items}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() { this.apiGetCustomers(); }

  trCustomerClick(item) {
    this.setState({ orders: [], order: null, selectedCustomer: item });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick(item) { this.setState({ order: item }); }
  
  lnkDeleteClick(item) { 
    if (window.confirm(`Bạn có chắc chắn muốn XÓA khách hàng: ${item.name}?\nHành động này không thể hoàn tác.`)) {
      this.apiDeleteCustomer(item._id);
    }
  }

  apiDeleteCustomer(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete(`/api/admin/customers/${id}`, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Đã xóa khách hàng thành công!');
        this.apiGetCustomers();
        this.setState({ selectedCustomer: null, orders: [], order: null });
      } else {
        alert('Xóa khách hàng thất bại!');
      }
    });
  }

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ customers: res.data });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      alert(res.data.message);
    });
  }
}

export default Customer;