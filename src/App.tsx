import React from 'react';
import Header from './components/layout/Header';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header title="🚀 My React App" />
      
      <main style={{ padding: '2rem', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1>🎉 React 앱이 실행중!</h1>
          <p>Header 컴포넌트가 성공적으로 추가되었습니다!</p>
          
          <div style={{ 
            background: '#f8fafc', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0',
            marginTop: '2rem'
          }}>
            <h2>✨ 구현 완료 기능</h2>
            <ul>
              <li>✅ 반응형 Header 컴포넌트</li>
              <li>✅ 모바일 햄버거 메뉴</li>
              <li>✅ CSS Modules 스타일링</li>
              <li>✅ 다크모드 지원 준비</li>
              <li>✅ Sticky Header (스크롤시 상단 고정)</li>
            </ul>
          </div>

          <div style={{ 
            background: '#fef7e7', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            border: '1px solid #f6cc8f',
            marginTop: '1rem'
          }}>
            <h3>🎯 다음 할일</h3>
            <ul>
              <li>Footer 컴포넌트 구현</li>
              <li>Sidebar/Navigation 확장</li>
              <li>React Router 설정</li>
              <li>페이지 컴포넌트들 생성</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;