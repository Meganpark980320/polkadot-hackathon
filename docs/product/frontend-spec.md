# ClubVault Frontend Spec

- 작성일: 2026-03-09
- 기준 문서: [product-brief.md](./product-brief.md)
- 구현 경로: [../../clubvault/src/App.jsx](../../clubvault/src/App.jsx)

## 목표

해커톤 심사 기준에서 중요한 `UX and adoption potential`을 짧은 데모 안에 보여줄 수 있는 화면 구조를 만든다.

핵심 원칙:
- 한눈에 이해된다
- 클릭 수가 짧다
- 트랜잭션 상태가 보인다
- 학생 팀이 바로 쓸 수 있는 느낌이 난다

## 현재 상태

현재 프론트는 `live read/write가 연결된 MVP UI`까지 구현됐다.

이미 있는 것:
- 랜딩 헤더
- vault overview 카드
- AI proposal draft 카드
- proposal list 카드
- 지갑 연결
- 실제 컨트랙트 read
- 실제 컨트랙트 write
- form 상태
- transaction pending/success/error 처리

## 화면 구조

## 1. Hero / Landing

목적:
- 제품을 한 줄로 설명
- 지갑 연결 또는 금고 생성 액션 노출

필수 요소:
- 프로젝트명
- 한줄 설명
- `Create Vault`
- `Connect Wallet`

## 2. Vault Overview

목적:
- 사용자가 팀 자금 상태를 즉시 이해하게 함

필수 요소:
- vault 이름
- 잔액
- 멤버 수
- approval rule
- `Deposit`
- `New Proposal`

## 3. AI Proposal Draft

목적:
- AI 확장 포인트를 짧게 보여줌

필수 요소:
- 자연어 입력
- 생성된 title / description 초안
- `Use Draft`

원칙:
- AI는 제안 작성 보조만 한다
- AI가 트랜잭션을 직접 날리지는 않는다

## 4. Proposal List

목적:
- 현재 팀 자금 집행 의사결정 상태를 보여줌

필수 요소:
- title
- amount
- recipient
- proposer
- approval progress
- status
- `Approve`
- `Execute`

## 상태 모델

## 글로벌 상태

- walletAddress
- activeVaultId
- connected
- network
- txStatus

## vault 상태

- vaultName
- balance
- memberCount
- threshold
- members[]

## proposal 상태

- proposals[]
- selectedProposalId
- createProposalForm

## ai 상태

- prompt
- generatedTitle
- generatedDescription
- isGenerating

## 트랜잭션 UX 규칙

모든 write 액션은 아래 상태를 보여야 한다.

- idle
- awaiting wallet signature
- pending onchain
- success
- failed

심사에서는 이 부분이 중요하다.

이유:
- dApp다운 느낌이 난다
- 실제 사용성 인상이 달라진다
- 데모 중 사고가 나도 상태를 설명하기 쉽다

## 우선순위

## Priority 0

- wallet connect
- vault read
- deposit action
- create proposal action
- approve action
- execute action

현재 기준 `Priority 0`는 모두 구현됐다.

## Priority 1

- toast / inline status
- empty states
- basic validation

현재 기준:
- inline status 있음
- empty state 있음
- basic validation 있음
- last tx hash 노출 있음
- explorer tx link는 env 기반으로 연결 가능

## Priority 2

- AI proposal drafting
- category badges
- receipt link

현재 기준:
- AI proposal drafting 구현 완료
- category badges 미구현
- explorer tx link는 구현 완료
- receipt 상세 UI는 아직 없음

## 데모 동선

1. 지갑 연결
2. 금고 진입
3. 잔액 확인
4. 새 제안 생성
5. 승인
6. 실행
7. 목록에서 상태 갱신 확인
8. 선택적으로 AI draft 시연

## 디자인 방향

- polished fintech dashboard보다는 `sharp, lightweight web3 utility`에 가깝게 간다
- 과한 애니메이션보다 읽기 쉬운 레이아웃 우선
- 학생 팀/빌더 도구 느낌 유지

## 구현 메모

- 현재 빌드 기준 live UI까지 Vite 빌드 통과
- viem 기반 read/write client 연결 완료
- 남은 프론트 작업은 polish와 demo UX 압축 위주다
