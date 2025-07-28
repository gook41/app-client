// src/pages/inventory/detail/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 재고 상세 정보 타입
interface InventoryItemDetail {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unitPrice: number;
  minStockLevel: number;
  maxStockLevel: number;
  supplier: string;
  location: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  createdAt: string;
  updatedAt: string;
  lastStockMovement?: {
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    date: string;
    reason: string;
  };
  stockHistory: StockMovement[];
}

interface StockMovement {
  id: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  balanceAfter: number;
  reason: string;
  reference?: string;
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

export default function InventoryItemDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [item, setItem] = useState<InventoryItemDetail | null>(null);

  // Mock 데이터
  const mockInventoryDetail: InventoryItemDetail = {
    id: 1,
    name: "삼성 갤럭시 S24",
    sku: "GALAXY-S24-256GB",
    category: "스마트폰",
    quantity: 45,
    unitPrice: 1200000,
    minStockLevel: 10,
    maxStockLevel: 100,
    supplier: "삼성전자",
    location: "A-01-03",
    description: "삼성 갤럭시 S24 256GB 모델, 최신 안드로이드 OS 탑재",
    status: "ACTIVE",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-12-20T14:30:00Z",
    lastStockMovement: {
      type: "IN",
      quantity: 20,
      date: "2024-12-20T14:30:00Z",
      reason: "정기 입고"
    },
    stockHistory: [
      {
        id: 1,
        type: "IN",
        quantity: 50,
        balanceAfter: 50,
        reason: "초기 재고",
        reference: "INV-INIT-001",
        createdAt: "2024-01-15T09:00:00Z",
        createdBy: "admin"
      },
      {
        id: 2,
        type: "OUT",
        quantity: -10,
        balanceAfter: 40,
        reason: "판매",
        reference: "OUT-2024-001",
        createdAt: "2024-12-18T15:20:00Z",
        createdBy: "sales_user"
      },
      {
        id: 3,
        type: "IN",
        quantity: 20,
        balanceAfter: 60,
        reason: "정기 입고",
        reference: "IN-2024-015",
        createdAt: "2024-12-19T10:30:00Z",
        createdBy: "warehouse_user"
      },
      {
        id: 4,
        type: "OUT",
        quantity: -15,
        balanceAfter: 45,
        reason: "판매",
        reference: "OUT-2024-002",
        createdAt: "2024-12-20T14:30:00Z",
        createdBy: "sales_user"
      }
    ]
  };

