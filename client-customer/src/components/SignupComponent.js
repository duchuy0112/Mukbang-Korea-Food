import axios from 'axios';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      mounted: false
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ mounted: true }), 50);
  }

  render() {
    const { mounted } = this.state;

    return (
      <div style={styles.pageWrapper}>
        <Helmet>
          <title>Đăng Ký Tài Khoản | Mukbang Korea Food</title>
          <meta name="description" content="Đăng ký ngay tài khoản Mukbang Korea Food để nhận ưu đãi thành viên và đặt hàng dễ dàng." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <style>{`
          @keyframes floatMove {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-25px) rotate(8deg); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 30px rgba(255,87,34,0.3), 0 0 60px rgba(255,152,0,0.15); }
            50% { box-shadow: 0 0 50px rgba(255,87,34,0.5), 0 0 100px rgba(255,152,0,0.25); }
          }
          @keyframes inputFocusGlow {
            0%, 100% { box-shadow: 0 0 8px rgba(255,87,34,0.2); }
            50% { box-shadow: 0 0 20px rgba(255,87,34,0.4); }
          }
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .signup-input:focus {
            outline: none;
            border-color: #FF5722 !important;
            animation: inputFocusGlow 2s ease-in-out infinite;
          }
          .signup-input::placeholder {
            color: rgba(255,255,255,0.35);
          }
          .signup-btn:hover {
            transform: translateY(-3px) scale(1.02) !important;
            box-shadow: 0 15px 40px rgba(255,87,34,0.5), 0 0 60px rgba(255,152,0,0.3) !important;
          }
          .signup-btn:active {
            transform: translateY(0) scale(0.98) !important;
          }
          @media (max-width: 768px) {
            .signup-card-responsive {
              padding: 30px 25px !important;
              margin: 20px !important;
              border-radius: 24px !important;
            }
            .signup-title-responsive {
              font-size: 26px !important;
            }
          }
          @media (max-width: 480px) {
            .signup-card-responsive {
              padding: 24px 18px !important;
              margin: 12px !important;
            }
            .signup-title-responsive {
              font-size: 22px !important;
            }
          }
        `}</style>

        {/* Background gradient overlay */}
        <div style={styles.bgOverlay} />

        {/* Decorative floating elements */}
        <div style={{ ...styles.floatingEmoji, top: '6%', left: '4%', animationDelay: '0s' }}>🍜</div>
        <div style={{ ...styles.floatingEmoji, top: '10%', right: '5%', animationDelay: '1.2s' }}>🔥</div>
        <div style={{ ...styles.floatingEmoji, bottom: '10%', left: '6%', animationDelay: '0.8s' }}>🌶️</div>
        <div style={{ ...styles.floatingEmoji, bottom: '6%', right: '4%', animationDelay: '1.8s' }}>🥢</div>

        {/* Decorative glowing orbs */}
        <div style={styles.glowOrb1} />
        <div style={styles.glowOrb2} />

        {/* Main card */}
        <div
          className="signup-card-responsive"
          style={{
            ...styles.card,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          {/* Card glow effect */}
          <div style={styles.cardGlow} />

          {/* Logo / Icon */}
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>🍽️</span>
          </div>

          {/* Title */}
          <h1 className="signup-title-responsive" style={styles.title}>
            Đăng Ký Thành Viên
          </h1>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerIcon}>❂</span>
            <span style={styles.dividerLine} />
          </div>

          {/* Form */}
          <form onSubmit={(e) => this.btnSignupClick(e)} style={styles.form}>
            {this.renderInput('Tên đăng nhập', 'txtUsername', 'text', 'Nhập tên đăng nhập', '👤')}
            {this.renderInput('Mật khẩu', 'txtPassword', 'password', 'Nhập mật khẩu', '🔒')}
            {this.renderInput('Họ và tên', 'txtName', 'text', 'Nhập họ và tên đầy đủ', '✨')}
            {this.renderInput('Số điện thoại', 'txtPhone', 'tel', 'Nhập số điện thoại', '📱')}
            {this.renderInput('Email', 'txtEmail', 'email', 'example@gmail.com', '📧')}

            <button
              type="submit"
              className="signup-btn"
              style={styles.submitBtn}
            >
              <span style={styles.btnText}>Tạo Tài Khoản Ngay</span>
              <span style={styles.btnArrow}>→</span>
            </button>
          </form>

          <p style={styles.terms}>
            Bằng cách đăng ký, bạn đồng ý với các{' '}
            <span style={styles.termsLink}>điều khoản</span> của Koreafood.
          </p>
        </div>
      </div>
    );
  }

  renderInput(label, stateKey, type, placeholder, icon) {
    return (
      <div style={styles.inputGroup}>
        <label style={styles.label}>
          <span style={styles.labelIcon}>{icon}</span>
          {label}
        </label>
        <input
          className="signup-input"
          type={type}
          placeholder={placeholder}
          value={this.state[stateKey]}
          onChange={(e) => this.setState({ [stateKey]: e.target.value })}
          style={styles.input}
        />
      </div>
    );
  }

  btnSignupClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;

    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const account = {
        username: txtUsername,
        password: txtPassword,
        name: txtName,
        phone: txtPhone,
        email: txtEmail
      };
      this.apiSignup(account);
    } else {
      alert('Tuấn ơi, vui lòng nhập đầy đủ tất cả thông tin nhé!');
    }
  }

  apiSignup(account) {
    axios.post('/api/customer/signup', account).then((res) => {
      const result = res.data;
      alert(result.message || 'Đăng ký thành công! Kiểm tra email để kích hoạt nhé.');
    });
  }
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, #1a0a0a 0%, #2d1010 30%, #1a0505 60%, #0d0000 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    padding: '20px',
  },
  bgOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 30% 20%, rgba(255,87,34,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(255,152,0,0.1) 0%, transparent 60%)',
    zIndex: 0,
  },
  glowOrb1: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    width: '250px',
    height: '250px',
    background: 'radial-gradient(circle, rgba(255,87,34,0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    zIndex: 0,
  },
  glowOrb2: {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255,152,0,0.12) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(50px)',
    zIndex: 0,
  },
  floatingEmoji: {
    position: 'absolute',
    fontSize: '40px',
    animation: 'floatMove 5s ease-in-out infinite',
    zIndex: 1,
    opacity: 0.6,
    filter: 'drop-shadow(0 4px 15px rgba(255,87,34,0.3))',
  },
  card: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: '480px',
    padding: '45px 40px',
    borderRadius: '28px',
    background: 'linear-gradient(160deg, rgba(60,20,15,0.85) 0%, rgba(35,12,8,0.9) 100%)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: '1px solid rgba(255,87,34,0.25)',
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    animation: 'pulseGlow 4s ease-in-out infinite',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: '-80px',
    right: '-80px',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(255,87,34,0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    zIndex: 0,
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
    position: 'relative',
    zIndex: 1,
  },
  logoIcon: {
    fontSize: '52px',
    filter: 'drop-shadow(0 6px 20px rgba(255,87,34,0.5))',
  },
  title: {
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: '800',
    color: 'transparent',
    backgroundImage: 'linear-gradient(135deg, #FF5722, #FF9800, #FFAB40, #FF5722)',
    backgroundSize: '200% auto',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    animation: 'shimmer 4s linear infinite',
    marginBottom: '8px',
    letterSpacing: '1px',
    position: 'relative',
    zIndex: 1,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '28px',
    position: 'relative',
    zIndex: 1,
  },
  dividerLine: {
    display: 'block',
    width: '60px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,87,34,0.5), transparent)',
  },
  dividerIcon: {
    color: '#FF5722',
    fontSize: '14px',
    opacity: 0.7,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    position: 'relative',
    zIndex: 1,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(255,200,180,0.85)',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  labelIcon: {
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '14px',
    border: '1px solid rgba(255,87,34,0.2)',
    background: 'rgba(0,0,0,0.35)',
    color: '#FFF3E0',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  submitBtn: {
    marginTop: '8px',
    padding: '16px 32px',
    borderRadius: '16px',
    border: 'none',
    background: 'linear-gradient(135deg, #D32F2F, #FF5722, #FF9800)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 3s ease infinite',
    color: '#FFFFFF',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 8px 30px rgba(255,87,34,0.35)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  btnText: {
    position: 'relative',
  },
  btnArrow: {
    fontSize: '20px',
    fontWeight: '300',
  },
  terms: {
    textAlign: 'center',
    fontSize: '12px',
    color: 'rgba(255,200,180,0.45)',
    marginTop: '20px',
    lineHeight: '1.5',
    position: 'relative',
    zIndex: 1,
  },
  termsLink: {
    color: '#FF5722',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Signup;
