// src/pages/inbound/detail/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 입고 주문 상세 정보 타입
interface InboundOrderDetail {
  id: number;
  orderNumber: string;
  supplierId: number;
  supplierName: string;
  supplierContact: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  totalItems: number;
  totalAmount: number;
  requestedDate: string;
  deliveryDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  items: InboundOrderItemDetail[];
  statusHistory: StatusHistoryItem[];
}

interface InboundOrderItemDetail {
  id: number;
  inventoryItemId: number;
  itemName: string;
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'PENDING' | 'PARTIAL' | 'COMPLETED';
}

interface StatusHistoryItem {
  id: number;
  status: string;
  notes: string;
  createdAt: string;
  createdBy: string;
}

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export default function InboundOrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<InboundOrderDetail | null>(null);

  // Mock 데이터
  const mockInboundDetail: InboundOrderDetail = {
    id: 1,
    orderNumber: "IN-2024-001",
    supplierId: 1,
    supplierName: "삼성전자",
    supplierContact: "02-1234-5678",
    status: "DELIVERED",
    totalItems: 3,
    totalAmount: 29500000,
    requestedDate: "2024-12-25T09:00:00Z",
    deliveryDate: "2024-12-23T14:30:00Z",
    notes: "연말 대비 추가 재고 확보",
    createdAt: "2024-12-20T10:00:00Z",
    updatedAt: "2024-12-23T14:30:00Z",
    createdBy: "구매팀 김철수",
    items: [
      {
        id: 1,
        inventoryItemId: 1,
        itemName: "삼성 갤럭시 S24",
        sku: "GALAXY-S24-256GB",
        orderedQuantity: 20,
        receivedQuantity: 20,
        unitPrice: 1200000,
        totalPrice: 24000000,
        status: "COMPLETED"
      },
      {
        id: 2,
        inventoryItemId: 3,
        itemName: "맥북 에어 M3",
        sku: "MACBOOK-AIR-M3-13",
        orderedQuantity: 3,
        receivedQuantity: 3,
        unitPrice: 1800000,
        totalPrice: 5400000,
        status: "COMPLETED"
      },
      {
        id: 3,
        inventoryItemId: 5,
        itemName: "에어팟 프로 3세대",
        sku: "AIRPODS-PRO-3GEN",
        orderedQuantity: 1,
        receivedQuantity: 0,
        unitPrice: 350000,
        totalPrice: 350000,
        status: "PENDING"
      }
    ],
    statusHistory: [
      {
        id: 1,
        status: "PENDING",
        notes: "입고 주문 생성",
        createdAt: "2024-12-20T10:00:00Z",
        createdBy: "구매팀 김철수"
      },
      {
        id: 2,
        status: "CONFIRMED",
        notes: "공급업체 주문 확인",
        createdAt: "2024-12-21T09:30:00Z",
        createdBy: "공급업체 시스템"
      },
      {
        id: 3,
        status: "SHIPPED",
        notes: "배송 시작 - 운송장: 1234567890",
        createdAt: "2024-12-22T16:00:00Z",
        createdBy: "공급업체 시스템"
      },
      {
        id: 4,
        status: "DELIVERED",
        notes: "창고 도착, 검수 진행중",
        createdAt: "2024-12-23T14:30:00Z",
        createdBy: "창고팀 이영희"
      }
    ]
  };

  // 입고 주문 상세 정보 조회
  const fetchInboundDetail = async () => {
    if (!id) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Mock 데이터 모드
      const useMockData = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;
      
      if (useMockData) {
        setTimeout(() => {
          setOrder(mockInboundDetail);
          setLoading(false);
        }, 800);
        return;
      }

      const response = await fetch(`http://localhost:8080/api/inbound/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse<InboundOrderDetail> = await response.json();

      if (response.ok && data.success) {
        setOrder(data.data || null);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else if (response.status === 404) {
        setError('존재하지 않는 입고 주문입니다.');
      } else {
        setError(data.error || '입고 주문 상세 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Inbound detail fetch error:', err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInboundDetail();
  }, [id]);

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'CONFIRMED': return '#17a2b8';
      case 'SHIPPED': return '#fd7e14';
      case 'DELIVERED': return '#20c997';
      case 'COMPLETED': return '#28a745';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // 상태별 한글명
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기중';
      case 'CONFIRMED': return '확인됨';
      case 'SHIPPED': return '배송중';
      case 'DELIVERED': return '도착';
      case 'COMPLETED': return '완료';
      case 'CANCELLED': return '취소';
      default: return status;
    }
  };

  // 아이템 상태별 색상
  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'PARTIAL': return '#fd7e14';
      case 'COMPLETED': return '#28a745';
      default: return '#6c757d';
    }
  };

  // 아이템 상태별 한글명
  const getItemStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기중';
      case 'PARTIAL': return '부분입고';
      case 'COMPLETED': return '완료';
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
        <div>📥 입고 주문 상세 정보 불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: 'red', marginBottom: '20px', fontSize: '18px' }}>
          ❌ {error}
        </div>
        <button
          onClick={() => router.push('/inbound')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          입고 목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 주문이 없는 경우
  if (!order) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px', fontSize: '18px' }}>
          📥 입고 주문을 찾을 수 없습니다.
        </div>
        <button
          onClick={() => router.push('/inbound')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          입고 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
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
          <h1>📥 입고 주문 상세</h1>
          <p>{order.orderNumber} - {order.supplierName}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{
            padding: '8px 16px',
            backgroundColor: getStatusColor(order.status),
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {getStatusText(order.status)}
          </span>
          <button
            onClick={() => router.push('/inbound')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← 입고 목록
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* 주문 기본 정보 */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>📋 주문 기본 정보</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>주문번호:</strong>
              <span style={{ fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>
                {order.orderNumber}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>공급업체:</strong>
              <span>{order.supplierName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>연락처:</strong>
              <span>{order.supplierContact}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>요청일:</strong>
              <span>{new Date(order.requestedDate).toLocaleString()}</span>
            </div>
            {order.deliveryDate && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
                <strong>배송일:</strong>
                <span>{new Date(order.deliveryDate).toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>담당자:</strong>
              <span>{order.createdBy}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>총 주문액:</strong>
              <span style={{ color: '#007bff', fontWeight: 'bold', fontSize: '18px' }}>
                {order.totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 주문 요약 */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>📊 주문 요약</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
                {order.totalItems}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                총 상품 종류
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                  {order.items.reduce((sum, item) => sum + item.receivedQuantity, 0)}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  입고완료
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>
                  {order.items.reduce((sum, item) => sum + (item.orderedQuantity - item.receivedQuantity), 0)}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  대기중
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 비고 */}
      {order.notes && (
        <div style={{
          marginBottom: '30px',
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>📝 비고</h3>
          <p style={{ lineHeight: '1.6', color: '#666', margin: 0 }}>
            {order.notes}
          </p>
        </div>
      )}

      {/* 주문 상품 목록 */}
      <div style={{
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>📦 주문 상품 목록</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>상품명</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>SKU</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>주문수량</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>입고수량</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>단가</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>총액</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>
                    {item.itemName}
                  </td>
                  <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '12px' }}>
                    {item.sku}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    {item.orderedQuantity.toLocaleString()}
                  </td>
                  <td style={{ 
                    padding: '12px 8px', 
                    textAlign: 'right',
                    color: item.receivedQuantity === item.orderedQuantity ? '#28a745' : '#ffc107',
                    fontWeight: 'bold'
                  }}>
                    {item.receivedQuantity.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    {item.unitPrice.toLocaleString()}원
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                    {item.totalPrice.toLocaleString()}원
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: getItemStatusColor(item.status)
                    }}>
                      {getItemStatusText(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 상태 히스토리 */}
      <div style={{
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>📈 상태 히스토리</h3>
        <div style={{ position: 'relative' }}>
          {order.statusHistory.map((history, index) => (
            <div key={history.id} style={{ display: 'flex', marginBottom: '20px' }}>
              {/* 타임라인 도트 */}
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(history.status),
                marginRight: '20px',
                marginTop: '5px',
                position: 'relative',
                zIndex: 2
              }}>
                {/* 타임라인 선 */}
                {index < order.statusHistory.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '9px',
                    width: '2px',
                    height: '40px',
                    backgroundColor: '#dee2e6'
                  }} />
                )}
              </div>
              
              {/* 히스토리 내용 */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: getStatusColor(history.status),
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {getStatusText(history.status)}
                  </span>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    {new Date(history.createdAt).toLocaleString()}
                  </span>
                </div>
                <div style={{ color: '#666', marginBottom: '5px' }}>
                  {history.notes}
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  담당자: {history.createdBy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 메타 정보 */}
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>ℹ️ 메타 정보</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
            <strong>생성일:</strong>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
            <strong>최종 수정일:</strong>
            <span>{new Date(order.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
