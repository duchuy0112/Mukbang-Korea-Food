import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent'; 

class Product extends Component {
  static contextType = MyContext; 
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null
    };
  }

  updateProducts = (products, noPages, curPage) => {
    this.setState({ products: products, noPages: noPages, curPage: curPage });
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  lnkPageClick(index) {
    this.apiGetProducts(index);
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + page, config).then((res) => {
      const result = res.data;
      if (result) {
        this.setState({ 
          products: result.products || [], 
          noPages: result.noPages || 0, 
          curPage: result.curPage || 1 
        });
      }
    });
  }

  render() {
    // BẢN CHẤT CODE: Lọc bỏ các sản phẩm không có category trước khi map
    const filteredProducts = this.state.products.filter(item => item.category !== null);

    const prods = filteredProducts.map((item) => {
      return (
        <tr key={item._id} className="datatable-row" onClick={() => this.trItemClick(item)}>
          <td className="id-cell">#{item._id.substring(item._id.length - 6).toUpperCase()}</td>
          <td className="name-cell">{item.name}</td>
          <td className="price-cell">{item.price?.toLocaleString()} VNĐ</td>
          <td className="date-cell">{new Date(item.cdate).toLocaleDateString('vi-VN')}</td>
          <td className="cate-cell">
            <span className="cate-badge">{item.category.name}</span>
          </td>
          <td className="img-cell">
            <div className="product-img-wrapper">
              <img src={"data:image/jpg;base64," + item.image} alt={item.name} />
            </div>
          </td>
        </tr>
      );
    });

    // GIỮ NGUYÊN HỆ THỐNG PHÂN TRANG 1, 2, 3, 4, 5
    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      const pageNum = index + 1;
      if (pageNum === this.state.curPage) {
        return (<span key={index} className="pg-item active">{pageNum}</span>);
      } else {
        return (<span key={index} className="pg-item link" onClick={() => this.lnkPageClick(pageNum)}>{pageNum}</span>);
      }
    });

    return (
      <div className="product-admin-container">
        <style>{`
          .product-admin-container {
            padding: 40px 20px;
            font-family: 'Inter', sans-serif;
            background-color: #fcfaf7;
            background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
            min-height: 100vh;
            display: flex;
            gap: 40px;
            align-items: flex-start;
            justify-content: center;
          }
          .list-section {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
            width: 100%;
            max-width: 850px; /* Cân đối với bảng thông tin */
            box-sizing: border-box;
          }
          .text-center {
            color: #d32f2f;
            font-weight: 900;
            letter-spacing: 2px;
            margin-bottom: 30px;
            text-transform: uppercase;
            font-size: 24px;
            text-align: center;
          }
          table.datatable {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background: #f1f5f9;
            color: #475569;
            padding: 15px;
            text-transform: uppercase;
            font-size: 12px;
            font-weight: 800;
            border-bottom: 3px solid #ff9f43;
          }
          .datatable-row {
            transition: 0.3s;
            cursor: pointer;
            border-bottom: 1px solid #f1f1f1;
          }
          .datatable-row:hover {
            background: #fff5f5;
          }
          td {
            padding: 15px;
            vertical-align: middle;
            color: #333;
            font-weight: 600;
            font-size: 14px;
          }
          .id-cell { font-family: monospace; color: #94a3b8; }
          .name-cell { color: #2d2d2d; font-weight: 800; font-size: 16px; }
          .price-cell { color: #d32f2f; font-weight: 900; }
          
          .cate-badge {
            background: #fff7ed;
            color: #ea580c;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 800;
            border: 1px solid #fdba74;
          }

          .product-img-wrapper {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            overflow: hidden;
            border: 2px solid #eee;
            margin: 0 auto;
          }
          .product-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }

          .pagination-container {
            margin-top: 30px;
            display: flex;
            justify-content: center;
            gap: 10px;
          }
          .pg-item {
            width: 35px; height: 35px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 8px; background: white;
            color: #64748b; font-weight: 800; border: 2px solid #e2e8f0;
            cursor: pointer;
          }
          .pg-item.active {
            background: #d32f2f; color: white; border-color: #d32f2f;
          }

          .product-detail-section { 
            width: 380px; 
            flex-shrink: 0;
          }
        `}</style>

        <div className="list-section">
          <h2 className="text-center">Quản lý Sản phẩm</h2>
          <table className="datatable">
            <thead>
              <tr>
                <th>Mã số</th>
                <th>Tên món ăn</th>
                <th>Giá bán</th>
                <th>Ngày tạo</th>
                <th>Danh mục</th>
                <th style={{textAlign: 'center'}}>Hình ảnh</th>
              </tr>
            </thead>
            <tbody>
              {prods}
            </tbody>
          </table>
          
          <div className="pagination-container">
            {pagination}
          </div>
        </div>
        
        <div className="product-detail-section">
          <ProductDetail 
            item={this.state.itemSelected} 
            curPage={this.state.curPage} 
            updateProducts={this.updateProducts} 
          />
        </div>
      </div>
    );
  }
}

export default Product;