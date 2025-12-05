// ==================== 
// PLANET CONFIGURATION (Line 1-70)
// ==================== 
// To change planets: modify this array
// - radius: distance from sun (pixels)
// - speed: orbital speed (higher = faster)
// - size: planet diameter (pixels)
// - texture: NASA/Wikimedia image URL

const planetData = [
    { 
        id: 'mercury', 
        name: "Sahil's Mercury", 
        platform: 'INSTAGRAM',
        radius: 120,       // Distance from sun
        radiusY: 45,
        speed: 0.08,      // Orbital speed (INCREASED)
        size: 22,         // Planet size
        texture: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
        icon: '📸',
        url: 'https://instagram.com/yourusername',
        glowColor: 'rgba(225, 48, 108, 0.6)'
    },
    { 
        id: 'venus', 
        name: "Sahil's Venus", 
        platform: 'X / TWITTER',
        radius: 200,
        radiusY: 70,
        speed: 0.06,
        size: 30,
        texture: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg',
        icon: '𝕏',
        url: 'https://twitter.com/yourusername',
        glowColor: 'rgba(255, 255, 255, 0.4)'
    },
    { 
        id: 'earth', 
        name: "Sahil's Earth", 
        platform: 'LINKEDIN',
        radius: 300,
        radiusY: 100,
        speed: 0.045,
        size: 36,
        texture: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
        icon: '💼',
        url: 'https://linkedin.com/in/yourusername',
        glowColor: 'rgba(0, 119, 181, 0.6)'
    },
    { 
        id: 'mars', 
        name: "Sahil's Mars", 
        platform: 'KAGGLE',
        radius: 400,
        radiusY: 130,
        speed: 0.035,
        size: 28,
        texture: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
        icon: '📊',
        url: 'https://kaggle.com/yourusername',
        glowColor: 'rgba(32, 190, 255, 0.6)'
    },
    { 
        id: 'jupiter', 
        name: "Sahil's Jupiter", 
        platform: 'GITHUB',
        radius: 530,
        radiusY: 165,
        speed: 0.025,
        size: 55,
        texture: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg',
        icon: '💻',
        url: 'https://github.com/yourusername',
        glowColor: 'rgba(139, 148, 158, 0.5)'
    },
    { 
        id: 'saturn', 
        name: "Sahil's Saturn", 
        platform: 'EMAIL',
        radius: 680,
        radiusY: 200,
        speed: 0.018,
        size: 48,
        texture: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
        icon: '📧',
        url: 'mailto:drsahilsartaj@gmail.com',
        glowColor: 'rgba(123, 44, 191, 0.6)',
        hasRing: true
    }
];

// ==================== 
// CREATE SOLAR SYSTEM (Line 75-140)
// ==================== 
function createSolarSystem() {
    const container = document.getElementById('solar-container');
    
    // Create ELLIPTICAL orbit rings
    planetData.forEach(planet => {
        const orbit = document.createElement('div');
        orbit.className = 'orbit';
        orbit.style.width = (planet.radius * 2) + 'px';      // Full width
        orbit.style.height = (planet.radiusY * 2) + 'px';    // Shorter height
        container.appendChild(orbit);
    });

    // Create planets with real textures
    planetData.forEach(planet => {
        const planetEl = document.createElement('div');
        planetEl.className = 'planet';
        planetEl.id = planet.id;
        planetEl.style.width = planet.size + 'px';
        planetEl.style.height = planet.size + 'px';
        planetEl.style.backgroundImage = `url('${planet.texture}')`;
        

        
        // Click handler for warp
        planetEl.onclick = () => warpToPlanet(planet.platform, planet.url, planet.glowColor, planet.icon);

        // Add label
        const label = document.createElement('span');
        label.className = 'planet-label';
        label.innerHTML = `${planet.name}<span class="label-platform">${planet.platform}</span>`;
        planetEl.appendChild(label);

        // Add Saturn ring if needed
        if (planet.hasRing) {
            const ring = document.createElement('div');
            ring.className = 'saturn-ring';
            ring.style.width = (planet.size * 2.2) + 'px';
            ring.style.height = (planet.size * 2.2) + 'px';
            planetEl.appendChild(ring);
        }

        container.appendChild(planetEl);
    });
}

