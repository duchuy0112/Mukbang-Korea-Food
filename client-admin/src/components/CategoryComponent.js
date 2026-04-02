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
          className={`k-tr ${isSelected ? 'k-active' : ''}`} 
          onClick={() => this.trItemClick(item)}
        >
          <td className="k-id">#{item._id.substring(item._id.length - 6).toUpperCase()}</td>
          <td className="k-name-cell">{item.name}</td>
          <td className="k-status">
            <span className="k-status-badge">Đang kinh doanh</span>
          </td>
        </tr>
      );
    });

    return (
      <div className="korea-light-admin">
        <style>{`
          .korea-light-admin {
            padding: 40px;
            background-color: #f9f7f5; /* Màu nền giấy Hanji sáng */
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
          }

          .k-layout {
            display: flex;
            gap: 30px;
            max-width: 1300px;
            margin: 0 auto;
            align-items: flex-start;
          }

          /* KHỐI DANH SÁCH SÁNG SỦA */
          .k-section-list {
            flex: 1.5;
            background: #ffffff;
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #e5e7eb; /* Viền xám nhạt thanh lịch */
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
            position: relative;
            overflow: hidden;
          }

          /* VIỀN HOA VĂN MỜ ĐỎ-CAM Ở GÓC */
          .k-section-list::before {
            content: '✿';
            position: absolute;
            top: -10px; right: -10px;
            font-size: 100px;
            color: rgba(211, 47, 47, 0.03);
          }

          .k-section-detail {
            flex: 1;
            position: sticky;
            top: 40px;
          }

          .k-title {
            color: #d32f2f; /* Đỏ đặc trưng */
            font-weight: 900;
            font-size: 24px;
            text-align: center;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          .k-title span {
            color: #ff8c00; /* Nhấn màu Cam */
          }

          .k-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 8px; /* Tạo khoảng cách giữa các hàng */
          }

          .k-table thead th {
            background: #f1f5f9; /* MÀU XÁM SÁNG HIỆN ĐẠI */
            color: #475569; /* Chữ xám đậm dễ đọc */
            padding: 15px;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 12px;
            border-bottom: 3px solid #ff9f43; /* Gạch chân màu Cam */
            border-radius: 8px 8px 0 0;
          }

          .k-tr {
            background: #ffffff;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .k-tr td {
            padding: 15px;
            text-align: center;
            border-top: 1px solid #f3f4f6;
            border-bottom: 1px solid #f3f4f6;
          }

          .k-tr td:first-child { border-left: 1px solid #f3f4f6; border-radius: 12px 0 0 12px; }
          .k-tr td:last-child { border-right: 1px solid #f3f4f6; border-radius: 0 12px 12px 0; }

          .k-tr:hover {
            background: #fff5f5;
            transform: scale(1.01);
          }

          /* TRẠNG THÁI ACTIVE RỰC RỠ */
          .k-active {
            background: #fff1f1 !important;
            box-shadow: 0 5px 15px rgba(211, 47, 47, 0.1);
          }

          .k-active td {
            border-color: #fecaca !important;
            color: #d32f2f !important;
          }

          .k-active .k-name-cell {
            color: #d32f2f;
          }

          .k-id { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #94a3b8; }
          .k-name-cell { font-weight: 800; color: #334155; font-size: 16px; }

          /* BADGE TRẠNG THÁI MÀU CAM-ĐỎ */
          .k-status-badge {
            background: linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 800;
            box-shadow: 0 4px 10px rgba(255, 107, 107, 0.2);
          }

          @media (max-width: 1024px) {
            .k-layout { flex-direction: column; }
          }
        `}</style>

        <div className="k-layout">
          <div className="k-section-list">
            <h2 className="k-title">Quản Lý <span>Danh Mục</span></h2>
            <table className="k-table">
              <thead>
                <tr>
                  <th>Mã số</th>
                  <th>Tên danh mục</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {cates}
              </tbody>
            </table>
          </div>

          <div className="k-section-detail">
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