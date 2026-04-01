# SmartImageEditorPlugin 기술 사양서

## 아키텍처 설계

### 클래스 다이어그램

```
SmartImageEditorPlugin (메인 클래스)
├── SmartEditorUI (UI 관리)
│   ├── initModal()
│   ├── createToolTabs()
│   ├── createCanvasView()
│   ├── createOptionPanel()
│   └── showModal()
├── ImageProcessor (이미지 처리)
│   ├── loadImage()
│   ├── applyFilter()
│   ├── applyAdjustment()
│   ├── rotateImage()
│   ├── cropImage()
│   ├── addFrame()
│   ├── addSignature()
│   ├── addMosaic()
│   ├── addSticker()
│   └── getCanvasData()
├── StateManager (상태 관리)
│   ├── pushHistory()
│   ├── undo()
│   ├── redo()
│   ├── reset()
│   └── getState()
└── EventHandler (이벤트 처리)
    ├── onToolChange()
    ├── onOptionChange()
    ├── onApply()
    └── onCancel()
```

---

## 파일 구조

```
SmartImageEditorPlugin.js
├── 상수 정의
├── SmartImageEditorPlugin 클래스
│   ├── constructor
│   ├── init()
│   ├── _setupUI()
│   ├── _setupEvents()
│   ├── _loadImage()
│   ├── _applyTool()
│   ├── _saveImage()
│   └── _cleanup()
├── SmartEditorUI 클래스
├── ImageProcessor 클래스
├── StateManager 클래스
└── 유틸리티 함수
    ├── createCanvas()
    ├── drawImage()
    ├── applyFilterEffect()
    ├── getContrastImage()
    └── ...
```

---

## 주요 메서드 명세

### SmartImageEditorPlugin

#### constructor(editor)
```javascript
/**
 * @param {Neditor} editor - NEditor 인스턴스
 */
constructor(editor) {
    this.editor = editor;
    this.modal = null;
    this.canvas = null;
    this.imageProcessor = null;
    this.stateManager = null;
    this.currentTool = null;
    this.editButton = null;
}
```

#### init()
```javascript
/**
 * 플러그인 초기화
 * - UI 생성
 * - 이벤트 리스너 등록
 * - 기존 ImagePlugin과 연동
 */
init() {
    this._createUI();
    this._setupEvents();
    this._hookIntoImagePlugin();
}
```

#### openEditor(imageElement)
```javascript
/**
 * 이미지 편집 모달 오픈
 * @param {HTMLImageElement} imageElement - 편집할 이미지
 */
openEditor(imageElement) {
    // 모달 표시
    // 이미지 로드
    // Canvas에 렌더링
}
```

#### closeEditor()
```javascript
/**
 * 편집 모달 닫기
 */
closeEditor() {
    // 모달 숨기기
    // 상태 초기화
    // Canvas 정리
}
```

### ImageProcessor

#### loadImage(imageUrl)
```javascript
/**
 * 이미지 로드 및 Canvas에 렌더링
 * @param {string} imageUrl - 이미지 URL (Data URI 또는 경로)
 * @returns {Promise<void>}
 */
loadImage(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            this.originalImage = img;
            this.renderToCanvas(img);
            resolve();
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
    });
}
```

#### applyFilter(filterType, intensity)
```javascript
/**
 * 필터 적용
 * @param {string} filterType - 필터 타입
 * @param {number} intensity - 강도 (0-100)
 * @returns {void}
 */
applyFilter(filterType, intensity) {
    // Canvas context에 필터 적용
    // preview 업데이트
}
```

#### applyAdjustment(adjustments)
```javascript
/**
 * 보정 도구 적용
 * @param {Object} adjustments
 *   @param {number} brightness - 밝기 (-100 ~ +100)
 *   @param {number} saturation - 채도 (-100 ~ +100)
 *   @param {number} contrast - 명암 (-100 ~ +100)
 *   @param {number} temperature - 색온도 (-50 ~ +50)
 * @returns {void}
 */
applyAdjustment(adjustments) {
    // ImageData 조작
    // 픽셀 단위로 값 변경
}
```

#### crop(x, y, width, height)
```javascript
/**
 * 이미지 자르기
 * @param {number} x - 시작 X 좌표
 * @param {number} y - 시작 Y 좌표
 * @param {number} width - 너비
 * @param {number} height - 높이
 * @returns {void}
 */
crop(x, y, width, height) {
    // Canvas 크기 조정
    // getImageData 및 putImageData 사용
}
```

