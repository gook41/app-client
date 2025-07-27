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
            <h2>✅ 문제 해결 완료!</h2>
            <ul>
              <li>✅ CSS Modules 타입 선언 추가</li>
              <li>✅ 중복 JavaScript 파일들 정리</li>
              <li>✅ index.tsx 제대로 생성</li>
              <li>✅ Header 컴포넌트 정상 작동</li>
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