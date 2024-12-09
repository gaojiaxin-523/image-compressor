class ImageCompressor {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    // 计算文件大小
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 压缩图片
    async compress(file, quality = 0.8) {
        // 检查文件类型
        if (!file.type.match(/image\/(jpeg|png)/)) {
            throw new Error('只支持 JPEG 和 PNG 格式的图片');
        }

        // 创建图片对象
        const img = new Image();
        const reader = new FileReader();

        // 将文件转换为 base64
        const base64 = await new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        // 加载图片
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = base64;
        });

        // 设置画布尺寸
        this.canvas.width = img.width;
        this.canvas.height = img.height;

        // 绘制图片
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, 0, 0);

        // 压缩图片
        const compressedBase64 = this.canvas.toDataURL(file.type, quality);

        // 转换为 Blob
        const binaryString = atob(compressedBase64.split(',')[1]);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const compressedBlob = new Blob([bytes.buffer], { type: file.type });

        return {
            file: compressedBlob,
            base64: compressedBase64,
            width: img.width,
            height: img.height,
            size: compressedBlob.size,
            originalSize: file.size
        };
    }
}