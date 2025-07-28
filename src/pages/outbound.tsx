// src/pages/outbound.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 출고 주문 타입 정의
interface OutboundOrder {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  status: 'PENDING' | 'PICKING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalItems: number;
  requestedDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  shippingAddress: string;
  createdAt: string;
  items: OutboundItem[];
}

interface OutboundItem {
  id: number;
  inventoryItemId: number;
  itemName: string;
  sku: string;
  requestedQuantity: number;
  pickedQuantity?: number;
  unitPrice: number;
}

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export default function Outbound() {
  const [orders, setOrders] = useState<OutboundOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const router = useRouter();

  // Mock 데이터
  const mockOutboundData: OutboundOrder[] = [
    {
      id: 1,
      orderNumber: "OUT-2024-001",
      customerId: 1,
      customerName: "테크마트 강남점",
      status: "PENDING",
      totalItems: 3,
      requestedDate: "2024-12-25T15:00:00Z",
      shippingAddress: "서울시 강남구 테헤란로 123",
      createdAt: "2024-12-20T14:30:00Z",
      items: [
        {
          id: 1,
          inventoryItemId: 1,
          itemName: "삼성 갤럭시 S24",
          sku: "GALAXY-S24-256GB",
          requestedQuantity: 10,
          unitPrice: 1200000
        },
        {
          id: 2,
          inventoryItemId: 2,
          itemName: "아이폰 15 Pro",
          sku: "IPHONE15PRO-128GB",
          requestedQuantity: 5,
          unitPrice: 1550000
        },
        {
          id: 3,
          inventoryItemId: 5,
          itemName: "에어팟 프로 3세대",
          sku: "AIRPODS-PRO-3GEN",
          requestedQuantity: 20,
          unitPrice: 350000
        }
      ]
    },
    {
      id: 2,
      orderNumber: "OUT-2024-002",
      customerId: 2,
      customerName: "일렉트로닉스 마켓",
      status: "PICKING",
      totalItems: 2,
      requestedDate: "2024-12-23T10:00:00Z",
      shippingAddress: "부산시 해운대구 센텀중앙로 456",
      createdAt: "2024-12-19T09:15:00Z",
      items: [
        {
          id: 4,
          inventoryItemId: 3,
          itemName: "맥북 에어 M3",
          sku: "MACBOOK-AIR-M3-13",
          requestedQuantity: 3,
          pickedQuantity: 3,
          unitPrice: 1800000
        },
        {
          id: 5,
          inventoryItemId: 6,
          itemName: "소니 WH-1000XM5",
          sku: "SONY-WH1000XM5-BLACK",
          requestedQuantity: 8,
          pickedQuantity: 6,
          unitPrice: 450000
        }
      ]
    },
    {
      id: 3,
      orderNumber: "OUT-2024-003",
      customerId: 3,
      customerName: "디지털프라자 대구점",
      status: "DELIVERED",
      totalItems: 1,
      requestedDate: "2024-12-20T13:00:00Z",
      shippedDate: "2024-12-20T16:30:00Z",
      deliveredDate: "2024-12-21T11:20:00Z",
      shippingAddress: "대구시 중구 동성로 789",
      createdAt: "2024-12-18T11:45:00Z",
      items: [
        {
          id: 6,
          inventoryItemId: 4,
          itemName: "LG 그램 17인치",
          sku: "LG-GRAM-17-2024",
          requestedQuantity: 5,
          pickedQuantity: 5,
          unitPrice: 2100000
        }
      ]
    }
  ];

  // 출고 주문 목록 조회
  const fetchOutboundOrders = async () => {
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
          setOrders(mockOutboundData);
          setLoading(false);
        }, 600);
        return;
      }

      const response = await fetch('http://localhost:8080/api/outbound', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse<OutboundOrder[]> = await response.json();

      if (response.ok && data.success) {
        setOrders(data.data || []);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError(data.error || '출고 주문 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Outbound fetch error:', err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutboundOrders();
  }, []);

  // 상태별 필터링
  const filteredOrders = selectedStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#ff9800';
      case 'PICKING': return '#2196f3';
      case 'PACKED': return '#9c27b0';
      case 'SHIPPED': return '#00bcd4';
      case 'DELIVERED': return '#4caf50';
      case 'CANCELLED': return '#f44336';
      default: return '#757575';
    }
  };

  // 상태별 한글명
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기중';
      case 'PICKING': return '피킹중';
      case 'PACKED': return '포장완료';
      case 'SHIPPED': return '배송중';
      case 'DELIVERED': return '배송완료';
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
        <div>📤 출고 주문 목록 불러오는 중...</div>
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
          <h1>📤 출고 관리</h1>
          <p>총 {filteredOrders.length}개 주문</p>
        </div>
        <div>
          <button
            onClick={() => router.push('/outbound/add')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            📤 출고 주문 생성
          </button>
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
            onClick={fetchOutboundOrders}
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
        {['ALL', 'PENDING', 'PICKING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(status => (
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

      {/* 출고 주문 목록 */}
      {filteredOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📤</div>
          <h3>출고 주문이 없습니다</h3>
          <p>새로운 출고 주문을 생성해보세요!</p>
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
                  <p style={{ margin: '0 0 5px 0', color: '#666' }}>고객: {order.customerName}</p>
                  <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
                    📍 {order.shippingAddress}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginRight: '10px'
                  }}>
                    {getStatusText(order.status)}
                  </span>
                  <button
                    onClick={() => router.push(`/outbound/detail/${order.id}`)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    👁️ 상세
                  </button>
                  <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                    요청일: {new Date(order.requestedDate).toLocaleDateString()}
                  </div>
                  {order.shippedDate && (
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      배송일: {new Date(order.shippedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {/* 상품 목록 */}
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ marginBottom: '10px' }}>📦 출고 상품 ({order.totalItems}개)</h4>
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
                  <div>요청 수량</div>
                  <div>피킹 수량</div>
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
                    <div>{item.requestedQuantity}개</div>
                    <div>
                      {item.pickedQuantity !== undefined ? (
                        <span style={{ 
                          color: item.pickedQuantity === item.requestedQuantity ? 'green' : 
                                item.pickedQuantity < item.requestedQuantity ? 'orange' : 'blue',
                          fontWeight: 'bold'
                        }}>
                          {item.pickedQuantity}개
                          {item.pickedQuantity !== item.requestedQuantity && (
                            <span style={{ fontSize: '12px', marginLeft: '4px' }}>
                              ({item.pickedQuantity > item.requestedQuantity ? '+' : ''}{item.pickedQuantity - item.requestedQuantity})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
                      )}
                    </div>
                    <div>{item.unitPrice.toLocaleString()}원</div>
                    <div style={{ fontWeight: 'bold' }}>
                      {(item.unitPrice * (item.pickedQuantity !== undefined ? item.pickedQuantity : item.requestedQuantity)).toLocaleString()}원
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
                  주문일: {new Date(order.createdAt).toLocaleDateString()}
                  {order.deliveredDate && (
                    <span> | 배송완료: {new Date(order.deliveredDate).toLocaleDateString()}</span>
                  )}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  총 주문액: {order.items.reduce((sum, item) => 
                    sum + (item.unitPrice * (item.pickedQuantity !== undefined ? item.pickedQuantity : item.requestedQuantity)), 0
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h5>대기중</h5>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff9800' }}>
            {orders.filter(o => o.status === 'PENDING').length}
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#cce5ff',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h5>피킹중</h5>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196f3' }}>
            {orders.filter(o => o.status === 'PICKING').length}
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#e1bee7',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h5>포장완료</h5>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#9c27b0' }}>
            {orders.filter(o => o.status === 'PACKED').length}
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#b2ebf2',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h5>배송중</h5>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00bcd4' }}>
            {orders.filter(o => o.status === 'SHIPPED').length}
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h5>배송완료</h5>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4caf50' }}>
            {orders.filter(o => o.status === 'DELIVERED').length}
          </div>
        </div>
      </div>
    </div>
  );
}
