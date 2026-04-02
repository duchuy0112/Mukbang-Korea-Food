import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);

    // RENDER DANH SÁCH ĐƠN HÀNG
    const orders = this.state.orders.map((item) => {
      const isActive = this.state.order?._id === item._id; // Kiểm tra để tô đậm đơn hàng đang xem
      return (
        <tr
          key={item._id}
          className={`order-row ${isActive ? 'active-order' : ''}`}
          onClick={() => this.trItemClick(item)}
        >
          <td className="order-id">#{item._id.substring(item._id.length - 8)}</td>
          <td>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
          <td>{item.customer?.name || 'Khách hàng'}</td>
          <td>{item.customer?.phone}</td>
          <td className="total-cell">{item.total?.toLocaleString()} đ</td>
          <td>
            <span className={`status-badge ${item.status.toLowerCase()}`}>
              {item.status === 'PENDING' ? 'Đang chờ' : 
               item.status === 'APPROVED' ? 'Đã duyệt' : 
               item.status === 'CANCELED' ? 'Đã hủy' : item.status}
            </span>
          </td>
        </tr>
      );
    });

    // RENDER CHI TIẾT ĐƠN HÀNG
    let items = null;
    if (this.state.order && this.state.order.items) {
      items = this.state.order.items.map((item, index) => {
        if (!item.product) return null;
        return (
          <tr key={item.product._id} className="detail-row">
            <td>{index + 1}</td>
            <td>
              <div className="prod-cell">
                <img
                  src={"data:image/jpg;base64," + item.product.image}
                  className="order-prod-img"
                  alt=""
                />
                <span>{item.product.name}</span>
              </div>
            </td>
            <td>{item.product.price?.toLocaleString()} đ</td>
            <td><span className="qty-circle">{item.quantity}</span></td>
            <td className="amount-cell">{(item.product.price * item.quantity).toLocaleString()} đ</td>
          </tr>
        );
      });
    }

    return (
      <div className="korea-orders-page">
        <style>{`
          .korea-orders-page {
            padding: 40px 60px;
            max-width: 1300px;
            margin: 0 auto;
            font-family: 'Inter', sans-serif;
            background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
            min-height: 90vh;
          }

          .section-title {
            color: #d32f2f;
            font-weight: 900;
            text-transform: uppercase;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .section-title::before {
            content: '';
            width: 5px; height: 25px;
            background: #ff9f43;
            border-radius: 10px;
          }

          /* BẢNG ĐƠN HÀNG CHUYÊN NGHIỆP */
          .orders-table-wrapper {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border: 1px solid #eee;
            margin-bottom: 50px;
          }

          .k-table {
            width: 100%;
            border-collapse: collapse;
          }

          .k-table th {
            background: #f8f9fa;
            padding: 18px;
            text-align: left;
            font-size: 13px;
            color: #666;
            border-bottom: 2px solid #eee;
          }

          .order-row { cursor: pointer; transition: 0.3s; }
          .order-row:hover { background: #fffcf0; }
          
          /* HIỆU ỨNG TÔ ĐẬM KHI CHỌN */
          .active-order {
            background: #fff5f5 !important;
            border-left: 5px solid #d32f2f;
          }
          .active-order td { color: #d32f2f; font-weight: 700; }

          .order-row td { padding: 18px; border-bottom: 1px solid #f1f1f1; font-size: 14px; }
          .order-id { font-family: monospace; font-weight: bold; color: #2d3436; }
          .total-cell { font-weight: 800; color: #d32f2f; }

          /* TRẠNG THÁI ĐƠN HÀNG */
          .status-badge {
            padding: 5px 12px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
          }
          .status-badge.pending { background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; }
          .status-badge.approved { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
          .status-badge.canceled { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }

          /* CHI TIẾT ĐƠN HÀNG */
          .detail-container {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 15px 40px rgba(211, 47, 47, 0.1);
            border: 2px solid #ff9f43;
            animation: slideUp 0.4s ease-out;
          }

          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

          .prod-cell { display: flex; align-items: center; gap: 15px; }
          .order-prod-img { width: 50px; height: 50px; object-fit: cover; border-radius: 10px; border: 1px solid #eee; }
          .qty-circle { background: #f1f3f5; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; }
          .amount-cell { font-weight: 900; color: #d32f2f; }

        `}</style>

        <div className="orders-section">
          <h2 className="section-title">Lịch sử đặt hàng của bạn</h2>
          <div className="orders-table-wrapper">
            <table className="k-table">
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Ngày Đặt</th>
                  <th>Tên Khách</th>
                  <th>Số Điện Thoại</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders : (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '30px'}}>Bạn chưa có đơn hàng nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {this.state.order && (
          <div className="detail-container">
            <h2 className="section-title">Chi tiết đơn hàng #{this.state.order._id.substring(0, 8)}</h2>
            <table className="k-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Sản Phẩm</th>
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
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data || [] });
    });
  }
}

export default Myorders;