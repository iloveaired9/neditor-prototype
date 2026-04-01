# 플러그인 문서

이 디렉토리에는 NEditor의 모든 플러그인에 대한 문서가 포함되어 있습니다.

## 📚 플러그인 목록

### ✅ 구현 완료 (P0)

#### [SmartImageEditorPlugin](./SmartImageEditorPlugin.md)
고급 이미지 편집 기능을 제공하는 플러그인

**기능:**
- 8개 이미지 편집 도구 (자르기, 회전, 필터, 보정, 액자, 서명, 모자이크, 스티커)
- 15개 필터 (흑백, 세피아, 블러, 반전, 밝기, 명암, 채도, 색상, 빈티지, 차가움, 따뜻함, 연탄, 스케치, 포스터, 만화)
- Undo/Redo 히스토리 (최대 10단계)
- 실시간 Canvas 미리보기
- 서버 업로드 (dataURL → 서버 URL 변환)
- 파일 중복 방지 (같은 이미지는 같은 파일로 덮어쓰기)

**위치:** `js/plugins/SmartImageEditorPlugin.js`

**사용법:**
```javascript
// 에디터 내 이미지 클릭 → "편집" 버튼 표시 → 자동으로 모달 오픈
const smartEditor = window.editorInstance.plugins.smartImageEditor;
smartEditor.openEditor(imageElement);
```

---

### 📋 계획 중 (P1)

#### EmojiPickerPlugin
이모지 선택 기능

#### MapEmbedPlugin
지도 임베드 기능

#### UrlLinkEmbedPlugin (개선)
URL 링크 임베드 개선

---

## 📖 문서 작성 가이드

새로운 플러그인을 추가할 때 다음 형식으로 문서를 작성하세요:

```markdown
# PluginNamePlugin 구조도 및 사용법

## 📋 전체 아키텍처
(플로우차트 또는 다이어그램)

## 🏗️ 클래스 구조
(속성, 메서드 정의)

## 🎯 주요 메서드
(Public/Private 메서드 목록)

## 💻 사용법 (코드 예시)
(1. 기본 사용, 2. 프로그래밍 호출, 등)

## 🔄 데이터 흐름
(동작 과정 설명)

## 📊 상태 관리
(필요시)

## 🚀 확장 가능성
(새 기능 추가 방법)

## 📌 주요 특징 요약
(표 형식)
```

---

## 🔗 관련 파일

- **플러그인 구현:** `js/plugins/`
- **플러그인 스타일:** `style.css`
- **플러그인 등록:** `script.js`
- **요구사항 문서:** `docs/requirements/`

---

## 💡 플러그인 아키텍처 패턴

모든 플러그인은 다음 구조를 따릅니다:

```javascript
export class PluginNamePlugin {
  constructor(editor) {
    this.editor = editor;  // NEditor 참조
    // 플러그인 초기화
  }

  init() {
    // UI 생성, 이벤트 등록
  }

  // Public methods
  publicMethod() { }

  // Private methods
  _privateMethod() { }
}
```

### 플러그인 등록 방법

```javascript
// script.js
editor.registerPlugin('pluginName', PluginNamePlugin);
```

### 플러그인 간 통신

```javascript
// 이벤트 발생
this.editor.emit('eventName', data);

// 이벤트 리스닝
this.editor.on('eventName', (data) => {
  // 처리
});
```

---

## ✨ 플러그인 개발 체크리스트

새로운 플러그인을 개발할 때:

- [ ] 플러그인 클래스 구현
- [ ] CSS 스타일 추가
- [ ] `script.js`에 등록
- [ ] 문서 작성 (`docs/plugins/[PluginName].md`)
- [ ] 테스트 케이스 작성
- [ ] README 업데이트

---

## 📞 질문 및 피드백

플러그인 개발 관련 질문이나 피드백은 이슈를 통해 알려주세요.
