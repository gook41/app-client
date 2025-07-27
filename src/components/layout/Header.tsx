import React, { useState } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "React App" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* 로고 영역 */}
        <div className={styles.logo}>
          <h1 className={styles.logoText}>{title}</h1>
        </div>

        {/* 데스크탑 네비게이션 */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            <li><a href="/" className={styles.navLink}>홈</a></li>
            <li><a href="/about" className={styles.navLink}>소개</a></li>
            <li><a href="/contact" className={styles.navLink}>연락처</a></li>
          </ul>
        </nav>

        {/* 사용자 액션 영역 */}
        <div className={styles.userActions}>
          <button className={styles.loginBtn}>로그인</button>
          <button className={styles.signupBtn}>회원가입</button>
        </div>

        {/* 모바일 햄버거 메뉴 */}
        <button 
          className={styles.mobileMenuBtn}
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기"
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <ul className={styles.mobileNavList}>
              <li><a href="/" className={styles.mobileNavLink}>홈</a></li>
              <li><a href="/about" className={styles.mobileNavLink}>소개</a></li>
              <li><a href="/contact" className={styles.mobileNavLink}>연락처</a></li>
              <li className={styles.mobileUserActions}>
                <button className={styles.mobileLoginBtn}>로그인</button>
                <button className={styles.mobileSignupBtn}>회원가입</button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;