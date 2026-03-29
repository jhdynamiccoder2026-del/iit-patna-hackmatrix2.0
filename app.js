document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const views = {
        welcome: document.getElementById('welcome-view'),
        dashboard: document.getElementById('dashboard-view')
    };

    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            if(views.welcome && views.dashboard) {
                views.welcome.classList.remove('active');
                views.welcome.classList.add('hidden');
                views.dashboard.classList.remove('hidden');
                views.dashboard.classList.add('active');
            }
        });
    }

    // -- Navigation Logic --
    const navDashboard = document.getElementById('nav-dashboard');
    const navFeedback = document.getElementById('nav-feedback');
    const mainDashboardContent = document.getElementById('main-dashboard-content');
    const mainFeedbackContent = document.getElementById('main-feedback-content');

    if (navDashboard && navFeedback && mainDashboardContent && mainFeedbackContent) {
        navDashboard.addEventListener('click', () => {
            navDashboard.classList.add('active');
            navFeedback.classList.remove('active');
            mainDashboardContent.classList.remove('hidden');
            mainFeedbackContent.classList.add('hidden');
        });

        navFeedback.addEventListener('click', () => {
            navFeedback.classList.add('active');
            navDashboard.classList.remove('active');
            mainFeedbackContent.classList.remove('hidden');
            mainDashboardContent.classList.add('hidden');
        });
    }

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const loadingState = document.getElementById('loading-state');
    const downloadBtn = document.getElementById('download-txt-btn');
    const resultsGrid = document.getElementById('preview-view');
    
    const displayElements = {
        filename: document.getElementById('filename-display'),
        iframe: document.getElementById('pdf-frame'),
        extractedText: document.getElementById('extracted-text'),
        pageCount: document.getElementById('page-count-display')
    };

    let currentPdfData = null;
    let rawTextContent = "";

    // -- State Management --
    function showResults() {
        if(resultsGrid) {
            resultsGrid.classList.remove('hidden');
        }
    }

    function toggleLoading(isLoading) {
        if (isLoading) {
            loadingState.classList.remove('hidden');
        } else {
            loadingState.classList.add('hidden');
            loadingState.classList.add('hidden');
        }
    }

    // -- File Handling (Drag & Drop) --
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    // File Input clicks
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    dropZone.addEventListener('click', (e) => {
        // Prevent click if they explicitly clicked the button inside
        if(e.target !== browseBtn) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // -- Feedback Section File Handling (Drag & Drop) --
    ['bill', 'discharge', 'test'].forEach(type => {
        const fDropZone = document.getElementById(`drop-zone-${type}`);
        const fFileInput = document.getElementById(`file-input-${type}`);

        if (fDropZone && fFileInput) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                fDropZone.addEventListener(eventName, preventDefaults, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                fDropZone.addEventListener(eventName, () => {
                    fDropZone.classList.add('drag-over');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                fDropZone.addEventListener(eventName, () => {
                    fDropZone.classList.remove('drag-over');
                }, false);
            });

            fDropZone.addEventListener('drop', (e) => {
                const file = e.dataTransfer.files[0];
                handleFeedbackFile(file, type);
            });

            // Avoid triggering file input multiple times when browse button is clicked
            fDropZone.addEventListener('click', (e) => {
                if(e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                    fFileInput.click();
                }
            });

            fFileInput.addEventListener('change', (e) => {
                if (e.target.files.length) {
                    handleFeedbackFile(e.target.files[0], type);
                }
            });
        }
    });

    function handleFeedbackFile(file, type) {
        if (!file) return;
        const dropZoneTitle = document.querySelector(`#drop-zone-${type} .upload-title`);
        const browseBtn = document.querySelector(`#drop-zone-${type} .btn-browse`);
        if (dropZoneTitle) dropZoneTitle.textContent = `Selected: ${file.name}`;
        if (browseBtn) browseBtn.textContent = 'Change File';

        // Render preview
        const previewContainer = document.getElementById(`preview-${type}`);
        const iframe = document.getElementById(`iframe-${type}`);
        
        if (previewContainer && iframe) {
            // Unhide container
            previewContainer.classList.remove('hidden');
            // Create object URL and assign
            const objectUrl = URL.createObjectURL(file);
            iframe.src = objectUrl;
        }
    }

    // -- Feedback Section Prediction Mock Logic --
    const predictBtn = document.getElementById('predict-bill-btn');
    const predictionResult = document.getElementById('prediction-result');
    
    if (predictBtn && predictionResult) {
        predictBtn.addEventListener('click', () => {
            const resultH2 = predictionResult.querySelector('h2');
            
            let hasFiles = false;
            ['bill', 'discharge', 'test'].forEach(type => {
                const title = document.querySelector(`#drop-zone-${type} .upload-title`);
                if (title && title.textContent.startsWith('Selected:')) {
                    hasFiles = true;
                }
            });

            if (!hasFiles) {
                alert('Please upload at least one document to predict the bill amount.');
                return;
            }

            predictBtn.textContent = 'Calculating...';
            predictBtn.style.opacity = '0.7';
            predictBtn.disabled = true;
            predictionResult.classList.add('hidden');

            setTimeout(() => {
                predictBtn.textContent = 'Predict Bill Amount';
                predictBtn.style.opacity = '1';
                predictBtn.disabled = false;
                resultH2.textContent = '₹' + Math.floor(Math.random() * (26000 - 22000 + 1) + 22000).toLocaleString();
                predictionResult.classList.remove('hidden');
                predictionResult.style.animation = 'fadeIn 0.5s ease-out forwards';
            }, 1500);
        });
    }

    // -- Processing the File --
    async function handleFile(file) {
        if (!file || file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }

        toggleLoading(true);
        displayElements.filename.textContent = file.name;

        try {
            // 1. Setup Preview (Iframe Object URL)
            const objectUrl = URL.createObjectURL(file);
            displayElements.iframe.src = objectUrl;

            // 2. Extract Data via FastAPI
            await uploadToPythonAPI(file);

            // 3. Complete and Transition
            toggleLoading(false);
            showResults();

        } catch (error) {
            console.error("Error processing PDF: ", error);
            alert("An error occurred while analyzing the PDF. Please try again.");
            toggleLoading(false);
        }
    }

    // -- Text Extraction Logic (FastAPI) --
    async function uploadToPythonAPI(pdfFile) {
        displayElements.extractedText.innerHTML = '<p class="empty-state">Sending to AI for extraction...</p>';
        rawTextContent = "";

        const formData = new FormData();
        formData.append("file", pdfFile); 

        try {
            console.log("Uploading to AI...");
            const response = await fetch("http://127.0.0.1:8000/upload-pdf", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server returned status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.status === "success" && result.data) {
                console.log("Extraction Successful!");
                
                // Update UI based on API JSON
                if (result.data.Name) {
                    const nameDisp = document.getElementById('patient-name-display');
                    if (nameDisp) nameDisp.textContent = result.data.Name;
                }
                
                if (result.data.Diseases) {
                    const diagDisp = document.getElementById('diagnosis-display');
                    if (diagDisp) diagDisp.textContent = Array.isArray(result.data.Diseases) ? result.data.Diseases.join(', ') : result.data.Diseases;
                }

                // Show raw JSON
                const formattedJson = JSON.stringify(result.data, null, 2);
                displayElements.extractedText.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace; font-size: 0.9rem;">${formattedJson}</pre>`;
                rawTextContent = formattedJson;
                
                displayElements.pageCount.textContent = "AI Parsed";
            } else {
                console.error("API Error:", result);
                displayElements.extractedText.innerHTML = `<p class="empty-state" style="color: red;">API Error: ${JSON.stringify(result)}</p>`;
            }

        } catch (error) {
            console.error("Network error. Is the Python server running?", error);
            displayElements.extractedText.innerHTML = `<p class="empty-state" style="color: red;">Network error. Is the Python server running at http://127.0.0.1:8000?<br><br>${error.message}</p>`;
        }
    }

    // -- Utilities --
    if(downloadBtn) {
        downloadBtn.addEventListener('click', () => {
        if (!rawTextContent) {
            alert("No text available to download.");
            return;
        }

        const blob = new Blob([rawTextContent], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = displayElements.filename.textContent.replace('.pdf', '_extracted.txt');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        });
    }
});
