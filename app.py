from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

def policy_evaluation(n, start, end, walls, gamma=0.9, threshold=1e-4):
    """
    Perform iterative policy evaluation on an n x n grid.
    - Generate a fixed random policy (1 random action per state).
    - Living reward = -1.
    - Moving into End state reward = +10.
    - End state value fixed at 10.0.
    - Walls are inaccessible.
    """
    V = np.zeros((n, n))
    policy = np.zeros((n, n), dtype=int)
    actions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    end_r, end_c = end
    wall_set = set(tuple(w) for w in walls)
    
    import random
    # Generate fixed random policy for each state
    for r in range(n):
        for c in range(n):
            if (r, c) == (end_r, end_c) or (r, c) in wall_set:
                continue
            policy[r, c] = random.randint(0, 3)
            
    # Initialize End state value
    V[end_r, end_c] = 10.0
    
    while True:
        delta = 0
        new_V = np.copy(V)
        
        for r in range(n):
            for c in range(n):
                # End state is fixed at 10.0
                if r == end_r and c == end_c:
                    new_V[r, c] = 10.0
                    continue
                
                # Walls skip calculation (Value 0 or keep as is)
                if (r, c) in wall_set:
                    new_V[r, c] = 0
                    continue
                
                # Fetch the fixed action from our random policy
                action_idx = policy[r, c]
                dr, dc = actions[action_idx]
                nr, nc = r + dr, c + dc
                
                # Out of bounds or wall: stay in current state
                if nr < 0 or nr >= n or nc < 0 or nc >= n or (nr, nc) in wall_set:
                    nr, nc = r, c
                
                # Reward logic
                if nr == end_r and nc == end_c:
                    reward = 10.0
                else:
                    reward = -1.0
                
                # Probability is 1.0 for the fixed random action
                v = reward + gamma * V[nr, nc]
                
                new_V[r, c] = v
                delta = max(delta, abs(v - V[r, c]))
        
        V = new_V
        if delta < threshold:
            break
            
    return V.tolist(), policy.tolist()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    n = int(data.get('n', 5))
    start = data.get('start')
    end = data.get('end')
    walls = data.get('walls', [])
    
    if not start or not end:
        return jsonify({"error": "Start and End positions are required"}), 400
    
    values, policy = policy_evaluation(n, start, end, walls)
    return jsonify({"values": values, "policy": policy})

if __name__ == '__main__':
    app.run(debug=True)
