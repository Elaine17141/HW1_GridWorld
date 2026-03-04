document.addEventListener('DOMContentLoaded', () => {
    const gridSizeInput = document.getElementById('grid-size');
    const generateBtn = document.getElementById('generate-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const backBtn = document.getElementById('back-btn');
    const dynamicStatus = document.getElementById('dynamic-status');

    const setupSection = document.getElementById('setup-section');
    const resultSection = document.getElementById('result-section');

    const gridContainer = document.getElementById('grid-container');
    const valueMatrix = document.getElementById('value-matrix');
    const policyMatrix = document.getElementById('policy-matrix');
    const gridTitle = document.getElementById('grid-title');

    let start = null;
    let end = null;
    let walls = [];
    let n = parseInt(gridSizeInput.value);

    function updateStatus(msg) {
        if (dynamicStatus) dynamicStatus.textContent = msg;
    }

    function createGrid() {
        n = parseInt(gridSizeInput.value);
        if (n < 3) n = 3;
        if (n > 10) n = 10;
        gridSizeInput.value = n;

        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${n}, 50px)`;
        gridTitle.textContent = `${n} x ${n} Square:`;

        start = null;
        end = null;
        walls = [];
        setupSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
        updateStatus('請點擊設定起點 (綠色)');

        let cellId = 1;
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = cellId++;
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('click', () => handleCellClick(r, c, cell));
                gridContainer.appendChild(cell);
            }
        }
    }

    function handleCellClick(r, c, cell) {
        if (!start) {
            start = [r, c];
            cell.classList.add('start');
            updateStatus('請點擊設定終點 (紅色)');
        } else if (!end) {
            if (r === start[0] && c === start[1]) return;
            end = [r, c];
            cell.classList.add('end');
            updateStatus('請點擊格子設定牆壁 (灰色)，設定完後請點擊 Calculate');
        } else {
            if ((r === start[0] && c === start[1]) || (r === end[0] && c === end[1])) return;
            if (cell.classList.contains('wall')) {
                cell.classList.remove('wall');
                walls = walls.filter(w => w[0] !== r || w[1] !== c);
            } else {
                cell.classList.add('wall');
                walls.push([r, c]);
            }
        }
    }

    // Ported from Python app.py
    function policyEvaluation(n, start, end, walls, gamma = 0.9, threshold = 1e-4) {
        let V = Array.from({ length: n }, () => Array(n).fill(0));
        const actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const [endR, endC] = end;
        const wallSet = new Set(walls.map(w => `${w[0]},${w[1]}`));

        V[endR][endC] = 10.0;

        while (true) {
            let delta = 0;
            let nextV = Array.from({ length: n }, () => Array(n).fill(0));

            for (let r = 0; r < n; r++) {
                for (let c = 0; c < n; c++) {
                    if (r === endR && c === endC) {
                        nextV[r][c] = 10.0;
                        continue;
                    }
                    if (wallSet.has(`${r},${c}`)) {
                        nextV[r][c] = 0;
                        continue;
                    }

                    let v = 0;
                    for (const [dr, dc] of actions) {
                        let nr = r + dr;
                        let nc = c + dc;

                        if (nr < 0 || nr >= n || nc < 0 || nc >= n || wallSet.has(`${nr},${nc}`)) {
                            nr = r;
                            nc = c;
                        }

                        let reward = (nr === endR && nc === endC) ? 10.0 : -1.0;
                        v += 0.25 * (reward + gamma * V[nr][nc]);
                    }
                    nextV[r][c] = v;
                    delta = Math.max(delta, Math.abs(nextV[r][c] - V[r][c]));
                }
            }
            V = nextV;
            if (delta < threshold) break;
        }
        return V;
    }

    async function handleCalculate() {
        if (!start || !end) {
            alert("Please set both Start and End points first.");
            return;
        }

        // Domestic computation for static demo
        const values = policyEvaluation(n, start, end, walls);
        renderResults(values);
        updateStatus('計算完成！左邊為價值矩陣，右邊為最佳路徑');
    }

    function renderResults(values) {
        setupSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

        renderMatrix(valueMatrix, values, 'value');
        renderMatrix(policyMatrix, values, 'policy');
    }

    function getBestDirection(r, c, values, n, wallSet) {
        const neighbors = [
            { dir: '↑', r: r - 1, c: c },
            { dir: '↓', r: r + 1, c: c },
            { dir: '←', r: r, c: c - 1 },
            { dir: '→', r: r, c: c + 1 }
        ];

        let maxVal = -Infinity;
        let bestDir = '';

        neighbors.forEach(nb => {
            let nr = nb.r, nc = nb.c;
            if (nr < 0 || nr >= n || nc < 0 || nc >= n || wallSet.has(`${nr},${nc}`)) {
                nr = r;
                nc = c;
            }
            const val = values[nr][nc];
            if (val > maxVal) {
                maxVal = val;
                bestDir = nb.dir;
            }
        });
        return bestDir;
    }

    function renderMatrix(container, values, type) {
        container.innerHTML = '';
        container.style.gridTemplateColumns = `30px repeat(${n}, 50px)`;
        container.style.gridTemplateRows = `repeat(${n}, 50px) 30px`;

        const wallSet = new Set(walls.map(w => `${w[0]},${w[1]}`));

        for (let idx = 0; idx < n; idx++) {
            const r = idx;
            const y_label = n - 1 - r;

            const yLabelDiv = document.createElement('div');
            yLabelDiv.className = 'label-cell y-label';
            yLabelDiv.textContent = y_label;
            container.appendChild(yLabelDiv);

            for (let c = 0; c < n; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';

                if (wallSet.has(`${r},${c}`)) {
                    cell.classList.add('wall');
                } else if (r === end[0] && c === end[1]) {
                    if (type === 'value') cell.textContent = '10.00';
                } else {
                    if (type === 'value') {
                        cell.textContent = values[r][c].toFixed(2);
                    } else {
                        const dir = getBestDirection(r, c, values, n, wallSet);
                        const arrowDiv = document.createElement('div');
                        arrowDiv.className = 'policy-arrow-single';
                        arrowDiv.textContent = dir;
                        arrowDiv.style.fontSize = '24px';
                        arrowDiv.style.fontWeight = 'bold';
                        cell.appendChild(arrowDiv);
                    }
                }
                container.appendChild(cell);
            }
        }

        container.appendChild(document.createElement('div'));
        for (let c = 0; c < n; c++) {
            const xLabelDiv = document.createElement('div');
            xLabelDiv.className = 'label-cell x-label';
            xLabelDiv.textContent = c;
            container.appendChild(xLabelDiv);
        }
    }

    generateBtn.addEventListener('click', createGrid);
    calculateBtn.addEventListener('click', handleCalculate);
    backBtn.addEventListener('click', () => {
        setupSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
    });

    createGrid();
});