// ==================== 
// ANIMATE PLANETS (Line 145-175)
// ==================== 
// Uses requestAnimationFrame for smooth 60fps animation
function animatePlanets() {
    const time = Date.now() * 0.001; // Current time in seconds
    const container = document.getElementById('solar-container');
    const centerX = container.offsetWidth / 2; // sun center X
    const centerY = container.offsetHeight / 2; // sun center Y

    // get min and max orbit radius so brightness scales correctly
    const radii = planetData.map(p => p.radius);
    const minRadius = Math.min(...radii);
    const maxRadius = Math.max(...radii);

    planetData.forEach(planet => {
        const planetEl = document.getElementById(planet.id);
        if (!planetEl) return;

        // ELLIPTICAL orbital position
        const angle = time * planet.speed;
        const x = centerX + planet.radius * Math.cos(angle) - planet.size / 2;   // radiusX (horizontal)
        const y = centerY + planet.radiusY * Math.sin(angle) - planet.size / 2;  // radiusY (vertical - smaller)

        planetEl.style.left = x + 'px';
        planetEl.style.top = y + 'px';

        // DYNAMIC LIGHTING RELATIVE TO THE SUN

        // planet center
        const cx = x + planet.size / 2;
        const cy = y + planet.size / 2;

        // vector from planet to sun
        const dx = centerX - cx;
        const dy = centerY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        // unit vector in direction of the sun
        const lx = dx / dist;
        const ly = dy / dist;

        // offset of highlight/shadow around the disc (in % of diameter)
        const edgeOffset = 40; // tweak: higher = closer to limb

        // highlight – push toward sun
        planetEl.style.setProperty('--light-x', `${lx * edgeOffset}%`);
        planetEl.style.setProperty('--light-y', `${ly * edgeOffset}%`);

        // shadow – opposite side
        planetEl.style.setProperty('--shadow-x', `${-lx * edgeOffset * 0.6}%`);
        planetEl.style.setProperty('--shadow-y', `${-ly * edgeOffset * 0.6}%`);

        // brightness: closer orbits get more light
        const t = 1 - (planet.radius - minRadius) / (maxRadius - minRadius); // 1 = closest, 0 = farthest
        const lightStrength = 0.20 + t * 0.40; // range ~0.25–0.8

        planetEl.style.setProperty('--light-strength', lightStrength.toString());
    });

    requestAnimationFrame(animatePlanets);
}

// Initialize
createSolarSystem();
animatePlanets();

// ==================== 
// STARFIELD (Line 180-200)
// ==================== 
function createStars() {
    const starfield = document.getElementById('starfield');
    const count = window.innerWidth < 768 ? 150 : 300;
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star' + (Math.random() > 0.92 ? ' bright' : '');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 2.5 + 0.5;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.setProperty('--duration', (Math.random() * 4 + 2) + 's');
        star.style.setProperty('--opacity', Math.random() * 0.7 + 0.3);
        starfield.appendChild(star);
    }
}
createStars();

// ==================== 
// COMET TRAIL - Canvas (Line 205-265)
// ==================== 
const cometCanvas = document.getElementById('comet-canvas');
const cometCtx = cometCanvas.getContext('2d');
let particles = [];
let isDrawing = false;
let lastX = 0, lastY = 0;

function resizeCanvas() {
    cometCanvas.width = window.innerWidth;
    cometCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.alpha = 1;
        this.decay = 0.02 + Math.random() * 0.02;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
    }
    update() {
        this.alpha -= this.decay;
        this.x += this.vx;
        this.y += this.vy;
        this.size *= 0.97;
    }
    draw() {
        cometCtx.save();
        cometCtx.globalAlpha = this.alpha;
        cometCtx.beginPath();
        cometCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const gradient = cometCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(200, 230, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(150, 200, 255, 0)');
        cometCtx.fillStyle = gradient;
        cometCtx.fill();
        cometCtx.restore();
    }
}

function addParticles(x, y) {
    particles.push(new Particle(x, y, 8 + Math.random() * 6));
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(x + (Math.random() - 0.5) * 25, y + (Math.random() - 0.5) * 25, 2 + Math.random() * 4));
    }
}

