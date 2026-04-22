document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mathCanvas');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clearBtn');
    const predictBtn = document.getElementById('predictBtn');
    const recognizedText = document.getElementById('recognizedText');

    // Drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Initialize canvas
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Clear canvas with white background
    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    clearCanvas();

    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }

    function draw(e) {
        if (!isDrawing) return;
        const [x, y] = getCoordinates(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return [
            clientX - rect.left,
            clientY - rect.top
        ];
    }

    // Event listeners for Mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Event listeners for Touch (Mobile)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });
    canvas.addEventListener('touchend', stopDrawing);

    // Clear Button
    clearBtn.addEventListener('click', () => {
        clearCanvas();
        recognizedText.textContent = 'Draw a math problem and click Solve...';
    });

    // Recognize Button
    predictBtn.addEventListener('click', async () => {
        predictBtn.textContent = 'Solving...';
        predictBtn.disabled = true;

        try {
            const imageData = canvas.toDataURL('image/png');
            
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: imageData })
            });

            const data = await response.json();

            if (data.error) {
                recognizedText.textContent = 'Error: ' + data.error;
                return;
            }

            // Show recognized text
            recognizedText.textContent = data.text || 'Nothing recognized';

        } catch (error) {
            console.error('Error:', error);
            recognizedText.textContent = 'Error: Server not running!';
        } finally {
            predictBtn.textContent = 'Solve';
            predictBtn.disabled = false;
        }
    });
});
