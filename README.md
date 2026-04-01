# Neditor: Modular ES Edition

Neditor는 현대적인 웹 개발 환경에 맞춰 **Vite**와 **ES Modules**를 기반으로 재설계된 고기능 웹 에디터입니다.
플러그인 기반 아키텍처를 채택하여 각 기능을 독립적으로 관리하고 확장할 수 있으며, 강력한 **Python/FastAPI** 백엔드와 연동되어 있습니다.

---

## 🏗 아키텍처 (Architecture)

### 1. Core System (`js/core/Neditor.js`)
에디터의 심장부로 다음과 같은 역할을 수행합니다:
- **플러그인 시스템**: `registerPlugin`을 통한 동적 기능 로드 및 생명주기 관리.
- **이벤트 버스**: 전체 시스템의 상태 변화를 감지하고 플러그인 간 데이터를 교환합니다.
- **붙여넣기 최적화**: 테이블 내부에서의 다중 행 붙여넣기 버그 등을 처리하는 견고한 핸들러를 포함합니다.

### 2. Plugin System (`js/plugins/`)

#### P0 (우선순위 높음) - 완료
- **SmartImageEditorPlugin** ⭐ NEW
  - 고급 이미지 편집 기능 (자르기, 회전, 필터, 보정, 액자, 서명, 모자이크, 스티커)
  - 15개 이미지 필터 (흑백, 세피아, 블러, 반전, 밝기, 명암, 채도, 색상, 빈티지, 차가움, 따뜻함, 연탄, 스케치, 포스터, 만화)
  - Undo/Redo 히스토리 (최대 10단계)
  - 실시간 Canvas 미리보기
  - 서버 업로드 (dataURL → 서버 URL 변환)
  - 파일 중복 방지 (같은 이미지는 같은 파일로 덮어쓰기)
  - 📖 [상세 문서](docs/plugins/SmartImageEditorPlugin.md)

- **ImagePlugin**: 다중 파일 드래그 앤 드롭, 실시간 미리보기, 정렬 및 리사이징 설정
- **TablePlugin**: 테이블 구조를 깨뜨리지 않는 스마트한 텍스트 삽입 로직
- **ScrapPlugin**: 외부 링크 메타데이터 추출 및 카드 형태 렌더링
- **YoutubePlugin**: YouTube 영상 임베드
- **TabPlugin**: 탭 기능
- **ToolbarPlugin**: 텍스트 편집 도구모음
- **StoragePlugin**: 로컬 스토리지 관리
- **FileManagerPlugin**: 파일 관리
- **SettingsPlugin**: 개발자용 관리 도구 및 백엔드 상태 모니터링
- **AiPlugin**: AI 기반 텍스트 편집 (요약, 교정, 톤 변환)

#### P1 (우선순위 중간) - 계획 중
- **EmojiPickerPlugin**: 이모지 선택 기능
- **MapEmbedPlugin**: 지도 임베드 기능
- **UrlLinkEmbedPlugin**: URL 링크 임베드 개선

### 3. Backend Integration (`backend/`)
- **FastAPI Framework**: 스크랩 메타데이터 추출, 이미지 업로드 및 파일 관리 API를 제공합니다.
- **Vite Proxy**: 프론트엔드 통신 시 CORS 문제를 방지하고 보안 및 안정성을 위해 `/api` 경로를 통한 프록시 통신을 수행합니다.

---

## 🚀 실행 방법 (Execution Guide)

### 1. 전체 실행 (프론트엔드 + 백엔드)
가장 권장되는 방법으로, 두 서버를 한 번에 실행합니다:
```bash
npm run start:all
```
또는 루트 폴더의 **`run_all.bat`** 파일을 더블 클릭하세요.

### 2. 개별 실행 및 관리
- **백엔드만 시작**: 루트 폴더의 **`start_backend.bat`** 파일을 실행하거나 `npm run backend` 명령어를 사용합니다.
- **프론트엔드만 시작**: `npm run dev` 명령어를 사용합니다. (기본 포트: 3000)

### 3. 의존성 설치
```bash
# Frontend
npm install

# Backend
pip install -r backend/requirements.txt
```

---

