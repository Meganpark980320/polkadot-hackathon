# ClubVault Build Log

## 2026-03-09

### 오늘 확정한 것

- 제출 프로젝트: `ClubVault`
- 제출 포지션: `DeFi / Stablecoin-enabled dapps`
- 보조 포지션: `AI-powered dapps`
- MVP 원칙:
  - 공동지갑 핵심 흐름 먼저
  - AI는 오프체인 보조 기능으로만
  - Polkadot Hub 특화 포인트는 1개만 확실히

### 오늘 만든 파일

- [../research/polkadot-hackathon-ideas.md](../research/polkadot-hackathon-ideas.md)
- [../research/polkadot-solidity-roadmap.md](../research/polkadot-solidity-roadmap.md)
- [../product/product-brief.md](../product/product-brief.md)
- [../product/mvp-spec.md](../product/mvp-spec.md)
- [contract-review.md](./contract-review.md)
- [test-plan.md](./test-plan.md)
- [../product/frontend-spec.md](../product/frontend-spec.md)
- [../submission/demo-script.md](../submission/demo-script.md)
- [../submission/deploy-notes.md](../submission/deploy-notes.md)
- [../../clubvault/README.md](../../clubvault/README.md)
- [../../clubvault/contracts/ClubVault.sol](../../clubvault/contracts/ClubVault.sol)
- [../../clubvault/scripts/deploy.js](../../clubvault/scripts/deploy.js)
- [../../clubvault/scripts/seedDemo.js](../../clubvault/scripts/seedDemo.js)

### 현재 상태

- 아이디어 확정 완료
- 제품 정의 완료
- MVP 범위 확정 완료
- Solidity 컨트랙트 구현 완료
- 컨트랙트 리뷰 문서 작성 완료
- 테스트 계획 문서 작성 완료
- 로컬 Node 툴체인 설치 완료
- Hardhat compile 통과
- Hardhat test 통과
- Vite build 통과
- 프론트엔드 live read 연결 완료
- 프론트엔드 live write 연결 완료
- 지갑 연결 / vault 생성 / 입금 / 제안 생성 / 승인 / 실행 / 취소 UI 연결 완료
- AI draft에서 proposal form으로 값 넘기는 흐름 추가
- 배포 스크립트 추가 및 실행 확인
- demo seed 스크립트 추가 및 실행 확인
- last tx hash / explorer link UI 추가

### 지금 보이는 리스크

- Polkadot Hub 특화 기능은 아직 코드에 반영되지 않음
- 실제 배포 주소와 RPC를 아직 최종 고정하지 않음
- explorer 링크와 receipt UX는 아직 없음
- 다중 vault 탐색 UX는 아직 최소 수준

### 다음 순서

1. 최종 배포 네트워크 결정 및 실제 컨트랙트 배포
2. 제출용 데모 데이터 1세트 미리 준비
3. explorer link / tx receipt 노출 추가
4. README와 데모 스크립트 더 압축

### 내가 다음 턴에 바로 할 것

- 배포 스크립트 또는 네트워크 설정 추가
- 데모 영상용 runbook과 발표 포인트 정리
- 실제 제출 패키지 품질 기준으로 README 다듬기
