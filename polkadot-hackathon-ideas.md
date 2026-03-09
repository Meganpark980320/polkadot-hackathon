# Polkadot Hackathon 아이디어 정리

- 작성일: 2026-03-09
- 대상 해커톤: Polkadot Solidity Hackathon 2026
- 관련 문서: [polkadot-solidity-roadmap.md](./polkadot-solidity-roadmap.md)

## 확정안

이번 해커톤 제출 주제는 아래로 고정한다.

- 프로젝트명: `ClubVault`
- 제출 포지션: `DeFi / Stablecoin-enabled dapps`
- 보조 포지션: `AI-powered dapps` 확장 가능
- 전략: `공동지갑 MVP 먼저 완성 -> AI 보조 기능은 오프체인으로 최소 추가`

## 원칙

이번 해커톤 아이디어는 아래 기준으로 고른다.

- `11일` 안에 MVP 제출 가능해야 함
- Solidity + 프론트엔드만으로 데모 가능해야 함
- 문제 설명이 쉬워야 함
- Demo Day에서 1분 안에 이해시킬 수 있어야 함
- 가능하면 Polkadot Hub 특성을 붙일 여지가 있어야 함

## 추천 1순위: ClubVault

## 한줄 설명

학생팀, 동아리, 스터디, 해커톤 팀을 위한 공동지갑 + 승인형 지출 관리 dApp

## 문제

소규모 팀 돈 관리는 아직 카톡, 엑셀, 계좌이체, 총무 수기 정산에 의존한다.

문제점:
- 누가 얼마나 냈는지 추적이 어렵다
- 공동 자금 집행 과정이 불투명하다
- 한 사람이 돈을 들고 있으면 신뢰 비용이 생긴다

## 해결

팀별 공동지갑을 만들고, 지출은 제안 후 팀 승인으로 집행한다.

핵심 흐름:
- 팀 생성
- 멤버 입금
- 지출 제안 생성
- 과반 승인
- 자동 집행
- 히스토리 조회

## 왜 굳이 웹3인가

ClubVault는 그냥 가계부 앱이 아니라, "공동 자금"을 신뢰 없이 다루는 도구라는 점이 핵심이다.

웹3로 가는 이유:
- 공동 자금이 특정 개인 계좌에 묶이지 않는다
- 승인 규칙이 코드로 고정된다
- 집행 히스토리가 남는다
- 소규모 팀이 멀티시그/공동지갑 UX를 쉽게 쓸 수 있다

즉, 핵심 가치는 "회계 편의"보다 "공동 자금의 신뢰 최소화"에 있다.

## 왜 좋은가

- consumer + DeFi 성격이 섞여 있어서 설명이 쉽다
- 문제와 해결 구조가 직관적이다
- 데모가 명확하다
- 컨트랙트 범위가 작다
- 추후 Polkadot native asset 지원을 붙이기 좋다

## MVP 범위

- 컨트랙트
  - VaultFactory 또는 단일 Vault
  - 멤버 관리
  - deposit
  - createProposal
  - approveProposal
  - executeProposal
- 프론트
  - 팀 생성 화면
  - 팀 상세/잔액 화면
  - 제안 목록 화면
  - 제안 생성 모달

## 버전 컷라인

### v0 제출 최소선

- 팀 생성
- 멤버 입금
- 지출 제안 생성
- 과반 승인
- 집행
- 히스토리 표시

### v1 있으면 좋은 것

- 지출 카테고리
- 제안 메모/영수증 링크
- pending / executed / rejected 상태 구분
- 팀 타입 preset

### stretch goal

- AI 보조 기능
- Polkadot Hub 특화 기능
- 크로스체인 확장

원칙:
- `v0`가 끝나기 전에는 `v1`이나 stretch를 건드리지 않는다.

## 데모 시나리오

- Alice가 팀 생성
- Bob, Carol이 자금 입금
- Alice가 "행사 간식비" 지출 제안 생성
- Bob이 승인
- 과반 달성 후 집행
- 히스토리와 잔액 갱신 확인

## 심사 기준 대응

- Technical implementation: 승인/집행 로직과 테스트
- Use of Polkadot Hub features: native asset 또는 관련 기능 연동 여지
- Innovation & impact: 현실적인 팀 자금 관리 문제 해결
- UX and adoption potential: 이해하기 쉬운 flow
- Team execution and presentation: 데모 구조가 깔끔함

## 카테고리 매핑

