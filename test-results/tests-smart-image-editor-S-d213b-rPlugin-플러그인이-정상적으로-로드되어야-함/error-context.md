# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\smart-image-editor.spec.js >> SmartImageEditorPlugin >> 플러그인이 정상적으로 로드되어야 함
- Location: tests\smart-image-editor.spec.js:21:9

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForFunction: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - heading "Modern Web Editor" [level=1] [ref=e3]
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - button "" [ref=e7] [cursor=pointer]:
            - generic [ref=e8]: 
          - button "" [ref=e9] [cursor=pointer]:
            - generic [ref=e10]: 
          - button "" [ref=e11] [cursor=pointer]:
            - generic [ref=e12]: 
          - button "" [ref=e13] [cursor=pointer]:
            - generic [ref=e14]: 
        - generic [ref=e15]:
          - button "" [ref=e16] [cursor=pointer]:
            - generic [ref=e17]: 
          - button "" [ref=e18] [cursor=pointer]:
            - generic [ref=e19]: 
          - button "" [ref=e20] [cursor=pointer]:
            - generic [ref=e21]: 
        - generic [ref=e22]:
          - button "" [ref=e23] [cursor=pointer]:
            - generic [ref=e24]: 
          - button "" [ref=e25] [cursor=pointer]:
            - generic [ref=e26]: 
        - generic [ref=e27]:
          - combobox "Font Size" [ref=e28] [cursor=pointer]:
            - option "Size" [selected]
            - option "S"
            - option "M"
            - option "L"
            - option "XL"
          - generic [ref=e29]:
            - generic: 
            - textbox "Text Color" [ref=e30] [cursor=pointer]: "#333333"
        - generic [ref=e31]:
          - button "" [ref=e32] [cursor=pointer]:
            - generic [ref=e33]: 
          - button "" [ref=e34] [cursor=pointer]:
            - generic [ref=e35]: 
        - generic [ref=e36]:
          - button "" [ref=e37] [cursor=pointer]:
            - generic [ref=e38]: 
          - button "" [ref=e40] [cursor=pointer]:
            - generic [ref=e41]: 
          - button "" [ref=e42] [cursor=pointer]:
            - generic [ref=e43]: 
          - button "" [ref=e44] [cursor=pointer]:
            - generic [ref=e45]: 
          - button "" [ref=e47] [cursor=pointer]:
            - generic [ref=e48]: 
          - button "" [ref=e49] [cursor=pointer]:
            - generic [ref=e50]: 
      - generic [ref=e51]:
        - button " Editor" [ref=e52] [cursor=pointer]:
          - generic [ref=e53]: 
          - text: Editor
        - button " Source" [ref=e54] [cursor=pointer]:
          - generic [ref=e55]: 
          - text: Source
      - generic [ref=e57]: 이곳을 클릭하여 편집을 시작하세요...
      - generic [ref=e59]: 첨부된 이미지가 없습니다.
  - generic:
    - generic:
      - generic:
        - heading " 내 PC 사진 넣기" [level=3]:
          - generic: 
          - text: 내 PC 사진 넣기
        - button "":
          - generic: 
      - generic:
        - generic:
          - generic:
            - button " 전체삭제":
              - generic: 
              - text: 전체삭제
            - button " 사진/동영상 추가":
              - generic: 
              - text: 사진/동영상 추가
            - generic: (사진을 점선 안으로 끌어 놓을 수 있습니다.)
          - generic:
            - generic:
              - generic:
                - generic: 
                - paragraph: 이미지를 여기에 드롭하거나 버튼을 눌러 추가하세요.
        - generic:
          - generic:
            - heading "사진 정보" [level=4]
            - generic:
              - paragraph: "가로: 0 세로: 0"
              - paragraph: "이름: 없음"
          - generic:
            - heading "사진 정렬" [level=4]
            - generic:
              - generic:
                - generic: 
              - generic:
                - generic: 
              - generic:
                - generic: 
          - generic:
            - generic:
              - checkbox "한줄에 한 장씩 넣기" [checked]
              - text: 한줄에 한 장씩 넣기
            - generic:
              - checkbox "사진 여백 넣기" [checked]
              - text: 사진 여백 넣기
          - generic:
            - heading "크기 줄이기" [level=4]
            - combobox:
              - option "원본 크기"
              - option "1200px"
              - option "1000px"
              - option "800px" [selected]
              - option "600px"
      - generic:
        - button "확인"
        - button "취소"
  - text: +  +                
  - generic:
    - generic:
      - heading " Developer Settings" [level=3]:
        - generic: 
        - text: Developer Settings
      - button "":
        - generic: 
    - generic:
      - heading "Registered Plugins" [level=4]
      - list
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('SmartImageEditorPlugin', () => {
  4   |     test.beforeEach(async ({ page }) => {
  5   |         // 개발 서버 연결
  6   |         await page.goto('http://localhost:3001');
  7   | 
  8   |         // 페이지 로드 대기
  9   |         await page.waitForSelector('#editor');
  10  | 
  11  |         // 플러그인 초기화 대기
> 12  |         await page.waitForFunction(() => {
      |                    ^ Error: page.waitForFunction: Test timeout of 30000ms exceeded.
  13  |             return window.editorInstance &&
  14  |                    window.editorInstance.plugins &&
  15  |                    window.editorInstance.plugins.smartImageEditor;
  16  |         }, { timeout: 5000 });
  17  | 
  18  |         console.log('✅ 에디터 로드 완료');
  19  |     });
  20  | 
  21  |     test('플러그인이 정상적으로 로드되어야 함', async ({ page }) => {
  22  |         // SmartImageEditorPlugin 확인
  23  |         const pluginExists = await page.evaluate(() => {
  24  |             return window.editorInstance.plugins.smartImageEditor !== undefined;
  25  |         });
  26  | 
  27  |         expect(pluginExists).toBe(true);
  28  |         console.log('✅ 플러그인 로드 확인');
  29  |     });
  30  | 
  31  |     test('모달 UI가 정상적으로 생성되어야 함', async ({ page }) => {
  32  |         const modalExists = await page.evaluate(() => {
  33  |             return document.getElementById('smartImageEditorModal') !== null;
  34  |         });
  35  | 
  36  |         expect(modalExists).toBe(true);
  37  |         console.log('✅ 모달 생성 확인');
  38  |     });
  39  | 
  40  |     test('이미지 에디터를 열 수 있어야 함', async ({ page }) => {
  41  |         // 테스트 이미지 생성
  42  |         await page.evaluate(() => {
  43  |             const canvas = document.createElement('canvas');
  44  |             canvas.width = 200;
  45  |             canvas.height = 200;
  46  |             const ctx = canvas.getContext('2d');
  47  |             ctx.fillStyle = '#ff0000';
  48  |             ctx.fillRect(0, 0, 200, 200);
  49  | 
  50  |             window.testImageUrl = canvas.toDataURL();
  51  |         });
  52  | 
  53  |         // 에디터 열기
  54  |         await page.evaluate(() => {
  55  |             const editor = window.editorInstance;
  56  |             const smartEditor = editor.plugins.smartImageEditor;
  57  |             const testImg = new Image();
  58  |             testImg.src = window.testImageUrl;
  59  |             testImg.onload = () => {
  60  |                 smartEditor.openEditor(testImg);
  61  |             };
  62  |         });
  63  | 
  64  |         // 모달 표시 확인
  65  |         await page.waitForTimeout(500);
  66  |         const modalVisible = await page.evaluate(() => {
  67  |             const modal = document.getElementById('smartImageEditorModal');
  68  |             return modal.style.display !== 'none';
  69  |         });
  70  | 
  71  |         expect(modalVisible).toBe(true);
  72  |         console.log('✅ 이미지 에디터 열기 확인');
  73  |     });
  74  | 
  75  |     test('모든 도구 탭이 존재해야 함', async ({ page }) => {
  76  |         const toolTabs = [
  77  |             'crop', 'rotate', 'filter', 'adjust',
  78  |             'frame', 'signature', 'mosaic', 'sticker'
  79  |         ];
  80  | 
  81  |         const allTabsExist = await page.evaluate((tabs) => {
  82  |             return tabs.every(tool => {
  83  |                 const btn = document.querySelector(`[data-tool="${tool}"]`);
  84  |                 return btn !== null;
  85  |             });
  86  |         }, toolTabs);
  87  | 
  88  |         expect(allTabsExist).toBe(true);
  89  |         console.log('✅ 모든 도구 탭 확인');
  90  |     });
  91  | 
  92  |     test('필터가 15개 제공되어야 함', async ({ page }) => {
  93  |         const filterCount = await page.evaluate(() => {
  94  |             return document.querySelectorAll('.filter-btn').length;
  95  |         });
  96  | 
  97  |         expect(filterCount).toBe(15);
  98  |         console.log(`✅ 필터 개수 확인: ${filterCount}개`);
  99  |     });
  100 | 
  101 |     test('Crop 기능이 동작해야 함', async ({ page }) => {
  102 |         // 에디터 열기
  103 |         await page.evaluate(() => {
  104 |             const canvas = document.createElement('canvas');
  105 |             canvas.width = 200;
  106 |             canvas.height = 200;
  107 |             const ctx = canvas.getContext('2d');
  108 |             ctx.fillStyle = '#ff0000';
  109 |             ctx.fillRect(0, 0, 200, 200);
  110 | 
  111 |             const editor = window.editorInstance;
  112 |             const smartEditor = editor.plugins.smartImageEditor;
```