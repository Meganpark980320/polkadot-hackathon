# ClubVault Video Production

- 작성일: 2026-03-09

## Output files

- Video: `/home/traverse/hackathon/deliverables/video/clubvault-demo-roughcut.mp4`
- Contact sheet: `/home/traverse/hackathon/deliverables/review/clubvault-demo-contact-sheet.png`
- Render script: `/home/traverse/hackathon/clubvault/scripts/render_demo_video.py`
- Screen recording raw: `/home/traverse/hackathon/deliverables/video/clubvault-demo-screenrecording.mp4`
- Screen recording final: `/home/traverse/hackathon/deliverables/video/clubvault-demo-screenrecording-final.mp4`
- Screen recording final webm: `/home/traverse/hackathon/deliverables/video/clubvault-demo-screenrecording-final.webm`
- Screen recording frame sheet: `/home/traverse/hackathon/deliverables/review/clubvault-demo-screenrecording-frames.png`
- Capture script: `/home/traverse/hackathon/clubvault/scripts/recordScreenDemo.mjs`
- 3-minute master: `/home/traverse/hackathon/deliverables/video/clubvault-demo-screenrecording-3min.mp4`
- 3-minute final: `/home/traverse/hackathon/deliverables/video/clubvault-demo-screenrecording-3min-final.mp4`
- 3-minute final webm: `/home/traverse/hackathon/deliverables/video/clubvault-demo-screenrecording-3min-final.webm`
- 3-minute capture script: `/home/traverse/hackathon/clubvault/scripts/recordScreenDemo3min.mjs`
- Voiceover script: `/home/traverse/hackathon/docs/submission/voiceover-script.md`
- Voiceover render script: `/home/traverse/hackathon/clubvault/scripts/renderVoiceover.py`
- Voiceover wav: `/home/traverse/hackathon/deliverables/audio/clubvault-demo-screenrecording-3min-voiceover.wav`
- 3-minute final with voiceover: `/home/traverse/hackathon/deliverables/video/clubvault-demo-screenrecording-3min-final-vo.mp4`
- 3-minute final with voiceover webm: `/home/traverse/hackathon/deliverables/video/clubvault-demo-screenrecording-3min-final-vo.webm`

## Current cut

- Format: `mp4`
- Resolution: `1280x720`
- FPS: `20`
- Duration: `160s`
- Style: `captioned rough cut`
- Audio: `none`

## What this cut is for

- 전체 흐름 검토
- 길이 평가
- 톤 평가
- 장면 순서 평가
- 자막 강도 평가

## Included sections

1. Problem
2. Product overview
3. Why Polkadot Hub
4. Create vault
5. Deposit
6. AI draft helper
7. Proposal creation
8. Approve and execute
9. Closing

## Likely next revisions

- 자막을 더 짧고 세게 만들기
- 장면 길이 줄이기
- 실제 화면 캡처 버전으로 교체하거나 혼합하기
- 오디오 내레이션 추가

## Actual screen recording

- Capture mode: Playwright browser capture against `/?recording=1`
- Resolution: `1280x720`
- Duration: `22.56s`
- Audio: `none`
- Flow: create vault -> deposit -> draft -> create proposal -> approve -> execute
- Notes: 첫 1초 로딩 구간은 잘라내고 `final` 파일로 정리했다.

## Actual 3-minute screen recording

- Capture mode: Playwright browser capture against `/?recording=1`
- Resolution: `1280x720`
- Duration: `03:00.04`
- Audio: `none`
- Flow: intro -> create vault -> deposit -> AI draft -> edit proposal text -> create proposal -> approve -> execute
- Notes: 느린 타이핑과 긴 체류 시간을 넣었다. 커서 오버레이는 제거했고, 제출용 `final`은 정확히 3분으로 맞췄다.

## Actual 3-minute screen recording with voiceover

- Format: `mp4` and `webm`
- Resolution: `1280x720`
- Duration: `02:59.99` for mp4, `03:00.02` for webm
- Audio: `English TTS narration`, mono
- Voice: `en-US-AvaMultilingualNeural`
- Flow: intro -> create vault -> deposit -> AI helper -> proposal editing -> proposal creation -> approve -> execute -> closing
- Notes: 타임코드 기준으로 구간별 음성을 만들고, 침묵 구간을 삽입한 뒤 최종 영상에 합쳤다.
