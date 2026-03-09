# ClubVault Tasks

STATUS: IN PROGRESS

---

## Phase 1: 프로젝트 초기화 (3/9) - DONE

- [x] task-01: 모노레포 구조 생성 (`contracts/`, `test/`, `src/`, `scripts/`)
- [x] task-02: Hardhat 프로젝트 초기화 + hardhat-toolbox-mocha-ethers 설정
- [x] task-03: 프론트엔드 프로젝트 초기화 (React + Vite)
- [x] task-04: .gitignore 생성

## Phase 2: 컨트랙트 설계 (3/10) - DONE

- [x] task-05: ClubVault.sol 인터페이스 설계 (함수, 이벤트, 상태변수, 에러 정의 완료)
- [x] task-06: VaultFactory 대신 단일 컨트랙트에 vaultCount 기반 멀티 Vault 구조로 결정

## Phase 3: 컨트랙트 구현 (3/11) - DONE

- [x] task-07: ClubVault.sol 핵심 로직 구현 (create, deposit, propose, approve, execute, cancel)
- [x] task-08: VaultFactory 불필요 - ClubVault.sol이 자체적으로 멀티 Vault 지원
- [x] task-09: 테스트 작성 - happy path (test/ClubVault.js)
- [x] task-10: 테스트 작성 - 실패 케이스 (비멤버, 중복승인, 미달집행 등)

## Phase 4: 프론트엔드 뼈대 (3/12) - DONE

- [x] task-11: 단일 페이지 구조 (라우팅 없이 App.jsx에서 전체 플로우 처리)
- [x] task-12: 지갑 연결 구현 (MetaMask via window.ethereum)
- [x] task-13: 컨트랙트 ABI 연동 + viem 기반 read/write 클라이언트 (clubvaultClient.js)

## Phase 5: 프론트엔드 기능 연결 (3/13) - DONE

- [x] task-14: Vault 생성 폼 + createVault 트랜잭션 연결
- [x] task-15: 입금 UI + deposit 트랜잭션 연결
- [x] task-16: 제안 생성 폼 + createProposal 트랜잭션 연결
- [x] task-17: 제안 목록 + 승인 버튼 + approveProposal 연결
- [x] task-18: 집행 버튼 + executeProposal 연결 + 취소 기능 추가
- [x] task-19: E2E 플로우 연결 완료 (데모 모드 + 라이브 모드 분리)

## Phase 6: UX 다듬기 (3/14)

- [x] task-20: 트랜잭션 pending/success/error 상태 표시 (isSubmitting + statusText + lastTxHash)
- [x] task-21: 빈 상태 처리 (No proposals yet, No vault created yet)
- [x] task-22: 반응형 레이아웃 + 스타일링 보강 (styles.css 존재하지만 추가 다듬기 필요)
- [x] task-23: 네트워크 체크 (Polkadot Hub 테스트넷 아니면 경고 표시)

## Phase 7: 문서화 + 배포 준비 (3/15-16)

- [x] task-24: README.md 작성 완료 (구조, 플로우, 환경변수, 실행방법)
- [x] task-25: 아키텍처 다이어그램 1장 (mermaid 또는 이미지)
- [x] task-26: 배포 스크립트 작성 (scripts/deploy.js)
- [ ] task-27: Polkadot Hub 테스트넷 배포 + hardhat.config.js에 네트워크 설정 추가 + 배포 주소 README 기록
- [x] task-28: 데모용 시드 데이터 스크립트 (scripts/seedDemo.js)

## Phase 8: 기능 동결 + 제출 준비 (3/17-20)

- [x] task-29: 기능 동결 선언 (이후 버그 수정만)
- [x] task-30: 데모 영상 스크립트 작성 (1-3분)
- [x] task-31: pitch deck 5장 작성 (Problem / Solution / Why Polkadot Hub / Demo / Next Steps)
- [x] task-32: 최종 버그 수정
- [x] task-33: 제출용 프로젝트 설명문 작성
- [ ] task-34: GitHub repo 공개 상태 확인 + 제출

---

## Blockers

- `@parity/hardhat-polkadot@0.2.7` 는 Hardhat `^2.26.0`을 요구하지만 현재 프로젝트는 Hardhat 3 기반이다. PolkaVM/resolc 전환 전에 툴체인 마이그레이션이 필요하다.
- Polkadot Hub TestNet 공개 배포는 PAS가 들어 있는 `PRIVATE_KEY`가 현재 환경에 없어 수행 불가하다.
- GitHub 저장소는 공개 상태로 확인됐고 코드 업로드도 완료했다. 남은 것은 해커톤 제출 포털 제출이다.
- 새 deployer 주소는 생성했지만 faucet가 Google reCAPTCHA를 요구해서 이 환경에서 자동 PAS 수령은 불가하다.
- 제출 포털 접근 정보가 없어 최종 제출은 현재 환경에서 수행 불가하다.
