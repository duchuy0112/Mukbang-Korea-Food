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
      payMethod: 'COD' // 'COD' | 'MOMO' | 'BANK'
    };
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
        this.props.navigate('/home');
      } else {
        alert('CÓ LỖI XẢY RA, VUI LÒNG THỬ LẠI!');
      }
    });
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
            padding: 60px 5%;
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

          /* RIGHT: PAYMENT INFO */
          .payment-card {
            background: #f1ede8;
            border-radius: 24px;
            padding: 40px;
          }
          .pay-title { font-size: 24px; font-weight: 800; margin-bottom: 35px; }

          .form-group { margin-bottom: 25px; }
          .form-label { display: block; font-size: 11px; font-weight: 800; color: #888; margin-bottom: 10px; letter-spacing: 0.5px; }
          .pay-input {
            width: 100%;
            border: none;
            background: #fff;
            padding: 16px 20px;
            border-radius: 12px;
            font-size: 14px;
            outline: none;
            transition: 0.2s;
          }
          .pay-input:focus { box-shadow: 0 0 0 2px #e25a36; }

          .pay-method-title { font-size: 11px; font-weight: 800; color: #888; margin-bottom: 15px; text-transform: uppercase; }
          .method-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 40px; }
          .method-item {
            background: #fff;
            padding: 15px 20px;
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
          .total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; margin-bottom: 30px; }
          .total-lbl { font-size: 18px; font-weight: 800; color: #1a1a1a; }
          .total-val { font-size: 32px; font-weight: 900; color: #b01e1e; }

          .confirm-btn {
            width: 100%;
            background: #b01e1e;
            color: #fff;
            border: none;
            padding: 20px;
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

          .safety-tag { text-align: center; font-size: 10px; font-weight: 800; color: #aaa; margin-top: 25px; letter-spacing: 1px; text-transform: uppercase; }

          /* QR SECTION */
          .qr-section {
            background: #fff;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 30px;
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

          @media (max-width: 900px) {
            .checkout-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <div className="checkout-wrapper">
          <h1 className="main-heading">Giỏ hàng & Thanh toán</h1>
          <p className="sub-heading">Hoàn tất hành trình ẩm thực Hàn Quốc của bạn.</p>

          <div className="checkout-grid">
            {/* LEFT COLUMN */}
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

            {/* RIGHT COLUMN */}
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
                    {/* Placeholder MoMo QR - trong thực tế sẽ là QR động từ Gateway */}
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
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Mycart);