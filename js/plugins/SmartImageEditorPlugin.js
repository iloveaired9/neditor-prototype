/**
 * SmartImageEditorPlugin.js
 * 고급 이미지 편집 기능을 제공하는 플러그인
 * - Crop, Rotate, Filter, Adjust, Frame, Signature, Mosaic, Sticker
 */
import { ApiService } from '../utils/ApiService.js';

export class SmartImageEditorPlugin {
    constructor(editor) {
        this.editor = editor;
        this.modal = null;
        this.canvas = null;
        this.ctx = null;
        this.originalImage = null;
        this.currentTool = null;
        this.selectedImageElement = null;
        this.previewCanvas = null;

        // 상태 관리
        this.state = {
            history: [],
            historyIndex: -1,
            maxHistory: 10
        };

        // 편집 상태
        this.editState = {
            crop: { x: 0, y: 0, width: 0, height: 0, aspectRatio: null },
            rotate: { angle: 0, backgroundColor: '#ffffff' },
            filters: [],
            adjustments: { brightness: 0, saturation: 0, contrast: 0, temperature: 0 },
            frame: { type: null, size: 0, color: '#000000' },
            signatures: [],
            mosaics: [],
            stickers: []
        };

        // 필터 정의
        this.filters = {
            grayscale: { name: '흑백', apply: this._applyGrayscale.bind(this) },
            sepia: { name: '세피아', apply: this._applySepia.bind(this) },
            blur: { name: '흐릿함', apply: this._applyBlur.bind(this) },
            invert: { name: '반전', apply: this._applyInvert.bind(this) },
            brightness: { name: '밝기', apply: this._applyBrightness.bind(this) },
            contrast: { name: '명암', apply: this._applyContrast.bind(this) },
            saturate: { name: '채도', apply: this._applySaturate.bind(this) },
            'hue-rotate': { name: '색상', apply: this._applyHueRotate.bind(this) },
            vintage: { name: '빈티지', apply: this._applyVintage.bind(this) },
            cool: { name: '차가움', apply: this._applyCool.bind(this) },
            warm: { name: '따뜻함', apply: this._applyWarm.bind(this) },
            charcoal: { name: '연탄', apply: this._applyCharcoal.bind(this) },
            sketch: { name: '스케치', apply: this._applySketch.bind(this) },
            posterize: { name: '포스터', apply: this._applyPosterize.bind(this) },
            cartoon: { name: '만화', apply: this._applyCartoon.bind(this) }
        };

        // 스티커 데이터
        this.stickers = {
            emoji: ['😊', '😂', '😍', '🤔', '😢', '❤️', '👍', '🎉', '🔥', '💯'],
            icons: ['✓', '✕', '►', '⬅', '➡', '⬇', '⬆', '★', '☆', '◆'],
            shapes: ['●', '○', '■', '□', '▲', '△', '◈', '♠', '♥', '♣']
        };
    }

    init() {
        console.log('SmartImageEditorPlugin initializing...');
        this._createModal();
        this._setupEvents();
    }

