# NEditor 개선 요구사항 (2026.03.31)

## 📋 목차
1. [개요](#개요)
2. [플러그인 목록](#플러그인-목록)
3. [우선순위별 구현 계획](#우선순위별-구현-계획)
4. [아키텍처](#아키텍처)
5. [의존성](#의존성)

---

## 개요

**프로젝트명**: NEditor 사진, 동영상 편집 기능 추가
**목표**: 기본 WYSIWYG 에디터에 고급 이미지 편집 기능 추가
**기획 일자**: 2026.03.31

### 핵심 기능
- ✅ 기본 이미지 업로드/관리 (기존)
- ⚠️ 고급 이미지 편집 (SmartEditor) - **신규**
- ⚠️ 추가 유틸리티 기능들 - **신규**

---

## 플러그인 목록

### 이미지 편집 플러그인 (P0 - 긴급)

#### SmartImageEditorPlugin
**파일**: `js/plugins/SmartImageEditorPlugin.js`
**크기**: ~800-1000줄 예상
**상태**: 🔴 미개발

##### 포함 기능
1. **Image Crop** - 이미지 자르기/크롭
2. **Image Rotate** - 이미지 회전 (90도 단위 + 자유 각도)
3. **Image Filter** - 필터 적용 (15가지)
   - Grayscale (흑백)
   - Sepia (세피아)
   - Blur (흐릿함)
   - Invert (반전)
   - Brightness
   - Contrast
   - Saturate
   - Hue-rotate
   - Vintage
   - Cool
   - Warm
   - Charcoal
   - Sketch
   - Posterize
   - Cartoon
4. **Image Adjust** - 보정 도구
   - 밝기 (Brightness)
   - 색상 (Saturation)
   - 대비 (Contrast)
   - 색온도 (Color Temperature)
5. **Image Frame** - 액자/프레임 추가
6. **Image Signature** - 서명 추가
   - 이미지 서명
   - 텍스트 서명
   - 템플릿 서명
7. **Image Mosaic** - 모자이크 처리
8. **Image Sticker** - 스티커 추가

##### 기술 사양
- **기반**: Canvas API, HTML5
- **UI**: Modal 기반 (기존 ImageModal 활용)
- **상태 관리**: Editor 이벤트 시스템 활용
- **파일 크기**: 원본 유지, Base64 변환

---

### 유틸리티 플러그인 (P1 - 중요)

#### EmojiPickerPlugin
**파일**: `js/plugins/EmojiPickerPlugin.js`
**상태**: 🔴 미개발
**기능**: 이모지 검색 및 삽입

#### MapEmbedPlugin
**파일**: `js/plugins/MapEmbedPlugin.js`
**상태**: 🔴 미개발
**기능**: 지도 검색 및 삽입 (Kakao Map API)

#### UrlLinkEmbedPlugin
**파일**: `js/plugins/UrlLinkEmbedPlugin.js`
**상태**: 🟡 부분 개발
**기능**: URL 링크 설정 개선

---

### 관리 플러그인 (P2 - 추후)

#### SeriesManagementPlugin
**파일**: `js/plugins/SeriesManagementPlugin.js`
**상태**: 🔴 미개발
**기능**: 시리즈 관리

#### AdvancedTablePlugin
**파일**: `js/plugins/AdvancedTablePlugin.js`
**상태**: 🔴 미개발
**기능**: TablePlugin 확장 (높이 조정, 색상 등)

---

## 우선순위별 구현 계획

### P0 (긴급) - 2026년 4월 내
- [x] 문서화 완료
- [ ] SmartImageEditorPlugin 구현
  - [ ] 크롭 기능
  - [ ] 회전 기능
  - [ ] 필터 기능
  - [ ] 보정 기능
  - [ ] 액자 기능
  - [ ] 서명 기능
  - [ ] 모자이크 기능
  - [ ] 스티커 기능
- [ ] 기존 ImagePlugin과 통합

### P1 (중요) - 2026년 5월
- [ ] EmojiPickerPlugin
- [ ] MapEmbedPlugin
- [ ] UrlLinkEmbedPlugin

### P2 (추후) - 2026년 6월
- [ ] SeriesManagementPlugin
- [ ] AdvancedTablePlugin

---

## 아키텍처

### 플러그인 시스템
```
NEditor Core
├── Plugin System
├── Event System
└── Plugins
    ├── ImagePlugin (기존 - 이미지 업로드)
    ├── SmartImageEditorPlugin (신규 - 이미지 편집)
    ├── TablePlugin (기존)
    ├── ToolbarPlugin (기존)
    └── ... (기타 플러그인)
```

### SmartImageEditorPlugin 구조
```
SmartImageEditorPlugin
├── UI 컴포넌트
│   ├── Modal
│   ├── Canvas 뷰어
│   ├── 도구 패널
│   └── 옵션 패널
├── 이미지 조작
│   ├── Crop Manager
│   ├── Rotate Manager
│   ├── Filter Manager
│   ├── Adjust Manager
│   ├── Frame Manager
│   ├── Signature Manager
│   ├── Mosaic Manager
│   └── Sticker Manager
└── 유틸리티
    ├── Canvas Helper
    ├── Image Processor
    └── State Manager
```

---

## 의존성

### SmartImageEditorPlugin 의존성
- ✅ Neditor Core (기본 에디터)
- ✅ ImagePlugin (이미지 기본 관리)
- ❌ Canvas API (브라우저 기본 제공)
- ❌ ES6 Module System

### 외부 라이브러리
- 필터 적용: 순수 Canvas API (외부 라이브러리 미사용)
- 이미지 처리: Canvas 기본 제공 메서드

---

## 개발 가이드

### 플러그인 개발 기본 구조
```javascript
export class SmartImageEditorPlugin {
    constructor(editor) {
        this.editor = editor;
    }

    init() {
        // 플러그인 초기화
    }

    // 기능 메서드들
}
```

### 이벤트 통신
```javascript
// 이벤트 발생
this.editor.emit('imageEdited', { image: canvas, metadata: {} });

// 이벤트 리스닝
this.editor.on('imageEdited', (data) => {
    // 처리
});
```

---

## 참고
- 기획 문서: `docs/requirements/smart-image-editor.md`
- 스크린샷: `docs/requirements/screenshots/`
- 기술 명세: `docs/requirements/technical-spec.md`
