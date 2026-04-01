# SmartImageEditorPlugin 상세 요구사항

## 📋 개요

**플러그인명**: SmartImageEditorPlugin
**파일 위치**: `js/plugins/SmartImageEditorPlugin.js`
**의존성**: Neditor Core, ImagePlugin
**기술 스택**: Canvas API, ES6+

---

## 기능 명세

### 1. Crop (자르기/크롭)

#### UI
- 선택 영역: 마우스 드래그로 자르기 영역 선택
- 핸들: 모서리와 모서리 중간의 조절점
- 가이드: 1/3 그리드 표시 (비율 제시)

#### 기능
- ✅ 자유 영역 선택
- ✅ 사전 설정 비율 (1:1, 4:3, 16:9, 3:2, 9:16)
- ✅ 픽셀 단위 미세 조정 (입력 필드)
- ✅ 미리보기
- ✅ 취소/적용

#### 파라미터
```javascript
{
    x: 0,           // 시작 X 좌표
    y: 0,           // 시작 Y 좌표
    width: 800,     // 자르기 폭
    height: 600,    // 자르기 높이
    aspectRatio: null // 종횡비 (null=자유, '1:1', '4:3', etc)
}
```

---

### 2. Rotate (회전)

#### UI
- 회전 각도 입력 필드 (-180 ~ 180도)
- 사전 설정 버튼: 90도 시계방향, 반시계방향, 180도 회전
- 실시간 미리보기

#### 기능
- ✅ 자유 각도 회전 (0.1도 단위)
- ✅ 빠른 회전 (90도 단위)
- ✅ 배경색 선택 (회전 후 빈 공간)
- ✅ 자동 캔버스 크기 조정

#### 파라미터
```javascript
{
    angle: 0,               // 회전 각도 (-180 ~ 180)
    backgroundColor: '#ffffff' // 회전 후 배경색
}
```

---

### 3. Filter (필터)

#### 제공 필터 (15가지)
1. **Grayscale** - 흑백
2. **Sepia** - 갈색톤 (빈티지)
3. **Blur** - 흐릿함
4. **Invert** - 색상 반전
5. **Brightness** - 밝기
6. **Contrast** - 명암
7. **Saturate** - 채도
8. **Hue-Rotate** - 색상 회전
9. **Vintage** - 빈티지
10. **Cool** - 차가운 톤
11. **Warm** - 따뜻한 톤
12. **Charcoal** - 연탄 효과
13. **Sketch** - 스케치
14. **Posterize** - 포스터 효과
15. **Cartoon** - 만화 효과

#### UI
- 필터 목록: 그리드 또는 목록
- 각 필터별 강도 조절 슬라이더 (0-100%)
- 실시간 미리보기
- 여러 필터 조합 적용 가능

#### 기능
- ✅ 1회 적용 또는 누적 적용
- ✅ 강도 조절
- ✅ 초기화

#### 파라미터
```javascript
{
    filterType: 'grayscale',  // 필터 타입
    intensity: 100            // 강도 (0-100)
}
```

---

### 4. Adjust (보정)

#### 제공 도구
1. **Brightness** (밝기) - -100 ~ +100
2. **Saturation** (채도) - -100 ~ +100
3. **Contrast** (대비) - -100 ~ +100
4. **Temperature** (색온도) - -50 ~ +50 (파랑 ~ 노랑)

#### UI
- 각 도구별 슬라이더
- 수치 입력 필드
- 실시간 미리보기
- 개별 적용 또는 다중 적용

#### 기능
- ✅ 독립적 조절
- ✅ 누적 적용
- ✅ 초기화

#### 파라미터
```javascript
{
    brightness: 0,      // -100 ~ +100
    saturation: 0,      // -100 ~ +100
    contrast: 0,        // -100 ~ +100
    temperature: 0      // -50 ~ +50
}
```

---

### 5. Frame (액자/프레임)

#### 제공 프레임
- 기본 (검정, 흰색, 회색 테두리)
- 나무 틀
- 금속 틀
- 패턴 틀 (격자, 점, 줄무늬)
- 보더만 (다양한 색상)

#### UI
- 프레임 목록: 미리보기 포함
- 프레임 크기 조절 슬라이더
- 색상 선택 (기본 프레임)
- 실시간 미리보기

#### 기능
- ✅ 프레임 적용
- ✅ 크기 조절 (5px ~ 50px)
- ✅ 색상 변경
- ✅ 제거

#### 파라미터
```javascript
{
    frameType: 'basic',     // 프레임 타입
    frameSize: 10,          // 프레임 크기 (px)
    frameColor: '#000000'   // 프레임 색상
}
```

---

### 6. Signature (서명)

#### 서명 타입

##### 6-1. 이미지 서명
- 이미지 파일 업로드
- 위치 설정 (중앙, 좌상단, 우하단 등)
- 투명도 조절 (0-100%)
- 크기 조절

##### 6-2. 텍스트 서명
- 텍스트 입력
- 폰트 선택 (기본 제공 폰트)
- 폰트 크기
- 색상 선택
- 투명도 조절

##### 6-3. 템플릿 서명
- 날짜 (YYYY-MM-DD 형식)
- 사용자명
- 인장 (도장 모양)
- 조합 (예: "2026-04-01 | 촬영자")

#### UI
- 서명 타입 선택 탭
- 위치 선택 (9가지 위치)
- 각 타입별 옵션 패널
- 실시간 미리보기

#### 기능
- ✅ 타입별 서명 추가
- ✅ 위치 및 크기 조절
- ✅ 투명도 조절
- ✅ 제거

