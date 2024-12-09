document.addEventListener('DOMContentLoaded', () => {
    // 初始化压缩器
    const compressor = new ImageCompressor();
    
    // 获取DOM元素
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewArea = document.getElementById('previewArea');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;
    let compressedResult = null;

    // 处理文件拖放
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('upload-area--active');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('upload-area--active');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('upload-area--active');
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    // 处理文件选择
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    // 处理质量滑块变化
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (currentFile) {
            compressImage(currentFile, e.target.value / 100);
        }
    });

    // 处理下载按钮
    downloadBtn.addEventListener('click', () => {
        if (compressedResult) {
            const link = document.createElement('a');
            link.href = compressedResult.base64;
            link.download = `compressed_${currentFile.name}`;
            link.click();
        }
    });

    // 处理文件
    async function handleFile(file) {
        currentFile = file;
        originalImage.src = URL.createObjectURL(file);
        originalSize.textContent = ImageCompressor.formatFileSize(file.size);
        previewArea.style.display = 'grid';
        await compressImage(file, qualitySlider.value / 100);
    }

    // 压缩图片
    async function compressImage(file, quality) {
        try {
            compressedResult = await compressor.compress(file, quality);
            compressedImage.src = compressedResult.base64;
            compressedSize.textContent = ImageCompressor.formatFileSize(compressedResult.size);
        } catch (error) {
            alert(error.message);
        }
    }
});