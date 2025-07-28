// src/pages/inventory.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { mockApiResponse } from '../utils/mockData';

// 재고 아이템 타입 정의
interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // 재고 목록 조회
  const fetchInventory = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Mock 데이터 모드 (개발용)
      const useMockData = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;
      
      if (useMockData) {
        // Mock 데이터 사용 (백엔드 연결 없이 테스트)
        setTimeout(() => {
          setItems(mockApiResponse.data || []);
          setLoading(false);
        }, 1000); // 1초 지연으로 로딩 상태 시뮬레이션
        return;
      }

      const response = await fetch('http://localhost:8080/api/inventory', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse<InventoryItem[]> = await response.json();

      if (response.ok && data.success) {
        setItems(data.data || []);
      } else if (response.status === 401) {
        // 토큰 만료
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError(data.error || '재고 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Inventory fetch error:', err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>📦 재고 목록 불러오는 중...</div>
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
          <h1>📦 재고 관리</h1>
          <p>전체 재고 {items.length}개</p>
        </div>
        <div>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            ← 대시보드
          </button>
          <button
            onClick={fetchInventory}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 새로고침
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div style={{
          color: 'red',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          ❌ {error}
        </div>
      )}

      {/* 재고 목록 */}
      {items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
          <h3>등록된 재고가 없습니다</h3>
          <p>새로운 재고를 등록해보세요!</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* 테이블 헤더 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px 100px 100px 150px 120px',
            gap: '10px',
            padding: '15px 20px',
            backgroundColor: '#e9ecef',
            fontWeight: 'bold',
            borderBottom: '1px solid #ddd'
          }}>
            <div>상품명 (SKU)</div>
            <div>재고 수량</div>
            <div>최소 수량</div>
            <div>상태</div>
            <div>위치</div>
            <div>등록일</div>
          </div>

          {/* 테이블 내용 */}
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 100px 100px 150px 120px',
                gap: '10px',
                padding: '15px 20px',
                borderBottom: '1px solid #eee',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>SKU: {item.sku}</div>
              </div>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                {item.quantity}
              </div>
              <div style={{ textAlign: 'center' }}>
                {item.minQuantity}
              </div>
              <div style={{ textAlign: 'center' }}>
                {item.quantity <= item.minQuantity ? (
                  <span style={{
                    color: 'red',
                    backgroundColor: '#ffebee',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    🚨 부족
                  </span>
                ) : (
                  <span style={{
                    color: 'green',
                    backgroundColor: '#e8f5e8',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    ✅ 정상
                  </span>
                )}
              </div>
              <div>{item.location}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 하단 요약 정보 */}
      <div style={{
        marginTop: '30px',
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
            {items.reduce((sum, item) => sum + item.quantity, 0)}개
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
            {items.filter(item => item.quantity <= item.minQuantity).length}개
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4>정상 재고</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
            {items.filter(item => item.quantity > item.minQuantity).length}개
          </div>
        </div>
      </div>
    </div>
  );
}
