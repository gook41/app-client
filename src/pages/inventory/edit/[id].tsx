// src/pages/inventory/edit/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 재고 아이템 타입 정의 (수정용)
interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  location: string;
  unitPrice: number;
  description?: string;
  category: string;
  supplier?: string;
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

export default function EditInventory() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [item, setItem] = useState<InventoryItem | null>(null);

  // Mock 데이터 (기존 재고 목록에서 가져온 데이터)
  const mockInventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: "삼성 갤럭시 S24",
      sku: "GALAXY-S24-256GB",
      quantity: 45,
      minQuantity: 10,
      location: "A-01-01",
      unitPrice: 1200000,
      description: "삼성 최신 플래그십 스마트폰",
      category: "SMARTPHONE",
      supplier: "삼성전자",
      createdAt: "2024-01-15T09:00:00Z",
      updatedAt: "2024-12-20T14:30:00Z"
    },
    {
      id: 2,
      name: "아이폰 15 Pro",
      sku: "IPHONE15PRO-128GB",
      quantity: 8,
      minQuantity: 15,
      location: "A-01-02",
      unitPrice: 1550000,
      description: "애플 프리미엄 스마트폰",
      category: "SMARTPHONE",
      supplier: "애플코리아",
      createdAt: "2024-01-20T10:30:00Z",
      updatedAt: "2024-12-19T16:45:00Z"
    },
    {
      id: 3,
      name: "맥북 에어 M3",
      sku: "MACBOOK-AIR-M3-13",
      quantity: 22,
      minQuantity: 5,
      location: "B-02-01",
      unitPrice: 1800000,
      description: "13인치 맥북 에어 M3 칩",
      category: "LAPTOP",
      supplier: "애플코리아",
      createdAt: "2024-02-01T11:15:00Z",
      updatedAt: "2024-12-20T09:20:00Z"
    }
  ];

  // 재고 정보 조회
  const fetchInventoryItem = async () => {
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
          const foundItem = mockInventoryItems.find(item => item.id === Number(id));
          if (foundItem) {
            setItem(foundItem);
          } else {
            setError('해당 재고 아이템을 찾을 수 없습니다.');
          }
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

      const data: ApiResponse<InventoryItem> = await response.json();

      if (response.ok && data.success) {
        setItem(data.data || null);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else if (response.status === 404) {
        setError('해당 재고 아이템을 찾을 수 없습니다.');
      } else {
        setError(data.error || '재고 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Inventory fetch error:', err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryItem();
  }, [id]);

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!item) return;
    
    const { name, value, type } = e.target;
    
    setItem(prev => ({
      ...prev!,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    if (!item) return false;
    
    if (!item.name.trim()) {
      setError('상품명을 입력해주세요.');
      return false;
    }
    if (!item.sku.trim()) {
      setError('SKU를 입력해주세요.');
      return false;
    }
    if (item.quantity < 0) {
      setError('수량은 0 이상이어야 합니다.');
      return false;
    }
    if (item.minQuantity < 0) {
      setError('최소 수량은 0 이상이어야 합니다.');
      return false;
    }
    if (!item.location.trim()) {
      setError('저장 위치를 입력해주세요.');
      return false;
    }
    if (item.unitPrice <= 0) {
      setError('단가는 0보다 커야 합니다.');
      return false;
    }
    if (!item.category) {
      setError('카테고리를 선택해주세요.');
      return false;
    }
    return true;
  };

  // 수정 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !item) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccessMessage('');

      // Mock 모드에서는 시뮬레이션
      const useMockData = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;
      
      if (useMockData) {
        setTimeout(() => {
          setSuccessMessage(`상품 "${item.name}"이 성공적으로 수정되었습니다!`);
          setSubmitting(false);
          
          // 3초 후 재고 목록으로 이동
          setTimeout(() => {
            router.push('/inventory');
          }, 3000);
        }, 1500);
        return;
      }

      const response = await fetch(`http://localhost:8080/api/inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item)
      });

      const data: ApiResponse<any> = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(`상품 "${item.name}"이 성공적으로 수정되었습니다!`);
        
        // 3초 후 재고 목록으로 이동
        setTimeout(() => {
          router.push('/inventory');
        }, 3000);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError(data.error || '재고 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('Inventory update error:', err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // 카테고리 옵션
  const categories = [
    { value: '', label: '카테고리 선택' },
    { value: 'SMARTPHONE', label: '📱 스마트폰' },
    { value: 'LAPTOP', label: '💻 노트북' },
    { value: 'TABLET', label: '📲 태블릿' },
    { value: 'ACCESSORY', label: '🎧 액세서리' },
    { value: 'WEARABLE', label: '⌚ 웨어러블' },
    { value: 'GAMING', label: '🎮 게이밍' },
    { value: 'OTHER', label: '📦 기타' }
  ];

  // 로딩 상태
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>📦 재고 정보 불러오는 중...</div>
      </div>
    );
  }

  // 아이템을 찾을 수 없는 경우
  if (!item) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ 재고 아이템을 찾을 수 없습니다</h2>
        <p>요청하신 재고 아이템이 존재하지 않거나 삭제되었습니다.</p>
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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
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
          <h1>✏️ 재고 수정</h1>
          <p>상품 정보를 수정합니다 (ID: {item.id})</p>
        </div>
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

      {/* 성공 메시지 */}
      {successMessage && (
        <div style={{
          color: 'green',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#d4edda',
          borderRadius: '4px',
          border: '1px solid #c3e6cb',
          textAlign: 'center'
        }}>
          ✅ {successMessage}
          <div style={{ marginTop: '10px', fontSize: '14px' }}>
            잠시 후 재고 목록으로 이동합니다...
          </div>
        </div>
      )}

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

      {/* 수정 폼 */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* 메타데이터 표시 */}
        <div style={{
          padding: '15px',
          backgroundColor: '#e9ecef',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h4 style={{ marginBottom: '10px' }}>📋 재고 정보</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px' }}>
            <div><strong>등록일:</strong> {new Date(item.createdAt).toLocaleDateString()}</div>
            <div><strong>수정일:</strong> {new Date(item.updatedAt).toLocaleDateString()}</div>
            <div><strong>재고 ID:</strong> {item.id}</div>
            <div><strong>현재 재고가치:</strong> {(item.quantity * item.unitPrice).toLocaleString()}원</div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* 상품명 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              상품명 *
            </label>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* SKU */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              SKU (상품 코드) *
            </label>
            <input
              type="text"
              name="sku"
              value={item.sku}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                textTransform: 'uppercase'
              }}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              카테고리 *
            </label>
            <select
              name="category"
              value={item.category}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 공급업체 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              공급업체
            </label>
            <input
              type="text"
              name="supplier"
              value={item.supplier || ''}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* 현재 수량 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              현재 수량 *
            </label>
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={handleInputChange}
              min="0"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            {item.quantity <= item.minQuantity && (
              <div style={{ fontSize: '12px', color: 'red', marginTop: '4px' }}>
                ⚠️ 최소 수량 이하입니다!
              </div>
            )}
          </div>

          {/* 최소 수량 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              최소 수량 (알림 기준) *
            </label>
            <input
              type="number"
              name="minQuantity"
              value={item.minQuantity}
              onChange={handleInputChange}
              min="0"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* 단가 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              단가 (원) *
            </label>
            <input
              type="number"
              name="unitPrice"
              value={item.unitPrice}
              onChange={handleInputChange}
              min="1"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {item.unitPrice > 0 && `${item.unitPrice.toLocaleString()}원`}
            </div>
          </div>

          {/* 저장 위치 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              저장 위치 *
            </label>
            <input
              type="text"
              name="location"
              value={item.location}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                textTransform: 'uppercase'
              }}
            />
          </div>
        </div>

        {/* 상품 설명 */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            상품 설명
          </label>
          <textarea
            name="description"
            value={item.description || ''}
            onChange={handleInputChange}
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>

        {/* 변경 사항 요약 */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h4 style={{ marginBottom: '15px' }}>📝 수정 정보 요약</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div><strong>상품명:</strong> {item.name}</div>
            <div><strong>SKU:</strong> {item.sku}</div>
            <div><strong>수량:</strong> {item.quantity}개</div>
            <div><strong>최소 수량:</strong> {item.minQuantity}개</div>
            <div><strong>단가:</strong> {item.unitPrice.toLocaleString()}원</div>
            <div><strong>총 가치:</strong> {(item.quantity * item.unitPrice).toLocaleString()}원</div>
            <div><strong>위치:</strong> {item.location}</div>
            <div><strong>카테고리:</strong> {categories.find(c => c.value === item.category)?.label || item.category}</div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => router.push('/inventory')}
            style={{
              padding: '12px 30px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px 30px',
              backgroundColor: submitting ? '#ccc' : '#ffc107',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {submitting ? '수정 중...' : '✏️ 재고 수정'}
          </button>
        </div>
      </form>
    </div>
  );
}
