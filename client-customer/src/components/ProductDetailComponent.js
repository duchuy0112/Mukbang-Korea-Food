import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      activeTab: 'desc'
    };
  }

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
    window.scrollTo(0, 0);
  }

  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      this.setState({ product: res.data });
    });
  }

  handleQtyChange(amount) {
    const newQty = Math.max(1, Math.min(99, parseInt(this.state.txtQuantity) + amount));
    this.setState({ txtQuantity: newQty });
  }

  render() {
    const prod = this.state.product;
    if (!prod) {
      return (
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Đang chuẩn bị mỹ vị...</p>
          <style>{`
            .loading-screen { height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; color: #d32f2f; font-weight: 800; font-family: 'Plus Jakarta Sans', sans-serif; }
            .loader { width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #d32f2f; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      );
    }

    return (
      <div className="p-detail-page">
        <style>{`
          :root {
            --primary-red: #D32F2F;
            --primary-orange: #FF6D00;
            --accent-gradient: linear-gradient(135deg, #FF6D00 0%, #D32F2F 100%);
          }

          .p-detail-page {
            max-width: 1200px; margin: 0 auto; padding: 40px; font-family: 'Inter', sans-serif; color: #1a1a1a;
          }

          /* --- BREADCRUMB --- */
          .breadcrumb { margin-bottom: 30px; font-size: 13px; font-weight: 600; color: #aaa; display: flex; gap: 8px; }
          .breadcrumb a { text-decoration: none; color: inherit; transition: 0.3s; }
          .breadcrumb a:hover { color: var(--primary-red); }

          /* --- MAIN WRAPPER --- */
          .main-detail-grid { display: grid; grid-template-columns: 450px 1fr; gap: 60px; align-items: start; }

          /* --- IMAGE --- */
          .main-img-frame {
            background: #fff; border-radius: 30px; overflow: hidden; border: 1px solid #f0f0f0;
            box-shadow: 0 20px 50px rgba(0,0,0,0.06); aspect-ratio: 1/1;
          }
          .main-img-frame img { width: 100%; height: 100%; object-fit: cover; transition: 1s cubic-bezier(0.165, 0.84, 0.44, 1); }
          .main-img-frame:hover img { transform: scale(1.08); }

          /* --- INFO --- */
          .detail-cat { color: var(--primary-red); font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 12px; display: block; }
          .detail-title { font-size: 42px; font-weight: 900; line-height: 1.1; margin-bottom: 20px; letter-spacing: -1.5px; }
          
          .price-status-row { display: flex; align-items: center; gap: 30px; margin-bottom: 30px; }
          .price-tag { font-size: 32px; font-weight: 900; color: var(--primary-red); }
          
          .stock-status {
            display: flex; align-items: center; gap: 8px; background: #e8f5e9; color: #2e7d32;
            padding: 6px 14px; border-radius: 50px; font-size: 13px; font-weight: 700;
          }
          .stock-status svg { fill: #2e7d32; width: 16px; height: 16px; }

          .detail-short-desc {
             font-size: 16px; color: #666; line-height: 1.8; margin-bottom: 35px; padding-left: 20px; border-left: 3px solid var(--primary-orange);
          }

          /* --- PURCHASE BOX --- */
          .purchase-box { display: flex; align-items: center; gap: 20px; margin-bottom: 45px; }
          .qty-control { 
            display: flex; align-items: center; background: #f5f5f7; border-radius: 50px; 
            padding: 8px 15px; border: none; width: 140px; justify-content: space-between;
          }
          .qty-btn { 
            width: 32px; height: 32px; border: none; background: transparent; 
            font-size: 20px; cursor: pointer; transition: 0.2s; color: #333; 
            display: flex; align-items: center; justify-content: center; font-weight: 500;
          }
          .qty-btn:hover { color: var(--primary-red); transform: scale(1.2); }
          .qty-val { 
            width: 40px; text-align: center; font-weight: 700; font-size: 17px; 
            background: transparent; border: none; outline: none; color: #1d1d1f;
          }

          .add-to-cart-btn {
             flex: 1; height: 64px; background: #a62626; color: white; border: none; 
             border-radius: 50px; font-size: 16px; font-weight: 700; cursor: pointer; 
             transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; 
             justify-content: center; gap: 12px; box-shadow: 0 10px 25px rgba(166, 38, 38, 0.25);
          }
          .add-to-cart-btn:hover { 
            background: #8e1e1e; transform: translateY(-4px) scale(1.02); 
            box-shadow: 0 15px 35px rgba(166, 38, 38, 0.35); 
          }

          /* --- TABS --- */
          .tabs-row { display: flex; gap: 40px; border-bottom: 2px solid #f0f0f0; margin-bottom: 30px; }
          .tab-item { padding: 15px 0; font-weight: 800; font-size: 16px; cursor: pointer; color: #bbb; position: relative; transition: 0.3s; }
          .tab-item.active { color: #1a1a1a; }
          .tab-item.active::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 3px; background: var(--primary-red); }

          .tab-pane { font-size: 15px; color: #555; line-height: 1.8; animation: fadeIn 0.4s ease; }

          @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

          @media (max-width: 1000px) {
            .p-detail-page { padding: 25px 20px; }
            .main-detail-grid { grid-template-columns: 1fr; gap: 30px; }
            .main-img-frame { max-width: 500px; margin: 0 auto; }
            .detail-title { font-size: 32px; }
          }
        `}</style>

        <Helmet>
          <title>{prod.name} | Chi Tiết Mỹ Vị | Mukbang Seoul</title>
        </Helmet>

        <nav className="breadcrumb">
          <Link to="/home">Trang chủ</Link> <span>/</span> 
          <Link to="/product/category/all">Thực đơn</Link> <span>/</span>
          <span style={{color: '#333', fontWeight: 700}}>{prod.name}</span>
        </nav>

        <div className="main-detail-grid">
          {/* TRÁI: ẢNH SẢN PHẨM */}
          <div className="detail-gallery">
            <div className="main-img-frame">
              <img src={"data:image/jpg;base64," + prod.image} alt={prod.name} />
            </div>
          </div>

          {/* PHẢI: THÔNG TIN SẢN PHẨM */}
          <div className="detail-content">
            <span className="detail-cat">{prod.category?.name || 'Món chính'}</span>
            <h1 className="detail-title">{prod.name}</h1>
            
            <div className="price-status-row">
              <span className="price-tag">{prod.price?.toLocaleString()} VNĐ</span>
              <span className="stock-status">
                 <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                 Sẵn sàng phục vụ
              </span>
            </div>

            <p className="detail-short-desc">
              {prod.description || "Món ăn chuẩn vị Hàn Quốc, được chế biến tâm huyết từ các đầu bếp hàng đầu với 15 năm kinh nghiệm."}
            </p>

            {prod.ingredients && (
              <div style={{marginBottom: '30px', fontSize: '14px', color: '#888', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{color: '#D32F2F', fontWeight: '800'}}>THÀNH PHẦN:</span> {prod.ingredients.length > 80 ? prod.ingredients.substring(0, 77) + '...' : prod.ingredients}
              </div>
            )}

            <div className="purchase-box">
              <div className="qty-control">
                <button className="qty-btn" onClick={() => this.handleQtyChange(-1)}>−</button>
                <input className="qty-val" type="text" readOnly value={this.state.txtQuantity} />
                <button className="qty-btn" onClick={() => this.handleQtyChange(1)}>+</button>
              </div>

              <button className="add-to-cart-btn" onClick={(e) => this.btnAdd2CartClick(e)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Thêm vào giỏ hàng
              </button>
            </div>

            <div className="tabs-row">
               <div className={`tab-item ${this.state.activeTab === 'info' ? 'active' : ''}`} onClick={() => this.setState({activeTab: 'info'})}>Thông tin dinh dưỡng & Phục vụ</div>
            </div>

            <div className="tab-pane">
               • <b>Nguyên liệu chính:</b> {prod.ingredients || "Nguyên liệu tươi sạch nhập khẩu hàng ngày."}<br/>
               • <b>Thời gian chuẩn bị:</b> 10-15 phút<br/>
               • <b>Đóng gói:</b> Hộp giấy bảo vệ môi trường, giữ nhiệt 45 phút<br/>
               • <b>Ghi chú:</b> Món ăn ngon nhất khi dùng nóng.<br/>
               • <b>Giao hàng:</b> Miễn phí trong bán kính 3km
            </div>
          </div>
        </div>
      </div>
    );
  }

  btnAdd2CartClick(e) {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);
    
    if (quantity > 0) {
      const mycart = [...this.context.mycart];
      const index = mycart.findIndex(x => x.product._id === product._id);
      
      if (index === -1) {
        mycart.push({ product: product, quantity: quantity });
      } else {
        mycart[index].quantity += quantity;
      }
      
      this.context.setMycart(mycart);
      alert('Tuyệt vời! ' + product.name + ' đã được thêm vào giỏ hàng.');
    }
  }
}

export default withRouter(ProductDetail);