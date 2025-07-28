// src/pages/inventory/add.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

// 재고 등록 폼 데이터 타입
interface InventoryFormData {
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  location: string;
  unitPrice: number;
  description: string;
  category: string;
  supplier: string;
}

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export default function AddInventory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 폼 데이터 상태
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    sku: '',
    quantity: 0,
    minQuantity: 0,
    location: '',
    unitPrice: 0,
    description: '',
    category: '',
    supplier: ''
  });

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('상품명을 입력해주세요.');
      return false;
    }
    if (!formData.sku.trim()) {
      setError('SKU를 입력해주세요.');
      return false;
    }
    if (formData.quantity < 0) {
      setError('수량은 0 이상이어야 합니다.');
      return false;
    }
    if (formData.minQuantity < 0) {
      setError('최소 수량은 0 이상이어야 합니다.');
      return false;
    }
    if (!formData.location.trim()) {
      setError('저장 위치를 입력해주세요.');
      return false;
    }
    if (formData.unitPrice <= 0) {
      setError('단가는 0보다 커야 합니다.');
      return false;
    }
    if (!formData.category) {
      setError('카테고리를 선택해주세요.');
      return false;
    }
    return true;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      // Mock 모드에서는 시뮬레이션
      const useMockData = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;
      
      if (useMockData) {
        // Mock 등록 시뮬레이션
        setTimeout(() => {
          setSuccessMessage(`상품 "${formData.name}"이 성공적으로 등록되었습니다!`);
          setLoading(false);
          
          // 3초 후 재고 목록으로 이동
          setTimeout(() => {
            router.push('/inventory');
          }, 3000);
        }, 1500);
        return;
      }

      const response = await fetch('http://localhost:8080/api/inventory', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data: ApiResponse<any> = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(`상품 "${formData.name}"이 성공적으로 등록되었습니다!`);
        
        // 3초 후 재고 목록으로 이동
        setTimeout(() => {
          router.push('/inventory');
        }, 3000);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError(data.error || '재고 등록에 실패했습니다.');
      }
    } catch (err) {
      console.error('Inventory creation error:', err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
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
          <h1>📦 재고 등록</h1>
          <p>새로운 상품을 재고에 추가합니다</p>
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

      {/* 등록 폼 */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
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
              value={formData.name}
              onChange={handleInputChange}
              placeholder="예: 삼성 갤럭시 S24"
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
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="예: GALAXY-S24-256GB"
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
              value={formData.category}
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
              value={formData.supplier}
              onChange={handleInputChange}
              placeholder="예: 삼성전자"
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
              value={formData.quantity}
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

          {/* 최소 수량 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              최소 수량 (알림 기준) *
            </label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
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
              value={formData.unitPrice}
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
              {formData.unitPrice > 0 && `${formData.unitPrice.toLocaleString()}원`}
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
              value={formData.location}
              onChange={handleInputChange}
              placeholder="예: A-01-01"
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
            value={formData.description}
            onChange={handleInputChange}
            placeholder="상품에 대한 추가 설명을 입력하세요..."
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

        {/* 폼 요약 */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h4 style={{ marginBottom: '15px' }}>📋 등록 정보 요약</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div><strong>상품명:</strong> {formData.name || '-'}</div>
            <div><strong>SKU:</strong> {formData.sku || '-'}</div>
            <div><strong>수량:</strong> {formData.quantity}개</div>
            <div><strong>최소 수량:</strong> {formData.minQuantity}개</div>
            <div><strong>단가:</strong> {formData.unitPrice.toLocaleString()}원</div>
            <div><strong>총 가치:</strong> {(formData.quantity * formData.unitPrice).toLocaleString()}원</div>
            <div><strong>위치:</strong> {formData.location || '-'}</div>
            <div><strong>카테고리:</strong> {categories.find(c => c.value === formData.category)?.label || '-'}</div>
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
            disabled={loading}
            style={{
              padding: '12px 30px',
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? '등록 중...' : '📦 재고 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
