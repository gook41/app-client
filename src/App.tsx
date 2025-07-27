import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🔧 테스트 중...</h1>
      <p>현재 시간: {new Date().toLocaleTimeString()}</p>
      <div style={{ background: 'lightgreen', padding: '10px', marginTop: '20px' }}>
        <strong>React가 정상 작동하면 이 박스가 보입니다!</strong>
      </div>
    </div>
  );
}

export default App;