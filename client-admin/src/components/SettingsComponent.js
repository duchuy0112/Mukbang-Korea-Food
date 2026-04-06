import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../contexts/MyContext';

class Settings extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      config: {
        _id: '',
        shopName: '',
        slogan: '',
        address: '',
        phone: '',
        email: '',
        facebook: '',
        instagram: '',
        openingHours: ''
      },
      newPassword: '',
      confirmPassword: '',
      loading: true
    };
  }

  componentDidMount() {
    this.fetchConfig();
  }

  fetchConfig() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/configs', config).then((res) => {
      if (res.data) {
        this.setState({ config: res.data, loading: false });
      }
    });
  }

  handleConfigUpdate = (e) => {
    e.preventDefault();
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/configs', this.state.config, config).then((res) => {
      if (res.data) {
        alert('Cập nhật thông tin thành công!');
      } else {
        alert('Cập nhật thất bại!');
      }
    });
  }

  handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (this.state.newPassword !== this.state.confirmPassword) {
      alert('Mật khẩu nhập lại không khớp!');
      return;
    }
    const body = { 
      username: this.context.username, 
      newPassword: this.state.newPassword 
    };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/password', body, config).then((res) => {
      if (res.data) {
        alert('Đổi mật khẩu thành công!');
        this.setState({ newPassword: '', confirmPassword: '' });
      } else {
        alert('Đổi mật khẩu thất bại!');
      }
    });
  }

  render() {
    if (this.state.loading) return <div style={{padding:'40px'}}>Đang tải cấu hình...</div>;

    const { config } = this.state;

    return (
      <div className="settings-page">
        <style>{`
          .settings-page { padding: 40px; font-family: 'Inter', sans-serif; background: #fdfaf7; min-height: 100vh; }
          .settings-container { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; max-width: 1200px; margin: 0 auto; }
          .settings-card { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #eee; }
          .card-title { color: #d32f2f; font-weight: 900; text-transform: uppercase; margin-bottom: 25px; border-bottom: 2px solid #ff9f43; padding-bottom: 10px; font-size: 18px; }
          .form-group { margin-bottom: 20px; }
          .form-group label { display: block; font-size: 12px; font-weight: 800; color: #666; text-transform: uppercase; margin-bottom: 8px; }
          .form-control { width: 100%; padding: 12px 15px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; box-sizing: border-box; transition: 0.3s; }
          .form-control:focus { outline: none; border-color: #d32f2f; box-shadow: 0 0 0 3px rgba(211,47,47,0.1); }
          .btn-save { background: #d32f2f; color: white; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 800; cursor: pointer; text-transform: uppercase; transition: 0.3s; width: 100%; margin-top: 10px; }
          .btn-save:hover { background: #b3261e; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(211,47,47,0.2); }
        `}</style>

        <h1 style={{ color: '#1a1a1a', fontWeight: 900, marginBottom: '30px', textAlign: 'center' }}>⚙️ CÀI ĐẶT HỆ THỐNG</h1>

        <div className="settings-container">
          <div className="settings-card">
            <h2 className="card-title">🏪 Thông tin cửa hàng</h2>
            <form onSubmit={this.handleConfigUpdate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Tên cửa hàng</label>
                  <input type="text" className="form-control" value={config.shopName} onChange={(e) => this.setState({ config: { ...config, shopName: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label>Slogan / Khẩu hiệu</label>
                  <input type="text" className="form-control" value={config.slogan} onChange={(e) => this.setState({ config: { ...config, slogan: e.target.value } })} />
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ cửa hàng</label>
                <input type="text" className="form-control" value={config.address} onChange={(e) => this.setState({ config: { ...config, address: e.target.value } })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Số điện thoại / Hotline</label>
                  <input type="text" className="form-control" value={config.phone} onChange={(e) => this.setState({ config: { ...config, phone: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label>Email liên hệ</label>
                  <input type="text" className="form-control" value={config.email} onChange={(e) => this.setState({ config: { ...config, email: e.target.value } })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Facebook Link</label>
                  <input type="text" className="form-control" value={config.facebook} onChange={(e) => this.setState({ config: { ...config, facebook: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label>Instagram Link</label>
                  <input type="text" className="form-control" value={config.instagram} onChange={(e) => this.setState({ config: { ...config, instagram: e.target.value } })} />
                </div>
              </div>

              <div className="form-group">
                <label>Giờ mở cửa (VD: 09:00 - 22:00)</label>
                <input type="text" className="form-control" value={config.openingHours} onChange={(e) => this.setState({ config: { ...config, openingHours: e.target.value } })} />
              </div>

              <button type="submit" className="btn-save">Lưu thay đổi</button>
            </form>
          </div>

          <div className="settings-card">
            <h2 className="card-title">🔐 Đổi mật khẩu</h2>
            <form onSubmit={this.handlePasswordUpdate}>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input type="password" name="newPassword" value={this.state.newPassword} className="form-control" onChange={(e) => this.setState({ newPassword: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu</label>
                <input type="password" name="confirmPassword" value={this.state.confirmPassword} className="form-control" onChange={(e) => this.setState({ confirmPassword: e.target.value })} required />
              </div>
              <button type="submit" className="btn-save" style={{ background: '#4a5568' }}>Cập nhật mật khẩu</button>
              <div style={{ marginTop: '15px', padding: '15px', background: '#fff8e1', borderRadius: '12px', fontSize: '11px', color: '#856404', fontWeight: 800 }}>
                ⚠️ Lưu ý: Sau khi đổi mật khẩu, bạn cần đăng nhập lại với mật khẩu mới.
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
