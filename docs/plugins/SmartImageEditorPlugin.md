# SmartImageEditorPlugin 구조도 및 사용법

## 📋 전체 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│              NEditor (메인 에디터)                        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Editor Area (contenteditable)                     │ │
│  │                                                    │ │
│  │  [이미지 클릭]                                      │ │
│  │       ↓                                            │ │
│  │  [편집 오버레이 표시]  ←── script.js에서 생성      │ │
│  │       ↓                                            │ │
│  │  [편집 버튼 클릭]                                  │ │
│  └────────────────────────────────────────────────────┘ │
│           ↓ (openEditor() 호출)                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │     SmartImageEditorPlugin Modal                   │ │
│  │     ──────────────────────────                     │ │
│  │                                                    │ │
│  │  [도구 탭 8개]                                      │ │
│  │  ├─ 자르기 (Crop)                                  │ │
│  │  ├─ 회전 (Rotate)                                  │ │
│  │  ├─ 필터 (Filter) ─── 15개 필터                    │ │
│  │  ├─ 보정 (Adjust)                                  │ │
│  │  ├─ 액자 (Frame)                                   │ │
│  │  ├─ 서명 (Signature)                               │ │
│  │  ├─ 모자이크 (Mosaic)                              │ │
│  │  └─ 스티커 (Sticker)                               │ │
│  │                                                    │ │
│  │  [Canvas]  (실시간 미리보기)                        │ │
│  │                                                    │ │
│  │  [옵션 패널] (도구별 파라미터)                      │ │
│  │                                                    │ │
│  │  [하단 버튼]                                        │ │
│  │  ├─ 초기화 / 취소 / 재실행                         │ │
│  │  └─ ✓ 적용                                         │ │
│  └────────────────────────────────────────────────────┘ │
│           ↓ (적용 클릭)                                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │  편집된 이미지 서버 업로드                          │ │
│  │  1. Canvas → dataURL                              │ │
│  │  2. dataURL → File 객체                            │ │
│  │  3. ApiService.uploadImage(file)                  │ │
│  │  4. 서버 응답: URL                                 │ │
│  │  5. img.src = 서버 URL  (dataURL 대체)             │ │
│  │  6. smartImageEdited 이벤트 emit                   │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ 클래스 구조

### SmartImageEditorPlugin 속성

```javascript
constructor(editor) {
  // 에디터 참조
  this.editor                // NEditor 인스턴스

  // DOM 요소
  this.modal                 // 모달 div
  this.canvas                // Canvas 요소
  this.ctx                   // Canvas 2D context

  // 이미지 데이터
  this.originalImage         // Image 객체
  this.selectedImageElement   // img 태그 참조

  // 상태 관리
  this.state = {
    history: [],             // 편집 히스토리
    historyIndex: -1,
    maxHistory: 10
  }

  // 편집 상태
  this.editState = {
    crop: {...},            // 자르기 파라미터
    rotate: {...},          // 회전 각도
    filters: [],            // 적용된 필터 목록
    adjustments: {...},     // 밝기/채도/명암
    frame: {...},           // 액자 설정
    signatures: [],         // 텍스트 서명
    mosaics: [],           // 모자이크 영역
    stickers: []           // 스티커 목록
  }

  // 필터 정의
  this.filters = {
    grayscale, sepia, blur, invert,
    brightness, contrast, saturate, ...
  }

  // 스티커 데이터
  this.stickers = {
    emoji: ['😊', '😂', ...],
    icons: ['✓', '✕', ...],
    shapes: ['●', '○', ...]
  }
}
```

---

## 🎯 주요 메서드

### Public Methods (외부에서 호출)

| 메서드 | 용도 | 예시 |
|--------|------|------|
| `init()` | 플러그인 초기화 | 자동 호출됨 |
| `openEditor(imageElement)` | 에디터 열기 | `smartEditor.openEditor(imgTag)` |
| `closeEditor()` | 에디터 닫기 | 모달 닫기 |