    /**
     * 이미지 편집 모달 생성
     */
    _createModal() {
        const existingModal = document.getElementById('smartImageEditorModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'smartImageEditorModal';
        modal.className = 'smart-editor-modal';
        modal.innerHTML = `
            <div class="smart-editor-container">
                <div class="smart-editor-header">
                    <h2>스마트 이미지 편집</h2>
                    <button class="smart-editor-close" title="닫기">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="smart-editor-body">
                    <!-- 도구 탭 -->
                    <div class="tool-tabs">
                        <button class="tool-tab active" data-tool="crop" title="자르기">
                            <i class="fas fa-crop"></i>
                            <span>자르기</span>
                        </button>
                        <button class="tool-tab" data-tool="rotate" title="회전">
                            <i class="fas fa-rotate-right"></i>
                            <span>회전</span>
                        </button>
                        <button class="tool-tab" data-tool="filter" title="필터">
                            <i class="fas fa-wand-magic-sparkles"></i>
                            <span>필터</span>
                        </button>
                        <button class="tool-tab" data-tool="adjust" title="보정">
                            <i class="fas fa-sliders"></i>
                            <span>보정</span>
                        </button>
                        <button class="tool-tab" data-tool="frame" title="액자">
                            <i class="fas fa-square"></i>
                            <span>액자</span>
                        </button>
                        <button class="tool-tab" data-tool="signature" title="서명">
                            <i class="fas fa-pen"></i>
                            <span>서명</span>
                        </button>
                        <button class="tool-tab" data-tool="mosaic" title="모자이크">
                            <i class="fas fa-th"></i>
                            <span>모자이크</span>
                        </button>
                        <button class="tool-tab" data-tool="sticker" title="스티커">
                            <i class="fas fa-star"></i>
                            <span>스티커</span>
                        </button>
                    </div>

                    <!-- Canvas 미리보기 -->
                    <div class="canvas-wrapper">
                        <canvas id="smartEditorCanvas" class="smart-editor-canvas"></canvas>
                    </div>

                    <!-- 옵션 패널 -->
                    <div class="options-panel" id="optionsPanel">
                        <!-- 자르기 옵션 -->
                        <div class="tool-options active" data-tool="crop">
                            <div class="option-group">
                                <label>종횡비</label>
                                <select id="cropAspectRatio">
                                    <option value="free">자유</option>
                                    <option value="1:1">1:1</option>
                                    <option value="4:3">4:3</option>
                                    <option value="16:9">16:9</option>
                                    <option value="3:2">3:2</option>
                                    <option value="9:16">9:16</option>
                                </select>
                            </div>
                            <div class="option-group">
                                <label>X</label>
                                <input type="number" id="cropX" value="0" min="0">
                            </div>
                            <div class="option-group">
                                <label>Y</label>
                                <input type="number" id="cropY" value="0" min="0">
                            </div>
                            <div class="option-group">
                                <label>너비</label>
                                <input type="number" id="cropWidth" value="0" min="0">
                            </div>
                            <div class="option-group">
                                <label>높이</label>
                                <input type="number" id="cropHeight" value="0" min="0">
                            </div>
                            <button class="option-apply-btn" data-action="apply-crop">적용</button>
                        </div>

                        <!-- 회전 옵션 -->
                        <div class="tool-options" data-tool="rotate">
                            <div class="option-group">
                                <label>회전 각도 (-180 ~ 180)</label>
                                <input type="range" id="rotateAngle" min="-180" max="180" value="0">
                                <span id="rotateAngleValue">0°</span>
                            </div>
                            <div class="option-group">
                                <label>배경색</label>
                                <input type="color" id="rotateBgColor" value="#ffffff">
                            </div>
                            <div class="quick-rotate-buttons">
                                <button class="quick-btn" data-angle="-90">-90°</button>
                                <button class="quick-btn" data-angle="90">+90°</button>
                                <button class="quick-btn" data-angle="180">180°</button>
                            </div>
                            <button class="option-apply-btn" data-action="apply-rotate">적용</button>
                        </div>

                        <!-- 필터 옵션 -->
                        <div class="tool-options" data-tool="filter">
                            <div class="filter-list" id="filterList"></div>
                            <div class="option-group">
                                <label>강도</label>
                                <input type="range" id="filterIntensity" min="0" max="100" value="100">
                                <span id="filterIntensityValue">100%</span>
                            </div>
                            <button class="option-apply-btn" data-action="apply-filter">적용</button>
                        </div>

                        <!-- 보정 옵션 -->
                        <div class="tool-options" data-tool="adjust">
                            <div class="option-group">
                                <label>밝기</label>
                                <input type="range" id="brightness" min="-100" max="100" value="0">
                                <span id="brightnessValue">0</span>
                            </div>
                            <div class="option-group">
                                <label>채도</label>
                                <input type="range" id="saturation" min="-100" max="100" value="0">
                                <span id="saturationValue">0</span>
                            </div>
                            <div class="option-group">
                                <label>명암</label>
                                <input type="range" id="contrast" min="-100" max="100" value="0">
                                <span id="contrastValue">0</span>
                            </div>
                            <div class="option-group">
                                <label>색온도</label>
                                <input type="range" id="temperature" min="-50" max="50" value="0">
                                <span id="temperatureValue">0</span>
                            </div>
                            <button class="option-apply-btn" data-action="apply-adjust">적용</button>
                        </div>

                        <!-- 액자 옵션 -->
                        <div class="tool-options" data-tool="frame">
                            <div class="option-group">
                                <label>프레임 타입</label>
                                <select id="frameType">
                                    <option value="basic-black">검정 테두리</option>
                                    <option value="basic-white">흰색 테두리</option>
                                    <option value="double">이중 테두리</option>
                                </select>
                            </div>
                            <div class="option-group">
                                <label>크기 (px)</label>
                                <input type="range" id="frameSize" min="5" max="50" value="10">
                                <span id="frameSizeValue">10px</span>
                            </div>
                            <div class="option-group">
                                <label>색상</label>
                                <input type="color" id="frameColor" value="#000000">
                            </div>
                            <button class="option-apply-btn" data-action="apply-frame">적용</button>
                        </div>

                        <!-- 서명 옵션 -->
                        <div class="tool-options" data-tool="signature">
                            <div class="signature-tabs">
                                <button class="sig-tab active" data-sig-type="text">텍스트</button>
                                <button class="sig-tab" data-sig-type="template">템플릿</button>
                            </div>
                            <div class="option-group">
                                <label>위치</label>
                                <select id="signaturePosition">
                                    <option value="top-left">좌상단</option>
                                    <option value="top-center">중상단</option>
                                    <option value="top-right">우상단</option>
                                    <option value="center-left">좌중단</option>
                                    <option value="center-center">중앙</option>
                                    <option value="center-right">우중단</option>
                                    <option value="bottom-left">좌하단</option>
                                    <option value="bottom-center">중하단</option>
                                    <option value="bottom-right">우하단</option>
                                </select>
                            </div>
                            <div id="signatureTextOptions" class="option-group">
                                <label>서명 텍스트</label>
                                <input type="text" id="signatureText" placeholder="서명 입력">
                                <label>폰트 크기</label>
                                <input type="number" id="signatureFontSize" value="24" min="10" max="72">
                                <label>색상</label>
                                <input type="color" id="signatureColor" value="#000000">
                            </div>
                            <div id="signatureTemplateOptions" class="option-group" style="display:none;">
                                <label>템플릿</label>
                                <select id="signatureTemplate">
                                    <option value="date">날짜</option>
                                    <option value="stamp">인장</option>
                                </select>
                            </div>
                            <button class="option-apply-btn" data-action="apply-signature">적용</button>
                        </div>

                        <!-- 모자이크 옵션 -->
                        <div class="tool-options" data-tool="mosaic">
                            <div class="option-group">
                                <label>모자이크 크기 (px)</label>
                                <input type="range" id="mosaicPixelSize" min="5" max="50" value="10">
                                <span id="mosaicPixelSizeValue">10px</span>
                            </div>
                            <input type="text" id="mosaicArea" placeholder="x,y,w,h,size 형식으로 입력" style="width:100%; margin:10px 0; padding:8px;">
                            <button class="option-apply-btn" data-action="apply-mosaic">적용</button>
                        </div>

                        <!-- 스티커 옵션 -->
                        <div class="tool-options" data-tool="sticker">
                            <div class="sticker-categories">
                                <button class="sticker-category active" data-category="emoji">이모지</button>
                                <button class="sticker-category" data-category="icons">아이콘</button>
                                <button class="sticker-category" data-category="shapes">도형</button>
                            </div>
                            <div class="sticker-grid" id="stickerGrid"></div>
                        </div>
                    </div>
                </div>

                <!-- 하단 버튼 -->
                <div class="smart-editor-footer">
                    <button id="smartEditorReset" class="btn-secondary">
                        <i class="fas fa-redo"></i> 초기화
                    </button>
                    <button id="smartEditorUndo" class="btn-secondary">
                        <i class="fas fa-undo"></i> 취소
                    </button>
                    <button id="smartEditorRedo" class="btn-secondary">
                        <i class="fas fa-redo"></i> 재실행
                    </button>
                    <button id="smartEditorCancel" class="btn-secondary">
                        <i class="fas fa-times"></i> 취소
                    </button>
                    <button id="smartEditorApply" class="btn-primary">
                        <i class="fas fa-check"></i> 적용
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;
    }

    /**
     * 이벤트 설정
     */
    _setupEvents() {
        // 모달 닫기
        this.modal.querySelector('.smart-editor-close').addEventListener('click', () => this.closeEditor());
        this.modal.querySelector('#smartEditorCancel').addEventListener('click', () => this.closeEditor());

        // 도구 탭 클릭
        this.modal.querySelectorAll('.tool-tab').forEach(btn => {
            btn.addEventListener('click', (e) => this._selectTool(btn.dataset.tool));
        });

        // 옵션 변경 이벤트
        this._setupOptionEvents();

        // 적용, 초기화, 취소 버튼
        this.modal.querySelector('#smartEditorApply').addEventListener('click', () => this._applyEdits());
        this.modal.querySelector('#smartEditorReset').addEventListener('click', () => this._reset());
        this.modal.querySelector('#smartEditorUndo').addEventListener('click', () => this._undo());
        this.modal.querySelector('#smartEditorRedo').addEventListener('click', () => this._redo());

        // Canvas 설정
        this.canvas = this.modal.querySelector('#smartEditorCanvas');
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * 옵션 이벤트 설정
     */
    _setupOptionEvents() {
        // 자르기 옵션
        this.modal.querySelector('#cropAspectRatio').addEventListener('change', (e) => {
            this.editState.crop.aspectRatio = e.target.value === 'free' ? null : e.target.value;
        });

        ['cropX', 'cropY', 'cropWidth', 'cropHeight'].forEach(id => {
            this.modal.querySelector(`#${id}`).addEventListener('change', (e) => {
                const key = id.replace('crop', '').toLowerCase();
                this.editState.crop[key] = parseInt(e.target.value);
            });
        });

        // 회전 각도
        const rotateAngleInput = this.modal.querySelector('#rotateAngle');
        rotateAngleInput.addEventListener('input', (e) => {
            const angle = parseFloat(e.target.value);
            this.editState.rotate.angle = angle;
            this.modal.querySelector('#rotateAngleValue').textContent = `${angle}°`;
        });

        // 빠른 회전 버튼
        this.modal.querySelectorAll('.quick-rotate-buttons .quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const angle = parseFloat(btn.dataset.angle);
                rotateAngleInput.value = angle;
                this.editState.rotate.angle = angle;
                this.modal.querySelector('#rotateAngleValue').textContent = `${angle}°`;
            });
        });

        // 배경색
        this.modal.querySelector('#rotateBgColor').addEventListener('change', (e) => {
            this.editState.rotate.backgroundColor = e.target.value;
        });

        // 필터 선택
        this._createFilterList();

        // 보정 옵션
        ['brightness', 'saturation', 'contrast', 'temperature'].forEach(prop => {
            const input = this.modal.querySelector(`#${prop}`);
            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                this.editState.adjustments[prop] = value;
                this.modal.querySelector(`#${prop}Value`).textContent = value;
            });
        });

        // 액자 옵션
        this.modal.querySelector('#frameSize').addEventListener('input', (e) => {
            const size = parseFloat(e.target.value);
            this.editState.frame.size = size;
            this.modal.querySelector('#frameSizeValue').textContent = `${size}px`;
        });

        this.modal.querySelector('#frameColor').addEventListener('change', (e) => {
            this.editState.frame.color = e.target.value;
        });

        this.modal.querySelector('#frameType').addEventListener('change', (e) => {
            this.editState.frame.type = e.target.value;
        });

        // 서명 탭
        this.modal.querySelectorAll('.signature-tabs .sig-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                this.modal.querySelectorAll('.sig-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const sigType = btn.dataset.sigType;
                const textOptions = this.modal.querySelector('#signatureTextOptions');
                const templateOptions = this.modal.querySelector('#signatureTemplateOptions');
                if (sigType === 'text') {
                    textOptions.style.display = 'block';
                    templateOptions.style.display = 'none';
                } else {
                    textOptions.style.display = 'none';
                    templateOptions.style.display = 'block';
                }
            });
        });

        // 모자이크 크기
        const mosaicSizeInput = this.modal.querySelector('#mosaicPixelSize');
        mosaicSizeInput.addEventListener('input', (e) => {
            const size = parseFloat(e.target.value);
            this.modal.querySelector('#mosaicPixelSizeValue').textContent = `${size}px`;
        });

        // 스티커 카테고리
        this.modal.querySelectorAll('.sticker-category').forEach(btn => {
            btn.addEventListener('click', () => {
                this.modal.querySelectorAll('.sticker-category').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this._createStickerGrid(btn.dataset.category);
            });
        });

        // 적용 버튼들
        this.modal.querySelectorAll('.option-apply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this._executeAction(action);
            });
        });

        // 스티커 선택
        this._createStickerGrid('emoji');
    }

    /**
     * 필터 목록 생성
     */
    _createFilterList() {
        const filterList = this.modal.querySelector('#filterList');
        filterList.innerHTML = '';

        Object.keys(this.filters).forEach(filterKey => {
            const filter = this.filters[filterKey];
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = filter.name;
            btn.dataset.filter = filterKey;
            btn.addEventListener('click', () => {
                this.modal.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = filterKey;
            });
            filterList.appendChild(btn);
        });
    }

    /**
     * 스티커 그리드 생성
     */
    _createStickerGrid(category) {
        const grid = this.modal.querySelector('#stickerGrid');
        grid.innerHTML = '';

        const stickers = this.stickers[category] || [];
        stickers.forEach(sticker => {
            const btn = document.createElement('button');
            btn.className = 'sticker-btn';
            btn.textContent = sticker;
            btn.addEventListener('click', () => this._addSticker(sticker));
            grid.appendChild(btn);
        });
    }

    /**
     * 에디터 열기
     */
    async openEditor(imageElement) {
        if (!imageElement) {
            console.error('Image element not provided');
            return;
        }

        try {
            this.selectedImageElement = imageElement;
            this.modal.style.display = 'flex';

            // 원본 이미지 URL 저장 (편집 후 src가 변경돼도 추적 가능)
            if (!imageElement.__originalImageUrl) {
                imageElement.__originalImageUrl = imageElement.src;
            }

            // 이미지 편집용 고유 ID 생성 (처음 한 번만)
            if (!imageElement.__smartImageEditId) {
                imageElement.__smartImageEditId = this._generateUUID();
            }

            // 이미지 로드
            await this._loadImage(imageElement.src);
            this._render();
        } catch (error) {
            console.error('Failed to open editor:', error);
            alert('이미지 편집을 열 수 없습니다.');
        }
    }

    /**
     * 이미지 로드
     */
    async _loadImage(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                this.originalImage = img;
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this._pushHistory('init');
                resolve();
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = imageUrl;
        });
    }

    /**
     * 도구 선택
     */
    _selectTool(toolName) {
        // 탭 활성화
        this.modal.querySelectorAll('.tool-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        this.modal.querySelector(`[data-tool="${toolName}"]`).classList.add('active');

        // 옵션 패널 전환
        this.modal.querySelectorAll('.tool-options').forEach(panel => {
            panel.classList.remove('active');
        });
        this.modal.querySelector(`.tool-options[data-tool="${toolName}"]`).classList.add('active');

        this.currentTool = toolName;
    }

    /**
     * 액션 실행
     */
    _executeAction(action) {
        switch(action) {
            case 'apply-crop':
                this._applyCrop();
                break;
            case 'apply-rotate':
                this._applyRotate();
                break;
            case 'apply-filter':
                this._applyFilterAction();
                break;
            case 'apply-adjust':
                this._applyAdjustAction();
                break;
            case 'apply-frame':
                this._applyFrameAction();
                break;
            case 'apply-signature':
                this._applySignatureAction();
                break;
            case 'apply-mosaic':
                this._applyMosaicAction();
                break;
        }
    }

    /**
     * Crop 적용
     */
    _applyCrop() {
        const crop = this.editState.crop;
        if (crop.width <= 0 || crop.height <= 0) {
            alert('자르기 영역을 설정하세요');
            return;
        }

        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = crop.width;
        croppedCanvas.height = crop.height;
        const ctx = croppedCanvas.getContext('2d');

        ctx.drawImage(this.canvas, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

        this.canvas.width = crop.width;
        this.canvas.height = crop.height;
        this.ctx.drawImage(croppedCanvas, 0, 0);

        this._pushHistory('crop');
        this._render();
    }

    /**
     * Rotate 적용
     */
    _applyRotate() {
        const angle = this.editState.rotate.angle;
        const bgColor = this.editState.rotate.backgroundColor;

        if (angle === 0) return;

        const rad = angle * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const newWidth = Math.abs(this.canvas.width * cos) + Math.abs(this.canvas.height * sin);
        const newHeight = Math.abs(this.canvas.width * sin) + Math.abs(this.canvas.height * cos);

        const rotatedCanvas = document.createElement('canvas');
        rotatedCanvas.width = newWidth;
        rotatedCanvas.height = newHeight;
        const ctx = rotatedCanvas.getContext('2d');

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, newWidth, newHeight);

        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(rad);
        ctx.drawImage(this.canvas, -this.canvas.width / 2, -this.canvas.height / 2);

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        this.ctx.drawImage(rotatedCanvas, 0, 0);

        this._pushHistory('rotate');
        this.editState.rotate.angle = 0;
        this.modal.querySelector('#rotateAngle').value = 0;
        this.modal.querySelector('#rotateAngleValue').textContent = '0°';
    }

    /**
     * Filter 적용
     */
    _applyFilterAction() {
        if (!this.currentFilter) {
            alert('필터를 선택하세요');
            return;
        }

        const intensity = parseFloat(this.modal.querySelector('#filterIntensity').value) / 100;
        const filter = this.filters[this.currentFilter];

        if (filter && filter.apply) {
            filter.apply(intensity);
            this._pushHistory('filter', { filter: this.currentFilter, intensity });
        }
    }

    /**
     * Adjust 적용
     */
    _applyAdjustAction() {
        const adjustments = this.editState.adjustments;
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // 밝기
            r += adjustments.brightness * 2.55;
            g += adjustments.brightness * 2.55;
            b += adjustments.brightness * 2.55;

            // 명암
            if (adjustments.contrast !== 0) {
                const factor = (259 * (adjustments.contrast + 255)) / (255 * (259 - adjustments.contrast));
                r = factor * (r - 128) + 128;
                g = factor * (g - 128) + 128;
                b = factor * (b - 128) + 128;
            }

            data[i] = Math.max(0, Math.min(255, r));
            data[i + 1] = Math.max(0, Math.min(255, g));
            data[i + 2] = Math.max(0, Math.min(255, b));
        }

        this.ctx.putImageData(imageData, 0, 0);
        this._pushHistory('adjust');

        // 초기화
        this.editState.adjustments = { brightness: 0, saturation: 0, contrast: 0, temperature: 0 };
        ['brightness', 'saturation', 'contrast', 'temperature'].forEach(prop => {
            this.modal.querySelector(`#${prop}`).value = 0;
            this.modal.querySelector(`#${prop}Value`).textContent = '0';
        });
    }

    /**
     * Frame 적용
     */
    _applyFrameAction() {
        const frame = this.editState.frame;
        const frameSize = frame.size;
        const frameColor = frame.color;

        const framedCanvas = document.createElement('canvas');
        framedCanvas.width = this.canvas.width + frameSize * 2;
        framedCanvas.height = this.canvas.height + frameSize * 2;
        const ctx = framedCanvas.getContext('2d');

        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, framedCanvas.width, framedCanvas.height);

        ctx.drawImage(this.canvas, frameSize, frameSize);

        this.canvas.width = framedCanvas.width;
        this.canvas.height = framedCanvas.height;
        this.ctx.drawImage(framedCanvas, 0, 0);

        this._pushHistory('frame');
    }

    /**
     * Signature 적용
     */
    _applySignatureAction() {
        const position = this.modal.querySelector('#signaturePosition').value;
        const activeTab = this.modal.querySelector('.sig-tab.active').dataset.sigType;

        let text = '';
        if (activeTab === 'text') {
            text = this.modal.querySelector('#signatureText').value;
            if (!text) {
                alert('서명 텍스트를 입력하세요');
                return;
            }
        } else {
            const template = this.modal.querySelector('#signatureTemplate').value;
            if (template === 'date') {
                const now = new Date();
                text = now.toISOString().split('T')[0];
            } else {
                text = '●'; // 인장 모양
            }
        }

        const fontSize = parseInt(this.modal.querySelector('#signatureFontSize').value);
        const color = this.modal.querySelector('#signatureColor').value;

        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.fillStyle = color;

        const metrics = this.ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = fontSize;

        let x, y;
        const padding = 10;

        switch(position) {
            case 'top-left': x = padding; y = fontSize + padding; break;
            case 'top-center': x = this.canvas.width / 2 - textWidth / 2; y = fontSize + padding; break;
            case 'top-right': x = this.canvas.width - textWidth - padding; y = fontSize + padding; break;
            case 'center-left': x = padding; y = this.canvas.height / 2; break;
            case 'center-center': x = this.canvas.width / 2 - textWidth / 2; y = this.canvas.height / 2; break;
            case 'center-right': x = this.canvas.width - textWidth - padding; y = this.canvas.height / 2; break;
            case 'bottom-left': x = padding; y = this.canvas.height - padding; break;
            case 'bottom-center': x = this.canvas.width / 2 - textWidth / 2; y = this.canvas.height - padding; break;
            case 'bottom-right': x = this.canvas.width - textWidth - padding; y = this.canvas.height - padding; break;
        }

        this.ctx.fillText(text, x, y);
        this._pushHistory('signature');
    }

    /**
     * Mosaic 적용
     */
    _applyMosaicAction() {
        const areaInput = this.modal.querySelector('#mosaicArea').value;
        if (!areaInput) {
            alert('모자이크 영역을 입력하세요 (x,y,w,h,size)');
            return;
        }

        const parts = areaInput.split(',').map(p => parseInt(p.trim()));
        if (parts.length < 5) {
            alert('형식이 올바르지 않습니다');
            return;
        }

        const [x, y, w, h, pixelSize] = parts;
        const imageData = this.ctx.getImageData(x, y, w, h);
        const data = imageData.data;

        for (let i = 0; i < h; i += pixelSize) {
            for (let j = 0; j < w; j += pixelSize) {
                let r = 0, g = 0, b = 0, count = 0;

                for (let di = 0; di < pixelSize && i + di < h; di++) {
                    for (let dj = 0; dj < pixelSize && j + dj < w; dj++) {
                        const idx = (i + di) * w * 4 + (j + dj) * 4;
                        r += data[idx];
                        g += data[idx + 1];
                        b += data[idx + 2];
                        count++;
                    }
                }

                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);

                for (let di = 0; di < pixelSize && i + di < h; di++) {
                    for (let dj = 0; dj < pixelSize && j + dj < w; dj++) {
                        const idx = (i + di) * w * 4 + (j + dj) * 4;
                        data[idx] = r;
                        data[idx + 1] = g;
                        data[idx + 2] = b;
                    }
                }
            }
        }

        this.ctx.putImageData(imageData, x, y);
        this._pushHistory('mosaic');
        this.modal.querySelector('#mosaicArea').value = '';
    }

    /**
     * 스티커 추가
     */
    _addSticker(sticker) {
        const fontSize = 40;
        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;

        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(sticker, x, y);

        this._pushHistory('sticker');
    }

    /**
     * Filter 함수들
     */
    _applyGrayscale(intensity) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
            data[i] = data[i] * (1 - intensity) + gray * intensity;
            data[i + 1] = data[i + 1] * (1 - intensity) + gray * intensity;
            data[i + 2] = data[i + 2] * (1 - intensity) + gray * intensity;
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    _applySepia(intensity) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const gray = r * 0.3 + g * 0.59 + b * 0.11;

            data[i] = Math.min(255, gray * 1.2 * intensity + r * (1 - intensity));
            data[i + 1] = Math.min(255, gray * 1.0 * intensity + g * (1 - intensity));
            data[i + 2] = Math.min(255, gray * 0.8 * intensity + b * (1 - intensity));
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    _applyBlur(intensity) {
        const canvas = this.canvas;
        canvas.style.filter = `blur(${intensity * 10}px)`;
    }

    _applyInvert(intensity) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * (1 - intensity) + (255 - data[i]) * intensity;
            data[i + 1] = data[i + 1] * (1 - intensity) + (255 - data[i + 1]) * intensity;
            data[i + 2] = data[i + 2] * (1 - intensity) + (255 - data[i + 2]) * intensity;
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    _applyBrightness(intensity) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const brightness = (intensity - 0.5) * 255;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, data[i] + brightness));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness));
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    _applyContrast(intensity) {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const contrast = (intensity - 0.5) * 2;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * (1 + contrast) + 128));
            data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * (1 + contrast) + 128));
            data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * (1 + contrast) + 128));
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    _applySaturate(intensity) { this._applyGrayscale(0); }
    _applyHueRotate(intensity) { this._applySepia(0.3); }
    _applyVintage(intensity) { this._applySepia(intensity); }
    _applyCool(intensity) { this._applyBlur(0); }
    _applyWarm(intensity) { this._applySepia(intensity); }
    _applyCharcoal(intensity) { this._applyGrayscale(intensity); }
    _applySketch(intensity) { this._applyInvert(intensity); }
    _applyPosterize(intensity) { this._applyContrast(intensity); }
    _applyCartoon(intensity) { this._applyContrast(intensity * 0.5); }

    /**
     * Canvas 렌더링
     */
    _render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.originalImage, 0, 0);
    }

    /**
     * 히스토리 관리
     */
    _pushHistory(action) {
        this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        this.state.history.push({
            action,
            canvas: this._cloneCanvas(),
            timestamp: Date.now()
        });

        if (this.state.history.length > this.state.maxHistory) {
            this.state.history.shift();
        }

        this.state.historyIndex = this.state.history.length - 1;
    }

    /**
     * Canvas 복제
     */
    _cloneCanvas() {
        const cloned = document.createElement('canvas');
        cloned.width = this.canvas.width;
        cloned.height = this.canvas.height;
        const ctx = cloned.getContext('2d');
        ctx.drawImage(this.canvas, 0, 0);
        return cloned;
    }

    /**
     * 취소
     */
    _undo() {
        if (this.state.historyIndex > 0) {
            this.state.historyIndex--;
            const historyState = this.state.history[this.state.historyIndex];
            this.ctx.drawImage(historyState.canvas, 0, 0);
        }
    }

    /**
     * 재실행
     */
    _redo() {
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.historyIndex++;
            const historyState = this.state.history[this.state.historyIndex];
            this.ctx.drawImage(historyState.canvas, 0, 0);
        }
    }

    /**
     * 초기화
     */
    _reset() {
        this._render();
        this.state.history = [];
        this.state.historyIndex = -1;
        this.editState = {
            crop: { x: 0, y: 0, width: 0, height: 0, aspectRatio: null },
            rotate: { angle: 0, backgroundColor: '#ffffff' },
            filters: [],
            adjustments: { brightness: 0, saturation: 0, contrast: 0, temperature: 0 },
            frame: { type: null, size: 0, color: '#000000' },
            signatures: [],
            mosaics: [],
            stickers: []
        };
    }

    /**
     * UUID 생성
     */
    _generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * 이미지 요소에 고유 ID 부여 (처음 한 번만 생성, 이후 재사용)
     * 같은 이미지는 항상 같은 ID를 반환 (중복 편집 시 파일 덮어쓰기)
     */
    _ensureImageId(imageElement) {
        // 이미지에 이미 ID가 있으면 재사용
        if (imageElement.__smartImageEditId) {
            return imageElement.__smartImageEditId;
        }

        // 처음 편집: UUID 생성 및 저장
        const uuid = this._generateUUID();
        imageElement.__smartImageEditId = uuid;

        return uuid;
    }

    /**
     * Canvas dataURL을 File 객체로 변환
     */
    _dataUrlToFile(dataUrl, filename = 'edited-image.png') {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    /**
     * 편집 적용 - 서버 업로드 후 URL로 교체
     * 같은 원본 이미지의 중복 편집 시 파일은 덮어써짐 (쓰레기 파일 방지)
     */
    async _applyEdits() {
        const applyBtn = this.modal.querySelector('#smartEditorApply');
        const originalText = applyBtn.innerHTML;

        try {
            // 로딩 표시
            applyBtn.disabled = true;
            applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 업로드 중...';

            const dataUrl = this.canvas.toDataURL('image/png');

            // 이미지 요소에 고유 ID 부여 (처음 한 번만, 이후 편집은 같은 ID 사용)
            // 같은 원본 이미지는 항상 같은 파일명으로 덮어써짐
            let imageId = 'unknown';
            if (this.selectedImageElement) {
                imageId = this._ensureImageId(this.selectedImageElement);
            }
            const filename = `edited_${imageId}.png`;

            const file = this._dataUrlToFile(dataUrl, filename);
            const result = await ApiService.uploadImage(file);
            const serverUrl = result.url;

            // 이미지 src를 서버 URL로 교체
            if (this.selectedImageElement) {
                this.selectedImageElement.src = serverUrl;
            }

            this.editor.emit('smartImageEdited', {
                imageUrl: serverUrl,
                originalDataUrl: dataUrl,
                metadata: {
                    editState: this.editState,
                    history: this.state.history
                }
            });

            console.log('✅ 편집된 이미지 서버 업로드 완료:', serverUrl);
            this.closeEditor();
        } catch (error) {
            console.error('Failed to upload edited image:', error);

            // 서버 업로드 실패 시 fallback: dataURL로 직접 적용
            try {
                const dataUrl = this.canvas.toDataURL('image/png');
                if (this.selectedImageElement) {
                    this.selectedImageElement.src = dataUrl;
                }
                this.editor.emit('smartImageEdited', {
                    imageUrl: dataUrl,
                    metadata: {
                        editState: this.editState,
                        history: this.state.history
                    }
                });
                console.warn('⚠️ 서버 업로드 실패, dataURL로 대체 적용');
                this.closeEditor();
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                alert('편집을 적용하는 중 오류가 발생했습니다.');
            }
        } finally {
            applyBtn.disabled = false;
            applyBtn.innerHTML = originalText;
        }
    }

    /**
     * 편집기 닫기
     */
    closeEditor() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
        this._reset();
        this.selectedImageElement = null;
    }
}
