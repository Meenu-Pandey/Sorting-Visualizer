class ArrayVisualizer {
    constructor() {
        this.array = [];
        this.isRunning = false;
        this.speed = 5;
        this.arraySize = 8;
        this.comparisons = 0;
        this.swaps = 0;
        
        this.algorithms = new SortingAlgorithms(this);
        
        this.algorithmCodes = {
            bubble: `function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
}`,
            selection: `function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
}`,
            insertion: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
            quick: `function quickSort(arr, low, high) {
    if (low < high) {
        let pivotIndex = partition(arr, low, high);
        
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
            merge: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}`
        };
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateArray();
        this.updateAlgorithmDisplay();
    }

    initializeElements() {
        this.arrayContainer = document.getElementById('array-container');
        this.algorithmSelect = document.getElementById('algorithm');
        this.speedSlider = document.getElementById('speed');
        this.speedValue = document.getElementById('speed-value');
        this.sizeSlider = document.getElementById('size');
        this.sizeValue = document.getElementById('size-value');
        this.generateBtn = document.getElementById('generate');
        this.manualBtn = document.getElementById('manual');
        this.startBtn = document.getElementById('start');
        this.resetBtn = document.getElementById('reset');
        this.toggleBtn = document.getElementById('toggle');
        this.comparisonsEl = document.getElementById('comparisons');
        this.swapsEl = document.getElementById('swaps');
        this.codeDisplay = document.getElementById('code-display');
        this.currentLine = document.getElementById('current-line');
        this.modal = document.getElementById('modal');
        this.manualInput = document.getElementById('manual-input');
        this.applyBtn = document.getElementById('apply');
        this.cancelBtn = document.getElementById('cancel');
        this.mainContent = document.getElementById('main-content');
        this.codeSection = document.getElementById('code-section');
    }

    setupEventListeners() {
        this.algorithmSelect.addEventListener('change', () => {
            this.updateAlgorithmDisplay();
        });

        this.speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            this.speedValue.textContent = this.speed;
        });

        this.sizeSlider.addEventListener('input', (e) => {
            if (!this.isRunning) {
                this.arraySize = parseInt(e.target.value);
                this.sizeValue.textContent = this.arraySize;
                this.generateArray();
            }
        });

        this.generateBtn.addEventListener('click', () => {
            if (!this.isRunning) {
                this.generateArray();
            }
        });

        this.manualBtn.addEventListener('click', () => {
            if (!this.isRunning) {
                this.showModal();
            }
        });

        this.startBtn.addEventListener('click', () => {
            this.startSorting();
        });

        this.resetBtn.addEventListener('click', () => {
            this.resetSorting();
        });

        this.toggleBtn.addEventListener('click', () => {
            this.toggleCodeSection();
        });

        this.applyBtn.addEventListener('click', () => {
            this.applyManualArray();
        });

        this.cancelBtn.addEventListener('click', () => {
            this.hideModal();
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.hideModal();
            }
        });
    }

    showModal() {
        this.modal.classList.add('active');
        this.manualInput.focus();
    }

    hideModal() {
        this.modal.classList.remove('active');
        this.manualInput.value = '';
    }

    applyManualArray() {
        const input = this.manualInput.value.trim();
        if (!input) {
            this.hideModal();
            return;
        }

        try {
            const values = input.split(',')
                .map(v => parseInt(v.trim()))
                .filter(v => !isNaN(v) && v > 0);

            if (values.length === 0) {
                alert('Please enter valid numbers separated by commas');
                return;
            }

            if (values.length > 100) {
                alert('Maximum 100 elements allowed');
                return;
            }

            this.array = values.map(value => ({
                value: Math.max(10, Math.min(400, value)),
                state: 'default'
            }));

            this.arraySize = this.array.length;
            this.sizeValue.textContent = this.arraySize;
            this.sizeSlider.value = Math.min(this.arraySize, 100);

            this.renderArray();
            this.resetStats();
            this.hideCurrentLine();
            this.hideModal();
        } catch (error) {
            alert('Invalid input format. Please use comma-separated numbers.');
        }
    }

    toggleCodeSection() {
        const isHidden = this.codeSection.classList.contains('hidden');
        
        if (isHidden) {
            this.codeSection.classList.remove('hidden');
            this.mainContent.classList.remove('full-width');
            this.toggleBtn.textContent = 'Hide Code';
        } else {
            this.codeSection.classList.add('hidden');
            this.mainContent.classList.add('full-width');
            this.toggleBtn.textContent = 'Show Code';
        }
    }

    generateArray() {
        this.array = [];
        this.arrayContainer.innerHTML = '';
        
        for (let i = 0; i < this.arraySize; i++) {
            const value = Math.floor(Math.random() * 90) + 10;
            this.array.push({
                value: value,
                state: 'default'
            });
        }
        
        this.renderArray();
        this.resetStats();
        this.hideCurrentLine();
    }

    renderArray() {
        this.arrayContainer.innerHTML = '';
        const isLargeArray = this.array.length > 50;
        
        this.array.forEach((item, index) => {
            const bar = document.createElement('div');
            bar.className = `array-bar ${item.state} ${isLargeArray ? 'large-array' : ''}`;
            bar.style.height = `${item.value * 3}px`;
            
            if (!isLargeArray) {
                bar.textContent = item.value;
            }
            
            bar.setAttribute('data-index', index);
            this.arrayContainer.appendChild(bar);
        });
    }

    async startSorting() {
        if (this.isRunning) return;
        
        this.resetStats();
        this.isRunning = true;
        this.updateButtons();

        const algorithm = this.algorithmSelect.value;
        await this.runAlgorithm(algorithm);
        
        this.completeSorting();
    }

    async runAlgorithm(algorithm) {
        switch (algorithm) {
            case 'bubble':
                await this.algorithms.bubbleSort();
                break;
            case 'selection':
                await this.algorithms.selectionSort();
                break;
            case 'insertion':
                await this.algorithms.insertionSort();
                break;
            case 'quick':
                await this.algorithms.quickSort(0, this.array.length - 1);
                break;
            case 'merge':
                await this.algorithms.mergeSort(0, this.array.length - 1);
                break;
        }
    }

    highlightCodeLine(lineNumber) {
        if (this.codeSection.classList.contains('hidden')) return;
        
        const lineHeight = 25;
        const topOffset = 75 + (lineNumber * lineHeight);
        
        this.currentLine.style.top = `${topOffset}px`;
        this.currentLine.classList.add('active');
    }

    hideCurrentLine() {
        this.currentLine.classList.remove('active');
    }

    completeSorting() {
        this.isRunning = false;
        this.updateButtons();
        this.hideCurrentLine();
        
        this.array.forEach(item => item.state = 'sorted');
        this.renderArray();
    }

    resetSorting() {
        this.isRunning = false;
        this.updateButtons();
        this.generateArray();
    }

    updateButtons() {
        this.generateBtn.disabled = this.isRunning;
        this.manualBtn.disabled = this.isRunning;
        this.startBtn.disabled = this.isRunning;
        this.algorithmSelect.disabled = this.isRunning;
        this.speedSlider.disabled = this.isRunning;
        this.sizeSlider.disabled = this.isRunning;
        this.toggleBtn.disabled = this.isRunning;
    }

    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.updateStats();
    }

    updateStats() {
        this.comparisonsEl.textContent = this.comparisons;
        this.swapsEl.textContent = this.swaps;
    }

    updateAlgorithmDisplay() {
        const algorithm = this.algorithmSelect.value;
        const algorithmCode = this.algorithmCodes[algorithm];
        this.codeDisplay.textContent = algorithmCode;
        this.hideCurrentLine();
    }

    delay() {
        return new Promise(resolve => setTimeout(resolve, 1100 - (this.speed * 100)));
    }
}