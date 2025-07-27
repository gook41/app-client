import React from 'react';
import Header from './components/layout/Header';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header title="🚀 My React App" />
      
      <main style={{ padding: '2rem', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1>🎉 성공! React 앱이 실행중!</h1>
          <p>TypeScript 문제가 모두 해결되었습니다!</p>
          
          <div style={{ 
            background: '#e7f9e7', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            border: '2px solid #4caf50',
            marginTop: '2rem'
          }}>
            <h2>✅ 해결 완료!</h2>
            <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
              <li>✅ @types/react, @types/react-dom 설치</li>
              <li>✅ 중복된 CSS Modules 타입 선언 제거</li>
              <li>✅ TypeScript 컴파일 에러 해결</li>
              <li>✅ Header 컴포넌트 정상 작동</li>
              <li>✅ CSS Modules 임포트 성공</li>
            </ul>
          </div>

          <div style={{ 
            background: '#fff3cd', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            border: '1px solid #ffc107',
            marginTop: '1rem'
          }}>
            <h3>🚀 이제 모든 기능이 정상 작동합니다!</h3>
            <p>Header에서 햄버거 메뉴를 클릭해보세요 (모바일에서)</p>
            <p>화면 크기를 조절해서 반응형 디자인을 확인해보세요!</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;