## ⚙️ 주요 기능 및 통신 구조

### Vite Reverse Proxy
프론트엔드(`localhost:3000`) 환경에서 백엔드(`localhost:8000`)와 통신 시 발생할 수 있는 복잡한 문제를 해결하기 위해 **Vite Proxy**가 설정되어 있습니다.
- 모든 API 요청은 `/api/*` 주소를 통해 전달됩니다.
- 이는 브라우저의 보안 정책(CORS)을 준수하면서도 포그라운드 처리 문제를 방지합니다.

### 실시간 상태 확인
`Developer Settings` 모달 상단에서 백엔드 서버의 구동 상태를 5초마다 확인하여 알려줍니다. 서버가 중단된 경우 즉시 'Offline' 상태로 표시되어 조치가 용이합니다.

### SmartImageEditorPlugin - 이미지 편집
에디터 내 이미지 클릭 시 "편집" 오버레이가 표시되어 고급 이미지 편집 기능에 접근할 수 있습니다.
- **편집된 이미지는 서버에 자동 업로드**되어 dataURL이 서버 URL로 대체됩니다.
- **파일 중복 방지**: 같은 원본 이미지를 반복 편집해도 같은 파일로 덮어써져 쓰레기 파일이 생기지 않습니다.

---

## 🆕 v1.2.0 새로운 기능 (2026-04-01)

### SmartImageEditorPlugin 추가 ⭐
- **8개 이미지 편집 도구**: 자르기, 회전, 필터, 보정, 액자, 서명, 모자이크, 스티커
- **15개 고급 필터**: 흑백, 세피아, 블러, 반전, 밝기, 명암, 채도, 색상, 빈티지, 차가움, 따뜻함, 연탄, 스케치, 포스터, 만화
- **Undo/Redo 히스토리**: 최대 10단계 편집 이력 관리
- **실시간 Canvas 미리보기**: 편집 결과를 즉시 확인
- **서버 업로드**: 편집 완료 후 자동으로 서버에 업로드하여 영구 URL 획득
- **파일 최적화**: 중복 편집 시 파일 덮어쓰기로 스토리지 낭비 방지

---

## 📂 디렉토리 구조
```text
neditor/
├── backend/               # Python FastAPI 서버 코드 및 업로드 데이터
├── docs/
│   ├── requirements/      # 요구사항 및 설계 문서
│   └── plugins/          # 📖 플러그인 기술 문서
│       ├── README.md
│       └── SmartImageEditorPlugin.md
├── js/
│   ├── core/             # 에디터 코어 클래스 (Neditor.js)
│   ├── plugins/          # 각 기능별 플러그인 모듈
│   └── utils/            # ApiService 등 공통 유틸리티
├── tests/                # Playwright 자동화 테스트
│   └── smart-image-editor.spec.js
├── index.html            # 메인 UI 구조 및 에디터 컨테이너
├── style.css             # 전체 디자인 시스템 (고급 CSS 기법 적용)
├── script.js             # 메인 진입점
├── vite.config.js        # Proxy 및 서버 개발 설정
├── package.json          # 프로젝트 의존성 및 스크립트
├── run_all.bat           # 전체 통합 시작 스크립트 (윈도우)
└── start_backend.bat     # 백엔드 전용 시작 스크립트 (윈도우)
```

---

## 📌 버전 정보

| 버전 | 출시일 | 주요 기능 |
|------|--------|---------|
| **v1.2.0** | 2026-04-01 | SmartImageEditorPlugin (이미지 고급 편집, 서버 업로드, 파일 최적화) |
| v1.1.1 | 2026-03-21 | 개발자 모드 디버그 정보, 기본 이미지 크기 설정 |
| v1.0.0 | 2026-03-09 | 초기 출시 - 9개 플러그인, 모듈식 아키텍처 |

**현재 버전**: v1.2.0

---

## 📖 플러그인 문서

모든 플러그인의 상세 기술 문서는 `docs/plugins/` 디렉토리에서 확인할 수 있습니다:
- [플러그인 문서 목록](docs/plugins/README.md)
- [SmartImageEditorPlugin 상세 문서](docs/plugins/SmartImageEditorPlugin.md)
