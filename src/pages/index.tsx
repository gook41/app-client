import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>� WMS (창고 관리 시스템)</h1>
      <p>백엔드 API 100% 완성! 프론트엔드 개발 시작</p>
      
      <div style={{
        margin: '40px 0',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h2>🎯 구현할 화면들</h2>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>✅ 로그인/회원가입 (JWT 토큰 관리)</li>
          <li>🔄 대시보드 (입출고 현황, 실시간 재고)</li>
          <li>🔄 재고 관리 (CRUD, QR 코드)</li>
          <li>🔄 입고/출고 관리</li>
          <li>🔄 사용자 관리 (관리자)</li>
          <li>🔄 로그 조회 및 필터링</li>
        </ul>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Link href="/login" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#4CAF50',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 'bold'
        }}>
          🔐 로그인하기
        </Link>
        
        <Link href="/signup" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#2196F3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 'bold'
        }}>
          ✍️ 회원가입
        </Link>
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#e8f5e8',
        borderRadius: '8px'
      }}>
        <h3>📡 API 연동 정보</h3>
        <p><strong>백엔드 서버:</strong> http://localhost:8080</p>
        <p><strong>총 API:</strong> 33개 완성</p>
        <p><strong>인증:</strong> JWT Bearer Token</p>
      </div>
    </div>
  );
}