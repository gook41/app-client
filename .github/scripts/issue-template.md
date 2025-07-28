---
filename: issue-template.md
description: AI 지원 프론트엔드 작업/이슈 등록용 템플릿 (자동화 기반)
deprecated: false
ai_enhanced: true
---

<!--
🤖 AI 자동화 활용법:
1. "메인 대시보드 구현해줘" → AI가 파일 구조, 컴포넌트, 테스트까지 자동 생성
2. "사용자 프로필 페이지 만들어" → 기존 패턴 분석해서 일관된 구조로 생성
3. "API 연동 추가해줘" → Next.js API 라우트 + 훅 + 타입 자동 생성

⚠️ 이 템플릿은 AI가 자동 생성 못하는 비즈니스 로직 명세용으로 사용
-->

## 📝 비즈니스 요구사항 명세 (AI 입력용)

### 🎯 기능 목표

- 무엇을 만들어야 하는지 (What)
- 왜 필요한지 (Why)
- 사용자 시나리오 (How)

### � 비즈니스 로직

- 데이터 처리 규칙
- 권한/인증 요구사항
- 외부 API 연동 스펙

### 🎨 UI/UX 요구사항

- 디자인 가이드라인
- 사용자 플로우
- 반응형 요구사항

### � 기술적 제약사항

- 성능 요구사항
- 브라우저 지원 범위
- 접근성 요구사항

---

## 🤖 AI 자동 생성 예시

**입력**: "사용자 프로필 편집 페이지 만들어줘"

**AI 자동 생성**:

```
✅ 생성될 파일들:
- src/pages/profile/edit.tsx
- src/components/profile/ProfileForm.tsx
- src/hooks/useProfileUpdate.ts
- src/types/ProfileType.ts
- pages/api/profile/update.ts

✅ 자동 적용될 패턴:
- Next.js 페이지 라우팅
- TypeScript 타입 안정성
- API 응답 형식 (ApiResponse<T>)
- 에러 처리 및 로딩 상태
- 폼 검증 로직
```

---

## 예시 이슈

### 📝 메인 대시보드 컴포넌트 구현

### 📌 목적/배경

- 사용자가 로그인 후 가장 먼저 보게 되는 대시보드 화면 필요
- 주요 통계 정보와 최근 활동을 한눈에 볼 수 있는 UI 구현

### ✅ 할 일(Checklist)

- [ ] 대시보드 레이아웃 설계
- [ ] 통계 카드 컴포넌트 구현
- [ ] 차트/그래프 라이브러리 선택 및 적용
- [ ] 실시간 데이터 연동 준비
- [ ] 반응형 디자인 적용
- [ ] 단위 테스트 작성

### 🐞 관련 버그/참고 링크

- 차트 라이브러리 후보: Chart.js, Recharts, Victory
- 디자인 시스템: Material-UI 또는 Ant Design 검토 필요

### 💬 비고

- 우선순위: High
- 예상 소요시간: 3-4일
- 담당자: 개발팀