function animateParticles() {
    cometCtx.clearRect(0, 0, cometCanvas.width, cometCanvas.height);
    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

function handleMove(x, y) {
    if (!isDrawing) return;
    const dx = x - lastX, dy = y - lastY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const steps = Math.max(1, Math.floor(dist / 8));
    for (let i = 0; i <= steps; i++) {
        addParticles(lastX + dx * (i/steps), lastY + dy * (i/steps));
    }
    lastX = x; lastY = y;
}

document.addEventListener('mousedown', e => { isDrawing = true; lastX = e.clientX; lastY = e.clientY; });
document.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
document.addEventListener('mouseup', () => isDrawing = false);
document.addEventListener('touchstart', e => { isDrawing = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; }, {passive: true});
document.addEventListener('touchmove', e => handleMove(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
document.addEventListener('touchend', () => isDrawing = false);

// ==================== 
// MATRIX RAIN (Line 270-310)
// ==================== 
const matrixCanvas = document.getElementById('matrix-canvas');
const matrixCtx = matrixCanvas.getContext('2d');

function runMatrixRain(callback) {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    
    const overlay = document.getElementById('matrix-overlay');
    overlay.classList.add('active');
    
    const chars = 'アイウエオカキクケコ0123456789ABCDEF$#@!';
    const fontSize = 14;
    const columns = matrixCanvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    let frameCount = 0;
    const maxFrames = 100;

    function draw() {
        matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        matrixCtx.fillStyle = '#0f0';
        matrixCtx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            matrixCtx.fillStyle = Math.random() > 0.98 ? '#fff' : '#0f0';
            matrixCtx.fillText(char, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
        
        frameCount++;
        if (frameCount < maxFrames) {
            requestAnimationFrame(draw);
        } else {
            overlay.classList.remove('active');
            matrixCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            if (callback) callback();
        }
    }
    draw();
}

// ==================== 
// WARP ANIMATION (Line 315-345)
// ==================== 
function warpToPlanet(platform, url, color, emoji) {
    const overlay = document.getElementById('warp-overlay');
    const warpPlanet = document.getElementById('warp-planet');
    const warpText = document.getElementById('warp-text');
    const warpStars = document.getElementById('warp-stars');

    warpPlanet.style.background = color;
    warpPlanet.innerHTML = emoji;
    warpText.textContent = `Warping to ${platform}...`;
    warpStars.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const line = document.createElement('div');
        line.className = 'warp-star-line';
        line.style.top = Math.random() * 100 + '%';
        line.style.left = '-100px';
        line.style.width = (50 + Math.random() * 150) + 'px';
        line.style.animationDelay = (Math.random() * 0.5) + 's';
        warpStars.appendChild(line);
    }

    overlay.classList.add('active');

    setTimeout(() => {
        window.open(url, '_blank');
        overlay.classList.remove('active');
    }, 1500);
}

// ==================== 
// PAGE NAVIGATION (Line 350-375)
// ==================== 
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function goHome() { showPage('home'); }

function goToProfile(section = null) {
    showPage('profile-page');
    if (section) {
        setTimeout(() => {
            const el = document.getElementById(section);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

function openTerminal() {
    runMatrixRain(() => {
        showPage('terminal-page');
        initTerminal();
        document.getElementById('terminal-input').focus();
    });
}

// ==================== 
// TERMINAL SYSTEM (Line 380-500)
// ==================== 
const terminalBody = document.getElementById('terminal-body');
const terminalInput = document.getElementById('terminal-input');

const ASCII_LOGO = `
  ___       _     _ _ _       _   _       _                         
 / __| __ _| |__ (_) ( )___  | | | |_ __ (_)_ _____ _ _ ___ ___     
 \\__ \\/ _\` | '_ \\| | |/(_-<  | |_| | '  \\| \\ V / -_) '_(_-</ -_)    
 |___/\\__,_|_.__/_|_|  /__/   \\___/|_|_|_|_|\\_/\\___|_| /__/\\___|    
`;

// Command handlers - ADD NEW COMMANDS HERE (Line 395)
const COMMANDS = {
    '/help': showHelp,
    '/profile': () => goToProfile(),
    '/cv': openCV,
    '/interest': showInterests,
    '/phone': showPhone,
    '/email': showEmail,
    '/pic': openPicture,
    '/education': () => goToProfile('education-section'),
    '/current': showCurrent,
    '/projects': () => goToProfile('projects-section'),
    '/skills': showSkills,
    '/fun': openPuzzle,
    '/bye': goHome,
    '/home': goHome,
    '/clear': clearTerminal,
};

function initTerminal() {
    terminalBody.innerHTML = '';
    printLine(ASCII_LOGO, 'dim ascii-art');
    printLine('');
    printLine('Welcome to Sahil\'s Cosmic Terminal v2.0', 'bright');
    printLine('Type /help to see available commands', 'cyan');
    printLine('─'.repeat(50), 'dim');
}

function printLine(text, className = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line ' + className;
    line.innerHTML = text;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function printPrompt(cmd) {
    const line = document.createElement('div');
    line.className = 'terminal-line terminal-prompt';
    line.textContent = cmd;
    terminalBody.appendChild(line);
}

function processCommand(input) {
    const cmd = input.trim().toLowerCase();
    printPrompt(input);
    printLine('');
    if (COMMANDS[cmd]) COMMANDS[cmd]();
    else if (cmd !== '') {
        printLine(`Command not found: ${cmd}`, 'error');
        printLine('Type /help for available commands', 'dim');
    }
    printLine('');
}

// TERMINAL COMMAND FUNCTIONS - MODIFY CONTENT HERE (Line 450+)

function showHelp() {
    printLine('╔════════════════════════════════════════════════════╗', 'cyan');
    printLine('║           AVAILABLE COMMANDS                       ║', 'cyan');
    printLine('╠════════════════════════════════════════════════════╣', 'cyan');
    printLine('║  /profile    →  View Sahil\'s profile               ║', 'cyan');
    printLine('║  /cv         →  View Sahil\'s CV                    ║', 'cyan');
    printLine('║  /interest   →  Sahil\'s interests                  ║', 'cyan');
    printLine('║  /phone      →  Sahil\'s phone                      ║', 'cyan');
    printLine('║  /email      →  Sahil\'s email                      ║', 'cyan');
    printLine('║  /pic        →  View Sahil\'s picture               ║', 'cyan');
    printLine('║  /education  →  Educational background             ║', 'cyan');
    printLine('║  /current    →  What Sahil is doing now            ║', 'cyan');
    printLine('║  /projects   →  Sahil\'s projects                   ║', 'cyan');
    printLine('║  /skills     →  Technical skills                   ║', 'cyan');
    printLine('║  /fun        →  Play a puzzle game!                ║', 'cyan');
    printLine('║  /bye        →  Exit terminal                      ║', 'cyan');
    printLine('╚════════════════════════════════════════════════════╝', 'cyan');
}

// MODIFY CV LINK HERE (Line 475)
function openCV() {
    printLine('Opening Sahil\'s CV... 📄', 'yellow');
    setTimeout(() => window.open('https://drive.google.com/your-cv-link', '_blank'), 1000);
}

// MODIFY INTERESTS HERE (Line 480)
function showInterests() {
    printLine('╔═══════════════════════════════════════════════════╗', 'purple');
    printLine('║            SAHIL\'S CODING INTERESTS               ║', 'purple');
    printLine('╠═══════════════════════════════════════════════════╣', 'purple');
    printLine('║  🤖 Artificial Intelligence & ML                  ║', 'purple');
    printLine('║  🧠 Large Language Models (LLMs)                  ║', 'purple');
    printLine('║  🔒 Federated Learning                            ║', 'purple');
    printLine('║  👁️  Computer Vision                               ║', 'purple');
    printLine('║  📊 Natural Language Processing                   ║', 'purple');
    printLine('║  🌐 Web Development                               ║', 'purple');
    printLine('╚═══════════════════════════════════════════════════╝', 'purple');
}

function showPhone() {
    printLine('📱 PHONE NUMBER', 'yellow');
    printLine('─'.repeat(40), 'dim');
    printLine('Please don\'t want Sahil\'s number...', 'bright');
    printLine('He is very shy to speak on phone! 😅', 'bright');
    printLine('');
    printLine('📧 Email: drsahilsartaj@gmail.com', 'cyan');
    printLine('   (not yet Dr. though hehe :))', 'dim');
}

function showEmail() {
    printLine('📧 EMAIL', 'yellow');
    printLine('─'.repeat(40), 'dim');
    printLine('✉️  drsahilsartaj@gmail.com', 'cyan');
    printLine('   (not yet Dr. though hehe :))', 'dim');
}

// MODIFY PICTURE LINK HERE (Line 515)
function openPicture() {
    printLine('📸 Opening picture...', 'yellow');
    setTimeout(() => window.open('https://your-picture-url.com', '_blank'), 1000);
}

// MODIFY CURRENT ACTIVITY HERE (Line 520)
function showCurrent() {
    printLine('⏰ WHAT SAHIL IS DOING NOW', 'yellow');
    printLine('─'.repeat(40), 'dim');
    printLine('  🎓 Pursuing Masters in AI/ML', '');
    printLine('  🔬 Research in Federated Learning', '');
    printLine('  💻 Building cool AI projects', '');
    printLine('');
    printLine('However...', 'dim');
    printLine('He\'s busy taking a power nap to', 'cyan');
    printLine('recharge his neural networks! 😴💤', 'cyan');
}

// MODIFY SKILLS HERE (Line 535)
function showSkills() {
    printLine('⚡ TECHNICAL SKILLS', 'yellow');
    printLine('─'.repeat(50), 'dim');
    printLine('PROGRAMMING:', 'bright');
    printLine('  ▸ Python ████████████████████ Expert', 'cyan');
    printLine('  ▸ JavaScript ██████████████░░ Advanced', 'cyan');
    printLine('');
    printLine('AI/ML:', 'bright');
    printLine('  ▸ PyTorch ██████████████████ Expert', 'cyan');
    printLine('  ▸ TensorFlow ██████████████░░ Advanced', 'cyan');
    printLine('  ▸ Hugging Face ████████████████ Expert', 'cyan');
    printLine('');
    printLine('<span class="cmd-link" onclick="goToProfile(\'skills-section\')">→ View full skills</span>');
}

function clearTerminal() {
    terminalBody.innerHTML = '';
    printLine('Terminal cleared.', 'dim');
}

// Terminal input handler
terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        processCommand(terminalInput.value);
        terminalInput.value = '';
    }
});

// ==================== 
// PUZZLE GAME (Line 565-600)
// ==================== 
let currentPuzzle = null;

// ADD/MODIFY PUZZLES HERE (Line 570)
const puzzles = [
    { q: "Double me and add 10 = 30. What am I?", a: "10" },
    { q: "What has keys but no locks?", a: "keyboard" },
    { q: "Python function for list length?", a: "len" },
    { q: "2, 4, 8, 16, __?", a: "32" },
    { q: "LIFO data structure?", a: "stack" },
    { q: "What is 2^10?", a: "1024" },
];

function openPuzzle() {
    printLine('🧩 Opening puzzle...', 'yellow');
    document.getElementById('puzzle-modal').classList.add('active');
    getNewPuzzle();
}

function getNewPuzzle() {
    currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    document.getElementById('puzzle-question').textContent = currentPuzzle.q;
    document.getElementById('puzzle-input').value = '';
    document.getElementById('puzzle-result').style.display = 'none';
}

function checkPuzzleAnswer() {
    const userAnswer = document.getElementById('puzzle-input').value.trim().toLowerCase();
    const resultDiv = document.getElementById('puzzle-result');
    if (userAnswer === currentPuzzle.a.toLowerCase()) {
        resultDiv.className = 'puzzle-result success';
        resultDiv.textContent = '🎉 Correct!';
    } else {
        resultDiv.className = 'puzzle-result error';
        resultDiv.textContent = `❌ Answer: ${currentPuzzle.a}`;
    }
    resultDiv.style.display = 'block';
}

function closePuzzle() {
    document.getElementById('puzzle-modal').classList.remove('active');
}

// ==================== 
// KEYBOARD SHORTCUTS (Line 610)
// ==================== 
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('puzzle-modal').classList.contains('active')) closePuzzle();
        else if (document.getElementById('terminal-page').classList.contains('active')) goHome();
        else if (document.getElementById('profile-page').classList.contains('active')) goHome();
    }
});