#### 파라미터
```javascript
{
    signatureType: 'text',  // 'image', 'text', 'template'
    position: 'bottom-right', // 9가지 위치
    content: 'Signature',   // 텍스트 또는 이미지 URL
    fontSize: 24,
    color: '#000000',
    opacity: 100,           // 0-100%
    size: { width: 100, height: 50 }
}
```

---

### 7. Mosaic (모자이크)

#### 기능
- 모자이크 영역 선택 (드래그)
- 모자이크 크기 조절 (픽셀 크기)
- 여러 영역 모자이크 가능
- 개별 제거 가능

#### UI
- 모자이크 도구 선택
- 크기 슬라이더 (5px ~ 50px)
- 적용/취소

#### 기능
- ✅ 자유 영역 모자이크
- ✅ 크기 조절
- ✅ 다중 모자이크
- ✅ 개별 제거

#### 파라미터
```javascript
{
    areas: [
        {
            x: 100,
            y: 100,
            width: 150,
            height: 100,
            pixelSize: 10  // 모자이크 블록 크기
        }
    ]
}
```

---

### 8. Sticker (스티커)

#### 제공 스티커
- 이모지 (20+ 종류)
- 아이콘 (화살표, 동그라미, 하트 등)
- 텍스트 말풍선
- 도형 (별, 하트, 동그라미 등)

#### UI
- 스티커 분류 탭
- 스티커 목록 (그리드)
- 각 스티커별 크기/회전 옵션
- 실시간 미리보기

#### 기능
- ✅ 스티커 추가
- ✅ 위치 조절 (드래그)
- ✅ 크기 조절
- ✅ 회전
- ✅ 투명도 조절
- ✅ 개별 제거

#### 파라미터
```javascript
{
    stickers: [
        {
            type: 'emoji',
            content: '😊',
            x: 50,
            y: 50,
            width: 50,
            height: 50,
            rotation: 0,
            opacity: 100
        }
    ]
}
```

---

## UI/UX 요구사항

### 모달 구조
```
┌─────────────────────────────────────┐
│ 스마트 이미지 편집기                │
├─────────────────────────────────────┤
│ [도구 탭]  [도구 탭]  [도구 탭] ... │
├─────────────────────────────────────┤
│  [Canvas 미리보기 영역]             │
│  (1200x600px 또는 반응형)           │
├─────────────────────────────────────┤
│ [옵션 패널]                         │
│ - 슬라이더                          │
│ - 입력 필드                         │
│ - 버튼                              │
├─────────────────────────────────────┤
│ [취소]  [초기화]  [적용]            │
└─────────────────────────────────────┘
```

### 상호작용
- 탭 변경 시 옵션 패널 동적 변경
- 슬라이더/입력 시 실시간 미리보기
- 마우스 호버: 도구 설명 표시
- 저장: Base64 또는 Blob으로 변환

---

## 기술 구현 사항

### Canvas 처리
```javascript
// 1. 원본 이미지 로드
const img = new Image();
img.src = imageUrl;

// 2. Canvas에 그리기
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0);

// 3. 필터 적용 (CSS Filter API)
canvas.style.filter = 'grayscale(100%)';

// 4. 저장
const dataUrl = canvas.toDataURL('image/png');
```

### 이벤트 흐름
```
1. 사용자가 이미지 편집 버튼 클릭
   ↓
2. SmartImageEditorPlugin 모달 오픈
   ↓
3. 원본 이미지 로드 (ImagePlugin에서 가져오기)
   ↓
4. Canvas에 표시
   ↓
5. 도구 선택 및 조작
   ↓
6. 실시간 미리보기
   ↓
7. 적용 클릭
   ↓
8. 수정된 이미지 저장
   ↓
9. Editor 콘텐츠 업데이트
   ↓
10. 모달 닫기
```

### 상태 관리
```javascript
{
    originalImage: Image,
    currentCanvas: Canvas,
    history: [
        { canvas: Canvas, action: 'crop' },
        { canvas: Canvas, action: 'rotate' },
        ...
    ],
    currentEditIndex: 0,
    editState: {
        crop: { ...params },
        rotate: { ...params },
        filters: [{ ...params }],
        adjustments: { ...params },
        frame: { ...params },
        signatures: [{ ...params }],
        mosaics: [{ ...params }],
        stickers: [{ ...params }]
    }
}
```

---

## 호환성

### 브라우저
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### 이미지 형식
- ✅ JPEG
- ✅ PNG
- ✅ WebP
- ✅ GIF (정적 이미지만)

### 제약사항
- 최대 이미지 크기: 10MB
- 최대 캔버스 크기: 4096x4096px (브라우저 제한)

---

## 성능 고려사항

- Canvas 렌더링 최적화 (requestAnimationFrame 사용)
- 이미지 압축 (저장 시 품질 조절)
- 메모리 관리 (Canvas 객체 재사용)
- 히스토리 크기 제한 (최대 10단계)

---

## 테스트 케이스

### 기능 테스트
- [ ] 이미지 업로드 및 로드
- [ ] 각 도구별 기능 정상 작동
- [ ] 실시간 미리보기
- [ ] 다중 도구 조합 적용
- [ ] 취소/재실행
- [ ] 이미지 저장 및 삽입

### 호환성 테스트
- [ ] 모든 지원 브라우저에서 동작
- [ ] 다양한 이미지 형식 지원
- [ ] 반응형 UI 확인

### 성능 테스트
- [ ] 대용량 이미지 처리
- [ ] 메모리 누수 확인
- [ ] Canvas 렌더링 성능
