# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\smart-image-editor.spec.js >> SmartImageEditorPlugin >> 이미지 에디터를 열 수 있어야 함
- Location: tests\smart-image-editor.spec.js:40:9

# Error details

```
Error: page.waitForFunction: Target page, context or browser has been closed
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
      |                    ^ Error: page.waitForFunction: Target page, context or browser has been closed
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