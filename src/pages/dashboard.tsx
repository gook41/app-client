// src/pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 이동
      router.push('/login');
      return;
    }

    // 사용자 정보 가져오기 (실제로는 API 호출해야 함)
    setUser({ email: 'user@example.com', username: '사용자' });
    setLoading(false);
  }, [router]);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        로딩 중...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>
          <h1>🏭 WMS 대시보드</h1>
          <p>안녕하세요, {user?.username}님!</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 메뉴 카드들 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* 재고 관리 */}
        <div style={{
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📦</div>
          <h3>재고 관리</h3>
          <p>전체 재고 조회, 등록, 수정, 삭제</p>
          <button 
            onClick={() => router.push('/inventory')}
            style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            바로가기
          </button>
        </div>

        {/* 입고 관리 */}
        <div style={{
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📥</div>
          <h3>입고 관리</h3>
          <p>입고 주문 생성, 처리, 상태 관리</p>
          <button 
            onClick={() => router.push('/inbound')}
            style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            바로가기
          </button>
        </div>

        {/* 출고 관리 */}
        <div style={{
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📤</div>
          <h3>출고 관리</h3>
          <p>출고 주문 생성, 처리, 상태 관리</p>
          <button 
            onClick={() => router.push('/outbound')}
            style={{
            padding: '10px 20px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            바로가기
          </button>
        </div>

        {/* 로그 조회 */}
        <div style={{
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
          <h3>로그 조회</h3>
          <p>시스템 감사 로그 및 필터링</p>
          <button 
            onClick={() => router.push('/logs')}
            style={{
            padding: '10px 20px',
            backgroundColor: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            바로가기
          </button>
        </div>
      </div>

      {/* 요약 정보 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4>총 재고 수량</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
            1,234개
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4>오늘 입고</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
            56개
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4>오늘 출고</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
            43개
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4>저재고 알림</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>
            7개
          </div>
        </div>
      </div>
    </div>
  );
}
