# Polkadot Solidity Hackathon 2026 로드맵

- 작성일: 2026-03-09
- 공식 페이지: https://polkadothackathon.com/
- 해커톤 성격: 완전 온라인 Web3 해커톤
- 총 상금 풀: `$30,000 USD`
- 핵심 일정
  - Registration Opens: `2026-02-16`
  - Hacking Period Starts: `2026-03-01`
  - Project Submission Deadline: `2026-03-20`
  - Demo Day: `2026-03-24`~`2026-03-25`

## 목표

남은 `11일` 안에 "제출 가능한 오픈소스 MVP"를 만들고, Demo Day 발표까지 버틸 수 있는 수준으로 정리한다.

전제:
- 온라인 참가
- 웹3 선호
- 학생/솔로 또는 2인 팀 기준
- 상위권을 노리되, 과도한 범위 확장은 금지

확정 프로젝트:
- `ClubVault`
- 포지션: `DeFi / Stablecoin-enabled dapps`
- 보조 확장: `AI-powered dapps`

## 점수 잘 받는 방향

공식 심사 기준:
- Technical implementation
- Use of Polkadot Hub features
- Innovation & impact
- UX and adoption potential
- Team execution and presentation

따라서 이번 해커톤은 "기술만 셈"이 아니라 아래 5개가 동시에 보여야 한다.

- 실제로 돌아가는 스마트컨트랙트
- Polkadot Hub 특성 사용 흔적
- 문제 정의가 명확한 앱 레이어 유스케이스
- 데모에서 바로 이해되는 UX
- 발표 자료와 데모 동선이 깔끔함

## 트랙 전략

기본 전략:
- 처음부터 어려운 인프라를 파지 말고, `Solidity + 단일 프론트엔드`로 끝나는 앱 레이어 MVP를 만든다.
- 아이디어는 공식 문구에 맞춰 `AI / DeFi / consumer products` 범위 안에서 고른다.

트랙 선택 원칙:
- 기본값: 일반 Solidity/EVM 스타일로 빠르게 만든다.
- 단, 아래 중 하나를 `2026-03-12` 안에 확실히 붙일 수 있으면 `PVM Smart Contracts` 트랙 쪽으로 기울여도 된다.
  - Polkadot native assets 사용
  - precompiles 사용
  - Solidity에서 Rust/C++ 라이브러리 호출

실전 권장:
- 시작 시점이 늦었으므로, `3월 12일`까지 PVM 특화 기능이 안 붙으면 욕심 버리고 MVP 제출에 집중한다.

## 확정 프로젝트안

`ClubVault`
- 동아리/스터디/학생팀용 공동지갑 + 지출 승인 dApp
- 핵심 흐름:
  - 그룹 생성
  - 멤버 예치
  - 지출 제안 생성
  - 과반 승인
  - 집행 및 히스토리 확인
- 왜 괜찮은가:
  - consumer + DeFi 중간지점이라 설명이 쉽다
  - 데모가 명확하다
  - 스마트컨트랙트 범위가 통제 가능하다
  - Polkadot native asset 연동이 되면 점수 어필이 좋다

MVP 범위:
- 컨트랙트 1~2개
- 프론트 4개 화면 이내
- 단일 happy path 데모 가능

절대 넣지 말 것:
- 자체 토큰 발행
- 쓸모 없는 DAO 거버넌스 확장
- 브리지/크로스체인 대공사
- AI 붙이기 위한 AI 기능

## 제출물 체크리스트

공식 제출 요구사항:
- 오픈소스 GitHub repository
- Project description
- Demo video `1~3분`
- Pitch deck: optional but recommended

추가로 반드시 준비:
- README
- 배포 링크 또는 로컬 실행 방법
- 아키텍처 다이어그램 1장
- Demo Day 발표용 5장 내외 슬라이드

주의:
- 온라인 해커톤이라도 `Demo Day 실시간 발표`를 해야 수상 자격이 있다.
- 카메라는 켜야 한다.

## 11일 실행 로드맵

### 2026-03-09

- 아이디어 확정
- 팀 여부 확정
- 리포지토리 생성
- 개발 스택 확정
  - Solidity
  - Frontend: React / Next.js
  - Wallet 연결
- MVP 문서 1장 작성
  - 문제
  - 사용자
  - 핵심 기능 3개
  - 데모 시나리오
- 성공 기준 정의
  - 컨트랙트 배포
  - 입금
  - 제안
  - 승인
  - 실행

### 2026-03-10

- 컨트랙트 설계
- 상태 변수, 이벤트, 권한 모델 고정
- 프론트 화면 와이어프레임 작성
- 이 날 끝까지 ABI가 흔들리면 안 된다

산출물:
- contract spec
- function list
- UI 흐름도

