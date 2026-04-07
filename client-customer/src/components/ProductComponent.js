import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import { Helmet } from 'react-helmet-async';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categories: [],
      activeCategoryId: 'all',
      loading: true,
      currentPage: 1,
      itemsPerPage: 6 // Số lượng món ăn trên mỗi trang
    };
  }

  componentDidMount() {
    this.apiGetCategories();
    const params = this.props.params;
    if (params.cid) {
      this.setState({ activeCategoryId: params.cid, currentPage: 1 });
      if (params.cid === 'all') {
        this.apiGetAllProducts();
      } else {
        this.apiGetProductsByCatID(params.cid);
      }
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    } else {
      this.apiGetAllProducts();
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.setState({ activeCategoryId: params.cid, currentPage: 1 });
      if (params.cid === 'all') {
        this.apiGetAllProducts();
      } else {
        this.apiGetProductsByCatID(params.cid);
      }
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.setState({ currentPage: 1 });
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  // ================= PHÂN TRANG LOGIC =================
  handlePageChange(pageNumber) {
    this.setState({ currentPage: pageNumber });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ================= APIs =================
  apiGetCategories() {
    axios.get('/api/customer/categories').then((res) => {
      this.setState({ categories: res.data || [] });
    });
  }

  apiGetAllProducts() {
    this.setState({ loading: true });
    axios.get('/api/customer/products').then((res) => {
      this.setState({ products: res.data || [], loading: false });
    }).catch(() => this.setState({ loading: false }));
  }

  apiGetProductsByCatID(cid) {
    this.setState({ loading: true });
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      this.setState({ products: res.data || [], loading: false });
    }).catch(() => this.setState({ loading: false }));
  }

  apiGetProductsByKeyword(keyword) {
    this.setState({ loading: true });
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      this.setState({ products: res.data || [], loading: false });
    }).catch(() => this.setState({ loading: false }));
  }

  render() {
    const { products, categories, activeCategoryId, loading, currentPage, itemsPerPage } = this.state;

    // --- SẮP XẾP DANH MỤC: Đưa Món Phụ xuống cuối ---
    let sortedCategories = [...categories];
    const subIdx = sortedCategories.findIndex(c => c.name.toLowerCase().includes('món phụ') || c.name.toLowerCase().includes('side dish'));
    if (subIdx !== -1) {
      const subCat = sortedCategories.splice(subIdx, 1)[0];
      sortedCategories.push(subCat);
    }

    // --- LOGIC PHÂN TRANG TẠI FRONTEND ---
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    // Render danh mục (dùng sortedCategories)
    const categoryLinks = Array.isArray(sortedCategories) ? sortedCategories.map((cat) => (
      <Link 
        key={cat._id} 
        to={`/product/category/${cat._id}`}
        className={`menu-sidebar-item ${activeCategoryId === cat._id ? 'active' : ''}`}
      >
        <span className="dot"></span>
        {cat.name}
      </Link>
    )) : [];

    // Render sản phẩm hiện tại của trang
    const productGridItems = currentProducts.map((item) => (
      <div key={item._id} className="menu-product-card">
        <Link to={'/product/' + item._id} className="card-link">
          <div className="card-image-box">
            <img
              src={'data:image/jpg;base64,' + item.image}
              className="card-image"
              alt={item.name}
            />
          </div>
          <div className="card-details">
            <h3 className="card-title">{item.name}</h3>
            <p className="card-description">
              {item.description || "Món ăn chuẩn vị Hàn Quốc, được chế biến tâm huyết bởi đầu bếp chuyên nghiệp."}
            </p>
            <p className="card-price">{item.price?.toLocaleString()} VNĐ</p>
            <button className="card-add-btn">Thêm vào giỏ</button>
          </div>
        </Link>
      </div>
    ));

    // Render các nút phân trang
    const paginationButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationButtons.push(
        <button 
          key={i} 
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => this.handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="menu-page-wrapper">
        <style>{`
          :root {
            --primary-red: #D32F2F;
            --primary-orange: #FF6D00;
            --accent-gradient: linear-gradient(135deg, #FF6D00 0%, #D32F2F 100%);
          }

          .menu-page-wrapper {
            display: flex; min-height: 100vh; background: #fdfbfa; font-family: 'Inter', sans-serif;
          }

          /* --- SIDEBAR --- */
          .menu-sidebar {
            width: 290px; background: #fff; border-right: 1px solid #f0f0f0; padding: 35px 20px;
            position: sticky; top: 104px; height: calc(100vh - 104px); overflow-y: auto;
          }
          .sidebar-heading { font-size: 11px; font-weight: 800; color: #bbb; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 25px; display: block; padding-left: 12px; }
          .menu-sidebar-nav { display: flex; flex-direction: column; gap: 8px; }
          .menu-sidebar-item {
            text-decoration: none; color: #555; padding: 13px 20px; border-radius: 15px; font-weight: 700; font-size: 15px; transition: 0.3s;
            display: flex; align-items: center; justify-content: flex-end; text-align: right;
          }
          .menu-sidebar-item:hover { background: #fafafa; color: var(--primary-red); }
          .menu-sidebar-item.active { background: var(--accent-gradient); color: #fff; box-shadow: 0 8px 20px rgba(211, 47, 47, 0.15); }

          /* --- MAIN CONTENT --- */
          .menu-main-content { flex: 1; padding: 50px 60px; }
          .content-header h1 { font-size: 42px; font-weight: 900; color: #1a1a1a; letter-spacing: -1.5px; margin-bottom: 10px; }
          .highlight { color: var(--primary-red); }

          .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 30px; margin-top: 40px; }

          /* --- CARD --- */
          .menu-product-card {
            background: #fff; border-radius: 28px; overflow: hidden; border: 1px solid #f0f0f0; transition: box-shadow 0.3s, transform 0.3s;
            box-shadow: 0 10px 25px rgba(0,0,0,0.03);
          }
          .menu-product-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
          .card-link { text-decoration: none; color: inherit; display: block; }
          .card-image-box { height: 210px; overflow: hidden; }
          .card-image { width: 100%; height: 100%; object-fit: cover; transition: 0.8s; }
          .menu-product-card:hover .card-image { transform: scale(1.08); }
          
          .card-details { padding: 22px; text-align: left; }
          .card-title { font-size: 17px; font-weight: 800; margin-bottom: 8px; color: #1a1a1a; display: block; height: 48px; overflow: hidden; line-height: 1.4; }
          .card-description { 
            font-size: 13px; color: #777; line-height: 1.5; margin-bottom: 12px;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
            height: 38px;
          }
          .card-price { font-size: 18px; font-weight: 900; color: var(--primary-red); margin-bottom: 18px; }
          
          .card-add-btn {
            width: 100%; border: none; background: #222; color: #fff; padding: 13px; border-radius: 14px; font-weight: 800; font-size: 13px; transition: 0.3s; cursor: pointer;
          }
          .menu-product-card:hover .card-add-btn { background: var(--accent-gradient); }

          /* --- PAGINATION --- */
          .pagination-container { display: flex; justify-content: center; gap: 12px; padding: 50px 0; }
          .page-btn {
            width: 44px; height: 44px; border-radius: 12px; border: 1.5px solid #eee; background: #fff; font-weight: 700; cursor: pointer; transition: 0.3s; font-size: 14px;
          }
          .page-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
          .page-btn:hover:not(.active) { border-color: var(--primary-red); color: var(--primary-red); }

          @media (max-width: 900px) {
            .menu-page-wrapper { flex-direction: column; }
            .menu-sidebar { width: 100%; height: auto; position: static; border-right: none; padding: 20px; }
            .menu-sidebar-nav { flex-direction: row; overflow-x: auto; padding-bottom: 10px; justify-content: flex-start; }
            .menu-sidebar-item { border-radius: 50px; white-space: nowrap; padding: 8px 20px; }
            .menu-main-content { padding: 20px; }
          }
        `}</style>

        <Helmet>
          <title>Thực Đơn Mukbang | Phân Trang</title>
        </Helmet>

        <aside className="menu-sidebar">
          <span className="sidebar-heading">Danh mục thực đơn</span>
          <nav className="menu-sidebar-nav">
             <Link 
              to="/product/category/all" 
              className={`menu-sidebar-item ${activeCategoryId === 'all' ? 'active' : ''}`}
            >
              <span className="dot"></span>
              Tất cả món ăn
            </Link>
            {categoryLinks}
          </nav>
        </aside>

        <main className="menu-main-content">
          <header className="content-header">
            <div>
              <h1>Thực đơn đặc sắc</h1>
              <p>Trải nghiệm tinh hoa ẩm thực trong từng món ăn</p>
            </div>
          </header>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px' }}><h3>Đang tải...</h3></div>
          ) : (
            <React.Fragment>
              <div className="menu-grid">
                {productGridItems.length > 0 ? productGridItems : (
                  <div style={{ textAlign: 'center', width: '100%' }}><h3>Chưa tìm thấy món ăn nào.</h3></div>
                )}
              </div>

              {/* PHẦN PHÂN TRANG */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  {paginationButtons}
                </div>
              )}
            </React.Fragment>
          )}
        </main>
      </div>
    );
  }
}

export default withRouter(Product);