# ClubVault Demo Script - 3 Minutes

- 작성일: 2026-03-09
- 목표 길이: `2분 40초 ~ 3분`
- 용도: DoraHacks 제출용 데모 영상

## 영상 목표

이 영상은 아래 4가지를 짧고 명확하게 보여주는 데 집중한다.

- 어떤 문제를 푸는지
- 실제로 동작하는지
- 왜 Polkadot Hub 위에서 만들었는지
- 지금 당장 제출 가능한 수준인지

## 영상 톤

- 말은 천천히
- 화면 전환은 적게
- 클릭은 확실하게
- “기술 설명”보다 “실사용 흐름” 위주

## 3분 버전 구조

### 0:00 - 0:18 Hook / Problem

화면:
- ClubVault Hero 화면
- 프로젝트 이름과 subtitle 노출

내레이션:
```text
Student teams still manage shared money with chats, screenshots, spreadsheets, and personal transfers.
That makes treasury decisions slow, messy, and hard to verify.
ClubVault fixes this with a simple shared treasury and proposal-based spending flow on Polkadot Hub.
```

자막 키워드:
- Shared treasury for student teams
- Proposal-based spending
- Built on Polkadot Hub TestNet

### 0:18 - 0:35 What ClubVault Is

화면:
- Vault Overview
- Proposals 섹션
- AI Proposal Draft 카드

내레이션:
```text
ClubVault is a lightweight treasury app for hackathon teams, student clubs, and study groups.
Members can deposit native assets, create spending proposals, approve them with a simple majority, and execute payouts transparently.
```

자막 키워드:
- Deposit
- Propose
- Approve
- Execute

### 0:35 - 0:55 Why Polkadot Hub

화면:
- 네트워크 배지
- contract address 또는 explorer 링크

내레이션:
```text
We built this on Polkadot Hub TestNet to keep a familiar Solidity workflow while targeting the Polkadot ecosystem.
That lets us ship an EVM-compatible user experience, but position the product directly in the Polkadot builder environment.
```

자막 키워드:
- Solidity workflow
- Polkadot ecosystem
- EVM-compatible UX

### 0:55 - 1:20 Vault Creation

화면:
- `Create vault` 폼
- 팀 이름 입력
- 멤버 주소 입력
- Create Vault 클릭

내레이션:
```text
First, we create a team vault.
The creator is automatically included as a member, and additional members can be added during setup.
This gives a team one shared treasury with a simple majority approval rule.
```

자막 키워드:
- Create team vault
- Members added at setup
- Majority approval

### 1:20 - 1:38 Deposit

화면:
- Deposit 입력
- Deposit 실행
- balance 변화 보여주기

내레이션:
```text
Next, a team member deposits funds into the vault.
The balance is visible immediately in the dashboard, so everyone can see the treasury state before any spending happens.
```

자막 키워드:
- Deposit native asset
- Shared balance visibility

### 1:38 - 2:02 AI Draft Helper

화면:
- AI Proposal Draft 입력
- Generate Draft
- Use Draft
- Proposal Composer에 값 채워진 것 보여주기

내레이션:
```text
We also added an AI draft helper.
This does not control funds and does not change the governance rules.
It only helps members turn a plain-language request into a cleaner proposal draft with a title, amount suggestion, and description.
```

자막 키워드:
- Offchain AI helper
- No autonomous spending
- Proposal drafting only

### 2:02 - 2:28 Proposal Creation

화면:
- recipient, amount, title, description 확인
- Create Proposal 클릭
- proposal list에 새 항목 노출

내레이션:
```text
After that, a member submits a spending proposal.
Each proposal includes a recipient, an amount, and a clear reason for the expense.
Everything is visible in the proposal list so the team can review it before approval.
```

자막 키워드:
- Recipient
- Amount
- Reason for spend

### 2:28 - 2:48 Approval and Execution

화면:
- Approve 클릭
- Ready to execute 상태 보여주기
- Execute 클릭
- Executed 상태 보여주기

내레이션:
```text
Once the proposal reaches a simple majority, it becomes executable.
That means the team cannot spend before approval, and once approval is reached, the payout can be executed transparently onchain.
```

자막 키워드:
- Majority approval
- Ready to execute
- Executed onchain

### 2:48 - 3:00 Closing

화면:
- 마지막으로 hero 또는 dashboard 전체
- GitHub repo
- deployed contract address

내레이션:
```text
ClubVault turns a messy team-money workflow into a simple onchain treasury loop.
It is live on Polkadot Hub TestNet, connected to a working frontend, and ready for hackathon submission.
```

자막 키워드:
- Live on Polkadot Hub TestNet
- Frontend connected
- Ready for submission

## 촬영 체크리스트

- 브라우저 창은 한 개만 사용
- wallet popup은 미리 위치 조정
- 확대율은 110% 안팎
- tx hash 또는 explorer link는 마지막에 한 번 보여주기
- 잘못된 네트워크 경고는 필요하면 짧게만 보여주고 오래 끌지 않기

## 꼭 보여줄 실제 값

- GitHub repo: `https://github.com/Meganpark980320/polkadot-hackathon`
- Contract: `0x3Dc5041c113844030162005a6827ad06308d2c66`
- Network: `Polkadot Hub TestNet`
- Demo vault: `Vault #1`

## 편집 원칙

- 장면 사이 컷은 최소화
- 자막은 문장 전체보다 키워드 위주
- BGM 넣더라도 작게
- 총 길이가 3분을 넘으면 `Why Polkadot Hub` 구간부터 줄인다

## 제안

첫 녹화는 이 3분 버전으로 찍고,
제출 직전에 `2분 20초` 정도의 압축 버전도 하나 더 만드는 게 안전하다.
