import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import { Helmet } from 'react-helmet-async';
import MyContext from '../contexts/MyContext';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categories: [],
      activeCategoryId: 'all',
      loading: true,
      currentPage: 1,
      itemsPerPage: 6,
      toast: null // { message, type }
    };
    this.toastTimer = null;
  }

  showToast(message, type = 'success') {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.setState({ toast: { message, type } });
    this.toastTimer = setTimeout(() => this.setState({ toast: null }), 3000);
  }

  addToCart(e, item) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.context.token) {
      this.showToast('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'warn');
      return;
    }

    const mycart = [...this.context.mycart];
    const index = mycart.findIndex(x => x.product._id === item._id);

    if (index === -1) {
      mycart.push({ product: item, quantity: 1 });
    } else {
      mycart[index].quantity += 1;
    }

    this.context.setMycart(mycart);
    this.showToast('✓ ' + item.name + ' đã thêm vào giỏ!', 'success');
  }

  componentWillUnmount() {
    if (this.toastTimer) clearTimeout(this.toastTimer);
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
          </div>
        </Link>
        <button
          className="card-add-btn"
          onClick={(e) => this.addToCart(e, item)}
          title="Thêm vào giỏ hàng"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Thêm vào giỏ
        </button>
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

    const { toast } = this.state;

    return (
      <div className="menu-page-wrapper">
        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className={`cart-toast cart-toast--${toast.type}`}>
            {toast.message}
          </div>
        )}
        <style>{`
          :root {
            --primary-red: #D32F2F;
            --primary-orange: #FF6D00;
            --accent-gradient: linear-gradient(135deg, #FF6D00 0%, #D32F2F 100%);
          }

          /* ===== TOAST ===== */
          .cart-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            padding: 14px 24px;
            border-radius: 16px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 700;
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
            animation: toastIn 0.4s cubic-bezier(0.4,0,0.2,1);
            max-width: 360px;
            line-height: 1.4;
          }
          .cart-toast--success {
            background: linear-gradient(135deg, #FF6D00, #D32F2F);
            color: #fff;
          }
          .cart-toast--warn {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffc107;
          }
          @keyframes toastIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
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
            width: calc(100% - 44px);
            margin: 0 22px 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: #222;
            color: #fff;
            padding: 13px;
            border-radius: 14px;
            font-weight: 800;
            font-size: 13px;
            transition: 0.3s;
            cursor: pointer;
          }
          .card-add-btn:hover { background: var(--accent-gradient); transform: translateY(-2px); }
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