# ClubVault Test Plan

- 작성일: 2026-03-09
- 대상 파일: [clubvault/contracts/ClubVault.sol](./clubvault/contracts/ClubVault.sol)

## 목표

컨트랙트가 데모 기준 happy path와 핵심 실패 케이스를 모두 커버하는지 검증한다.

## 테스트 범위

- Vault 생성
- 멤버 권한
- 입금
- 제안 생성
- 승인
- 집행
- 취소

## 시나리오 세트

## A. Vault 생성

### A1. 생성자만으로 vault 생성 가능

- 입력: 빈 멤버 배열
- 기대:
  - vault 생성 성공
  - creator가 멤버로 들어감
  - threshold = 1

### A2. 중복 멤버 포함 시 실패

- 입력: 같은 주소 2번
- 기대:
  - revert `DuplicateMember`

### A3. zero address 포함 시 실패

- 입력: `address(0)`
- 기대:
  - revert `InvalidMember`

## B. Deposit

### B1. 멤버 입금 성공

- 기대:
  - vault balance 증가
  - `Deposited` 이벤트 발생

### B2. 비멤버 입금 실패

- 기대:
  - revert `NotVaultMember`

### B3. 0 금액 입금 실패

- 기대:
  - revert `InvalidAmount`

## C. Proposal 생성

### C1. 멤버 제안 생성 성공

- 기대:
  - proposal 저장
  - status = Pending
  - proposal list에 포함

### C2. 비멤버 제안 실패

- 기대:
  - revert `NotVaultMember`

### C3. 잔액 초과 제안 실패

- 기대:
  - revert `InsufficientVaultBalance`

### C4. recipient zero address 실패

- 기대:
  - revert `InvalidRecipient`

## D. Approval

### D1. 멤버 승인 성공

- 기대:
  - approvalCount 증가
  - `hasApprovedProposal` = true

### D2. 같은 멤버 중복 승인 실패

- 기대:
  - revert `AlreadyApproved`

### D3. 비멤버 승인 실패

- 기대:
  - revert `NotVaultMember`

### D4. 취소된 proposal 승인 실패

- 기대:
  - revert `ProposalNotPending`

## E. Execute

### E1. threshold 미달 실행 실패

- 기대:
  - revert `InsufficientApprovals`

### E2. threshold 충족 후 실행 성공

- 기대:
  - vault balance 감소
  - recipient 잔액 증가
  - status = Executed
  - executedAt 설정

### E3. 실행 후 재실행 실패

- 기대:
  - revert `ProposalNotPending`

## F. Cancel

### F1. proposer가 취소 성공

- 기대:
  - status = Cancelled
  - `ProposalCancelled` 이벤트 발생

### F2. proposer가 아닌 멤버 취소 실패

- 기대:
  - revert `NotProposer`

### F3. 실행된 proposal 취소 실패

- 기대:
  - revert `ProposalNotPending`

## G. Getter

### G1. getVault 반환값 확인

- 기대:
  - name
  - threshold
  - memberCount
  - balance

### G2. getVaultMembers 반환값 확인

- 기대:
  - 생성 시 등록한 멤버 배열 반환

### G3. getVaultProposalIds 반환값 확인

- 기대:
  - 해당 vault proposal IDs 순서대로 반환

## 최소 데모 커버 세트

시간이 없으면 아래만 먼저 친다.

- A1
- B1
- C1
- D1
- E1
- E2
- F1

## 테스트 작성 우선순위

### Priority 0

- happy path
- member-only restriction
- duplicate approval 방지
- threshold 검증

### Priority 1

- cancel 흐름
- getter 정확성

### Priority 2

- edge case
- fuzz / invariant 스타일 테스트

## 비고

이번 해커톤에서 중요한 건 완벽한 formal verification이 아니라, `실패하면 바로 보이는 핵심 케이스`를 확실히 잡는 것이다. 테스트는 짧더라도 흐름이 분명해야 한다.
