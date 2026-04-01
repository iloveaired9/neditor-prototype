# SmartImageEditorPlugin 통합 가이드

## 📦 설치 및 로드

### 1. 파일 구조
```
js/plugins/
├── SmartImageEditorPlugin.js (✅ 새로 추가)
├── ImagePlugin.js (기존)
├── ToolbarPlugin.js (기존)
└── ...
```

### 2. script.js에 로드
```javascript
import { SmartImageEditorPlugin } from './js/plugins/SmartImageEditorPlugin.js';

editor.registerPlugin('smartImageEditor', SmartImageEditorPlugin);
```

### 3. style.css에 스타일 추가
```css
/* SmartImageEditorPlugin CSS */
.smart-editor-modal { ... }
.tool-tabs { ... }
.options-panel { ... }
```

---

## 🔌 플러그인 연동

### ImagePlugin과의 연동
SmartImageEditorPlugin은 ImagePlugin의 이미지 위에서 편집 기능을 제공합니다.

#### 구현 방안
```javascript
// 1. ImagePlugin의 이미지 엘리먼트 감지
const images = editor.el.querySelectorAll('img');

// 2. 이미지에 편집 버튼 추가 (hover 시)
images.forEach(img => {
    const editBtn = document.createElement('button');
    editBtn.className = 'img-edit-btn';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', () => {
        editor.plugins.SmartImageEditor.openEditor(img);
    });
    img.parentElement.appendChild(editBtn);
});

// 3. 편집 완료 후 콜백
editor.on('smartImageEdited', (data) => {
    console.log('이미지 편집 완료:', data);
    // 필요한 후처리
});
```

### Toolbar와의 연동 (선택사항)
이미지 편집 버튼을 toolbar에 추가할 수 있습니다.

```javascript
// ToolbarPlugin에 다음 버튼 추가
<button id="editImage" title="Edit Image"><i class="fas fa-wand-magic-sparkles"></i></button>

// ImagePlugin 또는 SmartImageEditorPlugin에서 처리
document.getElementById('editImage').addEventListener('click', () => {
    const selectedImage = getSelectedImage();
    if (selectedImage) {
        editor.plugins.SmartImageEditor.openEditor(selectedImage);
    }
});
```

---

## 🎯 사용 예시

### 기본 사용법
```javascript
// 1. 에디터 생성
const editor = new Neditor({ containerId: 'editor' });

// 2. 플러그인 등록 (script.js에서 자동)
// editor.registerPlugin('smartImageEditor', SmartImageEditorPlugin);

// 3. 이미지 편집 시작
const imageElement = document.querySelector('img.my-image');
editor.plugins.smartImageEditor.openEditor(imageElement);

// 4. 편집 완료 시 이벤트 처리
editor.on('smartImageEdited', (data) => {
    console.log('편집된 이미지 URL:', data.imageUrl);
    console.log('편집 히스토리:', data.metadata.history);
});

// 5. 편집 모달 닫기 (자동으로 닫히지만 필요 시)
editor.plugins.smartImageEditor.closeEditor();
```

---

## 🧪 테스트 방법

### 1. 브라우저 콘솔 테스트
```javascript
// 에디터 객체 확인
console.log(editor.plugins.smartImageEditor);

// 플러그인 초기화 확인
console.log(editor.plugins.smartImageEditor.modal);

// 이미지 편집 테스트
const testImg = new Image();
testImg.src = 'data:image/png;base64,iVBORw0K...';
editor.plugins.smartImageEditor.openEditor(testImg);
```

### 2. 실제 사용 시나리오
```
1. 에디터에서 이미지 삽입 (ImagePlugin)
2. 이미지에 마우스 호버 → 편집 버튼 표시 (구현 필요)
3. 편집 버튼 클릭 → SmartImageEditorPlugin 모달 오픈
4. 각 도구별 편집 수행
5. 적용 버튼 클릭 → 편집된 이미지 저장
6. 모달 자동 닫기
```

---

## 📋 체크리스트

### 필수 구현 항목
- [x] SmartImageEditorPlugin.js 작성
- [x] CSS 스타일 추가
- [x] script.js에 플러그인 로드
- [ ] 이미지 편집 버튼 UI 추가 (선택적)
- [ ] 에러 처리 로직 강화
- [ ] 성능 최적화

### 테스트 항목
- [ ] 각 도구별 기능 테스트
  - [ ] Crop
  - [ ] Rotate
  - [ ] Filter
  - [ ] Adjust
  - [ ] Frame
  - [ ] Signature
  - [ ] Mosaic
  - [ ] Sticker
