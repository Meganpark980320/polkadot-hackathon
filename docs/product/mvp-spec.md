# ClubVault MVP 명세

- 작성일: 2026-03-09
- 기준 문서: [product-brief.md](./product-brief.md)

## 목표

해커톤 제출용으로 `작지만 완결된 공동지갑`을 만든다.

이번 MVP는 아래 질문에 "예"라고 답하면 성공이다.

- 팀을 만들 수 있는가
- 여러 멤버가 돈을 넣을 수 있는가
- 지출 제안을 만들 수 있는가
- 팀 승인 후 돈을 집행할 수 있는가
- 모든 흐름이 프론트에서 보이는가

## 제품 규칙

- 팀 단위로 하나의 금고를 가진다
- 멤버는 입금할 수 있다
- 멤버는 지출 제안을 만들 수 있다
- 멤버는 제안을 승인할 수 있다
- 승인 기준은 `과반`
- 과반이 되면 `즉시 실행 가능`
- 동일 멤버는 같은 제안을 중복 승인할 수 없다

## 범위

### 반드시 구현

- Vault 생성
- 멤버 목록 보관
- 금고 잔액 표시
- 입금
- 제안 생성
- 제안 승인
- 제안 집행
- 제안 목록 / 상태 표시

### 있으면 좋음

- 지출 카테고리
- 메모
- 영수증 URL
- 팀 타입 preset
- 제안 취소

### 이번 제출에서 제외

- 역할 기반 권한 체계
- 커스텀 threshold
- 타임락
- 구독 결제
- 크로스체인 브리지
- 자체 토큰
- 복잡한 DAO 거버넌스

## 스마트컨트랙트 설계

## 옵션

- 옵션 A: `VaultFactory + Vault`
- 옵션 B: 단일 `ClubVaultFactory`가 모든 상태 관리

해커톤 기준 권장:
- 옵션 B부터 시작
- 이유: 배포/연결/UI 복잡도가 낮다

## 최소 데이터 모델

### Vault

- `vaultId`
- `name`
- `members[]`
- `memberExists[address]`
- `approvalThreshold`
- `balance`

### Proposal

- `proposalId`
- `vaultId`
- `proposer`
- `recipient`
- `amount`
- `title`
- `description`
- `status`
- `approvalCount`
- `createdAt`
- `executedAt`
- `approvals[address]`

### ProposalStatus

- `Pending`
- `Executed`
- `Cancelled`

`Rejected`는 이번 MVP에서는 굳이 온체인 상태로 안 넣어도 된다. 데모 복잡도만 오른다.

## 컨트랙트 함수 초안

### Vault 관련

- `createVault(string name, address[] members)`
- `getVault(uint256 vaultId)`
- `getVaultMembers(uint256 vaultId)`

### 자금 관련

- `deposit(uint256 vaultId)` payable

### 제안 관련

- `createProposal(uint256 vaultId, address recipient, uint256 amount, string title, string description)`
- `approveProposal(uint256 proposalId)`
- `executeProposal(uint256 proposalId)`
- `cancelProposal(uint256 proposalId)`
- `getProposal(uint256 proposalId)`
- `getVaultProposalIds(uint256 vaultId)`

## 이벤트

- `VaultCreated`
- `Deposited`
- `ProposalCreated`
- `ProposalApproved`
- `ProposalExecuted`

이벤트는 프론트 상태 동기화와 데모 설명에 중요하므로 반드시 넣는다.

## 기본 검증 규칙

- 멤버만 제안 가능
- 멤버만 승인 가능
- 제안 금액은 금고 잔액 이하
- recipient는 zero address 불가
- 이미 실행된 제안은 재승인/재실행 불가
- 제안자는 자기 제안을 승인 가능하게 둘지 결정 필요

권장:
- 제안자도 승인 가능
- 이유: MVP 흐름이 단순해지고 과반 계산이 쉬워진다

## 프론트엔드 화면

## 1. 랜딩 / Vault 생성

- 제품 설명
- vault 이름 입력
- 멤버 주소 입력
- 생성 버튼

## 2. Vault 대시보드

- 금고 이름
- 현재 잔액
- 멤버 수
- 입금 버튼
- 새 제안 버튼

## 3. Proposal 리스트

- title
- amount
- proposer
- status
- approval progress

## 4. Proposal 상세 / 액션

- description
- recipient
- amount
- approval count
- approve 버튼
- execute 버튼

## UX 원칙

- 지갑 연결 후 바로 핵심 액션이 보여야 한다
- 화면은 4개를 넘기지 않는다
- 트랜잭션 상태를 반드시 보여준다
- 에러 메시지는 사람이 읽을 수 있게 쓴다

## AI 기능 명세

이번 해커톤 기준 AI는 `보조 기능 1개`만 넣는다.

권장 기능:
- 자연어 제안 생성

예:
- 입력: "스터디 간식비로 30 DOT 지출 제안 만들기"
- 출력:
  - title
  - description
  - amount suggestion

주의:
- AI가 recipient나 amount를 확정하지 않는다
- 최종 제출은 사용자가 직접 확인한다

## 테스트 최소 세트

- vault 생성 성공
- 멤버가 입금 가능
- 비멤버 제안 실패
- 멤버 제안 성공
- 중복 승인 실패
- 과반 전 실행 실패
- 과반 후 실행 성공
- 실행 후 재실행 실패

## README 포함 항목

- 문제 정의
- 왜 Polkadot Hub인가
- 기능 요약
- 아키텍처
- 로컬 실행법
- 배포 네트워크
- 데모 흐름

## 제출 패키지 체크리스트

- 공개 GitHub repo
- 컨트랙트 코드
- 테스트 코드
- 프론트 코드
- README
- 데모 영상 1~3분
- 발표 자료

## 구현 우선순위

### Priority 0

- 컨트랙트 happy path
- 프론트 연결

### Priority 1

- UX 정리
- README
- 데모 스크립트

### Priority 2

- AI 보조 기능
- Polkadot Hub 특화 기능 1개

## 비고

이 MVP는 "최강 treasury protocol"이 아니라 "학생 팀이 바로 쓸 수 있는 가장 쉬운 공동지갑"으로 보여야 한다. 복잡한 기능보다 짧고 확실한 데모가 더 중요하다.