공식 페이지 기준 EVM Smart Contract 카테고리는 아래 두 갈래다.

- `DeFi / Stablecoin-enabled dapps`
- `AI-powered dapps`

ClubVault는 기본적으로 `DeFi / Stablecoin-enabled dapps`에 자연스럽게 맞는다.

여기에 AI 보조 기능을 오프체인으로만 얹으면 `AI-powered dapps` 스토리도 가져갈 수 있다. 다만 제출 우선순위는 항상 `DeFi MVP 완성`이 먼저다.

## 리스크

- 차별성이 약할 수 있음
- 너무 단순하면 "멀티시그 지갑 클론"처럼 보일 수 있음

## 차별화 포인트

- 학생/소규모 팀용으로 UX 단순화
- 사용 목적 preset
  - 동아리
  - 스터디
  - 해커톤 팀
- 지출 카테고리와 집행 사유 메타데이터 제공

## AI 기능 확장 (AI-powered dApps 카테고리 대응)

해커톤에 "AI-powered dApps" 카테고리가 명시적으로 있다. ClubVault에 AI를 얹으면 두 카테고리를 동시에 커버할 수 있다.

추가 가능한 AI 기능:
- **지출 이상 탐지**: 과거 패턴 대비 비정상 지출 제안을 자동 플래그
- **예산 추천**: 팀 규모, 활동 유형 기반으로 카테고리별 예산 배분 추천
- **자연어 제안 생성**: "간식비 3만원 써도 될까?" → 자동으로 제안 폼 채워주기
- **정산 요약 리포트**: 월간/주간 자금 흐름을 자연어로 요약

구현 방식:
- 온체인: 컨트랙트는 그대로 유지 (복잡도 안 올림)
- 오프체인: 프론트엔드에서 AI API 호출 → 온체인 데이터 읽어서 분석
- Polkadot Agent Kit 활용 가능성 확인 필요

이렇게 하면 심사에서 "DeFi dApp이면서 AI-powered"로 어필 가능.

AI 확장 원칙:
- AI가 없어도 제품이 성립해야 한다
- AI는 "도우미" 역할만 한다
- 트랜잭션 실행은 최종적으로 사용자 승인 아래 있어야 한다
- AI 때문에 컨트랙트 구조를 바꾸지 않는다

## Polkadot Hub 특화 기능 활용

이번 해커톤에서 Polkadot Hub 고유 기능을 쓰면 가산점 가능성이 높다.

발표에서 사용할 수 있는 방향:
- **DOT 또는 Hub 자산 지원**: 가장 현실적인 체인 특화 포인트
- **Polkadot native assets / precompiles / Hub 기능**: 붙일 수 있으면 강한 어필 포인트
- **XCM / Hyperbridge / Agent Kit**: 당장 MVP 필수 요소가 아니라, 확장 로드맵으로 언급하는 편이 안전하다

실전 권장:
- MVP에서는 `Hub 위에서 실제로 잘 도는 공동지갑`을 먼저 보여준다
- Polkadot 특화 기능은 하나만 확실히 잡는다
- 나머지는 "다음 단계" 슬라이드로 넘긴다

## 공식 자료 기준 툴링 메모

공식 Builder Guide / Codecamp 자료에서 바로 보이는 안전한 출발점:
- Hardhat
- Foundry
- create-dot-app
- Scaffold-DOT

운영 원칙:
- 처음엔 공식 가이드에 있는 툴링만 쓴다
- 특수 컴파일러나 실험적 기능은 문서 확인 뒤 붙인다
- 기존 멀티시그 레포 복붙 대신, 직접 최소 구현으로 가져간다
- 가스/자산 단위와 네트워크 설정은 실제 테스트넷 기준으로 마지막에 재검증한다

## 내가 보기에 더 보강하면 좋은 점

- `누가 돈을 제안할 수 있는가`를 명확히 적기
  - 모든 멤버 가능 / 관리자만 가능
- `승인 기준`을 명확히 적기
  - 과반 / 만장일치 / 커스텀 threshold
- `집행 한도`를 적기
  - 예: 소액은 즉시, 고액은 더 많은 승인
- `왜 기존 멀티시그보다 쉬운가`를 한 문장으로 적기
- 발표용 한줄 가치 제안을 문서 상단에 따로 두기

추천 한줄:
- `ClubVault is a lightweight shared treasury for student teams, with proposal-based spending and transparent execution on Polkadot Hub.`