- [ ] 브라우저 호환성 테스트
- [ ] 대용량 이미지 테스트
- [ ] 메모리 누수 테스트

### 배포 전 확인사항
- [ ] 콘솔 에러 없음
- [ ] 성능 테스트 통과
- [ ] 모든 기능 동작 확인
- [ ] 문서화 완료

---

## 🐛 트러블슈팅

### 문제: 플러그인이 로드되지 않음
**원인**: script.js에서 import를 빼먹었거나 registerPlugin이 실행되지 않음
**해결**:
```javascript
// script.js 확인
import { SmartImageEditorPlugin } from './js/plugins/SmartImageEditorPlugin.js';
editor.registerPlugin('smartImageEditor', SmartImageEditorPlugin);
```

### 문제: 모달이 나타나지 않음
**원인**: CSS가 로드되지 않았거나 modal 엘리먼트가 생성되지 않음
**해결**:
```javascript
// 콘솔에서 확인
console.log(editor.plugins.smartImageEditor.modal);
// 모달이 null이면 _createModal() 재실행
editor.plugins.smartImageEditor._createModal();
```

### 문제: Canvas가 검은색으로 표시됨
**원인**: 이미지가 제대로 로드되지 않았거나 CORS 문제
**해결**:
```javascript
// 이미지 로드 테스트
const img = new Image();
img.crossOrigin = 'anonymous'; // CORS 허용
img.src = imageUrl;
img.onload = () => console.log('이미지 로드 성공');
img.onerror = () => console.error('이미지 로드 실패');
```

### 문제: 필터가 적용되지 않음
**원인**: Canvas filter API 브라우저 미지원 또는 ImageData 조작 오류
**해결**:
```javascript
// 브라우저 호환성 확인
const canvas = document.createElement('canvas');
console.log(canvas.getContext('2d').filter); // 지원 여부 확인

// ImageData 조작 검증
const imageData = ctx.getImageData(0, 0, 100, 100);
console.log(imageData.data.length); // 4*100*100 = 40000 이어야 함
```

---

## 📚 API 레퍼런스

### 주요 메서드

#### `openEditor(imageElement)`
이미지 편집 모달을 엽니다.
```javascript
await editor.plugins.smartImageEditor.openEditor(imageElement);
```

#### `closeEditor()`
편집 모달을 닫습니다.
```javascript
editor.plugins.smartImageEditor.closeEditor();
```

#### `_applyEdits()`
현재 편집 사항을 적용합니다. (내부용)
```javascript
// 자동으로 호출됨 (적용 버튼 클릭 시)
```

#### `_reset()`
편집 상태를 초기화합니다.
```javascript
editor.plugins.smartImageEditor._reset();
```

### 이벤트

#### `smartImageEdited`
이미지 편집이 완료되었을 때 발생합니다.
```javascript
editor.on('smartImageEdited', (data) => {
    console.log(data.imageUrl);      // 편집된 이미지 Data URL
    console.log(data.metadata);      // 편집 정보
});
```

---

## 🚀 최적화 팁

### 1. 성능 개선
- Canvas 크기를 합리적인 범위로 제한 (최대 2048x2048px)
- 히스토리 크기 제한 (최대 10단계)
- requestAnimationFrame 활용

### 2. 메모리 관리
```javascript
// 불필요한 Canvas 객체 정리
canvas.width = 0;
canvas.height = 0;

// 히스토리 정리
this.state.history = [];
```

### 3. 사용자 경험 개선
- 실시간 미리보기 추가
- Undo/Redo 기능 구현
- 저장 중 로딩 표시

---

## 🔐 보안 고려사항

### 1. CORS (Cross-Origin Resource Sharing)
```javascript
// 외부 이미지 사용 시
img.crossOrigin = 'anonymous';
```

### 2. 대용량 이미지 검증
```javascript
// 이미지 크기 확인
if (img.width > 4096 || img.height > 4096) {
    console.warn('이미지가 너무 큽니다');
}
```

### 3. Data URL 크기 제한
```javascript
// Base64 인코딩 시 크기 확인
const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
if (dataUrl.length > 5 * 1024 * 1024) {
    console.warn('편집된 이미지가 5MB를 초과합니다');
}
```

---

## 📞 지원

질문이나 문제가 있으면:
1. 콘솔 에러 메시지 확인
2. 트러블슈팅 섹션 참고
3. GitHub 이슈 등록
