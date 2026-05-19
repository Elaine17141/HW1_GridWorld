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
        let policy = Array.from({ length: n }, () => Array(n).fill(0));
        const actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const [endR, endC] = end;
        const wallSet = new Set(walls.map(w => `${w[0]},${w[1]}`));

        // 1. 初始化固定的隨機策略 (每個格子指定一個動作)
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (r === endR && c === endC) continue;
                if (wallSet.has(`${r},${c}`)) continue;
                policy[r][c] = Math.floor(Math.random() * 4); // 0:↑, 1:↓, 2:←, 3:→
            }
        }

        V[endR][endC] = 10.0;

        // 2. 針對該策略進行 Policy Evaluation
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

                    // 取出該格子固定的隨機動作
                    const actionIdx = policy[r][c];
                    const [dr, dc] = actions[actionIdx];
                    let nr = r + dr;
                    let nc = c + dc;

                    if (nr < 0 || nr >= n || nc < 0 || nc >= n || wallSet.has(`${nr},${nc}`)) {
                        nr = r;
                        nc = c;
                    }

                    let reward = (nr === endR && nc === endC) ? 10.0 : -1.0;
                    // 因為動作機率是 1.0，直接計算
                    let v = reward + gamma * V[nr][nc];
                    
                    nextV[r][c] = v;
                    delta = Math.max(delta, Math.abs(nextV[r][c] - V[r][c]));
                }
            }
            V = nextV;
            if (delta < threshold) break;
        }
        return { V, policy };
    }

    // --- HW1-3: Value Iteration ---
    function valueIteration(n, end, walls, gamma = 0.9, threshold = 1e-4) {
        let V = Array.from({ length: n }, () => Array(n).fill(0));
        let policy = Array.from({ length: n }, () => Array(n).fill([]));
        const actions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const [endR, endC] = end;
        const wallSet = new Set(walls.map(w => `${w[0]},${w[1]}`));

        V[endR][endC] = 10.0;

        // 1. 迭代尋找最佳價值 V*
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

                    let maxV = -Infinity;
                    for (const [dr, dc] of actions) {
                        let nr = r + dr;
                        let nc = c + dc;

                        if (nr < 0 || nr >= n || nc < 0 || nc >= n || wallSet.has(`${nr},${nc}`)) {
                            nr = r;
                            nc = c;
                        }

                        let reward = (nr === endR && nc === endC) ? 10.0 : -1.0;
                        let v = reward + gamma * V[nr][nc];
                        if (v > maxV) maxV = v;
                    }
                    nextV[r][c] = maxV;
                    delta = Math.max(delta, Math.abs(nextV[r][c] - V[r][c]));
                }
            }
            V = nextV;
            if (delta < threshold) break;
        }

        // 2. 根據收斂的 V* 推導最佳策略 (Greedy Policy)
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (r === endR && c === endC) continue;
                if (wallSet.has(`${r},${c}`)) continue;

                let maxV = -Infinity;
                let bestActions = [];
                for (let i = 0; i < actions.length; i++) {
                    const [dr, dc] = actions[i];
                    let nr = r + dr;
                    let nc = c + dc;

                    if (nr < 0 || nr >= n || nc < 0 || nc >= n || wallSet.has(`${nr},${nc}`)) {
                        nr = r;
                        nc = c;
                    }

                    let reward = (nr === endR && nc === endC) ? 10.0 : -1.0;
                    let v = reward + gamma * V[nr][nc];
                    
                    const epsilon = 1e-7;
                    if (v > maxV + epsilon) {
                        maxV = v;
                        bestActions = [i];
                    } else if (Math.abs(v - maxV) < epsilon) {
                        bestActions.push(i);
                    }
                }
                policy[r][c] = bestActions;
            }
        }
        return { V, policy };
    }

    async function handleCalculate() {
        if (!start || !end) {
            alert("Please set both Start and End points first.");
            return;
        }

        const result = policyEvaluation(n, start, end, walls);
        renderResults(result.V, result.policy, 'Stage 1: Random Policy Evaluation (HW1-2)', 'hw1-2', 'Currently showing a <strong>Random Policy</strong>. Arrows are generated randomly, and V(s) is evaluated strictly on this random behavior.');
        updateStatus('計算完成！已顯示隨機策略與對應價值');
    }

    function handleOptimize() {
        const result = valueIteration(n, end, walls);
        renderResults(result.V, result.policy, 'Stage 2: Optimal Policy & Value (HW1-3)', 'hw1-3', 'Currently showing the <strong>Optimal Policy</strong>. Value Iteration has converged, replacing random actions with optimal greedy actions.');
        updateStatus('最佳化完成！隨機動作已替換為最佳政策');
    }

    function renderResults(V, policy, title, mode, desc) {
        setupSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        
        // UI Updates for explicit homework requirements
        document.body.className = mode; // Add mode class to body for CSS targeting
        
        const titleEl = document.getElementById('result-title');
        if (titleEl) titleEl.textContent = title;
        
        const descEl = document.getElementById('result-desc');
        if (descEl) descEl.innerHTML = desc;
        
        // Badge highlights
        const badge2 = document.getElementById('badge-hw1-2');
        if (badge2) badge2.classList.toggle('active', mode === 'hw1-2');
        
        const badge3 = document.getElementById('badge-hw1-3');
        if (badge3) badge3.classList.toggle('active', mode === 'hw1-3');
        
        // Hide optimize button if already optimized
        const optimizeBtn = document.getElementById('optimize-btn');
        if (optimizeBtn) {
            optimizeBtn.style.display = mode === 'hw1-3' ? 'none' : 'inline-block';
        }

        renderMatrix(valueMatrix, V, policy, 'value');
        renderMatrix(policyMatrix, V, policy, 'policy');
    }

    function renderMatrix(container, values, policy, type) {
        container.innerHTML = '';
        container.style.gridTemplateColumns = `30px repeat(${n}, 50px)`;
        container.style.gridTemplateRows = `repeat(${n}, 50px) 30px`;

        const wallSet = new Set(walls.map(w => `${w[0]},${w[1]}`));
        const actionDirs = [
            { dir: '↑', cls: 'up' },
            { dir: '↓', cls: 'down' },
            { dir: '←', cls: 'left' },
            { dir: '→', cls: 'right' }
        ];

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
                    else cell.textContent = '★'; // Goal
                } else {
                    if (type === 'value') {
                        cell.textContent = values[r][c].toFixed(2);
                    } else {
                        // 支援單一動作或多個最佳動作
                        const actionsArray = Array.isArray(policy[r][c]) ? policy[r][c] : [policy[r][c]];
                        const arrowsContainer = document.createElement('div');
                        arrowsContainer.className = 'policy-arrows';
                        
                        actionsArray.forEach(actionIdx => {
                            const d = actionDirs[actionIdx];
                            const arrowDiv = document.createElement('div');
                            arrowDiv.className = `arrow ${d.cls}`;
                            arrowDiv.textContent = d.dir;
                            arrowsContainer.appendChild(arrowDiv);
                        });
                        
                        cell.appendChild(arrowsContainer);
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
    
    const optimizeBtn = document.getElementById('optimize-btn');
    if (optimizeBtn) optimizeBtn.addEventListener('click', handleOptimize);

    backBtn.addEventListener('click', () => {
        setupSection.classList.remove('hidden');
        resultSection.classList.add('hidden');
    });

    createGrid();
});
