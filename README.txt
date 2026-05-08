
# 환자확인 모니터링 시스템

## 기능
- 여러 사용자 동시 사용
- Firebase 실시간 DB
- 관리자 통계
- 관리자 전용 초기화
- 직군별 차트
- 장소별 차트
- 부정확 사유 분석
- 모바일 대응

## 설치

### 1. 패키지 설치
npm install

### 2. Firebase 프로젝트 생성
https://console.firebase.google.com

### 3. Firestore Database 활성화

### 4. Authentication 활성화
- 이메일 로그인 사용

### 5. src/firebase.js 수정

firebaseConfig 입력

### 6. 실행
npm run dev

## 배포 추천
- Vercel
- Netlify

## 관리자 기능
현재 예시는 버튼으로 관리자 모드 전환.
실제 운영 시:
- 관리자 이메일 체크
- role 기반 권한
- Firebase Rules 적용 추천

## 추천 추가 기능
- PDF 내보내기
- Excel 다운로드
- 날짜 필터
- 분기별 리포트
- 병원 로고
- QR 접속