### 2026-03-11

- 핵심 컨트랙트 구현 완료
- 최소 테스트 작성
  - create
  - deposit
  - propose
  - approve
  - execute
- 실패 케이스 2~3개 추가

산출물:
- 로컬에서 happy path 통과

### 2026-03-12

- 프론트엔드 뼈대 완성
- 지갑 연결
- 컨트랙트 read/write 연결
- 이 시점에 `PVM 특화 기능` 가능성 판단

의사결정:
- 가능하면 Polkadot Hub native asset / precompile 연동
- 안 되면 즉시 범위 고정하고 일반 MVP 제출 모드 전환

### 2026-03-13

- end-to-end 연결 완성
- 사용자가 처음 들어와서:
  - 그룹 만들기
  - 예치하기
  - 제안 만들기
  - 승인/집행
  - 히스토리 확인
  까지 이어지는지 확인

산출물:
- 1분 안에 데모 가능한 흐름

### 2026-03-14

- UX 다듬기
- 로딩/에러/빈 상태 처리
- 네트워크 전환, 트랜잭션 상태 표시
- 심사 기준 중 `UX and adoption potential`에 대응하는 문구 작성

산출물:
- 클릭 순서만으로 설명 가능한 UI

### 2026-03-15

- README 작성 시작
- 아키텍처 다이어그램 1장 작성
- 왜 Polkadot Hub인지 설명 추가
- Hub feature 사용 포인트 문장화

산출물:
- README 초안
- pitch 핵심 문장 3개

### 2026-03-16

- 버그 수정
- 테스트 보강
- 배포 자동화 또는 배포 절차 정리
- demo seed data 준비

산출물:
- 재현 가능한 배포/실행 흐름

### 2026-03-17

- 기능 동결
- 새 기능 추가 금지
- 데모 비디오 스크립트 작성
- 5장짜리 pitch deck 초안 작성

슬라이드 추천 구조:
- Problem
- Solution
- Why Polkadot Hub
- Product demo
- Next steps

### 2026-03-18

- 데모 영상 1차 녹화
- 발표 리허설
- 멘토/친구에게 보여주고 피드백 받기
- 설명이 안 되는 화면/기능 제거

산출물:
- 1차 demo video
- deck v1

### 2026-03-19

- 최종 버그 배시
- README 마감
- 제출 설명문 최종 작성
- demo video 재녹화
- 제출용 스크린샷 정리

산출물:
- 제출 직전 패키지 완성

### 2026-03-20

- 오전에 최종 점검
- GitHub 공개 상태 확인
- 제출 폼 작성
- demo video 링크 확인
- 마감 몇 시간 전에 제출

최종 체크:
- repo 오픈소스 여부
- 설명문
- 1~3분 영상
- deck 링크
- 실행 방법

## Demo Day 준비

`2026-03-21`~`2026-03-23`

- 라이브 발표 리허설 3회
- 카메라/마이크/화면공유 점검
- 질문 대응 준비
  - 왜 이 문제를 골랐는가
  - 왜 Polkadot Hub인가
  - 실제 유저가 누구인가
  - 다음 단계는 무엇인가

`2026-03-24`~`2026-03-25`

- 데모는 실패 가능성을 전제로 준비
- 라이브 배포 의존도를 낮춘다
- 화면공유 중 사용할 백업:
  - 로컬 영상
  - 스크린샷
  - 시드 데이터

## 매일 해야 하는 것

- Git commit 남기기
- 현재 blocker 1개만 적기
- Discord/Telegram/office hours 확인
- 오늘 만든 것 30초 요약 작성

## 리스크 관리

- `3월 12일`까지 컨트랙트가 안정화되지 않으면 기능을 줄인다.
- `3월 15일`까지 end-to-end가 안 되면 PVM 욕심을 버린다.
- `3월 17일` 이후에는 기능 추가를 금지한다.
- 라이브 데모만 믿지 말고 녹화 영상과 정적 자료를 같이 준비한다.

## 공식 지원 채널

- 아이디어 찾기: https://build.openguild.wtf/explore-ideas?category=all
- 팀원 찾기: https://build.openguild.wtf/signin
- Builder Playbook: https://github.com/polkadot-developers/hackathon-guide/blob/master/polkadot-hub-devs.md
- Hackathon Resources: https://build.openguild.wtf/hackathon-resources
- Codecamp: https://codecamp.openguild.wtf/
- Discord: https://discord.gg/kHDZtykSx2

## 한줄 결론

이번 해커톤은 `큰 기술`보다 `작지만 끝까지 완성된 Web3 제품`이 유리하다. 지금 시점에서는 `작은 Solidity MVP + 명확한 데모 + Polkadot Hub 사용 이유` 조합으로 가는 게 가장 현실적이다.