## 추천 2순위: DormSplit

## 한줄 설명

룸메이트/학생 하우스용 비용 분담 및 정산 dApp

## 문제

월세, 공과금, 장보기, 생활비 정산이 매번 메시지와 수기로 처리된다.

## 해결

공동 비용을 등록하고 각자 납부 상태를 추적하는 정산 앱을 만든다.

핵심 기능:
- 비용 항목 생성
- 참여자 지정
- 각자 납부
- 미납 현황 표시
- 정산 완료 상태 표시

## 장점

- 학생 대상이라 페르소나가 명확하다
- consumer angle이 강하다
- UI 중심 데모가 가능하다

## 단점

- 온체인화 이유가 약해질 수 있다
- "왜 일반 앱이 아니라 웹3인가"를 설명해야 한다

## 추천 여부

괜찮지만, 웹3 명분은 `ClubVault`보다 약하다.

## 추천 3순위: GrantBox

## 한줄 설명

학생 프로젝트/소규모 팀용 milestone escrow dApp

## 문제

작은 프로젝트 지원금이나 팀 예산은 중간 단계 검증 없이 한 번에 지급되는 경우가 많다.

## 해결

마일스톤 단위로 자금을 락업하고, 팀이 목표 달성 시 다음 금액이 풀리도록 만든다.

핵심 기능:
- milestone 생성
- 자금 예치
- milestone 승인
- 단계별 집행

## 장점

- 웹3다운 느낌이 강하다
- grant, bounty, mini accelerator 같은 확장 서사가 가능하다

## 단점

- 승인 주체 설계가 애매하면 복잡해진다
- ClubVault보다 설명이 한 단계 더 어렵다
- 발표에서 "실제 누구 문제냐"를 더 잘 잡아야 한다

## 추천 여부

야심차고 좋지만, 지금 일정에는 약간 무겁다.

## 추천 4순위: AI Treasury Copilot

## 한줄 설명

AI가 팀 재무를 분석하고 온체인 액션까지 실행하는 DeFi 코파일럿

## 문제

소규모 DAO나 팀의 트레저리 관리는 수동이고, 최적 타이밍에 자금을 운용하지 못한다.

## 해결

AI 에이전트가 온체인 데이터를 읽고, 예산 분석/이상 탐지/리밸런싱 제안을 하며, 승인 시 직접 트랜잭션을 실행한다.

핵심 기능:
- 트레저리 현황 대시보드
- AI 기반 지출 분석 및 이상 탐지
- 자동 리밸런싱 제안 → 멀티시그 승인 → 실행
- 자연어로 트레저리 질의 ("이번 달 가장 큰 지출은?")

## 장점

- AI-powered dApps 카테고리에 정확히 맞음
- Polkadot Agent Kit 활용으로 Polkadot Hub 특화 어필
- 트렌디함 (AI + DeFi)

## 단점

- AI 부분 구현 범위 조절을 잘해야 함
- 10일 안에 AI까지 완성도 있게 하려면 빡빡함
- 온체인 데이터가 테스트넷에서는 빈약할 수 있음

## 추천 여부

AI 카테고리를 노리고 싶으면 단독으로 가도 되지만, ClubVault + AI 확장이 더 안전하다.

---

## 최종 추천

현재 시점 기준 최종 추천이자 실제 선정안은 `ClubVault + AI 확장`이다.

## 이유

- 11일 안에 끝낼 확률이 가장 높다
- 스마트컨트랙트 구조가 단순하다
- 온라인 발표에서 데모 전달력이 좋다
- 학생 팀/동아리라는 사용자 서사가 바로 잡힌다
- AI 기능을 얹으면 DeFi + AI 두 카테고리 동시 커버
- Polkadot Hub DOT native asset 활용으로 체인 특화 어필 가능

## 선택 기준 한줄

- 빨리 끝내고 싶으면 `ClubVault`
- ClubVault + AI로 두 카테고리 커버하면 `ClubVault + AI 확장` (추천)
- 생활형 소비자 앱이면 `DormSplit`
- 좀 더 웹3 냄새 강하게 가려면 `GrantBox`
- AI 올인하려면 `AI Treasury Copilot`

## 다음 액션

아이디어를 `ClubVault`로 확정하면 바로 이어서 아래 문서를 만든다.

- 1페이지 제품 기획서
- 스마트컨트랙트 기능 명세
- 화면 목록
- 제출용 데모 시나리오
