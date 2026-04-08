import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null
    };
  }

  render() {
    const cates = this.state.categories.map((item) => {
      const isSelected = this.state.itemSelected?._id === item._id;
      return (
        <tr
          key={item._id}
          className={`cat-row ${isSelected ? 'cat-row-active' : ''}`}
          onClick={() => this.trItemClick(item)}
        >
          <td><span className="cat-id">#{item._id.substring(item._id.length - 6).toUpperCase()}</span></td>
          <td><span className="cat-name">{item.name}</span></td>
          <td>
            <span className="cat-status-badge">Đang kinh doanh</span>
          </td>
          <td>
            <span className={`cat-select-btn ${isSelected ? 'selected' : ''}`}>
              {isSelected ? '✓ Đang chỉnh sửa' : 'Chọn'}
            </span>
          </td>
        </tr>
      );
    });

    return (
      <div className="cat-page">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

          .cat-page {
            padding: 10px 0 40px;
            font-family: 'Inter', sans-serif;
            animation: cat-fadeIn 0.6s ease-out;
          }

          @keyframes cat-fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .cat-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 28px;
          }

          .cat-header h1 {
            font-size: 30px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0 0 6px;
            letter-spacing: -1px;
          }

          .cat-header-sub {
            font-size: 14px;
            color: #999;
            font-weight: 500;
          }

          .cat-count-badge {
            background: #fff5f5;
            color: #c62828;
            border: 1.5px solid #fecaca;
            border-radius: 50px;
            padding: 6px 18px;
            font-size: 13px;
            font-weight: 800;
          }

          .cat-layout {
            display: flex;
            gap: 24px;
            align-items: flex-start;
          }

          .cat-table-wrapper {
            flex: 1.4;
            background: #fff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 8px 35px rgba(0,0,0,0.04);
            border: 1px solid #f0f0f0;
          }

          .cat-table {
            width: 100%;
            border-collapse: collapse;
          }

          .cat-table th {
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

          .cat-row {
            border-bottom: 1px solid #f5f5f5;
            cursor: pointer;
            transition: all 0.25s;
          }

          .cat-row:last-child { border-bottom: none; }

          .cat-row:hover { background: #fffaf5; }

          .cat-row-active { background: #fff8f5 !important; }

          .cat-row td {
            padding: 16px 20px;
            font-size: 14px;
            vertical-align: middle;
          }

          .cat-id {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: #bbb;
            font-weight: 700;
          }

          .cat-name {
            font-weight: 800;
            color: #1a1a1a;
            font-size: 15px;
          }

          .cat-status-badge {
            background: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #c8e6c9;
            padding: 5px 14px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 800;
          }

          .cat-select-btn {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 800;
            background: #f5f5f5;
            color: #888;
            transition: all 0.2s;
            cursor: pointer;
          }

          .cat-row:hover .cat-select-btn {
            background: #fff3f3;
            color: #c62828;
          }

          .cat-select-btn.selected {
            background: linear-gradient(135deg, #c62828 0%, #e53935 100%);
            color: #fff;
            box-shadow: 0 4px 12px rgba(198,40,40,0.25);
          }

          .cat-detail-wrapper {
            flex: 1;
            position: sticky;
            top: 10px;
          }

          @media (max-width: 1024px) {
            .cat-layout { flex-direction: column; }
          }
        `}</style>

        <div className="cat-header">
          <div>
            <h1>Quản lý Danh mục</h1>
            <div className="cat-header-sub">Quản lý toàn bộ danh mục món ăn trong hệ thống</div>
          </div>
          <span className="cat-count-badge">{this.state.categories.length} danh mục</span>
        </div>

        <div className="cat-layout">
          <div className="cat-table-wrapper">
            <table className="cat-table">
              <thead>
                <tr>
                  <th>Mã số</th>
                  <th>Tên danh mục</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cates}
              </tbody>
            </table>
          </div>

          <div className="cat-detail-wrapper">
            <CategoryDetail
              item={this.state.itemSelected}
              updateCategories={this.updateCategories}
            />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() { this.apiGetCategories(); }
  trItemClick(item) { this.setState({ itemSelected: item }); }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.setState({ categories: res.data || [] });
    });
  }

  updateCategories = (categories) => {
    this.setState({ categories: categories, itemSelected: null });
  }
}

export default Category;