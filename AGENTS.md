# AGENTS.md

## 프로젝트

ClubVault - 학생/동아리/팀용 공동지갑 + 승인형 지출 관리 dApp (Polkadot Hub EVM)

## 행동 규칙

1. 작업 시작 전 반드시 `tasks.md`를 읽는다.
2. 체크되지 않은(`[ ]`) 태스크 중 가장 위에 있는 것부터 순서대로 작업한다.
3. 하나의 태스크를 끝내면 `tasks.md`에서 해당 항목을 `[x]`로 바꾼다.
4. 바로 다음 태스크로 넘어간다. 멈추지 않는다.
5. 막히면 `tasks.md` 하단 `## Blockers`에 한 줄로 적고, 다음 태스크로 넘어간다.
6. 모든 태스크가 끝나면 `tasks.md` 맨 위에 `STATUS: COMPLETE`를 적는다.

## 코드 규칙

- Solidity 컨트랙트는 `contracts/` 에 작성
- 테스트는 `test/` 에 작성
- 프론트엔드는 `frontend/` 에 작성
- 컨트랙트 컴파일: Hardhat with `@parity/hardhat-polkadot` (resolc 컴파일러)
- 프론트엔드: React + Vite + ethers.js (또는 viem) + Polkadot wallet adapter
- 가스/자산 단위는 DOT (ETH 아님)
- 기존 멀티시그 코드 복붙 금지 (70% 포크 유사도 = 실격)
- 불필요한 추상화, 과도한 에러 핸들링, 쓸데없는 주석 금지
- 파일 하나 만들기 전에 기존 파일 확인

## 커밋 규칙

- 태스크 하나 끝날 때마다 커밋
- 커밋 메시지: `[task-XX] 한줄 설명`
- 절대 force push 하지 않는다

## 절대 하지 말 것

- 자체 토큰 발행
- DAO 거버넌스 확장
- 브리지/크로스체인 구현
- AI를 위한 AI 기능
- v0 범위 밖의 기능 추가
- 3월 17일 이후 새 기능 추가

## 참고 문서

- `polkadot-hackathon-ideas.md` - 아이디어 상세
- `polkadot-solidity-roadmap.md` - 전체 로드맵
- `polkadot-solidity-hackathon-research.md` - 해커톤 조사
