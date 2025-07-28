// src/pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import OAuthButton from '../components/auth/OAuthButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // 로그인 API 호출 함수
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 동작 방지
    setLoading(true);
    setError('');

    try {
      // 백엔드 API 호출
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공
        localStorage.setItem('token', data.token); // JWT 토큰 저장
        router.push('/dashboard'); // 대시보드로 이동
      } else {
        // 로그인 실패
        setError(data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error('Login error:', err); // 에러 로깅 추가
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
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
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          🏭 WMS 로그인
        </h1>

        <form onSubmit={handleLogin}>
          {/* 이메일 입력 */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="이메일을 입력하세요"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div style={{
              color: 'red',
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: '#ffebee',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 구분선 */}
        <div style={{ 
          textAlign: 'center', 
          margin: '20px 0',
          position: 'relative'
        }}>
          <hr style={{ border: '1px solid #eee' }} />
          <span style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            padding: '0 10px',
            color: '#666'
          }}>
            또는
          </span>
        </div>

        {/* OAuth 로그인 버튼들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <OAuthButton provider="google" />
          <OAuthButton provider="naver" />
          <OAuthButton provider="kakao" />
        </div>

        {/* 회원가입 링크 */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span>계정이 없으신가요? </span>
          <a href="/signup" style={{ color: '#4CAF50' }}>회원가입</a>
        </div>
      </div>
    </div>
  );
}
