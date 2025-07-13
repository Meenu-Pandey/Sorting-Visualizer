class SortingAlgorithms {
    constructor(visualizer) {
        this.visualizer = visualizer;
    }

    async bubbleSort() {
        const array = this.visualizer.array;
        const n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (!this.visualizer.isRunning) return;
                
                this.visualizer.highlightCodeLine(2);
                array[j].state = 'comparing';
                array[j + 1].state = 'comparing';
                this.visualizer.comparisons++;
                this.visualizer.updateStats();
                this.visualizer.renderArray();
                await this.visualizer.delay();

                if (array[j].value > array[j + 1].value) {
                    this.visualizer.highlightCodeLine(4);
                    array[j].state = 'swapping';
                    array[j + 1].state = 'swapping';
                    this.visualizer.swaps++;
                    this.visualizer.updateStats();
                    this.visualizer.renderArray();
                    await this.visualizer.delay();

                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                }

                array[j].state = 'default';
                array[j + 1].state = 'default';
            }
            array[n - i - 1].state = 'sorted';
            this.visualizer.renderArray();
            await this.visualizer.delay();
        }
        array[0].state = 'sorted';
        this.visualizer.renderArray();
    }

    async selectionSort() {
        const array = this.visualizer.array;
        const n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            this.visualizer.highlightCodeLine(2);
            
            for (let j = i + 1; j < n; j++) {
                if (!this.visualizer.isRunning) return;
                
                this.visualizer.highlightCodeLine(4);
                array[j].state = 'comparing';
                array[minIdx].state = 'comparing';
                this.visualizer.comparisons++;
                this.visualizer.updateStats();
                this.visualizer.renderArray();
                await this.visualizer.delay();

                if (array[j].value < array[minIdx].value) {
                    if (minIdx !== i) array[minIdx].state = 'default';
                    minIdx = j;
                } else {
                    array[j].state = 'default';
                }
            }

            if (minIdx !== i) {
                this.visualizer.highlightCodeLine(9);
                array[i].state = 'swapping';
                array[minIdx].state = 'swapping';
                this.visualizer.swaps++;
                this.visualizer.updateStats();
                this.visualizer.renderArray();
                await this.visualizer.delay();

                [array[i], array[minIdx]] = [array[minIdx], array[i]];
            }

            array[i].state = 'sorted';
            if (minIdx !== i) array[minIdx].state = 'default';
            this.visualizer.renderArray();
            await this.visualizer.delay();
        }
        array[n - 1].state = 'sorted';
        this.visualizer.renderArray();
    }

    async insertionSort() {
        const array = this.visualizer.array;
        array[0].state = 'sorted';
        this.visualizer.renderArray();
        
        for (let i = 1; i < array.length; i++) {
            if (!this.visualizer.isRunning) return;
            
            this.visualizer.highlightCodeLine(2);
            let key = { ...array[i] };
            key.state = 'comparing';
            array[i] = key;
            this.visualizer.renderArray();
            await this.visualizer.delay();

            let j = i - 1;
            this.visualizer.highlightCodeLine(5);
            
            while (j >= 0 && array[j].value > key.value) {
                array[j].state = 'comparing';
                this.visualizer.comparisons++;
                this.visualizer.updateStats();
                this.visualizer.renderArray();
                await this.visualizer.delay();

                this.visualizer.highlightCodeLine(6);
                array[j + 1] = { ...array[j], state: 'swapping' };
                this.visualizer.swaps++;
                this.visualizer.updateStats();
                this.visualizer.renderArray();
                await this.visualizer.delay();

                array[j].state = 'sorted';
                j--;
            }

            this.visualizer.highlightCodeLine(9);
            array[j + 1] = { ...key, state: 'sorted' };
            this.visualizer.renderArray();
            await this.visualizer.delay();
        }
    }

    async quickSort(low, high) {
        const array = this.visualizer.array;
        if (low < high) {
            this.visualizer.highlightCodeLine(2);
            let pivotIndex = await this.partition(low, high);
            
            this.visualizer.highlightCodeLine(5);
            await this.quickSort(low, pivotIndex - 1);
            this.visualizer.highlightCodeLine(6);
            await this.quickSort(pivotIndex + 1, high);
        }
    }

    async partition(low, high) {
        const array = this.visualizer.array;
        this.visualizer.highlightCodeLine(11);
        array[high].state = 'pivot';
        this.visualizer.renderArray();
        await this.visualizer.delay();

        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            if (!this.visualizer.isRunning) return i + 1;
            
            this.visualizer.highlightCodeLine(15);
            array[j].state = 'comparing';
            this.visualizer.comparisons++;
            this.visualizer.updateStats();
            this.visualizer.renderArray();
            await this.visualizer.delay();

            if (array[j].value < array[high].value) {
                i++;
                this.visualizer.highlightCodeLine(17);
                
                if (i !== j) {
                    array[i].state = 'swapping';
                    array[j].state = 'swapping';
                    this.visualizer.swaps++;
                    this.visualizer.updateStats();
                    this.visualizer.renderArray();
                    await this.visualizer.delay();

                    [array[i], array[j]] = [array[j], array[i]];
                }
            }
            
            if (array[j].state !== 'pivot') {
                array[j].state = 'default';
            }
        }

        this.visualizer.highlightCodeLine(21);
        array[i + 1].state = 'swapping';
        array[high].state = 'swapping';
        this.visualizer.swaps++;
        this.visualizer.updateStats();
        this.visualizer.renderArray();
        await this.visualizer.delay();

        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        
        for (let k = low; k <= high; k++) {
            array[k].state = 'default';
        }
        array[i + 1].state = 'sorted';
        this.visualizer.renderArray();
        await this.visualizer.delay();

        return i + 1;
    }

    async mergeSort(left, right) {
        if (left >= right) return;
        
        this.visualizer.highlightCodeLine(4);
        const mid = Math.floor((left + right) / 2);
        
        this.visualizer.highlightCodeLine(8);
        await this.mergeSort(left, mid);
        await this.mergeSort(mid + 1, right);
        
        this.visualizer.highlightCodeLine(9);
        await this.merge(left, mid, right);
    }

    async merge(left, mid, right) {
        const array = this.visualizer.array;
        const leftArr = [];
        const rightArr = [];
        
        for (let i = left; i <= mid; i++) {
            leftArr.push({ ...array[i] });
        }
        for (let i = mid + 1; i <= right; i++) {
            rightArr.push({ ...array[i] });
        }
        
        let i = 0, j = 0, k = left;
        
        this.visualizer.highlightCodeLine(16);
        while (i < leftArr.length && j < rightArr.length) {
            if (!this.visualizer.isRunning) return;
            
            this.visualizer.highlightCodeLine(17);
            this.visualizer.comparisons++;
            this.visualizer.updateStats();
            
            if (leftArr[i].value <= rightArr[j].value) {
                array[k] = { ...leftArr[i], state: 'swapping' };
                i++;
            } else {
                array[k] = { ...rightArr[j], state: 'swapping' };
                j++;
            }
            
            this.visualizer.swaps++;
            this.visualizer.updateStats();
            this.visualizer.renderArray();
            await this.visualizer.delay();
            
            array[k].state = 'default';
            k++;
        }
        
        while (i < leftArr.length) {
            array[k] = { ...leftArr[i], state: 'default' };
            i++;
            k++;
        }
        
        while (j < rightArr.length) {
            array[k] = { ...rightArr[j], state: 'default' };
            j++;
            k++;
        }
        
        for (let idx = left; idx <= right; idx++) {
            array[idx].state = 'sorted';
        }
        this.visualizer.renderArray();
        await this.visualizer.delay();
    }
}