### Private Methods (내부 사용)

#### UI 생성
```javascript
_createModal()         // 모달 HTML 생성
_setupEvents()         // 이벤트 리스너 등록
_setupOptionEvents()   // 옵션 패널 이벤트
```

#### 이미지 로드 & 렌더링
```javascript
async _loadImage(url)  // 이미지 로드
_render()              // Canvas에 그리기
```

#### 도구 기능
```javascript
// Crop
_applyCrop(x, y, w, h)

// Rotate
_applyRotate()

// Filter (15개)
_applyGrayscale()      // 흑백
_applySepia()          // 세피아
_applyBlur()           // 흐릿함
_applyInvert()         // 반전
_applyBrightness()     // 밝기
_applyContrast()       // 명암
_applySaturate()       // 채도
_applyHueRotate()      // 색상
_applyVintage()        // 빈티지
_applyCool()           // 차가움
_applyWarm()           // 따뜻함
_applyCharcoal()       // 연탄
_applySketch()         // 스케치
_applyPosterize()      // 포스터
_applyCartoon()        // 만화

// Adjust
_applyAdjustAction()   // 밝기/채도/명암 조정

// Frame
_applyFrameAction()    // 액자 추가

// Signature
_applySignatureAction() // 텍스트 서명

// Mosaic
_applyMosaicAction()   // 모자이크 효과

// Sticker
_addSticker()          // 스티커 추가
_createStickerGrid()   // 스티커 그리드 생성
```

#### 상태 관리
```javascript
_pushHistory(action)   // 히스토리에 추가
_undo()               // 이전 단계로
_redo()               // 다음 단계로
_reset()              // 처음부터
```

#### 파일 처리 & 업로드
```javascript
_generateUUID()                    // UUID 생성
_ensureImageId(imageElement)       // 이미지 고유 ID 부여
_dataUrlToFile(dataUrl, filename)  // dataURL → File 변환
async _applyEdits()                // 편집 적용 & 서버 업로드
```

---

## 💻 사용법 (코드 예시)

### 1. 기본 사용 (에디터에서 자동)

```javascript
// script.js에서 이미 등록됨
editor.registerPlugin('smartImageEditor', SmartImageEditorPlugin);

// 에디터 내 이미지 클릭 시 자동으로:
// 1. "편집" 오버레이 표시
// 2. 클릭하면 openEditor() 호출
```

### 2. 프로그래밍으로 열기

```javascript
// 에디터 내 이미지 가져오기
const img = document.querySelector('#editor img');

// SmartImageEditorPlugin 호출
const smartEditor = window.editorInstance.plugins.smartImageEditor;
smartEditor.openEditor(img);
```

### 3. 편집 완료 이벤트 처리

```javascript
// 편집 완료 후 이벤트 리스닝
window.editorInstance.on('smartImageEdited', (event) => {
  console.log('편집 완료:');
  console.log('- 서버 URL:', event.imageUrl);
  console.log('- 편집 상태:', event.metadata.editState);
  console.log('- 히스토리:', event.metadata.history);
});
```

### 4. 필터 프로그래밍으로 적용

```javascript
const smartEditor = window.editorInstance.plugins.smartImageEditor;

// 이미지 로드
await smartEditor.openEditor(imgElement);

// 필터 선택 및 적용
smartEditor.currentFilter = 'sepia';
smartEditor._applyFilterAction();
smartEditor._pushHistory('filter');
smartEditor._render();
```

---

## 🔄 데이터 흐름

### 편집 → 적용 프로세스

