import { Neditor } from './js/core/Neditor.js';
import { ToolbarPlugin } from './js/plugins/ToolbarPlugin.js';
import { ImagePlugin } from './js/plugins/ImagePlugin.js';
import { SmartImageEditorPlugin } from './js/plugins/SmartImageEditorPlugin.js';
import { TablePlugin } from './js/plugins/TablePlugin.js';
import { ScrapPlugin } from './js/plugins/ScrapPlugin.js';
import { YoutubePlugin } from './js/plugins/YoutubePlugin.js';
import { AiPlugin } from './js/plugins/AiPlugin.js';
import { TabPlugin } from './js/plugins/TabPlugin.js';
import { StoragePlugin } from './js/plugins/StoragePlugin.js';
import { SettingsPlugin } from './js/plugins/SettingsPlugin.js';
import { FileManagerPlugin } from './js/plugins/FileManagerPlugin.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Core
    const editor = new Neditor({ containerId: 'editor' });

    // 2. Register Plugins
    editor.registerPlugin('toolbar', ToolbarPlugin);
    editor.registerPlugin('tabs', TabPlugin);
    editor.registerPlugin('image', ImagePlugin);
    editor.registerPlugin('smartImageEditor', SmartImageEditorPlugin);
    editor.registerPlugin('table', TablePlugin);
    editor.registerPlugin('scrap', ScrapPlugin);
    editor.registerPlugin('youtube', YoutubePlugin);
    editor.registerPlugin('ai', AiPlugin);
    editor.registerPlugin('storage', StoragePlugin);
    editor.registerPlugin('fileManager', FileManagerPlugin);
    editor.registerPlugin('settings', SettingsPlugin);

    // 전역 접근 (테스트 및 디버깅용)
    window.editorInstance = editor;

    // 에디터 내 이미지 클릭 시 편집 버튼 표시
    editor.el.addEventListener('click', (e) => {
        // 기존 편집 버튼 제거
        document.querySelectorAll('.smart-edit-overlay').forEach(el => el.remove());

        const img = e.target.closest('img');
        if (!img) return;

        // 편집 오버레이 생성
        const overlay = document.createElement('div');
        overlay.className = 'smart-edit-overlay';
        overlay.innerHTML = `
            <button class="smart-edit-btn" title="이미지 편집">
                <i class="fas fa-magic"></i> 편집
            </button>
        `;

        // 이미지 위에 오버레이 배치
        const rect = img.getBoundingClientRect();
        overlay.style.cssText = `
            position: fixed;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.3);
            z-index: 9999;
            pointer-events: auto;
        `;

        overlay.querySelector('.smart-edit-btn').addEventListener('click', (ev) => {
            ev.stopPropagation();
            overlay.remove();
            const smartEditor = editor.plugins.smartImageEditor;
            if (smartEditor) {
                smartEditor.openEditor(img);
            } else {
                alert('SmartImageEditorPlugin이 로드되지 않았습니다.');
            }
        });

        // 오버레이 바깥 클릭 시 제거
        overlay.addEventListener('click', (ev) => {
            if (ev.target === overlay) overlay.remove();
        });

        document.body.appendChild(overlay);
    });

    console.log('Neditor modular ES system ready.');
});
