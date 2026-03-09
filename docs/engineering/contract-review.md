# ClubVault Contract Review

- 작성일: 2026-03-09
- 대상 파일: [clubvault/contracts/ClubVault.sol](./clubvault/contracts/ClubVault.sol)

## 현재 평가

첫 버전 치고는 방향이 맞다. 해커톤 MVP 기준으로 필요한 핵심 흐름은 이미 다 들어가 있다.

이미 들어간 것:
- vault 생성
- 멤버 관리
- 입금
- 제안 생성
- 승인
- 집행
- 제안 취소
- 조회 함수
- 이벤트

## 강점

- 단일 컨트랙트라 연결이 단순하다
- 상태 전이가 짧아서 데모 만들기 쉽다
- 커스텀 에러를 써서 revert 이유가 명확하다
- execute 시 상태를 먼저 바꾸고 외부 호출을 해서 기본적인 재진입 리스크를 줄였다

## 남아 있는 리스크

## 1. 자금 예약이 없다

현재는 제안 생성 시 금고 잔액 이하인지 확인하지만, 여러 pending proposal이 동시에 존재할 수 있다.

예:
- vault balance = 100
- proposal A = 80
- proposal B = 70

둘 다 생성은 가능하다. 나중에 하나가 먼저 실행되면 다른 하나는 실행 실패할 수 있다.

판단:
- 해커톤 MVP에서는 허용 가능
- 다만 README와 발표에서 "pending proposal 간 자금 예약은 향후 개선"이라고 명시하는 게 낫다

## 2. 금고별 자금은 내부 장부 기반이다

실제 native asset은 컨트랙트 하나에 모이고, vault별 잔액은 내부 accounting으로 나뉜다.

판단:
- 단일 컨트랙트 MVP에서는 일반적인 선택
- 다만 향후에는 vault 개별 배포 또는 더 강한 accounting 검증이 필요하다

## 3. 멤버 추가/삭제가 없다

MVP에선 의도된 범위 축소다.

판단:
- 지금은 괜찮다
- 발표에서 "static membership MVP"라고 말하면 된다

## 4. 제안 만료가 없다

오래된 제안이 계속 pending으로 남을 수 있다.

판단:
- 이번 제출에서는 생략 가능
- stretch goal로 `deadline` 추가 가능

## 5. createVault 입력 검증은 최소 수준이다

예:
- 빈 이름 허용
- 멤버 수 상한 없음

판단:
- MVP에서는 문제 없음
- 프론트에서 먼저 막는 편이 빠르다

## 지금 당장 유지할 것

- 단일 컨트랙트 구조
- 과반 승인
- 제안자도 승인 가능
- 승인 즉시 실행 가능
- 멤버만 입금 가능

## 지금 당장 바꾸지 말 것

- 커스텀 threshold
- role 기반 권한
- 타임락
- 자금 예약 로직
- 크로스체인 기능

이것들은 지금 넣으면 일정만 망가진다.

## 테스트 우선순위

반드시 테스트해야 하는 것:
- vault 생성
- duplicate member 방지
- member-only deposit
- member-only proposal creation
- duplicate approval 방지
- approval threshold 미달 시 execute 실패
- threshold 충족 시 execute 성공
- execute 후 재실행 실패
- proposer만 cancel 가능
- cancelled proposal은 승인/집행 불가

## 발표용 설명 포인트

- `shared treasury without trusting a single treasurer`
- `proposal-based spending with transparent execution`
- `simple UX for small student teams`

## 결론

이 컨트랙트는 `해커톤용 첫 제출 베이스`로 충분하다. 지금 중요한 건 구조를 크게 바꾸는 게 아니라, 테스트와 프론트 happy path를 빨리 붙이는 것이다.
