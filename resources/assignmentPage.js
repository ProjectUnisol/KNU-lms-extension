const vscode = acquireVsCodeApi();

function getFileName(file) {
    if (!file) {
        return '';
    }

    if (typeof file.path === 'string' && file.path.length > 0) {
        const fromPath = file.path.split('/').pop();
        if (fromPath) {
            return fromPath;
        }
    }

    if (typeof file.fsPath === 'string' && file.fsPath.length > 0) {
        const normalized = file.fsPath.replace(/\\/g, '/');
        const fromFsPath = normalized.split('/').pop();
        if (fromFsPath) {
            return fromFsPath;
        }
    }

    return '파일';
}

function renderUploadedFiles(files) {
    const fileList = document.getElementById('uploadedFileList');
    if (!fileList) {
        return;
    }

    if (!Array.isArray(files) || files.length === 0) {
        fileList.innerHTML = '<li class="empty">아직 업로드된 파일이 없습니다.</li>';
        return;
    }

    fileList.innerHTML = files
        .map((file) => `<li>${getFileName(file)}</li>`)
        .join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadFilesButton');
    if (uploadButton) {
        uploadButton.addEventListener('click', (e) => {
            e.preventDefault();
            vscode.postMessage({
                command: 'upload'
            });
        });
    }

    const initialFilesNode = document.getElementById('initialUploadedFiles');
    if (initialFilesNode) {
        try {
            const initialFiles = JSON.parse(initialFilesNode.textContent || '[]');
            renderUploadedFiles(initialFiles);
        } catch {
            renderUploadedFiles([]);
        }
    }
});

window.addEventListener('message', (event) => {
    const message = event.data;
    if (message.command === 'filesUploaded') {
        renderUploadedFiles(message.files);
    }
});

document.addEventListener('submit', (e) => {
    e.preventDefault();
    vscode.postMessage({
        command: 'submit'
    });
});