```
1️⃣ 사용자가 도구 선택 (필터, 회전, 자르기 등)
   ↓
2️⃣ 옵션 패널에서 파라미터 조정
   ↓
3️⃣ "적용" 버튼 클릭
   ↓
4️⃣ _executeAction(actionName) 호출
   ↓
5️⃣ 해당 필터/도구 함수 실행
   ├─ Canvas에서 ImageData 추출
   ├─ 픽셀 조작 또는 Canvas 변환
   ├─ 결과를 Canvas에 그리기
   ├─ _pushHistory()로 히스토리 저장
   └─ _render()로 화면 업데이트
   ↓
6️⃣ "✓ 적용" 버튼 클릭 (_applyEdits)
   ├─ Canvas.toDataURL('image/png')
   ├─ dataURL → File 객체 변환
   ├─ ApiService.uploadImage(file)
   ├─ 서버에서 URL 응답
   ├─ img.src = 서버 URL (대체)
   ├─ smartImageEdited 이벤트 emit
   └─ 모달 닫기
```

---

## 📦 필터 구현 방식

### ImageData 기반 필터 (Grayscale, Sepia, Invert 등)

```javascript
_applyGrayscale() {
  const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114;
    data[i] = gray;      // R
    data[i+1] = gray;    // G
    data[i+2] = gray;    // B
    // data[i+3] = alpha (변경 없음)
  }

  this.ctx.putImageData(imageData, 0, 0);
}
```

### Canvas Transform 기반 필터 (Rotate)

```javascript
_applyRotate() {
  const angle = this.editState.rotate.angle * Math.PI / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // 새로운 캔버스 크기 계산
  const newWidth = Math.abs(this.canvas.width * cos) + Math.abs(this.canvas.height * sin);
  const newHeight = Math.abs(this.canvas.width * sin) + Math.abs(this.canvas.height * cos);

  // 캔버스 크기 변경
  this.canvas.width = newWidth;
  this.canvas.height = newHeight;

  // 회전 적용
  this.ctx.translate(newWidth / 2, newHeight / 2);
  this.ctx.rotate(angle);
  this.ctx.drawImage(oldCanvas, -oldWidth / 2, -oldHeight / 2);
}
```

---

## 📊 상태 관리 (Undo/Redo)

### 히스토리 구조

```javascript
this.state.history = [
  {
    action: 'init',
    canvas: Canvas,      // 편집 전 스냅샷
    timestamp: 1234567890
  },
  {
    action: 'filter',
    canvas: Canvas,
    timestamp: 1234567891
  },
  {
    action: 'rotate',
    canvas: Canvas,
    timestamp: 1234567892
  }
]

this.state.historyIndex = 2  // 현재 위치
```

### Undo/Redo 동작

```javascript
// Undo: historyIndex 감소
_undo() {
  if (this.state.historyIndex > 0) {
    this.state.historyIndex--;
    const historyState = this.state.history[this.state.historyIndex];
    this.ctx.drawImage(historyState.canvas, 0, 0);
  }
}

// Redo: historyIndex 증가
_redo() {
  if (this.state.historyIndex < this.state.history.length - 1) {
    this.state.historyIndex++;
    const historyState = this.state.history[this.state.historyIndex];
    this.ctx.drawImage(historyState.canvas, 0, 0);
  }
}
```

---

## 🚀 서버 업로드 메커니즘

### 파일 중복 방지 (같은 이미지는 같은 파일명)

```javascript
// openEditor() - 처음 호출 시 UUID 생성
if (!imageElement.__smartImageEditId) {
  imageElement.__smartImageEditId = this._generateUUID();
}

// _applyEdits() - UUID를 파일명으로 사용
const imageId = this._ensureImageId(this.selectedImageElement);
const filename = `edited_${imageId}.png`;

// 결과:
// 첫 번째 편집: edited_abc123.png (서버에 저장)
// 두 번째 편집: edited_abc123.png (기존 파일 덮어쓰기)
```

### API 요청 흐름

```javascript
async _applyEdits() {
  // 1. Canvas를 PNG로 변환
  const dataUrl = this.canvas.toDataURL('image/png');

  // 2. dataURL → File 객체
  const file = this._dataUrlToFile(dataUrl, filename);

  // 3. 서버 업로드
  const result = await ApiService.uploadImage(file);
  // 응답: { url: 'http://localhost:8000/uploads/edited_abc123.png' }

  // 4. 이미지 src 교체 (dataURL → 서버 URL)
  this.selectedImageElement.src = result.url;

  // 5. 이벤트 발생
  this.editor.emit('smartImageEdited', {
    imageUrl: result.url,
    metadata: { editState, history }
  });
}
```

