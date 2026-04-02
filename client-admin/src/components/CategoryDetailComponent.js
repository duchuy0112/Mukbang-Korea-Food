import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: ''
    };
  }

  render() {
    return (
      <div className="k-detail-card">
        <style>{`
          .k-detail-card {
            background: #ffffff;
            padding: 30px;
            border-radius: 20px;
            border: 2px solid #e5e7eb;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            font-family: 'Inter', sans-serif;
          }

          .k-detail-title {
            color: #475569;
            font-weight: 900;
            font-size: 20px;
            text-align: center;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 2px;
            border-bottom: 2px solid #ff9f43;
            padding-bottom: 10px;
          }

          .k-form-group { margin-bottom: 20px; }

          .k-form-group label {
            display: block;
            font-size: 12px;
            font-weight: 800;
            color: #64748b;
            margin-bottom: 8px;
            text-transform: uppercase;
          }

          .k-input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #f1f5f9;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            transition: 0.3s;
            outline: none;
            box-sizing: border-box;
            background: #f8fafc;
          }

          .k-input:focus {
            border-color: #ff9f43;
            background: #fff;
            box-shadow: 0 0 0 4px rgba(255, 159, 67, 0.1);
          }

          /* Highlight ô ID để Tuấn biết là có thể nhập được */
          .k-input-id {
            border-left: 5px solid #ff8c00;
            font-family: 'JetBrains Mono', monospace;
          }

          .k-action-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 30px;
          }

          .k-btn {
            padding: 12px;
            border: none;
            border-radius: 10px;
            font-weight: 800;
            font-size: 13px;
            cursor: pointer;
            transition: 0.3s;
            text-transform: uppercase;
          }

          .btn-add {
            grid-column: span 2;
            background: linear-gradient(135deg, #ff9f43 0%, #ff8c00 100%);
            color: white;
          }

          .btn-update { background: #475569; color: white; }
          .btn-delete { background: #fee2e2; color: #d32f2f; border: 1px solid #fecaca; }

          .k-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
          .btn-delete:hover { background: #d32f2f; color: white; }

          .k-note {
            font-size: 11px;
            color: #94a3b8;
            margin-top: 5px;
            font-style: italic;
          }
        `}</style>

        <h2 className="k-detail-title">Thiết lập danh mục</h2>

        <form>
          <div className="k-form-group">
            <label>Mã định danh (ID)</label>
            <input
              className="k-input k-input-id"
              type="text"
              placeholder="Nhập mã mới hoặc chọn từ danh sách..."
              value={this.state.txtID}
              onChange={(e) => this.setState({ txtID: e.target.value })}
            />
            <p className="k-note">* Bạn có thể tự đặt mã hoặc để trống nếu muốn hệ thống tự sinh.</p>
          </div>

          <div className="k-form-group">
            <label>Tên nhóm món ăn</label>
            <input
              className="k-input"
              type="text"
              placeholder="Ví dụ: Mì lạnh, Kim chi..."
              value={this.state.txtName}
              onChange={(e) => this.setState({ txtName: e.target.value })}
            />
          </div>

          <div className="k-action-grid">
            <button className="k-btn btn-add" onClick={(e) => this.btnAddClick(e)}>
              ✨ Thêm mới danh mục
            </button>
            <button className="k-btn btn-update" onClick={(e) => this.btnUpdateClick(e)}>
              💾 Lưu thay đổi
            </button>
            <button className="k-btn btn-delete" onClick={(e) => this.btnDeleteClick(e)}>
              🗑 Xóa mục này
            </button>
          </div>
        </form>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name
      });
    }
  }

  // ================= EVENT HANDLERS =================
  btnAddClick(e) {
    e.preventDefault();
    const { txtID, txtName } = this.state;
    if (txtName) {
      // Gửi cả ID (nếu Tuấn tự nhập) và Tên
      const cate = { _id: txtID, name: txtName };
      this.apiPostCategory(cate);
    } else {
      alert('Bạn ơi, ít nhất phải có cái Tên danh mục nhé!');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID, txtName } = this.state;
    if (txtID && txtName) {
      this.apiPutCategory(txtID, { name: txtName });
    } else {
      alert('Vui lòng chọn danh mục hoặc nhập đủ ID và Tên!');
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    if (id) {
      if (window.confirm('Bạn chắc chắn muốn xóa danh mục này?')) {
        this.apiDeleteCategory(id);
      }
    } else {
      alert('Chưa có mã ID để xóa bạn ơi!');
    }
  }

  // ================= APIs =================
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.props.updateCategories(res.data);
      this.setState({ txtID: '', txtName: '' }); 
    });
  }

  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', cate, config).then((res) => {
      if (res.data) {
        alert('Đã thêm danh mục mới thành công!');
        this.apiGetCategories();
      } else {
        alert('Lỗi: Có thể mã ID này đã tồn tại rồi nhé!');
      }
    });
  }

  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
      if (res.data) {
        alert('Cập nhật thành công!');
        this.apiGetCategories();
      }
    });
  }

  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/categories/' + id, config).then((res) => {
      if (res.data) {
        alert('Đã xóa danh mục xong!');
        this.apiGetCategories();
      }
    });
  }
}

export default CategoryDetail;