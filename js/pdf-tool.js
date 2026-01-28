/**
 * PDF Tool - Merge, Compress, and Split PDFs
 * Uses pdf-lib.js for PDF manipulation
 * Safari, Chrome, Firefox compatible
 */

const PDFTool = {
    files: [],
    resultBlob: null,
    splitBlobs: [],

    init() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.fileList = document.getElementById('fileList');
        this.fileItems = document.getElementById('fileItems');
        this.options = document.getElementById('options');
        this.splitOptions = document.getElementById('splitOptions');
        this.actions = document.getElementById('actions');
        this.progress = document.getElementById('progress');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.progressPercent = document.getElementById('progressPercent');
        this.result = document.getElementById('result');
        this.resultInfo = document.getElementById('resultInfo');
        this.error = document.getElementById('error');
        this.errorText = document.getElementById('errorText');

        this.bindEvents();
    },

    bindEvents() {
        // Drop zone click
        this.dropZone.addEventListener('click', () => this.fileInput.click());

        // File input change
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Drag and drop
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('dragover');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('dragover');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
            this.handleFiles(files);
        });

        // Clear all button
        document.getElementById('clearAll').addEventListener('click', () => this.clearFiles());

        // Merge button
        document.getElementById('mergeBtn').addEventListener('click', () => this.mergePDFs());

        // Compress button
        document.getElementById('compressBtn').addEventListener('click', () => this.compressPDF());

        // Split button
        document.getElementById('splitBtn').addEventListener('click', () => this.splitPDF());

        // Download button
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadResult());
    },

    handleFiles(fileList) {
        const newFiles = Array.from(fileList).filter(f => f.type === 'application/pdf');

        if (newFiles.length === 0) {
            this.showError('Vælg venligst gyldige PDF-filer.');
            return;
        }

        this.files = [...this.files, ...newFiles];
        this.renderFileList();
        this.hideResult();
        this.hideError();
    },

    renderFileList() {
        if (this.files.length === 0) {
            this.fileList.classList.add('hidden');
            this.options.classList.add('hidden');
            this.splitOptions.classList.add('hidden');
            this.actions.classList.add('hidden');
            return;
        }

        this.fileList.classList.remove('hidden');
        this.options.classList.remove('hidden');
        this.actions.classList.remove('hidden');

        // Show split options only when 1 file is selected
        if (this.files.length === 1) {
            this.splitOptions.classList.remove('hidden');
        } else {
            this.splitOptions.classList.add('hidden');
        }

        this.fileItems.innerHTML = this.files.map((file, index) => `
            <div class="file-item flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-red-100 text-red-600 rounded-lg">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="font-medium text-slate-800 text-sm">${this.escapeHtml(file.name)}</p>
                        <p class="text-xs text-slate-500">${this.formatSize(file.size)}</p>
                    </div>
                </div>
                <button onclick="PDFTool.removeFile(${index})" class="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `).join('');

        // Update button states
        const mergeBtn = document.getElementById('mergeBtn');
        mergeBtn.disabled = this.files.length < 2;
        if (this.files.length < 2) {
            mergeBtn.title = 'Vælg mindst 2 filer for at sammenflet';
        } else {
            mergeBtn.title = '';
        }
    },

    removeFile(index) {
        this.files.splice(index, 1);
        this.renderFileList();
    },

    clearFiles() {
        this.files = [];
        this.fileInput.value = '';
        this.splitBlobs = [];
        this.renderFileList();
        this.hideResult();
        this.hideError();
    },

    async mergePDFs() {
        if (this.files.length < 2) {
            this.showError('Vælg mindst 2 PDF-filer for at sammenflet.');
            return;
        }

        try {
            this.showProgress('Sammenfletter PDFs...');

            const mergedPdf = await PDFLib.PDFDocument.create();

            for (let i = 0; i < this.files.length; i++) {
                this.updateProgress((i / this.files.length) * 80, `Behandler fil ${i + 1} af ${this.files.length}...`);

                const arrayBuffer = await this.fileToArrayBuffer(this.files[i]);
                const pdf = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
            }

            this.updateProgress(90, 'Gemmer PDF...');

            const pdfBytes = await mergedPdf.save();
            this.resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            this.splitBlobs = [];

            this.updateProgress(100, 'Færdig!');
            this.showResult(`Sammenflettede ${this.files.length} filer. Ny størrelse: ${this.formatSize(this.resultBlob.size)}`);

        } catch (err) {
            console.error(err);
            this.showError('Kunne ikke sammenflet PDFs. Prøv med andre filer.');
        }
    },

    async compressPDF() {
        if (this.files.length === 0) {
            this.showError('Vælg mindst én PDF-fil for at komprimere.');
            return;
        }

        try {
            this.showProgress('Komprimerer PDF...');

            let pdfToCompress;

            if (this.files.length === 1) {
                const arrayBuffer = await this.fileToArrayBuffer(this.files[0]);
                pdfToCompress = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            } else {
                this.updateProgress(10, 'Sammenfletter filer først...');
                pdfToCompress = await PDFLib.PDFDocument.create();

                for (let i = 0; i < this.files.length; i++) {
                    this.updateProgress(10 + (i / this.files.length) * 40, `Behandler fil ${i + 1}...`);
                    const arrayBuffer = await this.fileToArrayBuffer(this.files[i]);
                    const pdf = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                    const pages = await pdfToCompress.copyPages(pdf, pdf.getPageIndices());
                    pages.forEach(page => pdfToCompress.addPage(page));
                }
            }

            this.updateProgress(60, 'Komprimerer...');

            const pdfBytes = await pdfToCompress.save({
                useObjectStreams: true,
                addDefaultPage: false,
                objectsPerTick: 50
            });

            this.updateProgress(90, 'Færdiggør...');

            this.resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            this.splitBlobs = [];

            const targetSize = parseFloat(document.getElementById('targetSize').value) * 1024 * 1024;
            const originalSize = this.files.reduce((sum, f) => sum + f.size, 0);
            const newSize = this.resultBlob.size;
            const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

            this.updateProgress(100, 'Færdig!');

            let sizeWarning = '';
            if (newSize > targetSize) {
                sizeWarning = ` ⚠️ Filen er stadig over ${document.getElementById('targetSize').value} MB. Prøv at opdele PDFen i mindre filer.`;
            }

            this.showResult(`Komprimeret fra ${this.formatSize(originalSize)} til ${this.formatSize(newSize)} (${reduction}% mindre).${sizeWarning}`);

        } catch (err) {
            console.error(err);
            this.showError('Kunne ikke komprimere PDF. Prøv med en anden fil.');
        }
    },

    async splitPDF() {
        if (this.files.length !== 1) {
            this.showError('Vælg præcis én PDF-fil for at opdele.');
            return;
        }

        try {
            this.showProgress('Opdeler PDF...');

            const pagesPerFile = parseInt(document.getElementById('pagesPerFile').value);
            const arrayBuffer = await this.fileToArrayBuffer(this.files[0]);
            const sourcePdf = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            const totalPages = sourcePdf.getPageCount();

            if (totalPages <= pagesPerFile) {
                this.showError(`PDFen har kun ${totalPages} sider. Vælg færre sider per fil.`);
                return;
            }

            this.splitBlobs = [];
            const numFiles = Math.ceil(totalPages / pagesPerFile);

            for (let i = 0; i < numFiles; i++) {
                this.updateProgress((i / numFiles) * 90, `Opretter del ${i + 1} af ${numFiles}...`);

                const startPage = i * pagesPerFile;
                const endPage = Math.min(startPage + pagesPerFile, totalPages);
                const pageIndices = [];
                for (let p = startPage; p < endPage; p++) {
                    pageIndices.push(p);
                }

                const newPdf = await PDFLib.PDFDocument.create();
                const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
                copiedPages.forEach(page => newPdf.addPage(page));

                const pdfBytes = await newPdf.save({
                    useObjectStreams: true,
                    objectsPerTick: 50
                });

                this.splitBlobs.push({
                    blob: new Blob([pdfBytes], { type: 'application/pdf' }),
                    name: `del_${i + 1}_side_${startPage + 1}-${endPage}.pdf`,
                    size: pdfBytes.length
                });
            }

            this.updateProgress(100, 'Færdig!');
            this.resultBlob = null;

            const totalSize = this.splitBlobs.reduce((sum, b) => sum + b.size, 0);
            this.showSplitResult(this.splitBlobs, totalPages, this.formatSize(totalSize));

        } catch (err) {
            console.error(err);
            this.showError('Kunne ikke opdele PDF. Prøv med en anden fil.');
        }
    },

    showSplitResult(blobs, totalPages, totalSize) {
        this.hideProgress();
        this.result.classList.remove('hidden');

        const downloadBtns = blobs.map((b, i) => `
            <button onclick="PDFTool.downloadSplitPart(${i})" 
                class="flex items-center justify-between w-full p-3 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors text-sm">
                <span class="font-medium text-emerald-800">${b.name}</span>
                <span class="text-emerald-600">${this.formatSize(b.size)}</span>
            </button>
        `).join('');

        this.resultInfo.innerHTML = `
            <p class="mb-3">Opdelt i ${blobs.length} filer (${totalPages} sider total).</p>
            <div class="space-y-2 mt-4">${downloadBtns}</div>
            <p class="text-xs text-emerald-600 mt-4">💡 Tip: Du kan nu komprimere hver fil separat for bedre resultater.</p>
        `;

        // Hide the single download button since we have multiple
        document.getElementById('downloadBtn').classList.add('hidden');
    },

    downloadSplitPart(index) {
        if (!this.splitBlobs[index]) return;

        const url = URL.createObjectURL(this.splitBlobs[index].blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.splitBlobs[index].name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    fileToArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    },

    downloadResult() {
        if (!this.resultBlob) return;

        const url = URL.createObjectURL(this.resultBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `snartdansk_pdf_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    showProgress(text) {
        this.progress.classList.remove('hidden');
        this.result.classList.add('hidden');
        this.error.classList.add('hidden');
        document.getElementById('downloadBtn').classList.remove('hidden');
        this.progressText.textContent = text;
        this.progressPercent.textContent = '0%';
        this.progressBar.style.width = '0%';
    },

    updateProgress(percent, text) {
        this.progressBar.style.width = `${percent}%`;
        this.progressPercent.textContent = `${Math.round(percent)}%`;
        if (text) this.progressText.textContent = text;
    },

    hideProgress() {
        this.progress.classList.add('hidden');
    },

    showResult(info) {
        this.hideProgress();
        this.result.classList.remove('hidden');
        this.resultInfo.textContent = info;
        document.getElementById('downloadBtn').classList.remove('hidden');
    },

    hideResult() {
        this.result.classList.add('hidden');
        this.resultBlob = null;
        this.splitBlobs = [];
    },

    showError(message) {
        this.hideProgress();
        this.error.classList.remove('hidden');
        this.errorText.textContent = message;
    },

    hideError() {
        this.error.classList.add('hidden');
    },

    formatSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => PDFTool.init());
