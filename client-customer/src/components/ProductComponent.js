import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import { Helmet } from 'react-helmet-async';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  // ================= LIFECYCLE =================
  componentDidMount() {
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  // ================= APIs =================
  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      this.setState({ products: res.data || [] });
    });
  }

  apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      this.setState({ products: res.data || [] });
    });
  }

  // ================= RENDER =================
  render() {
    const prods = this.state.products.map((item) => (
      <div key={item._id} className="p-card">
        <Link to={'/product/' + item._id} className="p-link">
          <div className="p-img-wrapper">
            <img
              src={'data:image/jpg;base64,' + item.image}
              className="p-img"
              alt={item.name}
            />
            <div className="p-overlay">Xem chi tiết</div>
          </div>
          <div className="p-info">
            <h3 className="p-name">{item.name}</h3>
            <p className="p-price">{item.price?.toLocaleString()} VNĐ</p>
            <button className="p-btn">Thêm ngay</button>
          </div>
        </Link>
      </div>
    ));

    return (
      <div className="korea-products-page">
        <style>{`
          .korea-products-page {
            padding: 40px 20px;
            background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
            min-height: 80vh;
            font-family: 'Inter', sans-serif;
          }

          .p-title {
            text-align: center;
            color: #d32f2f;
            font-weight: 900;
            font-size: 32px;
            margin-bottom: 40px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          .p-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 30px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .p-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            transition: 0.4s;
            border: 1px solid #eee;
          }

          .p-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(211, 47, 47, 0.15);
            border-color: #ff9f43;
          }

          .p-img-wrapper {
            position: relative;
            height: 250px;
            overflow: hidden;
          }

          .p-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: 0.5s;
          }

          .p-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(211, 47, 47, 0.7);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 800;
            opacity: 0;
            transition: 0.3s;
          }

          .p-card:hover .p-overlay { opacity: 1; }
          .p-card:hover .p-img { transform: scale(1.1); }

          .p-info { padding: 20px; text-align: center; }
          .p-name {
            font-size: 18px;
            font-weight: 800;
            color: #333;
            margin-bottom: 10px;
            height: 45px;
            overflow: hidden;
          }

          .p-price {
            font-size: 20px;
            font-weight: 900;
            color: #ff8c00;
            margin-bottom: 15px;
          }

          .p-btn {
            background: #fff5f5;
            color: #d32f2f;
            border: 2px solid #d32f2f;
            padding: 8px 25px;
            border-radius: 50px;
            font-weight: 800;
            cursor: pointer;
            transition: 0.3s;
          }

          .p-card:hover .p-btn {
            background: #d32f2f;
            color: white;
          }

          .p-link { text-decoration: none; color: inherit; }

          .no-products {
            text-align: center;
            padding: 50px;
            color: #999;
            font-size: 18px;
          }
        `}</style>

        <Helmet>
          <title>Thực Đơn Món Ăn Hàn Quốc | Mukbang Korea Food</title>
          <meta name="description" content="Khám phá thực đơn phong phú từ Bibimbap, Kimbap đến các món lẩu Hàn Quốc đặc sắc. Nguyên liệu tươi ngon, chế biến chuẩn vị Hàn. Đặt giao hàng ngay!" />
          <meta name="keywords" content="thực đơn món hàn, danh sách món ăn mukbang, món hàn quốc ngon" />
        </Helmet>

        <h1 className="p-title">Danh Sách Món Ăn</h1>
        
        <div className="p-grid">
          {prods.length > 0 ? prods : (
            <div className="no-products">Hiện chưa có món ăn nào trong mục này...</div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Product);