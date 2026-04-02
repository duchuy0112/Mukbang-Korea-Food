import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import { Helmet } from 'react-helmet-async';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1
    };
  }

  render() {
    const prod = this.state.product;
    if (prod != null) {
      return (
        <div className="korea-detail-container">
          <style>{`
            .korea-detail-container {
              padding: 60px 20px;
              max-width: 1100px;
              margin: 0 auto;
              font-family: 'Inter', sans-serif;
              background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
            }

            .detail-wrapper {
              display: flex;
              gap: 50px;
              background: white;
              padding: 40px;
              border-radius: 30px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.05);
              border: 2px solid #ff9f43;
              align-items: center;
            }

            /* PHẦN HÌNH ẢNH LẤP LÁNH */
            .detail-img-box {
              flex: 1;
              position: relative;
            }

            .detail-img {
              width: 100%;
              max-width: 450px;
              border-radius: 20px;
              box-shadow: 0 10px 30px rgba(211, 47, 47, 0.2);
              border: 3px solid #d32f2f;
              transition: 0.5s;
            }

            .detail-img:hover {
              transform: scale(1.02);
            }

            /* THÔNG TIN SẢN PHẨM */
            .detail-info {
              flex: 1;
            }

            .detail-title {
              font-size: 32px;
              font-weight: 900;
              color: #d32f2f;
              margin-bottom: 10px;
              text-transform: uppercase;
            }

            .detail-id {
              font-size: 12px;
              color: #999;
              margin-bottom: 20px;
              display: block;
            }

            .detail-price {
              font-size: 36px;
              font-weight: 900;
              color: #ff8c00;
              margin-bottom: 30px;
            }

            .info-table {
              width: 100%;
              border-bottom: 1px solid #eee;
              margin-bottom: 30px;
            }

            .info-table td {
              padding: 12px 0;
              font-size: 16px;
            }

            .label-td {
              color: #777;
              width: 120px;
              font-weight: 600;
            }

            .value-td {
              color: #333;
              font-weight: 700;
            }

            /* SỐ LƯỢNG & NÚT BẤM */
            .qty-input-group {
              display: flex;
              align-items: center;
              gap: 15px;
              margin-bottom: 35px;
            }

            .k-qty-input {
              width: 70px;
              padding: 12px;
              border-radius: 12px;
              border: 2px solid #ff9f43;
              text-align: center;
              font-weight: 900;
              font-size: 18px;
              outline: none;
            }

            .btn-add-cart {
              background: linear-gradient(135deg, #d32f2f 0%, #ff8c00 100%);
              color: white;
              border: none;
              padding: 18px 40px;
              border-radius: 50px;
              font-size: 18px;
              font-weight: 900;
              cursor: pointer;
              transition: 0.4s;
              box-shadow: 0 10px 25px rgba(211, 47, 47, 0.3);
              width: 100%;
              text-transform: uppercase;
            }

            .btn-add-cart:hover {
              transform: translateY(-3px);
              filter: brightness(1.1);
              box-shadow: 0 15px 35px rgba(211, 47, 47, 0.4);
            }

            .cate-badge {
              background: #fff5f5;
              color: #d32f2f;
              padding: 4px 12px;
              border-radius: 50px;
              font-size: 13px;
              border: 1px solid #ff9f43;
            }

            @media (max-width: 768px) {
              .detail-wrapper { flex-direction: column; padding: 20px; }
            }
          `}</style>

          <Helmet>
            <title>{prod.name} | Thưởng Thức Ẩm Thực Hàn Quốc | Mukbang</title>
            <meta name="description" content={`Thưởng thức ${prod.name} chuẩn vị Hàn Quốc tại Mukbang. Nguyên liệu nhập khẩu, chế biến tươi ngon mỗi ngày. Giá chỉ ${prod.price?.toLocaleString()} VNĐ.`} />
            <meta property="og:title" content={`${prod.name} - Món Ngon Mukbang Korea Food`} />
            <meta property="og:description" content={`Thưởng thức món ${prod.name} chuẩn vị Hàn Quốc. Đặt giao hàng tận nơi nhanh chóng.`} />
            <meta property="og:image" content={"data:image/jpg;base64," + prod.image} />
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": prod.name,
                "image": ["data:image/jpg;base64," + prod.image],
                "description": `Món ${prod.name} thơm ngon chuẩn vị Hàn Quốc tại Mukbang Korea Food.`,
                "brand": {
                  "@type": "Brand",
                  "name": "Mukbang Korea Food"
                },
                "offers": {
                  "@type": "Offer",
                  "priceCurrency": "VND",
                  "price": prod.price,
                  "availability": "https://schema.org/InStock"
                }
              })}
            </script>
          </Helmet>

          <div className="detail-wrapper">
            <div className="detail-img-box">
              <img
                src={"data:image/jpg;base64," + prod.image}
                className="detail-img"
                alt={prod.name}
              />
            </div>

            <div className="detail-info">
              <span className="detail-id">Mã sản phẩm: #{prod._id.substring(prod._id.length - 8)}</span>
              <h1 className="detail-title">{prod.name}</h1>
              <div className="detail-price">{prod.price?.toLocaleString()} VNĐ</div>

              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="label-td">Danh mục:</td>
                    <td className="value-td">
                      <span className="cate-badge">{prod.category?.name || 'Ẩm thực Hàn'}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="label-td">Trạng thái:</td>
                    <td className="value-td" style={{color: '#16a34a'}}>Còn hàng</td>
                  </tr>
                </tbody>
              </table>

              <form onSubmit={(e) => this.btnAdd2CartClick(e)}>
                <div className="qty-input-group">
                  <span style={{fontWeight: 800, color: '#444'}}>SỐ LƯỢNG:</span>
                  <input
                    className="k-qty-input"
                    type="number"
                    min="1"
                    max="99"
                    value={this.state.txtQuantity}
                    onChange={(e) => { this.setState({ txtQuantity: e.target.value }) }}
                  />
                </div>
                
                <button type="submit" className="btn-add-cart">
                  THÊM VÀO GIỎ HÀNG 🛒
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="text-center" style={{padding: '100px', backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")', minHeight: '60vh'}}>
        <h3 style={{color: '#d32f2f', fontWeight: 800, letterSpacing: '2px'}}>ĐANG TẢI CHI TIẾT MÓN ĂN...</h3>
      </div>
    );
  }

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }

  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      this.setState({ product: res.data });
    });
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
      alert('Tuyệt vời! Món ăn đã được thêm vào giỏ hàng.');
    } else {
      alert('Vui lòng nhập số lượng hợp lệ!');
    }
  }
}

export default withRouter(ProductDetail);