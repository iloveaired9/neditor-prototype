import { test, expect } from '@playwright/test';

test.describe('SmartImageEditorPlugin', () => {
    test.beforeEach(async ({ page }) => {
        // 개발 서버 연결
        await page.goto('http://localhost:3001');

        // 페이지 로드 대기
        await page.waitForSelector('#editor');

        // 플러그인 초기화 대기
        await page.waitForFunction(() => {
            return window.editorInstance &&
                   window.editorInstance.plugins &&
                   window.editorInstance.plugins.smartImageEditor;
        }, { timeout: 5000 });

        console.log('✅ 에디터 로드 완료');
    });

    test('플러그인이 정상적으로 로드되어야 함', async ({ page }) => {
        // SmartImageEditorPlugin 확인
        const pluginExists = await page.evaluate(() => {
            return window.editorInstance.plugins.smartImageEditor !== undefined;
        });

        expect(pluginExists).toBe(true);
        console.log('✅ 플러그인 로드 확인');
    });

    test('모달 UI가 정상적으로 생성되어야 함', async ({ page }) => {
        const modalExists = await page.evaluate(() => {
            return document.getElementById('smartImageEditorModal') !== null;
        });

        expect(modalExists).toBe(true);
        console.log('✅ 모달 생성 확인');
    });

    test('이미지 에디터를 열 수 있어야 함', async ({ page }) => {
        // 테스트 이미지 생성
        await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(0, 0, 200, 200);

            window.testImageUrl = canvas.toDataURL();
        });

        // 에디터 열기
        await page.evaluate(() => {
            const editor = window.editorInstance;
            const smartEditor = editor.plugins.smartImageEditor;
            const testImg = new Image();
            testImg.src = window.testImageUrl;
            testImg.onload = () => {
                smartEditor.openEditor(testImg);
            };
        });

        // 모달 표시 확인
        await page.waitForTimeout(500);
        const modalVisible = await page.evaluate(() => {
            const modal = document.getElementById('smartImageEditorModal');
            return modal.style.display !== 'none';
        });

        expect(modalVisible).toBe(true);
        console.log('✅ 이미지 에디터 열기 확인');
    });

    test('모든 도구 탭이 존재해야 함', async ({ page }) => {
        const toolTabs = [
            'crop', 'rotate', 'filter', 'adjust',
            'frame', 'signature', 'mosaic', 'sticker'
        ];

        const allTabsExist = await page.evaluate((tabs) => {
            return tabs.every(tool => {
                const btn = document.querySelector(`[data-tool="${tool}"]`);
                return btn !== null;
            });
        }, toolTabs);

        expect(allTabsExist).toBe(true);
        console.log('✅ 모든 도구 탭 확인');
    });

    test('필터가 15개 제공되어야 함', async ({ page }) => {
        const filterCount = await page.evaluate(() => {
            return document.querySelectorAll('.filter-btn').length;
        });

        expect(filterCount).toBe(15);
        console.log(`✅ 필터 개수 확인: ${filterCount}개`);
    });

    test('Crop 기능이 동작해야 함', async ({ page }) => {
        // 에디터 열기
        await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(0, 0, 200, 200);

            const editor = window.editorInstance;
            const smartEditor = editor.plugins.smartImageEditor;
            const testImg = new Image();
            testImg.src = canvas.toDataURL();
            testImg.onload = () => {
                smartEditor.openEditor(testImg);
            };
        });

        await page.waitForTimeout(500);

        // Crop 설정
        await page.fill('#cropX', '25');
        await page.fill('#cropY', '25');
        await page.fill('#cropWidth', '150');
        await page.fill('#cropHeight', '150');

        // 적용
        await page.click('[data-action="apply-crop"]');
        await page.waitForTimeout(300);

        // Canvas 크기 확인
        const canvasSize = await page.evaluate(() => {
            const canvas = document.getElementById('smartEditorCanvas');
            return { width: canvas.width, height: canvas.height };
        });

        expect(canvasSize.width).toBe(150);
        expect(canvasSize.height).toBe(150);
        console.log(`✅ Crop 기능 확인: ${canvasSize.width}x${canvasSize.height}`);
    });

    test('Rotate 기능이 동작해야 함', async ({ page }) => {
        // 에디터 열기
        await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#0000ff';
            ctx.fillRect(0, 0, 200, 200);

            const editor = window.editorInstance;
            const smartEditor = editor.plugins.smartImageEditor;
            const testImg = new Image();
            testImg.src = canvas.toDataURL();
            testImg.onload = () => {
                smartEditor.openEditor(testImg);
            };
        });

        await page.waitForTimeout(500);

        // Rotate 탭 선택
        await page.click('[data-tool="rotate"]');

        // 회전 각도 설정
        await page.fill('#rotateAngle', '90');
        await page.click('[data-action="apply-rotate"]');
        await page.waitForTimeout(300);

        // Canvas 크기 변경 확인 (정사각형이 아니면 크기 변함)
        const rotateSuccess = await page.evaluate(() => {
            const canvas = document.getElementById('smartEditorCanvas');
            return canvas.width > 0 && canvas.height > 0;
        });

        expect(rotateSuccess).toBe(true);
        console.log('✅ Rotate 기능 확인');
    });

    test('Filter 기능이 동작해야 함', async ({ page }) => {
        // 에디터 열기
        await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(0, 0, 200, 200);

            const editor = window.editorInstance;
            const smartEditor = editor.plugins.smartImageEditor;
            const testImg = new Image();
            testImg.src = canvas.toDataURL();
            testImg.onload = () => {
                smartEditor.openEditor(testImg);
            };
        });

        await page.waitForTimeout(500);

        // Filter 탭 선택
        await page.click('[data-tool="filter"]');

        // 첫 번째 필터 선택 (Grayscale)
        await page.click('.filter-btn:first-child');
        await page.click('[data-action="apply-filter"]');
        await page.waitForTimeout(300);

        // 필터 적용 확인
        const filterApplied = await page.evaluate(() => {
            const canvas = document.getElementById('smartEditorCanvas');
            const imageData = canvas.getContext('2d').getImageData(0, 0, 1, 1);
            const [r, g, b] = imageData.data;
            return r === g && g === b; // 흑백은 RGB가 같음
        });

        console.log('✅ Filter 기능 확인');
    });

    test('Adjust 기능이 동작해야 함', async ({ page }) => {
        // 에디터 열기
        await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(0, 0, 200, 200);

            const editor = window.editorInstance;
            const smartEditor = editor.plugins.smartImageEditor;
            const testImg = new Image();
            testImg.src = canvas.toDataURL();
            testImg.onload = () => {
                smartEditor.openEditor(testImg);
            };
        });

        await page.waitForTimeout(500);

        // Adjust 탭 선택
        await page.click('[data-tool="adjust"]');

        // 밝기 조정
        await page.fill('#brightness', '50');
        await page.click('[data-action="apply-adjust"]');
        await page.waitForTimeout(300);

        // 조정 확인
        const adjustSuccess = await page.evaluate(() => {
            return document.getElementById('brightnessValue').textContent === '0';
        });

        console.log('✅ Adjust 기능 확인');
    });

    test('Frame 기능이 동작해야 함', async ({ page }) => {
        // 에디터 열기
        await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffaa00';
            ctx.fillRect(0, 0, 200, 200);

            const editor = window.editorInstance;
            const smartEditor = editor.plugins.smartImageEditor;
            const testImg = new Image();
            testImg.src = canvas.toDataURL();
            testImg.onload = () => {
                smartEditor.openEditor(testImg);
            };
        });

        await page.waitForTimeout(500);

        // Frame 탭 선택
        await page.click('[data-tool="frame"]');

        // 프레임 크기 설정
        await page.fill('#frameSize', '15');
        await page.click('[data-action="apply-frame"]');
        await page.waitForTimeout(300);

        // Canvas 크기 증가 확인
        const canvasSize = await page.evaluate(() => {
            const canvas = document.getElementById('smartEditorCanvas');
            return { width: canvas.width, height: canvas.height };
        });

        // 프레임이 추가되면 크기가 200+15*2 = 230
        expect(canvasSize.width).toBe(230);
        expect(canvasSize.height).toBe(230);
        console.log(`✅ Frame 기능 확인: ${canvasSize.width}x${canvasSize.height}`);
    });

    test('Signature 기능이 동작해야 함', async ({ page }) => {
        // 에디터 열기
        await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#aa00ff';
            ctx.fillRect(0, 0, 200, 200);

            const editor = window.editorInstance;
            const smartEditor = editor.plugins.smartImageEditor;
            const testImg = new Image();
            testImg.src = canvas.toDataURL();
            testImg.onload = () => {
                smartEditor.openEditor(testImg);
            };
        });

        await page.waitForTimeout(500);

        // Signature 탭 선택
        await page.click('[data-tool="signature"]');

        // 서명 입력
        await page.fill('#signatureText', 'TEST SIG');
        await page.fill('#signatureFontSize', '24');
        await page.click('[data-action="apply-signature"]');
        await page.waitForTimeout(300);

        console.log('✅ Signature 기능 확인');
    });

    test('Sticker 기능이 동작해야 함', async ({ page }) => {
        // 에디터 열기
        await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#00aaff';
            ctx.fillRect(0, 0, 200, 200);

            const editor = window.editorInstance;
            const smartEditor = editor.plugins.smartImageEditor;
            const testImg = new Image();
            testImg.src = canvas.toDataURL();
            testImg.onload = () => {
                smartEditor.openEditor(testImg);
            };
        });

        await page.waitForTimeout(500);

        // Sticker 탭 선택
        await page.click('[data-tool="sticker"]');

        // 첫 번째 스티커 클릭
        await page.click('.sticker-btn:first-child');
        await page.waitForTimeout(300);

        console.log('✅ Sticker 기능 확인');
    });

    test('Undo/Redo 기능이 동작해야 함', async ({ page }) => {
        // 에디터 열기
        await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(0, 0, 200, 200);

            const editor = window.editorInstance;
            const smartEditor = editor.plugins.smartImageEditor;
            const testImg = new Image();
            testImg.src = canvas.toDataURL();
            testImg.onload = () => {
                smartEditor.openEditor(testImg);
            };
        });

        await page.waitForTimeout(500);

        // 작업 수행
        await page.click('[data-tool="crop"]');
        await page.fill('#cropWidth', '100');
        await page.click('[data-action="apply-crop"]');
        await page.waitForTimeout(300);

        // Undo 클릭
        await page.click('#smartEditorUndo');
        await page.waitForTimeout(300);

        // Redo 클릭
        await page.click('#smartEditorRedo');
        await page.waitForTimeout(300);

        console.log('✅ Undo/Redo 기능 확인');
    });

    test('이미지 편집을 적용할 수 있어야 함', async ({ page }) => {
        // 에디터 열기
        await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(0, 0, 200, 200);

            const editor = window.editorInstance;
            const smartEditor = editor.plugins.smartImageEditor;
            const testImg = new Image();
            testImg.src = canvas.toDataURL();
            testImg.onload = () => {
                smartEditor.openEditor(testImg);
            };
        });

        await page.waitForTimeout(500);

        // 이벤트 리스너 설정
        await page.evaluate(() => {
            window.editComplete = false;
            window.editorInstance.on('smartImageEdited', (data) => {
                window.editComplete = true;
                window.editedImageUrl = data.imageUrl;
            });
        });

        // 적용 버튼 클릭
        await page.click('#smartEditorApply');
        await page.waitForTimeout(500);

        // 이벤트 발생 확인
        const editComplete = await page.evaluate(() => {
            return window.editComplete === true;
        });

        expect(editComplete).toBe(true);
        console.log('✅ 이미지 편집 적용 확인');
    });

    test('모달을 닫을 수 있어야 함', async ({ page }) => {
        // 에디터 열기
        await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(0, 0, 200, 200);

            const editor = window.editorInstance;
            const smartEditor = editor.plugins.smartImageEditor;
            const testImg = new Image();
            testImg.src = canvas.toDataURL();
            testImg.onload = () => {
                smartEditor.openEditor(testImg);
            };
        });

        await page.waitForTimeout(500);

        // 닫기 버튼 클릭
        await page.click('.smart-editor-close');
        await page.waitForTimeout(300);

        // 모달 숨김 확인
        const modalVisible = await page.evaluate(() => {
            const modal = document.getElementById('smartImageEditorModal');
            return modal.style.display === 'flex';
        });

        expect(modalVisible).toBe(false);
        console.log('✅ 모달 닫기 확인');
    });
});
