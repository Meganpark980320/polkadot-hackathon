# ClubVault Demo Script

- 작성일: 2026-03-09
- 목적: 해커톤 제출 영상과 라이브 데모를 90초~120초 안에 설득력 있게 끝낸다

## 한 줄 피치

`ClubVault는 학생 팀과 해커톤 팀을 위한 가장 단순한 공동지갑이다.`

핵심:
- 누구나 금고를 만들 수 있다
- 팀원이 함께 입금할 수 있다
- 지출은 proposal과 과반 승인으로만 집행된다

## 90초 데모 흐름

권장 녹화 길이:
- 압축 버전 `90초`
- 안전 버전 `110초~120초`

### 1. 문제 정의 `0s - 10s`

말할 것:
- 학생 팀 돈 관리는 아직 카톡, 엑셀, 계좌이체 캡처에 의존한다
- ClubVault는 그 흐름을 onchain shared treasury로 바꾼다

화면:
- Hero와 subtitle

### 2. 금고 생성 `10s - 25s`

말할 것:
- 팀 이름과 멤버 주소만 넣으면 금고를 바로 만든다
- 생성자는 자동으로 멤버에 포함된다

화면:
- `Create vault` 폼
- 생성 완료 후 vault overview 갱신

### 3. 입금 `25s - 35s`

말할 것:
- 팀원은 native asset을 바로 넣을 수 있다
- 잔액은 대시보드에서 즉시 확인된다

화면:
- `Deposit`
- balance 업데이트

### 4. AI draft `35s - 50s`

말할 것:
- AI는 거버넌스를 대신하지 않는다
- 제안 문구를 정리해주는 보조 기능만 맡는다

화면:
- `AI Proposal Draft`
- `Generate Draft`
- `Use Draft`

### 5. 제안 생성 `50s - 65s`

말할 것:
- 멤버는 recipient, amount, description을 확인하고 proposal을 만든다
- 제안은 모두 목록에 공개된다

화면:
- `Proposal Composer`
- proposal 생성 후 리스트 갱신

### 6. 승인과 실행 `65s - 85s`

말할 것:
- 같은 제안은 중복 승인할 수 없다
- 과반이 되면 즉시 실행 가능하다

화면:
- `Approve`
- 상태가 `Ready to execute`로 바뀜
- `Execute`
- 상태가 `Executed`로 바뀜

### 7. 마무리 `85s - 90s`

말할 것:
- ClubVault는 학생 팀 treasury를 가장 짧은 클릭 경로로 구현한다
- 다음 단계는 실제 Polkadot 배포와 receipt UX다

## 녹화 순서 요약

1. Hero에서 문제 정의
2. Vault 생성
3. Deposit
4. AI draft 생성
5. Proposal 생성
6. Approve
7. Execute
8. 마지막에 tx hash 또는 explorer link 보여주기

## 데모 전에 반드시 확인할 것

- 배포된 컨트랙트 주소가 `.env`에 들어가 있는가
- RPC endpoint가 정상 동작하는가
- 금고 1개와 제안 1개를 미리 준비할지, 처음부터 생성할지 정했는가
- 승인용 지갑을 최소 2개 확보했는가
- 브라우저 wallet popup이 화면을 가리지 않는가

## 실패 대비 멘트

- RPC가 느릴 때:
  `상태 텍스트가 pending과 confirmation을 보여주기 때문에 지금 체인 응답만 기다리면 됩니다.`

- 승인 수가 모자랄 때:
  `ClubVault는 과반 전 실행을 막습니다. 이게 핵심 안전장치입니다.`

- AI 결과가 별로일 때:
  `AI는 초안 보조일 뿐이고, 최종 금액과 recipient는 멤버가 직접 확인합니다.`
