# OAuth 인증 설정 가이드

## 🔧 Google Cloud Console 설정

### 1. OAuth 클라이언트 생성

- **승인된 JavaScript 원본**: `http://localhost:3000`
- **승인된 리디렉션 URI**: `http://localhost:3000/auth/callback`

# OAuth 인증 설정 가이드 (Google, Naver, Kakao)

## 🔧 각 플랫폼별 설정

### 1. Google Cloud Console

- **승인된 JavaScript 원본**: `http://localhost:3000`
- **승인된 리디렉션 URI**: `http://localhost:3000/auth/callback`

### 2. Naver Developers

- **서비스 URL**: `http://localhost:3000`
- **Callback URL**: `http://localhost:3000/auth/callback`

### 3. Kakao Developers

- **사이트 도메인**: `http://localhost:3000`
- **Redirect URI**: `http://localhost:3000/auth/callback`

## 🔧 스프링 백엔드 설정

```yaml
# application.yml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            scope:
              - email
              - profile
          naver:
            client-id: ${NAVER_CLIENT_ID}
            client-secret: ${NAVER_CLIENT_SECRET}
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            authorization-grant-type: authorization_code
            scope:
              - name
              - email
          kakao:
            client-id: ${KAKAO_CLIENT_ID}
            client-secret: ${KAKAO_CLIENT_SECRET}
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            authorization-grant-type: authorization_code
            scope:
              - profile_nickname
              - account_email
        provider:
          google:
            authorization-uri: https://accounts.google.com/o/oauth2/auth
            token-uri: https://oauth2.googleapis.com/token
            user-info-uri: https://www.googleapis.com/oauth2/v2/userinfo
          naver:
            authorization-uri: https://nid.naver.com/oauth2.0/authorize
            token-uri: https://nid.naver.com/oauth2.0/token
            user-info-uri: https://openapi.naver.com/v1/nid/me
            user-name-attribute: response
          kakao:
            authorization-uri: https://kauth.kakao.com/oauth/authorize
            token-uri: https://kauth.kakao.com/oauth/token
            user-info-uri: https://kapi.kakao.com/v2/user/me
            user-name-attribute: id

# OAuth 성공 후 프론트엔드 리다이렉션 URL
app:
  oauth2:
    authorized-redirect-uris:
      - http://localhost:3000/auth/callback
```

## 🔄 OAuth 플로우

1. **사용자**: 구글/네이버/카카오 로그인 버튼 클릭
2. **프론트**: `http://localhost:8080/oauth2/authorization/{provider}`로 리다이렉션
3. **스프링**: 각 플랫폼 OAuth 처리 후 JWT 생성
4. **스프링**: `http://localhost:3000/auth/callback?token=JWT_TOKEN`로 리다이렉션
5. **프론트**: JWT 토큰 저장 후 대시보드로 이동

## 📁 생성된 파일들

- ✅ `src/components/auth/OAuthButton.tsx` - 범용 OAuth 버튼 컴포넌트 (Google, Naver, Kakao)
- ✅ `src/pages/auth/callback.tsx` - OAuth 콜백 처리 페이지
- ✅ `src/pages/login.tsx` - 3개 플랫폼 로그인 버튼 추가
- ✅ `src/pages/signup.tsx` - 3개 플랫폼 회원가입 버튼 추가

## 🎯 다음 단계

1. **각 플랫폼 OAuth 앱 등록** (Google, Naver, Kakao)
2. **스프링 OAuth 설정** 3개 플랫폼 모두 추가
3. **JWT ↔ 세션 연동** 테스트
4. **에러 처리** 개선 (권한 거부, 네트워크 오류 등)
5. **로그아웃 기능** OAuth 토큰 무효화 추가

## 🎨 UI 특징

- **Google**: 화이트 배경, 구글 브랜드 컬러
- **Naver**: 네이버 그린 (#03C75A) 배경
- **Kakao**: 카카오 옐로우 (#FEE500) 배경
- **일관된 UX**: 동일한 크기와 간격으로 통일감 있는 디자인