  // 재고 상세 정보 조회
  const fetchInventoryDetail = async () => {
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
          setItem(mockInventoryDetail);
          setLoading(false);
        }, 800);
        return;
      }

      const response = await fetch(`http://localhost:8080/api/inventory/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse<InventoryItemDetail> = await response.json();

      if (response.ok && data.success) {
        setItem(data.data || null);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else if (response.status === 404) {
        setError('존재하지 않는 재고 아이템입니다.');
      } else {
        setError(data.error || '재고 상세 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Inventory detail fetch error:', err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryDetail();
  }, [id]);

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#28a745';
      case 'INACTIVE': return '#ffc107';
      case 'DISCONTINUED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // 상태별 한글명
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '활성';
      case 'INACTIVE': return '비활성';
      case 'DISCONTINUED': return '단종';
      default: return status;
    }
  };

  // 재고 이동 타입별 색상
  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'IN': return '#28a745';
      case 'OUT': return '#dc3545';
      case 'ADJUSTMENT': return '#ffc107';
      default: return '#6c757d';
    }
  };

  // 재고 이동 타입별 한글명
  const getMovementTypeText = (type: string) => {
    switch (type) {
      case 'IN': return '입고';
      case 'OUT': return '출고';
      case 'ADJUSTMENT': return '조정';
      default: return type;
    }
  };

  // 재고 수준 상태 확인
  const getStockLevelStatus = () => {
    if (!item) return { status: 'NORMAL', color: '#28a745', text: '정상' };
    
    if (item.quantity <= item.minStockLevel) {
      return { status: 'LOW', color: '#dc3545', text: '부족' };
    } else if (item.quantity >= item.maxStockLevel) {
      return { status: 'HIGH', color: '#ffc107', text: '과다' };
    }
    return { status: 'NORMAL', color: '#28a745', text: '정상' };
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
        <div>📦 재고 상세 정보 불러오는 중...</div>
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
          onClick={() => router.push('/inventory')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          재고 목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 아이템이 없는 경우
  if (!item) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px', fontSize: '18px' }}>
          📦 재고 정보를 찾을 수 없습니다.
        </div>
        <button
          onClick={() => router.push('/inventory')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          재고 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const stockLevel = getStockLevelStatus();

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
          <h1>📦 재고 상세 정보</h1>
          <p>{item.name} ({item.sku})</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => router.push(`/inventory/edit/${item.id}`)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffc107',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ✏️ 수정
          </button>
          <button
            onClick={() => router.push('/inventory')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← 재고 목록
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* 기본 정보 */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>📋 기본 정보</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>상품명:</strong>
              <span>{item.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>SKU:</strong>
              <span style={{ fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>
                {item.sku}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>카테고리:</strong>
              <span>{item.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>공급업체:</strong>
              <span>{item.supplier}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>보관 위치:</strong>
              <span style={{ fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '4px' }}>
                {item.location}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>단가:</strong>
              <span style={{ color: '#007bff', fontWeight: 'bold' }}>
                {item.unitPrice.toLocaleString()}원
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>상태:</strong>
              <span style={{ 
                color: getStatusColor(item.status),
                fontWeight: 'bold',
                backgroundColor: getStatusColor(item.status) + '20',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {getStatusText(item.status)}
              </span>
            </div>
          </div>
        </div>

        {/* 재고 현황 */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>📊 재고 현황</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: `3px solid ${stockLevel.color}`
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: stockLevel.color }}>
                {item.quantity}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                현재 재고 수량
              </div>
              <div style={{
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: stockLevel.color,
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px',
                display: 'inline-block'
              }}>
                {stockLevel.text}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>최소 재고:</strong>
              <span style={{ color: item.quantity <= item.minStockLevel ? '#dc3545' : '#666' }}>
                {item.minStockLevel}개
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>최대 재고:</strong>
              <span style={{ color: item.quantity >= item.maxStockLevel ? '#ffc107' : '#666' }}>
                {item.maxStockLevel}개
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
              <strong>재고 가치:</strong>
              <span style={{ color: '#007bff', fontWeight: 'bold' }}>
                {(item.quantity * item.unitPrice).toLocaleString()}원
              </span>
            </div>

            {/* 마지막 재고 이동 */}
            {item.lastStockMovement && (
              <div style={{
                marginTop: '15px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>최근 재고 이동</h5>
                <div style={{ fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{
                      color: getMovementTypeColor(item.lastStockMovement.type),
                      fontWeight: 'bold'
                    }}>
                      {getMovementTypeText(item.lastStockMovement.type)}
                    </span>
                    <span>{item.lastStockMovement.quantity}개</span>
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {item.lastStockMovement.reason} • {new Date(item.lastStockMovement.date).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 상품 설명 */}
      {item.description && (
        <div style={{
          marginTop: '30px',
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>📝 상품 설명</h3>
          <p style={{ lineHeight: '1.6', color: '#666', margin: 0 }}>
            {item.description}
          </p>
        </div>
      )}

      {/* 재고 이동 히스토리 */}
      <div style={{
        marginTop: '30px',
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>📈 재고 이동 히스토리</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>일시</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>유형</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>수량</th>
                <th style={{ padding: '12px 8px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>잔량</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>사유</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>참조</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>담당자</th>
              </tr>
            </thead>
            <tbody>
              {item.stockHistory.map((movement, index) => (
                <tr key={movement.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px 8px', fontSize: '14px' }}>
                    {new Date(movement.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: getMovementTypeColor(movement.type)
                    }}>
                      {getMovementTypeText(movement.type)}
                    </span>
                  </td>
                  <td style={{
                    padding: '12px 8px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: movement.quantity > 0 ? '#28a745' : '#dc3545'
                  }}>
                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontFamily: 'monospace' }}>
                    {movement.balanceAfter}
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '14px' }}>
                    {movement.reason}
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '12px' }}>
                    {movement.reference && (
                      <span style={{
                        fontFamily: 'monospace',
                        backgroundColor: '#f8f9fa',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {movement.reference}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: '14px', color: '#666' }}>
                    {movement.createdBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 메타 정보 */}
      <div style={{
        marginTop: '30px',
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>ℹ️ 메타 정보</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
            <strong>생성일:</strong>
            <span>{new Date(item.createdAt).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>
            <strong>최종 수정일:</strong>
            <span>{new Date(item.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
