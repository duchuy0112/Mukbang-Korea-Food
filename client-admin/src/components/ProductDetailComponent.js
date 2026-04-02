import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
    };
  }

  // ================= LIFECYCLE =================
  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image,
      });
    }
  }

  // ================= EVENT HANDLERS =================
  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

    if (name && price && category && image) {
      const prod = { name, price, category, image };
      this.apiPostProduct(prod);
    } else {
      alert('Vui lòng nhập đầy đủ thông tin sản phẩm!');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

    if (id && name && price && category && image) {
      const prod = { name, price, category, image };
      this.apiPutProduct(id, prod);
    } else {
      alert('Vui lòng chọn sản phẩm cần cập nhật!');
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteProduct(id);
      } else {
        alert('Vui lòng chọn sản phẩm cần xóa!');
      }
    }
  }

  // ================= APIs =================
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.setState({ categories: res.data });
    });
  }

  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      if (res.data) { alert('Thêm mới thành công!'); this.apiGetProducts(); }
      else { alert('Thêm mới thất bại!'); }
    });
  }

  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/products/' + id, prod, config).then((res) => {
      if (res.data) { alert('Cập nhật thành công!'); this.apiGetProducts(); }
      else { alert('Cập nhật thất bại!'); }
    });
  }

  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/products/' + id, config).then((res) => {
      if (res.data) { alert('Đã xóa sản phẩm!'); this.apiGetProducts(); }
      else { alert('Xóa thất bại!'); }
    });
  }

  apiGetProducts() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + this.props.curPage, config).then((res) => {
      const result = res.data;
      if (result.products.length !== 0) {
        this.props.updateProducts(result.products, result.noPages);
      } else {
        axios.get('/api/admin/products?page=' + (this.props.curPage - 1), config).then((res) => {
          this.props.updateProducts(res.data.products, res.data.noPages);
        });
      }
    });
  }

  // ================= RENDER =================
  render() {
    const cates = this.state.categories.map((cate) => (
      <option key={cate._id} value={cate._id}>
        {cate.name}
      </option>
    ));

    return (
      <div className="product-detail-card">
        <style>{`
          .product-detail-card {
            background: linear-gradient(145deg, #ffffff, #f0f4f8);
            padding: 25px;
            border-radius: 20px;
            box-shadow: 10px 10px 30px rgba(0,0,0,0.05);
            border: 1px solid rgba(255, 255, 255, 0.8);
            font-family: 'Inter', sans-serif;
            width: 100%; 
            box-sizing: border-box;
            height: fit-content;
            position: sticky;
            top: 25px;
            transition: transform 0.3s ease;
          }

          .detail-title {
            color: #1a202c;
            font-weight: 900;
            font-size: 20px;
            margin-bottom: 20px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
          }

          .detail-title::after {
            content: '';
            display: block;
            width: 50px;
            height: 4px;
            background: #d32f2f;
            margin: 8px auto;
            border-radius: 2px;
          }

          .detail-table { width: 100%; }
          .detail-table td { padding: 8px 5px; }

          .label-text {
            color: #4a5568;
            font-weight: 800;
            font-size: 11px;
            text-transform: uppercase;
            width: 95px;
          }

          .input-custom, .select-custom {
            width: 100%;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            background: #ffffff;
            font-weight: 700;
            font-size: 13px;
            color: #2d3748;
            outline: none;
            box-sizing: border-box;
            transition: all 0.2s ease;
            box-shadow: inset 1px 1px 3px #e2e8f0;
          }

          .input-custom:focus {
            border-color: #d32f2f;
            box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
          }

          /* Mã SP đã có thể nhập nhưng vẫn giữ style đen đậm nổi bật */
          .input-id-active {
            background: #fdfdfd;
            color: #000000 !important;
            font-weight: 900;
            border: 1px dashed #d32f2f;
          }

          .btn-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
          }

          .btn-action {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 12px;
            font-weight: 800;
            text-transform: uppercase;
            cursor: pointer;
            font-size: 11px;
            color: white;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }

          .btn-add { background: linear-gradient(135deg, #10b981, #059669); }
          .btn-update { background: linear-gradient(135deg, #4a5568, #2d3748); }
          .btn-delete { background: linear-gradient(135deg, #ef4444, #b91c1c); }
          
          .btn-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 14px rgba(0,0,0,0.15);
            filter: brightness(1.1);
          }

          .preview-container {
            margin-top: 25px;
            border-radius: 20px;
            border: 2px dashed #cbd5e0;
            padding: 15px;
            background: rgba(255,255,255,0.5);
            backdrop-filter: blur(5px);
          }

          .img-preview {
            max-width: 100%;
            height: 240px;
            object-fit: cover;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
        `}</style>

        <h2 className="detail-title">Thông Tin Chi Tiết</h2>

        <form>
          <table className="detail-table">
            <tbody>
              <tr>
                <td className="label-text">Mã Sản Phẩm</td>
                <td>
                  <input 
                    type="text" 
                    className="input-custom input-id-active" 
                    value={this.state.txtID} 
                    onChange={(e) => this.setState({ txtID: e.target.value })} 
                    placeholder="Nhập hoặc chọn ID..."
                  />
                </td>
              </tr>
              <tr>
                <td className="label-text">Tên Món Ăn</td>
                <td>
                  <input type="text" className="input-custom" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} placeholder="Nhập tên..." />
                </td>
              </tr>
              <tr>
                <td className="label-text">Giá Niêm Yết</td>
                <td>
                  <input type="number" className="input-custom" value={this.state.txtPrice} onChange={(e) => this.setState({ txtPrice: e.target.value })} />
                </td>
              </tr>
              <tr>
                <td className="label-text">Danh Mục</td>
                <td>
                  <select className="select-custom" value={this.state.cmbCategory} onChange={(e) => this.setState({ cmbCategory: e.target.value })}>
                    <option value="" disabled>-- Chọn loại món --</option>
                    {cates}
                  </select>
                </td>
              </tr>
              <tr>
                <td className="label-text">Hình Ảnh</td>
                <td>
                  <input type="file" className="input-custom" accept="image/*" onChange={(e) => this.previewImage(e)} />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <div className="btn-group">
                    <button className="btn-action btn-add" onClick={(e) => this.btnAddClick(e)}>Thêm Mới</button>
                    <button className="btn-action btn-update" onClick={(e) => this.btnUpdateClick(e)}>Cập Nhật</button>
                    <button className="btn-action btn-delete" onClick={(e) => this.btnDeleteClick(e)}>Xóa Món</button>
                  </div>
                </td>
              </tr>
              {this.state.imgProduct && (
                <tr>
                  <td colSpan="2">
                    <div className="preview-container">
                      <img src={this.state.imgProduct} className="img-preview" alt="Preview" />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}
export default ProductDetail;