#### rotate(angle, backgroundColor)
```javascript
/**
 * 이미지 회전
 * @param {number} angle - 회전 각도 (-180 ~ +180)
 * @param {string} backgroundColor - 배경색 (#RRGGBB)
 * @returns {void}
 */
rotate(angle, backgroundColor) {
    // Canvas 회전 변환
    // 새로운 캔버스 크기 계산
    // 배경색 채우기
}
```

#### addFrame(frameType, frameSize, frameColor)
```javascript
/**
 * 액자 추가
 * @param {string} frameType - 프레임 타입
 * @param {number} frameSize - 프레임 크기 (px)
 * @param {string} frameColor - 프레임 색상
 * @returns {void}
 */
addFrame(frameType, frameSize, frameColor) {
    // 새 캔버스 생성 (프레임 포함)
    // 원본 이미지 중앙에 배치
}
```

#### addSignature(signatureData)
```javascript
/**
 * 서명 추가
 * @param {Object} signatureData
 *   @param {string} type - 'image', 'text', 'template'
 *   @param {string} position - 위치 (9가지)
 *   @param {*} content - 내용 (이미지 또는 텍스트)
 *   @param {Object} style - 스타일 정보
 * @returns {void}
 */
addSignature(signatureData) {
    // 서명 타입별 처리
    // Canvas에 오버레이
}
```

#### addMosaic(areas)
```javascript
/**
 * 모자이크 추가
 * @param {Array} areas - 모자이크 영역 배열
 *   [{ x, y, width, height, pixelSize }, ...]
 * @returns {void}
 */
addMosaic(areas) {
    // 각 영역에 대해 모자이크 처리
    // 픽셀 블록 단위로 평균값 계산
}
```

#### addSticker(stickers)
```javascript
/**
 * 스티커 추가
 * @param {Array} stickers - 스티커 배열
 *   [{ type, content, x, y, width, height, rotation, opacity }, ...]
 * @returns {void}
 */
addSticker(stickers) {
    // 각 스티커 렌더링
    // 위치, 크기, 회전, 투명도 적용
}
```

#### getCanvasData(format)
```javascript
/**
 * Canvas 데이터 추출
 * @param {string} format - 출력 형식 ('dataUrl', 'blob')
 * @returns {string|Blob} - 이미지 데이터
 */
getCanvasData(format) {
    if (format === 'dataUrl') {
        return this.canvas.toDataURL('image/png');
    } else if (format === 'blob') {
        return new Promise(resolve => {
            this.canvas.toBlob(resolve, 'image/png');
        });
    }
}
```

### StateManager

#### pushHistory(action, data)
```javascript
/**
 * 히스토리에 액션 추가
 * @param {string} action - 액션명
 * @param {*} data - 액션 데이터
 */
pushHistory(action, data) {
    // 현재 canvas 상태 저장
    // 히스토리 배열에 추가
    // 최대 크기(10) 제한
}
```

#### undo()
```javascript
/**
 * 실행 취소
 */
undo() {
    // 히스토리에서 이전 상태 로드
    // Canvas에 렌더링
}
```

#### redo()
```javascript
/**
 * 재실행
 */
redo() {
    // 히스토리에서 다음 상태 로드
    // Canvas에 렌더링
}
```

#### reset()
```javascript
/**
 * 원본 이미지로 초기화
 */
reset() {
    // 히스토리 초기화
    // 원본 이미지 로드
    // Canvas 리셋
}
```

---

## 필터 구현 세부사항

### Canvas Filter API 활용
```javascript
// 간단한 필터 (CSS Filter 속성)
canvas.style.filter = `
    grayscale(100%)
    sepia(50%)
    blur(5px)
`;

// 복잡한 필터 (ImageData 조작)
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;

for (let i = 0; i < data.length; i += 4) {
    // R, G, B, A 값 조작
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // 필터 로직 적용
    data[i] = r * (1 + brightness/100);
    data[i + 1] = g * (1 + brightness/100);
    data[i + 2] = b * (1 + brightness/100);
}

ctx.putImageData(imageData, 0, 0);
```

### 필터별 구현 방식

| 필터 | 방식 | 복잡도 |
|-----|------|--------|
| Grayscale | CSS Filter | 낮음 |
| Sepia | CSS Filter | 낮음 |
| Blur | CSS Filter | 낮음 |
| Invert | CSS Filter | 낮음 |
| Brightness | ImageData + 선형 | 중간 |
| Contrast | ImageData + 비선형 | 중간 |
| Saturate | ImageData + HSL | 높음 |
| Hue-Rotate | ImageData + HSL | 높음 |
| Vintage | ImageData 조합 | 높음 |
| Cool | ImageData + 색온도 | 높음 |
| Warm | ImageData + 색온도 | 높음 |
| Charcoal | ImageData + 그레이스케일 | 높음 |
| Sketch | ImageData + 엣지 감지 | 매우 높음 |
| Posterize | ImageData + 양자화 | 높음 |
| Cartoon | ImageData + 필터 조합 | 매우 높음 |

