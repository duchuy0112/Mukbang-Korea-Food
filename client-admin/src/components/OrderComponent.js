import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  render() {
    // RENDER DANH SÁCH ĐƠN HÀNG TỔNG QUÁT
    const orders = this.state.orders.map((item) => {
      const isActive = this.state.order?._id === item._id;
      return (
        <tr 
          key={item._id} 
          className={`admin-order-row ${isActive ? 'active-row' : ''}`} 
          onClick={() => this.trItemClick(item)}
        >
          <td className="id-cell">#{item._id.substring(item._id.length - 8)}</td>
          <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
          <td className="font-bold">{item.customer?.name}</td>
          <td>{item.customer?.phone}</td>
          <td className="price-text">{item.total?.toLocaleString()} đ</td>
          <td>
            <span className={`admin-status-badge ${item.status.toLowerCase()}`}>
              {item.status === 'PENDING' ? 'Chờ duyệt' : 
               item.status === 'APPROVED' ? 'Đã duyệt' : 'Đã hủy'}
            </span>
          </td>
          <td onClick={(e) => e.stopPropagation()}>
            {item.status === 'PENDING' ? (
              <div className="action-btns">
                <button className="btn-approve" onClick={() => this.lnkApproveClick(item._id)}>DUYỆT</button>
                <button className="btn-cancel" onClick={() => this.lnkCancelClick(item._id)}>HỦY</button>
              </div>
            ) : <span className="text-muted">-</span>}
          </td>
        </tr>
      );
    });

    // RENDER CHI TIẾT ĐƠN HÀNG ĐƯỢC CHỌN
    let items = null;
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => (
        <tr key={item.product._id} className="admin-detail-row">
          <td>{index + 1}</td>
          <td className="id-cell">{item.product._id}</td>
          <td className="font-bold">{item.product.name}</td>
          <td>
            <img 
              src={"data:image/jpg;base64," + item.product.image} 
              className="admin-prod-img" 
              alt="" 
            />
          </td>
          <td>{item.product.price?.toLocaleString()} đ</td>
          <td><span className="qty-badge">{item.quantity}</span></td>
          <td className="price-text">{(item.product.price * item.quantity).toLocaleString()} đ</td>
        </tr>
      ));
    }

    return (
      <div className="admin-order-page">
        <style>{`
          .admin-order-page {
            padding: 30px;
            background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
            min-height: 90vh;
            font-family: 'Inter', sans-serif;
          }

          .admin-section {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.05);
            margin-bottom: 40px;
            border: 1px solid #eee;
          }

          .admin-title {
            color: #d32f2f;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 2px solid #ff9f43;
            padding-bottom: 10px;
          }

          .admin-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }

          .admin-table th {
            background: #f8f9fa;
            padding: 15px;
            text-align: left;
            color: #666;
            text-transform: uppercase;
            font-size: 12px;
          }

          .admin-order-row { cursor: pointer; transition: 0.3s; border-bottom: 1px solid #f1f1f1; }
          .admin-order-row:hover { background: #fffcf0; }
          .active-row { background: #fff5f5 !important; border-left: 5px solid #d32f2f; }

          .admin-order-row td { padding: 15px; }
          .id-cell { font-family: monospace; color: #777; font-weight: bold; }
          .price-text { font-weight: 800; color: #d32f2f; }
          .font-bold { font-weight: 700; color: #333; }

          /* BADGES */
          .admin-status-badge {
            padding: 5px 12px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 800;
          }
          .admin-status-badge.pending { background: #fff7ed; color: #ea580c; }
          .admin-status-badge.approved { background: #f0fdf4; color: #16a34a; }
          .admin-status-badge.canceled { background: #fef2f2; color: #dc2626; }

          /* BUTTONS */
          .action-btns { display: flex; gap: 8px; }
          .btn-approve, .btn-cancel {
            padding: 6px 12px;
            border: none;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 900;
            cursor: pointer;
            transition: 0.3s;
          }
          .btn-approve { background: #16a34a; color: white; }
          .btn-cancel { background: #dc2626; color: white; }
          .btn-approve:hover, .btn-cancel:hover { filter: brightness(1.2); transform: scale(1.05); }

          /* DETAILS */
          .admin-detail-section {
            animation: slideIn 0.4s ease-out;
            border: 2px solid #ff9f43;
          }
          @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

          .admin-prod-img { width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid #eee; }
          .qty-badge { background: #eee; padding: 4px 10px; border-radius: 50px; font-weight: bold; }
          .text-muted { color: #ccc; }
        `}</style>

        <div className="admin-section">
          <h2 className="admin-title">📦 Danh sách đơn hàng hệ thống</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Ngày Tạo</th>
                <th>Tên Khách</th>
                <th>Điện Thoại</th>
                <th>Tổng Cộng</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {orders}
            </tbody>
          </table>
        </div>

        {this.state.order && (
          <div className="admin-section admin-detail-section">
            <h2 className="admin-title">🔍 Chi tiết đơn hàng #{this.state.order._id.substring(0, 8)}</h2>
            <table className="admin-table">
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
                {items}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
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
        // Reset lại đơn hàng đang chọn để cập nhật trạng thái mới
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