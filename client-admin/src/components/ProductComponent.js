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
    this.setState({ products, noPages, curPage });
  }

  componentDidMount() { this.apiGetProducts(this.state.curPage); }
  lnkPageClick(index) { this.apiGetProducts(index); }
  trItemClick(item) { this.setState({ itemSelected: item }); }

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
    const filteredProducts = this.state.products.filter(item => item.category !== null);

    const prods = filteredProducts.map((item) => {
      const isSelected = this.state.itemSelected?._id === item._id;
      return (
        <tr
          key={item._id}
          className={`prod-row ${isSelected ? 'prod-row-active' : ''}`}
          onClick={() => this.trItemClick(item)}
        >
          <td><span className="prod-id">#{item._id.substring(item._id.length - 6).toUpperCase()}</span></td>
          <td>
            <div className="prod-name-cell">
              <div className="prod-thumb">
                <img src={"data:image/jpg;base64," + item.image} alt={item.name} />
              </div>
              <div className="prod-name-info">
                <div className="prod-name">{item.name}</div>
                <div className="prod-date">📅 {new Date(item.cdate).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>
          </td>
          <td><span className="prod-price">{item.price?.toLocaleString()} đ</span></td>
          <td>
            <span className="prod-cate-badge">{item.category.name}</span>
          </td>
          <td>
            <span className={`prod-select-btn ${isSelected ? 'selected' : ''}`}>
              {isSelected ? '✓ Đang chỉnh sửa' : 'Chỉnh sửa'}
            </span>
          </td>
        </tr>
      );
    });

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      const pageNum = index + 1;
      if (pageNum === this.state.curPage) {
        return <span key={index} className="prod-pg-btn active">{pageNum}</span>;
      } else {
        return <span key={index} className="prod-pg-btn" onClick={() => this.lnkPageClick(pageNum)}>{pageNum}</span>;
      }
    });

    return (
      <div className="prod-page">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

          .prod-page {
            padding: 10px 0 40px;
            font-family: 'Inter', sans-serif;
            animation: prod-fadeIn 0.6s ease-out;
          }

          @keyframes prod-fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .prod-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 28px;
          }

          .prod-header h1 {
            font-size: 30px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0 0 6px;
            letter-spacing: -1px;
          }

          .prod-header-sub {
            font-size: 14px;
            color: #999;
            font-weight: 500;
          }

          .prod-count-badge {
            background: #fff5f5;
            color: #c62828;
            border: 1.5px solid #fecaca;
            border-radius: 50px;
            padding: 6px 18px;
            font-size: 13px;
            font-weight: 800;
          }

          .prod-layout {
            display: flex;
            gap: 24px;
            align-items: flex-start;
          }

          .prod-list-panel {
            flex: 1.5;
            min-width: 0;
          }

          .prod-table-wrapper {
            background: #fff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 8px 35px rgba(0,0,0,0.04);
            border: 1px solid #f0f0f0;
            margin-bottom: 20px;
          }

          .prod-table {
            width: 100%;
            border-collapse: collapse;
          }

          .prod-table th {
            padding: 16px 20px;
            text-align: left;
            font-size: 11px;
            font-weight: 900;
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: #fafafa;
            border-bottom: 1px solid #f0f0f0;
          }

          .prod-row {
            border-bottom: 1px solid #f5f5f5;
            cursor: pointer;
            transition: all 0.25s;
          }

          .prod-row:last-child { border-bottom: none; }
          .prod-row:hover { background: #fffaf5; }
          .prod-row-active { background: #fff8f5 !important; }

          .prod-row td {
            padding: 14px 20px;
            font-size: 13px;
            vertical-align: middle;
          }

          .prod-id {
            font-family: monospace;
            font-size: 12px;
            color: #bbb;
            font-weight: 700;
          }

          .prod-name-cell {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .prod-thumb {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            overflow: hidden;
            border: 1.5px solid #eee;
            flex-shrink: 0;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }

          .prod-thumb img { width: 100%; height: 100%; object-fit: cover; }

          .prod-name-info { display: flex; flex-direction: column; gap: 3px; }
          .prod-name { font-weight: 800; color: #1a1a1a; font-size: 14px; }
          .prod-date { font-size: 11px; color: #bbb; font-weight: 500; }

          .prod-price {
            font-weight: 900;
            color: #c62828;
            font-size: 14px;
          }

          .prod-cate-badge {
            background: #fff7ed;
            color: #ea580c;
            padding: 5px 14px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 800;
            border: 1px solid #fdba74;
            white-space: nowrap;
          }

          .prod-select-btn {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 800;
            background: #f5f5f5;
            color: #888;
            transition: all 0.2s;
            white-space: nowrap;
          }

          .prod-row:hover .prod-select-btn {
            background: #fff3f3;
            color: #c62828;
          }

          .prod-select-btn.selected {
            background: linear-gradient(135deg, #c62828 0%, #e53935 100%);
            color: #fff;
            box-shadow: 0 4px 12px rgba(198,40,40,0.25);
          }

          /* PAGINATION */
          .prod-pagination {
            display: flex;
            justify-content: center;
            gap: 8px;
            padding: 4px 0 8px;
          }

          .prod-pg-btn {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            border: 1.5px solid #e8e8e8;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 700;
            color: #555;
            cursor: pointer;
            transition: 0.2s;
          }

          .prod-pg-btn:hover {
            border-color: #c62828;
            color: #c62828;
            background: #fff5f5;
          }

          .prod-pg-btn.active {
            background: #c62828;
            border-color: #c62828;
            color: #fff;
            box-shadow: 0 4px 12px rgba(198,40,40,0.3);
          }

          /* DETAIL PANEL */
          .prod-detail-panel {
            width: 370px;
            flex-shrink: 0;
            position: sticky;
            top: 10px;
          }

          @media (max-width: 1100px) {
            .prod-layout { flex-direction: column; }
            .prod-detail-panel { width: 100%; position: static; }
          }
        `}</style>

        <div className="prod-header">
          <div>
            <h1>Quản lý Sản phẩm</h1>
            <div className="prod-header-sub">Quản lý toàn bộ món ăn và thực đơn của nhà hàng</div>
          </div>
          <span className="prod-count-badge">{filteredProducts.length} sản phẩm</span>
        </div>

        <div className="prod-layout">
          <div className="prod-list-panel">
            <div className="prod-table-wrapper">
              <table className="prod-table">
                <thead>
                  <tr>
                    <th>Mã số</th>
                    <th>Tên món ăn</th>
                    <th>Giá bán</th>
                    <th>Danh mục</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>{prods}</tbody>
              </table>
            </div>
            <div className="prod-pagination">{pagination}</div>
          </div>

          <div className="prod-detail-panel">
            <ProductDetail
              item={this.state.itemSelected}
              curPage={this.state.curPage}
              updateProducts={this.updateProducts}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Product;