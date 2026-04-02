import React, { Component } from 'react';
import poster from '../asset/imgs/poster.jpg';

class Home extends Component {
  render() {
    return (
      <div className="align-center">
        <h2 className="text-center" style={{ marginTop: '20px', color: '#d32f2f', fontWeight: 'bold' }}>
          TRANG CHỦ QUẢN TRỊ
        </h2>
        <p className="text-center" style={{ marginBottom: '30px' }}>
          Chúc bạn một ngày làm việc hiệu quả nhé!
        </p>
        <img 
          src={poster} 
          width="800px" 
          alt="Admin Banner Poster" 
          style={{ display: 'block', margin: '0 auto', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
        />
      </div>
    );
  }
}

export default Home;