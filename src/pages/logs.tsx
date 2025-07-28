// src/pages/logs.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 로그 엔트리 타입 정의
interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  category: 'INVENTORY' | 'INBOUND' | 'OUTBOUND' | 'AUTH' | 'SYSTEM';
  action: string;
  userId?: number;
  username?: string;
  details: string;
  metadata?: Record<string, any>;
}

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const router = useRouter();

  // Mock 데이터
  const mockLogsData: LogEntry[] = [
    {
      id: 1,
      timestamp: "2024-12-20T15:30:00Z",
      level: "INFO",
      category: "INVENTORY",
      action: "ITEM_CREATED",
      userId: 1,
      username: "admin",
      details: "새로운 재고 아이템이 등록되었습니다",
      metadata: {
        itemId: 7,
        itemName: "갤럭시 북 프로",
        sku: "GALAXY-BOOK-PRO-16",
        quantity: 20
      }
    },
    {
      id: 2,
      timestamp: "2024-12-20T14:45:00Z",
      level: "WARN",
      category: "INVENTORY",
      action: "LOW_STOCK_ALERT",
      details: "재고 부족 알림: 아이폰 15 Pro (8개 남음)",
      metadata: {
        itemId: 2,
        itemName: "아이폰 15 Pro",
        currentQuantity: 8,
        minQuantity: 15
      }
    },
    {
      id: 3,
      timestamp: "2024-12-20T13:20:00Z",
      level: "INFO",
      category: "INBOUND",
      action: "ORDER_COMPLETED",
      userId: 2,
      username: "warehouse_manager",
      details: "입고 주문이 완료되었습니다",
      metadata: {
        orderId: 3,
        orderNumber: "IN-2024-003",
        supplierName: "LG전자",
        totalItems: 15
      }
    },
    {
      id: 4,
      timestamp: "2024-12-20T12:15:00Z",
      level: "ERROR",
      category: "OUTBOUND",
      action: "PICKING_ERROR",
      userId: 3,
      username: "picker01",
      details: "피킹 중 오류 발생: 재고 부족",
      metadata: {
        orderId: 2,
        orderNumber: "OUT-2024-002",
        itemId: 6,
        itemName: "소니 WH-1000XM5",
        requestedQuantity: 8,
        availableQuantity: 6
      }
    },
    {
      id: 5,
      timestamp: "2024-12-20T11:30:00Z",
      level: "INFO",
      category: "AUTH",
      action: "USER_LOGIN",
      userId: 1,
      username: "admin",
      details: "사용자가 로그인했습니다",
      metadata: {
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    },
    {
      id: 6,
      timestamp: "2024-12-20T10:45:00Z",
      level: "DEBUG",
      category: "SYSTEM",
      action: "BACKUP_COMPLETED",
      details: "일일 데이터베이스 백업이 완료되었습니다",
      metadata: {
        backupSize: "125.7MB",
        duration: "2m 34s",
        location: "/backups/wms_20241220.sql"
      }
    },
    {
      id: 7,
      timestamp: "2024-12-20T09:00:00Z",
      level: "INFO",
      category: "SYSTEM",
      action: "SYSTEM_STARTUP",
      details: "WMS 시스템이 시작되었습니다",
      metadata: {
        version: "1.0.0",
        environment: "production"
      }
    }
  ];

  // 로그 목록 조회
  const fetchLogs = async () => {
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
          setLogs(mockLogsData);
          setLoading(false);
        }, 400);
        return;
      }

      const response = await fetch('http://localhost:8080/api/logs', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse<LogEntry[]> = await response.json();

      if (response.ok && data.success) {
        setLogs(data.data || []);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError(data.error || '로그를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Logs fetch error:', err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 로그 필터링
  const filteredLogs = logs.filter(log => {
    const levelMatch = selectedLevel === 'ALL' || log.level === selectedLevel;
    const categoryMatch = selectedCategory === 'ALL' || log.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  // 레벨별 색상
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return '#2196f3';
      case 'WARN': return '#ff9800';
      case 'ERROR': return '#f44336';
      case 'DEBUG': return '#9e9e9e';
      default: return '#757575';
    }
  };

  // 카테고리별 이모지
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'INVENTORY': return '📦';
      case 'INBOUND': return '📥';
      case 'OUTBOUND': return '📤';
      case 'AUTH': return '🔐';
      case 'SYSTEM': return '⚙️';
      default: return '📋';
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
        <div>📋 로그 불러오는 중...</div>
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
          <h1>📋 로그 관리</h1>
          <p>총 {filteredLogs.length}개 로그</p>
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
            onClick={fetchLogs}
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

      {/* 필터 */}
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* 레벨 필터 */}
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>레벨:</label>
          {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'].map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              style={{
                padding: '6px 12px',
                backgroundColor: selectedLevel === level ? getLevelColor(level) : 'white',
                color: selectedLevel === level ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '12px',
                marginRight: '8px'
              }}
            >
              {level === 'ALL' ? '전체' : level} 
              ({level === 'ALL' ? logs.length : logs.filter(l => l.level === level).length})
            </button>
          ))}
        </div>

        {/* 카테고리 필터 */}
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>카테고리:</label>
          {['ALL', 'INVENTORY', 'INBOUND', 'OUTBOUND', 'AUTH', 'SYSTEM'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '6px 12px',
                backgroundColor: selectedCategory === category ? '#007bff' : 'white',
                color: selectedCategory === category ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '16px',
                cursor: 'pointer',
                fontSize: '12px',
                marginRight: '8px'
              }}
            >
              {category === 'ALL' ? '전체' : `${getCategoryEmoji(category)} ${category}`} 
              ({category === 'ALL' ? logs.length : logs.filter(l => l.category === category).length})
            </button>
          ))}
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

      {/* 로그 목록 */}
      {filteredLogs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
          <h3>로그가 없습니다</h3>
          <p>선택한 필터 조건에 맞는 로그가 없습니다.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: '15px',
                border: `1px solid ${getLevelColor(log.level)}20`,
                borderLeft: `4px solid ${getLevelColor(log.level)}`
              }}
            >
              {/* 로그 헤더 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    backgroundColor: getLevelColor(log.level),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {log.level}
                  </span>
                  <span style={{
                    backgroundColor: '#f0f0f0',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {getCategoryEmoji(log.category)} {log.category}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {log.action}
                  </span>
                  {log.username && (
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      by {log.username}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>

              {/* 로그 내용 */}
              <div style={{ marginBottom: '10px' }}>
                <p style={{ margin: '0 0 10px 0', color: '#333' }}>
                  {log.details}
                </p>
              </div>

              {/* 메타데이터 */}
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  <strong>상세 정보:</strong>
                  <div style={{ marginTop: '5px' }}>
                    {Object.entries(log.metadata).map(([key, value]) => (
                      <div key={key} style={{ marginBottom: '2px' }}>
                        <span style={{ color: '#666' }}>{key}:</span> 
                        <span style={{ marginLeft: '5px' }}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 통계 요약 */}
      <div style={{
        marginTop: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '15px'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h5>INFO</h5>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196f3' }}>
            {logs.filter(l => l.level === 'INFO').length}
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h5>WARN</h5>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff9800' }}>
            {logs.filter(l => l.level === 'WARN').length}
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h5>ERROR</h5>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f44336' }}>
            {logs.filter(l => l.level === 'ERROR').length}
          </div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h5>DEBUG</h5>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#9e9e9e' }}>
            {logs.filter(l => l.level === 'DEBUG').length}
          </div>
        </div>
      </div>
    </div>
  );
}
