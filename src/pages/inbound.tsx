// src/pages/inbound.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 입고 주문 타입 정의
interface InboundOrder {
  id: number;
  orderNumber: string;
  supplierId: number;
  supplierName: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalItems: number;
  expectedDate: string;
  actualDate?: string;
  createdAt: string;
  items: InboundItem[];
}

interface InboundItem {
  id: number;
  inventoryItemId: number;
  itemName: string;
  sku: string;
  expectedQuantity: number;
  actualQuantity?: number;
  unitPrice: number;
}

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export default function Inbound() {
  const [orders, setOrders] = useState<InboundOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const router = useRouter();

  // Mock 데이터
  const mockInboundData: InboundOrder[] = [
    {
      id: 1,
      orderNumber: "IN-2024-001",
      supplierId: 1,
      supplierName: "삼성전자",
      status: "PENDING",
      totalItems: 2,
      expectedDate: "2024-12-25T09:00:00Z",
      createdAt: "2024-12-20T10:30:00Z",
      items: [
        {
          id: 1,
          inventoryItemId: 1,
          itemName: "삼성 갤럭시 S24",
          sku: "GALAXY-S24-256GB",
          expectedQuantity: 50,
          unitPrice: 1200000
        },
        {
          id: 2,
          inventoryItemId: 5,
          itemName: "에어팟 프로 3세대",
          sku: "AIRPODS-PRO-3GEN",
          expectedQuantity: 30,
          unitPrice: 350000
        }
      ]
    },
    {
      id: 2,
      orderNumber: "IN-2024-002",
      supplierId: 2,
      supplierName: "애플코리아",
      status: "IN_PROGRESS",
      totalItems: 1,
      expectedDate: "2024-12-22T14:00:00Z",
      createdAt: "2024-12-18T15:45:00Z",
      items: [
        {
          id: 3,
          inventoryItemId: 2,
          itemName: "아이폰 15 Pro",
          sku: "IPHONE15PRO-128GB",
          expectedQuantity: 25,
          actualQuantity: 20,
          unitPrice: 1550000
        }
      ]
    },
    {
      id: 3,
      orderNumber: "IN-2024-003",
      supplierId: 3,
      supplierName: "LG전자",
      status: "COMPLETED",
      totalItems: 1,
      expectedDate: "2024-12-20T11:00:00Z",
      actualDate: "2024-12-20T10:45:00Z",
      createdAt: "2024-12-15T09:20:00Z",
      items: [
        {
          id: 4,
          inventoryItemId: 4,
          itemName: "LG 그램 17인치",
          sku: "LG-GRAM-17-2024",
          expectedQuantity: 15,
          actualQuantity: 15,
          unitPrice: 2100000
        }
      ]
    }
  ];

  // 입고 주문 목록 조회
  const fetchInboundOrders = async () => {
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
        setTimeout(() => {
          setOrders(mockInboundData);
          setLoading(false);
        }, 800);
        return;
      }

      const response = await fetch('http://localhost:8080/api/inbound', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse<InboundOrder[]> = await response.json();

      if (response.ok && data.success) {
        setOrders(data.data || []);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError(data.error || '입고 주문 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Inbound fetch error:', err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInboundOrders();
  }, []);

  // 상태별 필터링
  const filteredOrders = selectedStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#ff9800';
      case 'IN_PROGRESS': return '#2196f3';
      case 'COMPLETED': return '#4caf50';
      case 'CANCELLED': return '#f44336';
      default: return '#757575';
    }
  };

  // 상태별 한글명
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기중';
      case 'IN_PROGRESS': return '진행중';
      case 'COMPLETED': return '완료';
      case 'CANCELLED': return '취소';
      default: return status;
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>📥 입고 주문 목록 불러오는 중...</div>
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
          <h1>📥 입고 관리</h1>
          <p>총 {filteredOrders.length}개 주문</p>
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
            onClick={fetchInboundOrders}
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

      {/* 상태 필터 */}
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedStatus === status ? '#007bff' : 'white',
              color: selectedStatus === status ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {status === 'ALL' ? '전체' : getStatusText(status)} 
            ({status === 'ALL' ? orders.length : orders.filter(o => o.status === status).length})
          </button>
        ))}
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

      {/* 입고 주문 목록 */}
      {filteredOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📥</div>
          <h3>입고 주문이 없습니다</h3>
          <p>새로운 입고 주문을 생성해보세요!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                padding: '20px',
                border: '1px solid #eee'
              }}
            >
              {/* 주문 헤더 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{order.orderNumber}</h3>
                  <p style={{ margin: 0, color: '#666' }}>공급업체: {order.supplierName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {getStatusText(order.status)}
                  </span>
                  <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                    예정일: {new Date(order.expectedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* 상품 목록 */}
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ marginBottom: '10px' }}>📦 입고 상품 ({order.totalItems}개)</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  <div>상품명 (SKU)</div>
                  <div>예정 수량</div>
                  <div>실제 수량</div>
                  <div>단가</div>
                  <div>총액</div>
                </div>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                      gap: '10px',
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.itemName}</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>SKU: {item.sku}</div>
                    </div>
                    <div>{item.expectedQuantity}개</div>
                    <div>
                      {item.actualQuantity ? (
                        <span style={{ 
                          color: item.actualQuantity === item.expectedQuantity ? 'green' : 'orange',
                          fontWeight: 'bold'
                        }}>
                          {item.actualQuantity}개
                        </span>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
                      )}
                    </div>
                    <div>{item.unitPrice.toLocaleString()}원</div>
                    <div style={{ fontWeight: 'bold' }}>
                      {(item.unitPrice * (item.actualQuantity || item.expectedQuantity)).toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>

              {/* 주문 요약 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '15px',
                borderTop: '1px solid #eee'
              }}>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  등록일: {new Date(order.createdAt).toLocaleDateString()}
                  {order.actualDate && (
                    <span> | 완료일: {new Date(order.actualDate).toLocaleDateString()}</span>
                  )}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  총 주문액: {order.items.reduce((sum, item) => 
                    sum + (item.unitPrice * (item.actualQuantity || item.expectedQuantity)), 0
                  ).toLocaleString()}원
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 통계 요약 */}
      <div style={{
        marginTop: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4>대기중</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>
            {orders.filter(o => o.status === 'PENDING').length}건
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#cce5ff',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4>진행중</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>
            {orders.filter(o => o.status === 'IN_PROGRESS').length}건
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#d4edda',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4>완료</h4>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
            {orders.filter(o => o.status === 'COMPLETED').length}건
          </div>
        </div>
      </div>
    </div>
  );
}
