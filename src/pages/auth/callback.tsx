// src/pages/auth/callback.tsx
// OAuth 성공 후 스프링에서 리다이렉션되는 페이지
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const { token, error } = router.query;

    if (token) {
      // OAuth 성공: JWT 토큰 저장
      localStorage.setItem('token', token as string);
      setStatus('success');
      setMessage('로그인 성공! 대시보드로 이동합니다...');
      
      // 2초 후 대시보드로 이동
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } else if (error) {
      // OAuth 실패
      setStatus('error');
      setMessage('로그인에 실패했습니다: ' + error);
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } else if (router.isReady) {
      // 쿼리 파라미터가 없음
      setStatus('error');
      setMessage('잘못된 접근입니다.');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }, [router.query, router.isReady]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        {status === 'loading' && (
          <>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #4CAF50',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <h2 style={{ color: '#333', marginBottom: '10px' }}>
              로그인 처리 중...
            </h2>
            <p style={{ color: '#666' }}>
              잠시만 기다려주세요.
            </p>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              fontSize: '48px',
              marginBottom: '20px'
            }}>
              ✅
            </div>
            <h2 style={{ color: '#4CAF50', marginBottom: '10px' }}>
              로그인 성공!
            </h2>
            <p style={{ color: '#666' }}>
              {message}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              fontSize: '48px',
              marginBottom: '20px'
            }}>
              ❌
            </div>
            <h2 style={{ color: '#f44336', marginBottom: '10px' }}>
              로그인 실패
            </h2>
            <p style={{ color: '#666' }}>
              {message}
            </p>
            <button
              onClick={() => router.push('/login')}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              로그인 페이지로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
