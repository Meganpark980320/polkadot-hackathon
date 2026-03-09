# ClubVault Deploy Notes

- 작성일: 2026-03-09
- 구현 기준: [clubvault/contracts/ClubVault.sol](./clubvault/contracts/ClubVault.sol)

## 목적

배포와 데모 준비를 반복 가능하게 만든다.

현재 준비된 스크립트:
- `clubvault/scripts/deploy.js`
- `clubvault/scripts/seedDemo.js`

## 기본 명령

로컬 Node 경로를 붙여서 사용:

```bash
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm run deploy
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm run seed
```

특정 네트워크를 붙일 때:

```bash
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm run deploy -- --network <network-name>
PATH=/home/traverse/hackathon/.tools/node/bin:$PATH npm run seed -- --network <network-name>
```

## Polkadot Hub TestNet 기준값

- RPC: `https://testnet-passet-hub-eth-rpc.polkadot.io`
- Chain ID: `420420417`
- Explorer: `https://blockscout-passet-hub.parity-testnet.parity.io/`
- 테스트넷 가스 토큰: `PAS`

현재 ClubVault UI는 env로 심볼을 바꿀 수 있으므로 제출용 라벨을 `DOT`로 유지하거나 실제 테스트넷 표기인 `PAS`로 바꿀 수 있다.

## deploy.js

하는 일:
- `ClubVault` 배포
- 배포 주소 출력

출력 예시:
- `address=0x...`

이 주소를 프론트 `.env`의 `VITE_CLUBVAULT_ADDRESS`로 넣으면 된다.

## seedDemo.js

하는 일:
- 컨트랙트 배포
- `Demo Team Vault` 생성
- 금고에 `1` native asset 입금
- `Snacks budget` proposal 생성
- 2명 승인까지 완료

결과 상태:
- proposal은 `Ready to execute` 상태까지 간다
- 프론트에서 `Execute`만 누르면 되는 데모 세팅이 된다

## 데모 세팅 순서

1. 컨트랙트 배포
2. 프론트 `.env`에 주소와 RPC 입력
3. seed script를 돌릴지, 수동으로 생성할지 결정
4. 브라우저에서 연결 지갑과 승인용 지갑 준비

## 남은 일

- 최종 제출 네트워크용 Hardhat network config 추가
- explorer URL 패턴 확정
- receipt 링크를 프론트에 붙이기
- funded `PRIVATE_KEY` 확보 후 공개 테스트넷 배포 재시도
