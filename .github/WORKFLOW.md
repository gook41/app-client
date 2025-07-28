# 🔀 Git Workflow Guide

## 브랜치 전략

```
main (프로덕션)
├── dev (개발)
    ├── feature/login-api-integration
    ├── feature/inventory-management  
    ├── feature/dashboard-charts
    └── hotfix/critical-bug-fix
```

## 📋 개발 워크플로우

### 1. 새 기능 개발 시작
```bash
# dev 브랜치에서 시작
git checkout dev
git pull origin dev

# 새 기능 브랜치 생성
git checkout -b feature/기능명
```

### 2. 개발 중
```bash
# 작업 완료 후 커밋
git add .
git commit -m "feat: 기능 설명"

# 원격에 푸시
git push origin feature/기능명
```

### 3. 기능 완료 후
```bash
# Pull Request 생성 (feature/기능명 → dev)
# GitHub에서 PR 생성 및 리뷰
# 승인 후 dev에 Merge

# 로컬에서 dev 업데이트
git checkout dev
git pull origin dev
git branch -d feature/기능명  # 완료된 브랜치 삭제
```

### 4. 릴리즈 준비
```bash
# dev → main 으로 PR 생성
# 테스트 완료 후 main에 Merge
```

## 🏷️ 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드, 설정 변경

예시:
feat: 재고 목록 조회 API 연동
fix: 로그인 토큰 만료 처리 오류
docs: README에 API 연동 가이드 추가
```

## 🔄 브랜치 명명 규칙

```
feature/기능명        # 새 기능
bugfix/버그명         # 버그 수정
hotfix/긴급수정명     # 핫픽스
chore/작업명          # 설정, 빌드 관련
```

## 📝 Pull Request 템플릿

### PR 제목
```
[기능] 재고 관리 화면 구현
```

### PR 설명
```markdown
## 🎯 구현 내용
- 재고 목록 조회 화면
- 재고 등록/수정/삭제 기능
- 저재고 알림 표시

## ✅ 체크리스트  
- [ ] 기능 동작 테스트 완료
- [ ] 에러 처리 구현
- [ ] 반응형 디자인 적용
- [ ] 코드 리뷰 완료

## 📸 스크린샷
(화면 캡처 첨부)

## 🔗 관련 이슈
Closes #123
```
