// src/pages/inbound/add.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 입고 주문 생성 폼 데이터 타입
interface InboundOrderFormData {
  supplierName: string;
  expectedDate: string;
  notes: string;
  items: InboundItemFormData[];
}

interface InboundItemFormData {
  itemName: string;
  sku: string;
  expectedQuantity: number;
  unitPrice: number;
  inventoryItemId?: number;
}

// 재고 아이템 타입 (선택용)
interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export default function AddInboundOrder() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 기존 재고 아이템 목록 (선택 옵션용)
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  // 폼 데이터 상태
  const [formData, setFormData] = useState<InboundOrderFormData>({
    supplierName: '',
    expectedDate: '',
    notes: '',
    items: [
      {
        itemName: '',
        sku: '',
        expectedQuantity: 0,
        unitPrice: 0
      }
    ]
  });

  // Mock 재고 데이터
  const mockInventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: "삼성 갤럭시 S24",
      sku: "GALAXY-S24-256GB",
      quantity: 45,
      unitPrice: 1200000
    },
    {
      id: 2,
      name: "아이폰 15 Pro",
      sku: "IPHONE15PRO-128GB",
      quantity: 8,
      unitPrice: 1550000
    },
    {
      id: 3,
      name: "맥북 에어 M3",
      sku: "MACBOOK-AIR-M3-13",
      quantity: 22,
      unitPrice: 1800000
    },
    {
      id: 4,
      name: "LG 그램 17인치",
      sku: "LG-GRAM-17-2024",
      quantity: 3,
      unitPrice: 2100000
    },
    {
      id: 5,
      name: "에어팟 프로 3세대",
      sku: "AIRPODS-PRO-3GEN",
      quantity: 78,
      unitPrice: 350000
    }
  ];

  // 재고 목록 조회
  const fetchInventoryItems = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setInventoryLoading(true);

      // Mock 데이터 모드
      const useMockData = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL;
      
      if (useMockData) {
        setTimeout(() => {
          setInventoryItems(mockInventoryItems);
          setInventoryLoading(false);
        }, 500);
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
        setInventoryItems(data.data || []);
      }
    } catch (err) {
      console.error('Inventory fetch error:', err);
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  // 기본 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 아이템 입력값 변경 핸들러
  const handleItemChange = (index: number, field: keyof InboundItemFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // 기존 재고 아이템 선택 핸들러
  const handleInventorySelect = (index: number, inventoryItemId: number) => {
    const selectedItem = inventoryItems.find(item => item.id === inventoryItemId);
    if (selectedItem) {
      handleItemChange(index, 'inventoryItemId', inventoryItemId);
      handleItemChange(index, 'itemName', selectedItem.name);
      handleItemChange(index, 'sku', selectedItem.sku);
      handleItemChange(index, 'unitPrice', selectedItem.unitPrice);
    }
  };

  // 아이템 추가
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemName: '',
          sku: '',
          expectedQuantity: 0,
          unitPrice: 0
        }
      ]
    }));
  };

  // 아이템 제거
  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    if (!formData.supplierName.trim()) {
      setError('공급업체명을 입력해주세요.');
      return false;
    }
    if (!formData.expectedDate) {
      setError('예정일을 선택해주세요.');
      return false;
    }
    
    // 아이템 유효성 검사
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (!item.itemName.trim()) {
        setError(`${i + 1}번째 상품명을 입력해주세요.`);
        return false;
      }
      if (!item.sku.trim()) {
        setError(`${i + 1}번째 SKU를 입력해주세요.`);
        return false;
      }
      if (item.expectedQuantity <= 0) {
        setError(`${i + 1}번째 수량은 0보다 커야 합니다.`);
        return false;
      }
      if (item.unitPrice <= 0) {
        setError(`${i + 1}번째 단가는 0보다 커야 합니다.`);
        return false;
      }
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
        const orderNumber = `IN-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        setTimeout(() => {
          setSuccessMessage(`입고 주문 "${orderNumber}"이 성공적으로 생성되었습니다!`);
          setLoading(false);
          
          // 3초 후 입고 관리로 이동
          setTimeout(() => {
            router.push('/inbound');
          }, 3000);
        }, 1500);
        return;
      }

      const response = await fetch('http://localhost:8080/api/inbound', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data: ApiResponse<any> = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('입고 주문이 성공적으로 생성되었습니다!');
        
        // 3초 후 입고 관리로 이동
        setTimeout(() => {
          router.push('/inbound');
        }, 3000);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError(data.error || '입고 주문 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('Inbound order creation error:', err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 총 주문액 계산
  const getTotalAmount = () => {
    return formData.items.reduce((sum, item) => sum + (item.expectedQuantity * item.unitPrice), 0);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
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
          <h1>📥 입고 주문 생성</h1>
          <p>새로운 입고 주문을 생성합니다</p>
        </div>
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
          ← 입고 관리
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
            잠시 후 입고 관리로 이동합니다...
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

      {/* 입고 주문 생성 폼 */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* 기본 정보 */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>📋 주문 기본 정보</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* 공급업체명 */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                공급업체명 *
              </label>
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleInputChange}
                placeholder="예: 삼성전자"
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

            {/* 예정일 */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                입고 예정일 *
              </label>
              <input
                type="datetime-local"
                name="expectedDate"
                value={formData.expectedDate}
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
          </div>

          {/* 비고 */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              비고
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="입고 주문에 대한 추가 메모..."
              rows={3}
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
        </div>

        {/* 상품 목록 */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#333' }}>📦 입고 상품 목록</h3>
            <button
              type="button"
              onClick={addItem}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ➕ 상품 추가
            </button>
          </div>

          {inventoryLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              재고 목록 불러오는 중...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h4 style={{ margin: 0 }}>상품 #{index + 1}</h4>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ 제거
                      </button>
                    )}
                  </div>

                  {/* 기존 재고에서 선택 */}
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      기존 재고에서 선택 (선택사항)
                    </label>
                    <select
                      value={item.inventoryItemId || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          handleInventorySelect(index, Number(value));
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">직접 입력하거나 기존 재고에서 선택...</option>
                      {inventoryItems.map(invItem => (
                        <option key={invItem.id} value={invItem.id}>
                          {invItem.name} ({invItem.sku}) - {invItem.unitPrice.toLocaleString()}원
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px'
                  }}>
                    {/* 상품명 */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        상품명 *
                      </label>
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                        placeholder="상품명 입력"
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
                        SKU *
                      </label>
                      <input
                        type="text"
                        value={item.sku}
                        onChange={(e) => handleItemChange(index, 'sku', e.target.value.toUpperCase())}
                        placeholder="SKU 입력"
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

                    {/* 예정 수량 */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        예정 수량 *
                      </label>
                      <input
                        type="number"
                        value={item.expectedQuantity}
                        onChange={(e) => handleItemChange(index, 'expectedQuantity', Number(e.target.value))}
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
                    </div>

                    {/* 단가 */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        단가 (원) *
                      </label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
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
                  </div>

                  {/* 아이템 소계 */}
                  <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
                    textAlign: 'right'
                  }}>
                    <strong>소계: {(item.expectedQuantity * item.unitPrice).toLocaleString()}원</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 주문 요약 */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h4 style={{ marginBottom: '15px' }}>📋 주문 요약</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div><strong>공급업체:</strong> {formData.supplierName || '-'}</div>
            <div><strong>예정일:</strong> {formData.expectedDate ? new Date(formData.expectedDate).toLocaleString() : '-'}</div>
            <div><strong>총 상품 수:</strong> {formData.items.length}개</div>
            <div><strong>총 주문 수량:</strong> {formData.items.reduce((sum, item) => sum + item.expectedQuantity, 0)}개</div>
            <div><strong>총 주문액:</strong> <span style={{ color: '#007bff', fontSize: '18px' }}>{getTotalAmount().toLocaleString()}원</span></div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => router.push('/inbound')}
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
              backgroundColor: loading ? '#ccc' : '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? '생성 중...' : '📥 입고 주문 생성'}
          </button>
        </div>
      </form>
    </div>
  );
}
