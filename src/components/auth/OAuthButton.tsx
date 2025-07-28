// src/components/auth/OAuthButton.tsx
// 범용 OAuth 로그인 버튼 컴포넌트

interface OAuthButtonProps {
  readonly provider: 'google' | 'naver' | 'kakao';
  readonly buttonText?: string;
  readonly className?: string;
}

// 각 플랫폼별 스타일 및 설정
const oauthConfig = {
  google: {
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
    textColor: '#333',
    hoverBg: '#f8f9fa',
    hoverBorder: '#4285F4',
    defaultText: 'Google로 로그인',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    )
  },
  naver: {
    backgroundColor: '#03C75A',
    borderColor: '#03C75A', 
    textColor: '#ffffff',
    hoverBg: '#02b252',
    hoverBorder: '#02b252',
    defaultText: '네이버로 로그인',
    logo: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M13.6 0H6.4v7.7L10.3 12V20h3.3V0z" fill="#ffffff"/>
        <path d="M6.4 20h3.3V12.3L6.4 7.7V20z" fill="#ffffff"/>
      </svg>
    )
  },
  kakao: {
    backgroundColor: '#FEE500',
    borderColor: '#FEE500',
    textColor: '#000000',
    hoverBg: '#fdd835',
    hoverBorder: '#fdd835',
    defaultText: '카카오로 로그인',
    logo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C7.03 3 3 6.14 3 10.1c0 2.5 1.37 4.7 3.5 6.1l-.86 3.1c-.08.29.25.53.52.38l3.84-2.1c.33.03.66.05 1 .05 4.97 0 9-3.14 9-7.1S16.97 3 12 3z" fill="#000000"/>
      </svg>
    )
  }
};

export default function OAuthButton({ 
  provider,
  buttonText,
  className = ""
}: OAuthButtonProps) {
  
  const config = oauthConfig[provider];
  const displayText = buttonText || config.defaultText;
  
  const handleOAuthLogin = () => {
    // 스프링 OAuth2 엔드포인트로 리다이렉션
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <button
      type="button"
      onClick={handleOAuthLogin}
      className={className}
      style={{
        width: '100%',
        padding: '12px',
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'all 0.2s ease',
        fontWeight: '500'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = config.hoverBg;
        e.currentTarget.style.borderColor = config.hoverBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = config.backgroundColor;
        e.currentTarget.style.borderColor = config.borderColor;
      }}
    >
      {config.logo}
      {displayText}
    </button>
  );
}
