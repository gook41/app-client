import React from 'react';
// import Header from './components/layout/Header';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* <Header title="🚀 My React App" /> */}
      
      <main style={{ padding: '2rem', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1>🎉 React 앱이 실행중!</h1>
          <p>기본 테스트 페이지입니다.</p>
          
          <div style={{ 
            background: '#f8fafc', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0',
            marginTop: '2rem'
          }}>
            <h2>🔧 디버깅 중...</h2>
            <p>Header 컴포넌트를 임시로 비활성화했습니다.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;