---

## 📐 UI 구조

### Modal 레이아웃

```
┌─────────────────────────────────────────┐
│  스마트 이미지 편집              [✕]      │  ← Header
├─────────────────────────────────────────┤
│ [탭] [탭] [탭] [탭] [탭] [탭] [탭] [탭]   │  ← Tool Tabs
│                                         │
│  ┌──────────────┐   ┌────────────────┐ │
│  │   Canvas     │   │  옵션 패널      │ │  ← Body
│  │  (미리보기)   │   │ (도구별 설정)   │ │
│  └──────────────┘   └────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│ [초기화] [취소] [재실행] [✕취소] [✓적용]  │  ← Footer
└─────────────────────────────────────────┘
```

### CSS 클래스

```css
.smart-editor-modal          /* 전체 모달 (fixed overlay) */
.smart-editor-container      /* 모달 내용 */
.smart-editor-header         /* 헤더 */
.tool-tabs                   /* 탭 목록 */
.tool-tab                    /* 각 탭 */
.tool-tab.active            /* 활성 탭 */
.canvas-wrapper             /* Canvas 영역 */
.smart-editor-canvas        /* Canvas 요소 */
.options-panel              /* 옵션 패널 */
.tool-options               /* 도구별 옵션 */
.option-apply-btn           /* 도구 적용 버튼 */
.smart-editor-footer        /* 하단 버튼 */
```

---

## 🔧 확장 가능성

### 새 필터 추가

```javascript
// 1. filters 객체에 추가
this.filters.myCustomFilter = {
  name: '내 필터',
  apply: this._applyMyCustomFilter.bind(this)
};

// 2. 필터 구현
_applyMyCustomFilter() {
  const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  const data = imageData.data;

  // 픽셀 조작 로직
  for (let i = 0; i < data.length; i += 4) {
    // R, G, B 값 변경
    data[i] = Math.min(255, data[i] + 50);    // R
    // ...
  }

  this.ctx.putImageData(imageData, 0, 0);
}

// 3. 모달 HTML에 버튼 추가
// <button class="filter-btn" data-filter="myCustomFilter">내 필터</button>
```

### 새 도구 추가

```javascript
// 1. 도구 탭 등록
this.editor.on('init', () => {
  // _createModal()에서 새 탭 추가
  // <button class="tool-tab" data-tool="myTool">내 도구</button>
});

// 2. 옵션 패널 구현
// <div class="tool-options" data-tool="myTool">
//   <input type="range" id="myParam">
//   <button class="option-apply-btn" data-action="apply-myTool">적용</button>
// </div>

// 3. 액션 구현
_executeAction(action) {
  if (action === 'apply-myTool') {
    this._applyMyTool();
    this._pushHistory('myTool');
    this._render();
  }
}

_applyMyTool() {
  // 캔버스 조작
}
```

---

## 📌 주요 특징 요약

| 기능 | 설명 |
|------|------|
| **8개 도구** | Crop, Rotate, Filter, Adjust, Frame, Signature, Mosaic, Sticker |
| **15개 필터** | 흑백, 세피아, 흐릿함, 반전, 밝기, 명암, 채도, 색상, 빈티지, 차가움, 따뜻함, 연탄, 스케치, 포스터, 만화 |
| **Undo/Redo** | 최대 10단계 히스토리 관리 |
| **서버 업로드** | dataURL → 서버 URL 변환 |
| **파일 최적화** | 같은 이미지 중복 편집 시 파일 덮어쓰기 (쓰레기 파일 방지) |
| **실시간 미리보기** | Canvas에서 즉시 결과 확인 |
| **이벤트 시스템** | smartImageEdited 이벤트로 완료 감지 |
