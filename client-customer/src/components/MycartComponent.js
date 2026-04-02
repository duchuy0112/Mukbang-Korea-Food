import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext;

  render() {
    // Sửa lỗi: Thêm kiểm tra an toàn item.product? để không bị sập trang
    const mycart = this.context.mycart.map((item, index) => {
      if (!item.product) return null; // Bỏ qua nếu sản phẩm bị lỗi dữ liệu

      return (
        <tr key={item.product._id} className="cart-row">
          <td>{index + 1}</td>
          <td className="product-info">
            <img
              src={"data:image/jpg;base64," + item.product.image}
              className="cart-img"
              alt={item.product.name}
            />
            <div className="product-detail">
              <span className="p-name">{item.product.name}</span>
              <span className="p-id">Mã: {item.product._id}</span>
            </div>
          </td>
          <td><span className="cate-badge">{item.product.category?.name || 'Ẩm thực'}</span></td>
          <td className="price-text">{item.product.price?.toLocaleString()} đ</td>
          <td><span className="qty-box">{item.quantity}</span></td>
          <td className="amount-text">{(item.product.price * item.quantity).toLocaleString()} đ</td>
          <td>
            <button
              className="btn-remove"
              onClick={() => this.lnkRemoveClick(item.product._id)}
            >
              Xóa
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div className="korea-cart-container">
        <style>{`
          .korea-cart-container {
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
            font-family: 'Inter', sans-serif;
            background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
            min-height: 80vh;
          }

          .cart-title {
            text-align: center;
            color: #d32f2f;
            font-weight: 900;
            font-size: 32px;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          .cart-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 15px;
            background: transparent;
          }

          .cart-table th {
            background: #d32f2f;
            color: white;
            padding: 15px;
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 1px;
          }

          .cart-table th:first-child { border-radius: 15px 0 0 15px; }
          .cart-table th:last-child { border-radius: 0 15px 15px 0; }

          .cart-row {
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            transition: 0.3s;
          }

          .cart-row:hover { transform: scale(1.01); box-shadow: 0 10px 25px rgba(211, 47, 47, 0.1); }

          .cart-row td { padding: 15px; text-align: center; vertical-align: middle; border-top: 1px solid #eee; border-bottom: 1px solid #eee; }
          .cart-row td:first-child { border-left: 1px solid #eee; border-radius: 15px 0 0 15px; font-weight: bold; }
          .cart-row td:last-child { border-right: 1px solid #eee; border-radius: 0 15px 15px 0; }

          .product-info { display: flex; align-items: center; text-align: left !important; gap: 15px; }
          .cart-img { width: 80px; height: 80px; object-fit: cover; border-radius: 12px; border: 2px solid #ff9f43; }
          .product-detail { display: flex; flex-direction: column; }
          .p-name { font-weight: 800; color: #333; font-size: 16px; }
          .p-id { font-size: 11px; color: #999; }

          .cate-badge { background: #fff5f5; color: #d32f2f; padding: 5px 12px; border-radius: 50px; font-size: 12px; font-weight: 700; border: 1px solid #ff9f43; }
          .price-text { font-weight: 700; color: #444; }
          .qty-box { background: #f8f9fa; padding: 5px 15px; border-radius: 8px; font-weight: 800; border: 1px solid #ddd; }
          .amount-text { font-weight: 900; color: #d32f2f; font-size: 18px; }

          .btn-remove { background: #fff; color: #ff4e50; border: 1.5px solid #ff4e50; padding: 8px 15px; border-radius: 10px; cursor: pointer; font-weight: 800; transition: 0.3s; }
          .btn-remove:hover { background: #ff4e50; color: #fff; box-shadow: 0 5px 12px rgba(255, 78, 80, 0.3); }

          .cart-footer { margin-top: 30px; background: white; padding: 25px; border-radius: 20px; display: flex; justify-content: flex-end; align-items: center; gap: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 2px solid #ff9f43; }
          .total-label { font-size: 20px; font-weight: 800; color: #333; }
          .total-amount { font-size: 28px; font-weight: 900; color: #d32f2f; }

          .btn-checkout {
            background: linear-gradient(135deg, #d32f2f 0%, #ff8c00 100%);
            color: white; border: none; padding: 15px 45px; border-radius: 50px;
            font-size: 18px; font-weight: 900; cursor: pointer; transition: 0.4s;
            box-shadow: 0 10px 20px rgba(211, 47, 47, 0.3);
          }
          .btn-checkout:hover { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 15px 30px rgba(211, 47, 47, 0.4); }
        `}</style>

        <h2 className="cart-title">🛒 GIỎ HÀNG CỦA BẠN</h2>
        
        <table className="cart-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản Phẩm</th>
              <th>Danh Mục</th>
              <th>Đơn Giá</th>
              <th>Số Lượng</th>
              <th>Thành Tiền</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {mycart}
          </tbody>
        </table>

        {this.context.mycart.length > 0 ? (
          <div className="cart-footer">
            <div className="total-group">
              <span className="total-label">TỔNG CỘNG: </span>
              <span className="total-amount">{CartUtil.getTotal(this.context.mycart).toLocaleString()} VNĐ</span>
            </div>
            <button className="btn-checkout" onClick={() => this.lnkCheckoutClick()}>
              THANH TOÁN NGAY
            </button>
          </div>
        ) : (
          <div className="text-center" style={{marginTop: '50px'}}>
            <h3 style={{color: '#999'}}>Giỏ hàng đang trống, chọn món ngay nhé !</h3>
          </div>
        )}
      </div>
    );
  }

  lnkRemoveClick(id) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex(x => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  lnkCheckoutClick() {
    if (window.confirm('XÁC NHẬN THANH TOÁN ĐƠN HÀNG NÀY?')) {
      if (this.context.mycart.length > 0) {
        const total = CartUtil.getTotal(this.context.mycart);
        const items = this.context.mycart;
        const customer = this.context.customer;

        if (customer) {
          this.apiCheckout(total, items, customer);
        } else {
          this.props.navigate('/login');
        }
      } else {
        alert('Giỏ hàng của bạn đang trống!');
      }
    }
  }

  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.post('/api/customer/checkout', body, config).then((res) => {
      if (res.data) {
        alert('CHÚC MỪNG! ĐẶT HÀNG THÀNH CÔNG 🎉');
        this.context.setMycart([]);
        this.props.navigate('/home');
      } else {
        alert('CÓ LỖI XẢY RA, VUI LÒNG THỬ LẠI!');
      }
    });
  }
}

export default withRouter(Mycart);