---

## 이벤트 통신

### 에디터와의 이벤트 연동

```javascript
// SmartImageEditorPlugin 내부
this.editor.on('imageEdited', (data) => {
    // 이미지 저장
    this.saveEditedImage(data);
});

// 수정된 이미지를 에디터에 삽입
this.editor.emit('smartImageEdited', {
    imageUrl: canvasDataUrl,
    metadata: {
        originalSize: { width, height },
        editedSize: { width, height },
        edits: [
            { type: 'crop', params: {...} },
            { type: 'filter', params: {...} },
            ...
        ]
    }
});
```

### 플러그인 간 통신

```javascript
// ImagePlugin과의 연동
const imagePlugin = this.editor.plugins.ImagePlugin;

// 선택된 이미지 가져오기
const selectedImage = imagePlugin.getSelectedImage();

// 편집된 이미지 저장
imagePlugin.updateImage(editedImageUrl);
```

---

## 호환성 및 예비 처리

### 브라우저 기능 확인
```javascript
// Canvas 지원 확인
const canvasSupported = !!document.createElement('canvas').getContext;

// ImageData 지원 확인
const imageDataSupported = !!ctx.getImageData;

// Blob 지원 확인
const blobSupported = !!HTMLCanvasElement.prototype.toBlob;
```

### 폴백 처리
```javascript
// 지원하지 않는 필터의 경우 기본 이미지 반환
if (!supportsFilter(filterType)) {
    console.warn(`Filter ${filterType} not supported`);
    return this.originalImage;
}
```

---

## 성능 최적화 전략

### 1. Canvas 렌더링 최적화
```javascript
// 불필요한 렌더링 방지
let renderScheduled = false;

function scheduleRender() {
    if (!renderScheduled) {
        renderScheduled = true;
        requestAnimationFrame(() => {
            render();
            renderScheduled = false;
        });
    }
}
```

### 2. 이미지 데이터 캐싱
```javascript
class ImageProcessor {
    constructor() {
        this.cachedImageData = null;
        this.cachedImageDataVersion = -1;
    }

    getImageData(version) {
        if (this.cachedImageDataVersion === version) {
            return this.cachedImageData;
        }
        // 새로 계산
        this.cachedImageData = ctx.getImageData(...);
        this.cachedImageDataVersion = version;
        return this.cachedImageData;
    }
}
```

### 3. 메모리 관리
```javascript
class StateManager {
    constructor(maxHistory = 10) {
        this.maxHistory = maxHistory;
        this.history = [];
    }

    pushHistory(canvas) {
        // 히스토리 크기 제한
        if (this.history.length >= this.maxHistory) {
            this.history.shift(); // 가장 오래된 항목 제거
        }
        this.history.push(canvas);
    }

    cleanup() {
        // 메모리 해제
        this.history.forEach(canvas => {
            canvas.width = 0;
            canvas.height = 0;
        });
        this.history = [];
    }
}
```

---

## 에러 처리

### 예상 에러 케이스

```javascript
class SmartImageEditorPlugin {
    async openEditor(imageElement) {
        try {
            // 이미지 검증
            if (!imageElement || !(imageElement instanceof HTMLImageElement)) {
                throw new Error('Invalid image element');
            }

            // 이미지 로드
            await this.imageProcessor.loadImage(imageElement.src);

        } catch (error) {
            console.error('Failed to open editor:', error);
            this.showErrorMessage('이미지 편집 중 오류가 발생했습니다.');
        }
    }
}
```

---

## 테스트 전략

### 단위 테스트
- ImageProcessor 메서드별 테스트
- StateManager undo/redo 테스트
- 필터 적용 결과 검증

### 통합 테스트
- 전체 편집 워크플로우
- 플러그인 간 통신
- 이벤트 처리

### 성능 테스트
- 대용량 이미지 처리
- 메모리 누수 모니터링
- Canvas 렌더링 성능

---

## 배포 체크리스트

- [ ] 코드 검토 완료
- [ ] 모든 기능 테스트 완료
- [ ] 브라우저 호환성 검증
- [ ] 성능 최적화 완료
- [ ] 문서화 완료
- [ ] 사용자 가이드 작성
