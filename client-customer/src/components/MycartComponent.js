import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtName: undefined,
      txtPhone: undefined,
      txtAddress: undefined,
      txtNote: '',
      payMethod: 'COD',
      orders: [],
      selectedOrder: null,
      ohOpen: false
    };
  }

  componentDidMount() {
    if (this.context.customer) {
      this.apiGetOrders(this.context.customer._id);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const prevCustomer = this._prevCustomer;
    const curCustomer = this.context.customer;
    if (curCustomer && (!prevCustomer || prevCustomer._id !== curCustomer._id)) {
      this.apiGetOrders(curCustomer._id);
    }
    this._prevCustomer = curCustomer;
  }

  apiGetOrders(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/customer/' + cid, config).then((res) => {
      const orders = res.data || [];
      orders.sort((a, b) => (b.cdate || 0) - (a.cdate || 0));
      this.setState({ orders });
    }).catch(() => {});
  }

  updateQty(id, delta) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex(x => x.product._id === id);
    if (index !== -1) {
      mycart[index].quantity += delta;
      if (mycart[index].quantity < 1) mycart[index].quantity = 1;
      this.context.setMycart(mycart);
    }
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
    const customerContext = this.context.customer || {};
    const customer = {
      ...customerContext,
      name: this.state.txtName !== undefined ? this.state.txtName : (customerContext.name || ''),
      phone: this.state.txtPhone !== undefined ? this.state.txtPhone : (customerContext.phone || ''),
      address: this.state.txtAddress !== undefined ? this.state.txtAddress : (customerContext.address || '')
    };

    if (!customer.address || customer.address.trim() === '') {
      alert('VUI LÒNG NHẬP ĐỊA CHỈ GIAO HÀNG!');
      return;
    }
    if (!customer.name || customer.name.trim() === '') {
      alert('VUI LÒNG NHẬP HỌ VÀ TÊN!');
      return;
    }
    if (!customer.phone || customer.phone.trim() === '') {
      alert('VUI LÒNG NHẬP SỐ ĐIỆN THOẠI!');
      return;
    }

    if (window.confirm('XÁC NHẬN THANH TOÁN ĐƠN HÀNG NÀY?')) {
      if (this.context.mycart.length > 0) {
        const subtotal = CartUtil.getTotal(this.context.mycart);
        const shipping = subtotal > 0 ? 30000 : 0;
        const service = subtotal > 0 ? 15000 : 0;
        const total = subtotal + shipping + service;
        const items = this.context.mycart;

        if (this.context.customer) {
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
        alert('CHÚC MỪNG! ĐẶT HÀNG THÀNH CÔNG 🎉\n' + (this.state.payMethod !== 'COD' ? '' : 'Vui lòng chuẩn bị tiền mặt khi nhận hàng.'));
        this.context.setMycart([]);
        if (this.context.customer) {
          this.apiGetOrders(this.context.customer._id);
        }
        this.props.navigate('/home');
      } else {
        alert('CÓ LỖI XẢY RA, VUI LÒNG THỬ LẠI!');
      }
    });
  }

  getStatusLabel(status) {
    switch (status) {
      case 'PENDING': return 'Đang xử lý';
      case 'APPROVED': return 'Đã giao';
      case 'CANCELED': return 'Đã hủy';
      default: return status;
    }
  }

  getStatusClass(status) {
    switch (status) {
      case 'PENDING': return 'oh-status-pending';
      case 'APPROVED': return 'oh-status-approved';
      case 'CANCELED': return 'oh-status-canceled';
      default: return '';
    }
  }

  render() {
    const mycart = this.context.mycart || [];
    const subtotal = CartUtil.getTotal(mycart);
    const shipping = subtotal > 0 ? 30000 : 0;
    const totalPayable = subtotal + shipping;

    return (
      <div className="mukbang-checkout">
        <style>{`
          .mukbang-checkout {
            background-color: #faf7f2;
            min-height: 100vh;
            padding: 60px 3%;
            font-family: 'Inter', sans-serif;
            color: #333;
          }

          .checkout-wrapper {
            max-width: 1200px;
            margin: 0 auto;
          }

          .main-heading { font-size: 48px; font-weight: 900; color: #b01e1e; margin-bottom: 8px; }
          .sub-heading { font-size: 16px; color: #666; margin-bottom: 50px; }

          .checkout-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 40px;
            align-items: start;
          }

          /* ============ FLOATING TOGGLE BUTTON ============ */
          .oh-fab {
            position: fixed;
            right: 24px;
            bottom: 32px;
            z-index: 1100;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff6b35, #d32f2f);
            color: #fff;
            border: none;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 8px 30px rgba(211,47,47,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.35s cubic-bezier(.4,0,.2,1);
          }
          .oh-fab:hover {
            transform: scale(1.08);
            box-shadow: 0 12px 40px rgba(211,47,47,0.45);
          }
          .oh-fab-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #fff;
            color: #b01e1e;
            font-size: 11px;
            font-weight: 900;
            min-width: 22px;
            height: 22px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 5px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }

          /* ============ DRAWER OVERLAY ============ */
          .oh-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.25);
            z-index: 1200;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.35s ease;
          }
          .oh-overlay.oh-open { opacity: 1; pointer-events: all; }

          /* ============ SLIDE-OUT DRAWER ============ */
          .oh-drawer {
            position: fixed;
            top: 0;
            right: 0;
            width: 420px;
            max-width: 90vw;
            height: 100vh;
            z-index: 1300;
            background: #faf7f2;
            box-shadow: -10px 0 50px rgba(0,0,0,0.1);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(.4,0,.2,1);
            display: flex;
            flex-direction: column;
          }
          .oh-drawer.oh-open { transform: translateX(0); }

          /* LEFT: CART ITEMS */
          .section-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
          .section-title { font-size: 22px; font-weight: 800; color: #1a1a1a; }
          .item-count-badge { background: #eee; padding: 4px 12px; border-radius: 20px; font-size: 12px; color: #888; font-weight: 600; }

          .cart-item-card {
            background: #fff;
            border-radius: 16px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
            position: relative;
          }

          .item-img { width: 90px; height: 90px; border-radius: 12px; object-fit: cover; }
          .item-info { flex: 1; }
          .item-name { font-size: 17px; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
          .item-sub { font-size: 13px; color: #999; margin-bottom: 15px; }

          .qty-pill {
            display: inline-flex;
            align-items: center;
            background: #f5f5f5;
            border-radius: 50px;
            padding: 4px 12px;
            gap: 15px;
          }
          .qty-btn { border: none; background: none; font-size: 16px; color: #999; cursor: pointer; font-weight: bold; }
          .qty-btn:hover { color: #b01e1e; }
          .qty-val { font-size: 14px; font-weight: 700; width: 15px; text-align: center; }

          .item-price-col { text-align: right; }
          .item-price { font-size: 18px; font-weight: 800; color: #e25a36; }

          .delivery-info-box {
            background: #fff;
            border-radius: 16px;
            padding: 20px 25px;
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-top: 30px;
            border-left: 5px solid #d88960;
          }
          .info-icon { font-size: 20px; color: #d88960; margin-top: 2px; }
          .info-text h4 { font-size: 15px; font-weight: 800; margin-bottom: 5px; }
          .info-text p { font-size: 13px; color: #777; line-height: 1.5; margin: 0; }

          /* CENTER: PAYMENT INFO */
          .payment-card {
            background: #f1ede8;
            border-radius: 24px;
            padding: 35px;
          }
          .pay-title { font-size: 22px; font-weight: 800; margin-bottom: 30px; }

          .form-group { margin-bottom: 22px; }
          .form-label { display: block; font-size: 11px; font-weight: 800; color: #888; margin-bottom: 10px; letter-spacing: 0.5px; }
          .pay-input {
            width: 100%;
            border: none;
            background: #fff;
            padding: 14px 18px;
            border-radius: 12px;
            font-size: 14px;
            outline: none;
            transition: 0.2s;
          }
          .pay-input:focus { box-shadow: 0 0 0 2px #e25a36; }

          .pay-method-title { font-size: 11px; font-weight: 800; color: #888; margin-bottom: 15px; text-transform: uppercase; }
          .method-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; }
          .method-item {
            background: #fff;
            padding: 13px 18px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            border: 2px solid transparent;
            transition: 0.2s;
          }
          .method-item.active { background: #fffcfb; border-color: #d88960; }
          .method-left { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 700; }
          .radio-indicator { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #ddd; position: relative; }
          .method-item.active .radio-indicator { border-color: #b01e1e; background: #b01e1e; box-shadow: inset 0 0 0 3px #fffcfb; }

          .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; color: #666; font-size: 14px; }
          .total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 25px; margin-bottom: 25px; }
          .total-lbl { font-size: 18px; font-weight: 800; color: #1a1a1a; }
          .total-val { font-size: 28px; font-weight: 900; color: #b01e1e; }

          .confirm-btn {
            width: 100%;
            background: #b01e1e;
            color: #fff;
            border: none;
            padding: 18px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            transition: 0.3s;
          }
          .confirm-btn:hover { background: #8e1818; transform: translateY(-2px); }

          .safety-tag { text-align: center; font-size: 10px; font-weight: 800; color: #aaa; margin-top: 20px; letter-spacing: 1px; text-transform: uppercase; }

          /* QR SECTION */
          .qr-section {
            background: #fff;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 25px;
            text-align: center;
            border: 2px dashed #d88960;
            animation: fadeIn 0.4s ease;
          }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          
          .qr-img { width: 180px; height: 180px; margin: 15px auto; display: block; border-radius: 8px; }
          .qr-title { font-size: 15px; font-weight: 800; color: #b01e1e; margin-bottom: 8px; display: block; }
          .qr-desc { font-size: 11px; color: #888; line-height: 1.4; }
          .qr-bank-info { 
            margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;
            font-size: 12px; text-align: left; line-height: 1.8;
          }
          .qr-bank-info b { color: #333; }

          /* ============ DRAWER INNER ============ */
          .oh-drawer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 28px;
            border-bottom: 2px solid #f0ebe5;
            flex-shrink: 0;
          }

          .oh-title {
            font-size: 20px;
            font-weight: 900;
            color: #1a1a1a;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .oh-title-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #ff6b35, #d32f2f);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          }

          .oh-drawer-close {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            background: #f5f0eb;
            border: none;
            cursor: pointer;
            font-size: 18px;
            color: #999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.25s;
          }

          .oh-drawer-close:hover {
            background: #fee2e2;
            color: #dc2626;
          }

          .oh-count-chip {
            background: #f5f0eb;
            padding: 5px 14px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 800;
            color: #b01e1e;
          }

          .oh-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 20px 24px;
          }

          .oh-scroll::-webkit-scrollbar { width: 4px; }
          .oh-scroll::-webkit-scrollbar-track { background: transparent; }
          .oh-scroll::-webkit-scrollbar-thumb { background: #e0d5ca; border-radius: 10px; }

          .oh-card {
            background: #fff;
            border-radius: 16px;
            padding: 18px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
          }

          .oh-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 4px; height: 100%;
            border-radius: 10px 0 0 10px;
            transition: 0.3s;
          }

          .oh-card-pending::before { background: #f59e0b; }
          .oh-card-approved::before { background: #22c55e; }
          .oh-card-canceled::before { background: #ef4444; }

          .oh-card:hover {
            border-color: #e8ddd2;
            transform: translateX(3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.04);
          }

          .oh-card.oh-selected {
            border-color: #d88960;
            background: #fffcf9;
            box-shadow: 0 8px 25px rgba(216,137,96,0.12);
          }

          .oh-card-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .oh-order-id {
            font-family: 'JetBrains Mono', monospace;
            font-size: 13px;
            font-weight: 800;
            color: #b01e1e;
          }

          .oh-status {
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .oh-status-pending { background: #fff7ed; color: #ea580c; }
          .oh-status-approved { background: #f0fdf4; color: #16a34a; }
          .oh-status-canceled { background: #fef2f2; color: #dc2626; }

          .oh-card-date {
            font-size: 12px;
            color: #aaa;
            margin-bottom: 12px;
            font-weight: 600;
          }

          .oh-items-preview {
            display: flex;
            gap: 6px;
            margin-bottom: 12px;
            flex-wrap: wrap;
          }

          .oh-item-thumb {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            object-fit: cover;
            border: 2px solid #fff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          }

          .oh-item-more {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: #f0ebe5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 800;
            color: #999;
          }

          .oh-card-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .oh-item-count-label {
            font-size: 12px;
            color: #aaa;
            font-weight: 600;
          }

          .oh-total {
            font-size: 17px;
            font-weight: 900;
            color: #b01e1e;
          }

          /* Detail overlay */
          .oh-detail-overlay {
            background: #fff;
            border-radius: 14px;
            padding: 18px;
            margin-bottom: 12px;
            border: 2px solid #d88960;
            animation: ohSlide 0.35s ease-out;
          }

          @keyframes ohSlide {
            from { opacity: 0; max-height: 0; }
            to { opacity: 1; max-height: 600px; }
          }

          .oh-detail-title {
            font-size: 14px;
            font-weight: 800;
            color: #b01e1e;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .oh-detail-close {
            background: #f5f0eb;
            border: none;
            width: 26px;
            height: 26px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            color: #999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.2s;
          }

          .oh-detail-close:hover {
            background: #fee2e2;
            color: #dc2626;
          }

          .oh-detail-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid #f5f0eb;
          }

          .oh-detail-item:last-child { border-bottom: none; }

          .oh-detail-img {
            width: 42px;
            height: 42px;
            border-radius: 10px;
            object-fit: cover;
          }

          .oh-detail-info { flex: 1; }

          .oh-detail-name {
            font-size: 13px;
            font-weight: 700;
            color: #1a1a1a;
          }

          .oh-detail-qty {
            font-size: 11px;
            color: #999;
          }

          .oh-detail-price {
            font-size: 13px;
            font-weight: 800;
            color: #e25a36;
          }

          .oh-detail-total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 14px;
            padding-top: 14px;
            border-top: 2px dashed #f0ebe5;
          }

          .oh-detail-total-label {
            font-size: 13px;
            font-weight: 800;
            color: #666;
          }

          .oh-detail-total-val {
            font-size: 18px;
            font-weight: 900;
            color: #b01e1e;
          }

          .oh-empty {
            text-align: center;
            padding: 40px 15px;
            color: #ccc;
          }

          .oh-empty-icon { font-size: 40px; margin-bottom: 12px; }
          .oh-empty-text { font-size: 14px; font-weight: 700; color: #bbb; margin-bottom: 5px; }
          .oh-empty-sub { font-size: 12px; color: #ddd; }

          .oh-login-prompt {
            text-align: center;
            padding: 60px 25px;
          }

          .oh-login-prompt-icon { font-size: 44px; margin-bottom: 15px; }
          .oh-login-prompt-text { font-size: 15px; font-weight: 700; color: #999; margin-bottom: 18px; }

          .oh-login-btn {
            background: linear-gradient(135deg, #ff6b35, #d32f2f);
            color: #fff;
            border: none;
            padding: 12px 32px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
            transition: 0.3s;
          }

          .oh-login-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(211,47,47,0.3); }

          @media (max-width: 900px) {
            .checkout-grid { grid-template-columns: 1fr; }
            .oh-drawer { width: 100vw; max-width: 100vw; }
          }
        `}</style>

        <div className="checkout-wrapper">
          <h1 className="main-heading">Giỏ hàng & Thanh toán</h1>
          <p className="sub-heading">Hoàn tất hành trình ẩm thực Hàn Quốc của bạn.</p>

          <div className="checkout-grid">
            {/* LEFT COLUMN - Cart Items */}
            <div className="cart-side">
              <div className="section-title-row">
                <h2 className="section-title">Giỏ hàng của bạn</h2>
                <span className="item-count-badge">{mycart.length} món</span>
              </div>

              <div className="cart-list">
                {mycart.length > 0 ? mycart.map((item) => (
                  <div key={item.product._id} className="cart-item-card">
                    <img
                      src={"data:image/jpg;base64," + item.product.image}
                      alt={item.product.name}
                      className="item-img"
                    />
                    <div className="item-info">
                      <h4 className="item-name">{item.product.name}</h4>
                      <p className="item-sub">
                        {item.product.description ?
                          (item.product.description.length > 60 ? item.product.description.substring(0, 57) + '...' : item.product.description)
                          : "Hương vị Hàn độc bản."}
                      </p>
                      <div className="qty-pill">
                        <button className="qty-btn" onClick={() => this.updateQty(item.product._id, -1)}>−</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => this.updateQty(item.product._id, 1)}>+</button>
                      </div>
                    </div>
                    <div className="item-price-col">
                      <div className="item-price">{(item.product.price * item.quantity).toLocaleString()}đ</div>
                      <button
                        style={{ background: 'none', border: 'none', color: '#ccc', fontSize: '11px', marginTop: '10px', cursor: 'pointer' }}
                        onClick={() => this.lnkRemoveClick(item.product._id)}
                      >Xóa món</button>
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '16px', color: '#999' }}>
                    Giỏ hàng của bạn đang trống. Hãy chọn món nhé!
                  </div>
                )}
              </div>

              <div className="delivery-info-box">
                <span className="info-icon">ℹ</span>
                <div className="info-text">
                  <h4>Thời gian giao hàng dự kiến</h4>
                  <p>Món ăn của bạn sẽ được chuẩn bị ngay lập tức và giao tới sau khoảng 30-45 phút.</p>
                </div>
              </div>
            </div>

            {/* CENTER COLUMN - Payment */}
            <div className="pay-side">
              <div className="payment-card">
                <h2 className="pay-title">Thông tin thanh toán</h2>

                <div className="form-group">
                  <label className="form-label">HỌ VÀ TÊN <span style={{ color: '#b01e1e' }}>*</span></label>
                  <input
                    type="text"
                    className="pay-input"
                    placeholder="Nhập tên của bạn"
                    value={this.state.txtName !== undefined ? this.state.txtName : (this.context.customer?.name || '')}
                    onChange={(e) => this.setState({ txtName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">SỐ ĐIỆN THOẠI <span style={{ color: '#b01e1e' }}>*</span></label>
                  <input
                    type="text"
                    className="pay-input"
                    placeholder="090 123 4567"
                    value={this.state.txtPhone !== undefined ? this.state.txtPhone : (this.context.customer?.phone || '')}
                    onChange={(e) => this.setState({ txtPhone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ĐỊA CHỈ GIAO HÀNG <span style={{ color: '#b01e1e' }}>*</span></label>
                  <input
                    type="text"
                    className="pay-input"
                    placeholder="Số nhà, tên đường, phường/xã..."
                    value={this.state.txtAddress !== undefined ? this.state.txtAddress : (this.context.customer?.address || '')}
                    onChange={(e) => this.setState({ txtAddress: e.target.value })}
                    required
                  />
                </div>

                <h3 className="pay-method-title">PHƯƠNG THỨC THANH TOÁN</h3>
                <div className="method-list">
                  <div className={`method-item ${this.state.payMethod === 'COD' ? 'active' : ''}`} onClick={() => this.setState({ payMethod: 'COD' })}>
                    <div className="method-left">
                      <span>💵</span>
                      <span>Tiền mặt (COD)</span>
                    </div>
                    <div className="radio-indicator"></div>
                  </div>
                  <div className={`method-item ${this.state.payMethod === 'MOMO' ? 'active' : ''}`} onClick={() => this.setState({ payMethod: 'MOMO' })}>
                    <div className="method-left">
                      <span>📱</span>
                      <span>Ví MoMo</span>
                    </div>
                    <div className="radio-indicator"></div>
                  </div>
                  <div className={`method-item ${this.state.payMethod === 'BANK' ? 'active' : ''}`} onClick={() => this.setState({ payMethod: 'BANK' })}>
                    <div className="method-left">
                      <span>🏦</span>
                      <span>Chuyển khoản</span>
                    </div>
                    <div className="radio-indicator"></div>
                  </div>
                </div>

                {/* QR DISPLAY SECTION */}
                {this.state.payMethod === 'BANK' && (
                  <div className="qr-section">
                    <span className="qr-title">Hệ thống VietQR</span>
                    <p className="qr-desc">Vui lòng quét mã bên dưới để thanh toán đơn hàng</p>
                    <img
                      src={`https://img.vietqr.io/image/MB-1230111999999-compact.png?amount=${totalPayable}&addInfo=KH%20${this.context.customer?.name}%20THANH%20TOAN%20MUKBANG&accountName=MUKBANG%20KOREA%20FOOD`}
                      alt="VietQR Bank"
                      className="qr-img"
                    />
                    <div className="qr-bank-info">
                      <div>Ngân hàng: <b>MB Bank (Quân Đội)</b></div>
                      <div>STK: <b>1230111999999</b></div>
                      <div>Chủ TK: <b>MUKBANG KOREA FOOD</b></div>
                    </div>
                  </div>
                )}

                {this.state.payMethod === 'MOMO' && (
                  <div className="qr-section">
                    <span className="qr-title">Thanh toán MoMo</span>
                    <p className="qr-desc">Quét mã để thanh toán qua ứng dụng Ví MoMo</p>
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=2|99|0901234567|MUKBANG%20KOREA|contact@mukbang.vn|0|0|50000"
                      alt="MoMo QR"
                      className="qr-img"
                    />
                    <div className="qr-bank-info" style={{ textAlign: 'center' }}>
                      <div>Số điện thoại: <b>0901 234 567</b></div>
                      <div>Người nhận: <b>MUKBANG KOREA FOOD</b></div>
                    </div>
                  </div>
                )}

                <div className="summary-section">
                  <div className="summary-row">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString()}đ</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí vận chuyển</span>
                    <span>{shipping.toLocaleString()}đ</span>
                  </div>

                  <div className="total-row">
                    <span className="total-lbl">Tổng cộng</span>
                    <span className="total-val">{totalPayable.toLocaleString()}đ</span>
                  </div>
                </div>

                <button className="confirm-btn" onClick={() => this.lnkCheckoutClick()}>
                  Xác nhận thanh toán <span>➔</span>
                </button>

                <div className="safety-tag">BẢO MẬT & AN TOÀN TUYỆT ĐỐI</div>
              </div>
            </div>

            {/* FLOATING ORDER BUTTON */}
            <button className="oh-fab" onClick={() => this.setState({ ohOpen: true })}>
              📋
              {this.state.orders.length > 0 && (
                <span className="oh-fab-badge">{this.state.orders.length}</span>
              )}
            </button>

            {/* DRAWER OVERLAY */}
            <div
              className={`oh-overlay ${this.state.ohOpen ? 'oh-open' : ''}`}
              onClick={() => this.setState({ ohOpen: false, selectedOrder: null })}
            />

            {/* DRAWER */}
            <div className={`oh-drawer ${this.state.ohOpen ? 'oh-open' : ''}`}>
              <div className="oh-drawer-header">
                <div className="oh-title">
                  <div className="oh-title-icon">📋</div>
                  <span>Đơn đã đặt</span>
                  {this.state.orders.length > 0 && (
                    <span className="oh-count-chip">{this.state.orders.length} đơn</span>
                  )}
                </div>
                <button className="oh-drawer-close" onClick={() => this.setState({ ohOpen: false, selectedOrder: null })}>✕</button>
              </div>

              <div className="oh-scroll">
                {!this.context.customer ? (
                  <div className="oh-login-prompt">
                    <div className="oh-login-prompt-icon">🔒</div>
                    <p className="oh-login-prompt-text">Đăng nhập để xem đơn hàng</p>
                    <button className="oh-login-btn" onClick={() => { this.setState({ ohOpen: false }); this.props.navigate('/login'); }}>
                      Đăng nhập ngay
                    </button>
                  </div>
                ) : this.state.orders.length === 0 ? (
                  <div className="oh-empty">
                    <div className="oh-empty-icon">📭</div>
                    <p className="oh-empty-text">Chưa có đơn hàng nào</p>
                    <p className="oh-empty-sub">Đơn hàng sẽ hiển thị ở đây sau khi bạn đặt</p>
                  </div>
                ) : (
                  this.state.orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <div
                        className={`oh-card oh-card-${(order.status || 'pending').toLowerCase()} ${this.state.selectedOrder?._id === order._id ? 'oh-selected' : ''}`}
                        onClick={() => this.setState({ selectedOrder: this.state.selectedOrder?._id === order._id ? null : order })}
                      >
                        <div className="oh-card-top">
                          <span className="oh-order-id">#{order._id.substring(order._id.length - 8)}</span>
                          <span className={`oh-status ${this.getStatusClass(order.status)}`}>
                            {this.getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="oh-card-date">
                          {new Date(order.cdate).toLocaleString('vi-VN')}
                        </div>
                        <div className="oh-items-preview">
                          {order.items && order.items.slice(0, 4).map((it, i) => (
                            <img
                              key={i}
                              src={"data:image/jpg;base64," + it.product.image}
                              alt=""
                              className="oh-item-thumb"
                            />
                          ))}
                          {order.items && order.items.length > 4 && (
                            <div className="oh-item-more">+{order.items.length - 4}</div>
                          )}
                        </div>
                        <div className="oh-card-bottom">
                          <span className="oh-item-count-label">{order.items ? order.items.length : 0} món</span>
                          <span className="oh-total">{order.total?.toLocaleString()}đ</span>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {this.state.selectedOrder?._id === order._id && (
                        <div className="oh-detail-overlay">
                          <div className="oh-detail-title">
                            <span>Chi tiết đơn #{order._id.substring(order._id.length - 6)}</span>
                            <button className="oh-detail-close" onClick={(e) => { e.stopPropagation(); this.setState({ selectedOrder: null }); }}>✕</button>
                          </div>
                          {order.items && order.items.map((it, i) => (
                            <div key={i} className="oh-detail-item">
                              <img src={"data:image/jpg;base64," + it.product.image} alt="" className="oh-detail-img" />
                              <div className="oh-detail-info">
                                <div className="oh-detail-name">{it.product.name}</div>
                                <div className="oh-detail-qty">x{it.quantity}</div>
                              </div>
                              <div className="oh-detail-price">{(it.product.price * it.quantity).toLocaleString()}đ</div>
                            </div>
                          ))}
                          <div className="oh-detail-total-row">
                            <span className="oh-detail-total-label">Tổng đơn hàng</span>
                            <span className="oh-detail-total-val">{order.total?.toLocaleString()}đ</span>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Mycart);