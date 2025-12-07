import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let galaxyScene, galaxyCamera, galaxyRenderer, galaxyControls;
let galaxyPoints, centerGlow;
let autoRotateEnabled = true;
let galaxyInitialized = false;

const galaxyConfig = {
    count: 100000,
    size: 0.015,
    radius: 5,
    branches: 3,
    spin: 1.2,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ffffff',
    middleColor: '#ff6030',
    outsideColor: '#1b3984'
};

export function initGalaxy() {
    if (galaxyInitialized) {
        animateGalaxy();
        return;
    }

    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;

    galaxyScene = new THREE.Scene();
    galaxyScene.fog = new THREE.Fog(0x000000, 10, 25);

    galaxyCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    galaxyCamera.position.set(0, 2, 6);

    galaxyRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    galaxyRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    galaxyRenderer.setSize(window.innerWidth, window.innerHeight);

    galaxyControls = new OrbitControls(galaxyCamera, galaxyRenderer.domElement);
    galaxyControls.enableDamping = true;
    galaxyControls.dampingFactor = 0.05;
    galaxyControls.minDistance = 2;
    galaxyControls.maxDistance = 15;
    galaxyControls.autoRotate = true;
    galaxyControls.autoRotateSpeed = 0.8;

    generateGalaxy();
    window.addEventListener('resize', onGalaxyResize);
    galaxyInitialized = true;
    animateGalaxy();
}

function generateGalaxy() {
    if (galaxyPoints) {
        galaxyPoints.geometry.dispose();
        galaxyPoints.material.dispose();
        galaxyScene.remove(galaxyPoints);
    }

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(galaxyConfig.count * 3);
    const colors = new Float32Array(galaxyConfig.count * 3);

    const insideColor = new THREE.Color(galaxyConfig.insideColor);
    const middleColor = new THREE.Color(galaxyConfig.middleColor);
    const outsideColor = new THREE.Color(galaxyConfig.outsideColor);

    for (let i = 0; i < galaxyConfig.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * galaxyConfig.radius;
        const branchAngle = (i % galaxyConfig.branches) / galaxyConfig.branches * Math.PI * 2;
        const spinAngle = radius * galaxyConfig.spin;

        const randomX = Math.pow(Math.random(), galaxyConfig.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyConfig.randomness * radius;
        const randomY = Math.pow(Math.random(), galaxyConfig.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyConfig.randomness * radius * 0.3;
        const randomZ = Math.pow(Math.random(), galaxyConfig.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyConfig.randomness * radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = insideColor.clone();
        const radiusRatio = radius / galaxyConfig.radius;
        
        if (radiusRatio < 0.5) {
            mixedColor.lerp(middleColor, radiusRatio * 2);
        } else {
            mixedColor.copy(middleColor);
            mixedColor.lerp(outsideColor, (radiusRatio - 0.5) * 2);
        }

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: galaxyConfig.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 0.9
    });

    galaxyPoints = new THREE.Points(geometry, material);
    galaxyScene.add(galaxyPoints);
    
    addCenterGlow();
}

function addCenterGlow() {
    if (centerGlow) {
        centerGlow.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
        galaxyScene.remove(centerGlow);
    }

    centerGlow = new THREE.Group();

    const glow1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 32, 32),
        new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 1, blending: THREE.AdditiveBlending })
    );
    centerGlow.add(glow1);

    const glow2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshBasicMaterial({ color: '#ffcc88', transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending })
    );
    centerGlow.add(glow2);

    const glow3 = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 32, 32),
        new THREE.MeshBasicMaterial({ color: '#ff8844', transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending })
    );
    centerGlow.add(glow3);

    galaxyScene.add(centerGlow);
}

function animateGalaxy() {
    requestAnimationFrame(animateGalaxy);

    if (galaxyPoints) galaxyPoints.rotation.y += 0.0002;
    
    if (centerGlow) {
        const pulse = Math.sin(Date.now() * 0.001) * 0.05 + 1;
        centerGlow.scale.set(pulse, pulse, pulse);
    }

    galaxyControls.update();
    galaxyRenderer.render(galaxyScene, galaxyCamera);
}

function onGalaxyResize() {
    if (!galaxyCamera || !galaxyRenderer) return;
    galaxyCamera.aspect = window.innerWidth / window.innerHeight;
    galaxyCamera.updateProjectionMatrix();
    galaxyRenderer.setSize(window.innerWidth, window.innerHeight);
}

window.resetGalaxyView = function() {
    if (!galaxyCamera || !galaxyControls) return;
    galaxyCamera.position.set(0, 2, 6);
    galaxyControls.target.set(0, 0, 0);
    galaxyControls.update();
};

window.toggleGalaxyRotation = function() {
    if (!galaxyControls) return;
    autoRotateEnabled = !autoRotateEnabled;
    galaxyControls.autoRotate = autoRotateEnabled;
    event.target.textContent = autoRotateEnabled ? '⏯️ Auto-Rotate' : '⏸️ Paused';
};

window.randomizeGalaxy = function() {
    const colors = [
        { inside: '#ffffff', middle: '#ff6030', outside: '#1b3984' },
        { inside: '#ffffff', middle: '#00ff88', outside: '#0088ff' },
        { inside: '#ffffff', middle: '#ff0099', outside: '#9900ff' },
        { inside: '#ffffff', middle: '#ffff00', outside: '#ff0000' },
        { inside: '#ffffff', middle: '#00ffff', outside: '#ff00ff' }
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    galaxyConfig.insideColor = randomColor.inside;
    galaxyConfig.middleColor = randomColor.middle;
    galaxyConfig.outsideColor = randomColor.outside;
    galaxyConfig.branches = Math.floor(Math.random() * 4) + 3;
    galaxyConfig.spin = Math.random() * 2 + 0.5;
    generateGalaxy();
};

window.initGalaxy = initGalaxy;