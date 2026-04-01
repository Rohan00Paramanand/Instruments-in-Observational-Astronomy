import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Data Retrieval
    const dataElement = document.getElementById('geometry-data');
    if (!dataElement) return;
    const geometryData = JSON.parse(dataElement.textContent);
    console.log("Geometry Data Loaded:", geometryData);

    // 2. Scene Setup
    const container = document.getElementById('3d-viewer');
    const resetBtn = document.getElementById('reset-camera-btn');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    // Grid and Axes
    const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x888888);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Directional light for general illumination
    const dirLight = new THREE.DirectionalLight(0xfffae6, 1.5);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);

    // Initial camera configs
    const initialCameraPosition = new THREE.Vector3(20, 15, 20);
    const origin = new THREE.Vector3(0, 0, 0);
    camera.position.copy(initialCameraPosition);
    camera.lookAt(origin);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Explicitly set sRGB color space for better color visibility
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.copy(origin);

    // Camera Reset Button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            camera.position.copy(initialCameraPosition);
            controls.target.copy(origin);
            controls.update();
        });
    }

    // 3. Geometry Construction Materials
    const materialStone = new THREE.MeshLambertMaterial({
        color: 0xc17359, // Reddish sandstone color typical of Jantar Mantar
    });
    const materialBrass = new THREE.MeshLambertMaterial({
        color: 0xb5a642,
        side: THREE.DoubleSide
    });
    const materialGround = new THREE.MeshLambertMaterial({
        color: 0x2e4a2b, // Dark green grass/dirt color
    });

    const instrumentGroup = new THREE.Group();
    scene.add(instrumentGroup);

    // Universal Ground Plane
    const groundGeom = new THREE.PlaneGeometry(100, 100);
    const groundMesh = new THREE.Mesh(groundGeom, materialGround);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.5; // Slightly below origins
    scene.add(groundMesh);

    // --- Helper to draw floating Text Labels ---
    function createTextSprite(message) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        const fontsize = 36;
        context.font = "Bold " + fontsize + "px Arial";
        const metrics = context.measureText(message);
        const textWidth = metrics.width;
        
        // Draw Background Pill
        context.fillStyle = "rgba(20, 30, 50, 0.75)";
        const margin = 20;
        const bgWidth = textWidth + margin * 2;
        const bgHeight = fontsize + margin * 2;
        const startX = (canvas.width - bgWidth) / 2;
        const startY = (canvas.height - bgHeight) / 2;
        const radius = 15;
        
        context.beginPath();
        context.moveTo(startX + radius, startY);
        context.lineTo(startX + bgWidth - radius, startY);
        context.quadraticCurveTo(startX + bgWidth, startY, startX + bgWidth, startY + radius);
        context.lineTo(startX + bgWidth, startY + bgHeight - radius);
        context.quadraticCurveTo(startX + bgWidth, startY + bgHeight, startX + bgWidth - radius, startY + bgHeight);
        context.lineTo(startX + radius, startY + bgHeight);
        context.quadraticCurveTo(startX, startY + bgHeight, startX, startY + bgHeight - radius);
        context.lineTo(startX, startY + radius);
        context.quadraticCurveTo(startX, startY, startX + radius, startY);
        context.closePath();
        context.fill();
        
        // Draw Text
        context.fillStyle = "rgba(255, 255, 255, 1.0)";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(message, canvas.width / 2, canvas.height / 2 + 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.renderOrder = 999; // Render on top
        sprite.scale.set(12, 3, 1); 
        return sprite;
    }

    // 4. Draw Specific Instrument
    if (geometryData.instrument === 'samrat_yantra') {
        const height = geometryData.angles.gnomon_height;
        const base = geometryData.angles.gnomon_base;
        const thickness = 1.0;

        // Custom Triangle Geometry for Gnomon
        const shape = new THREE.Shape();
        shape.moveTo(0, 0); // Bottom tip
        shape.lineTo(base, 0); // Bottom back
        shape.lineTo(0, height); // Top tip
        shape.lineTo(0, 0); // Close

        const extrudeSettings = { depth: thickness, bevelEnabled: false };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        // Center the gnomon over origin
        geom.translate(-base / 2, 0, -thickness / 2);

        const gnomonMesh = new THREE.Mesh(geom, materialStone);
        instrumentGroup.add(gnomonMesh);

        // Add a simple flat base platform
        const platformGeom = new THREE.BoxGeometry(base * 1.5, 0.5, thickness * 8);
        const platformMesh = new THREE.Mesh(platformGeom, materialStone);
        platformMesh.position.y = -0.25;
        instrumentGroup.add(platformMesh);

        // Labels
        const scaleFix = base / 50; // Scale relative to model size naturally
        const lblHeight = createTextSprite("Height: " + height.toFixed(1) + "m");
        lblHeight.position.set(0, height / 2, thickness * 2);
        lblHeight.scale.multiplyScalar(scaleFix);
        instrumentGroup.add(lblHeight);

        const lblBase = createTextSprite("Base: " + base.toFixed(1) + "m");
        lblBase.position.set(-base / 2, 2, thickness * 2);
        lblBase.scale.multiplyScalar(scaleFix);
        instrumentGroup.add(lblBase);

        if (geometryData.angles.gnomon_angle) {
            const lblAngle = createTextSprite("Angle: " + geometryData.angles.gnomon_angle.toFixed(1) + "°");
            lblAngle.position.set(-base / 2, height / 2, thickness * 2);
            lblAngle.scale.multiplyScalar(scaleFix);
            instrumentGroup.add(lblAngle);
        }
    } else if (geometryData.instrument === 'nadi_valaya_yantra') {
        const radius = geometryData.angles.radius;
        const tilt = geometryData.angles.dial_tilt; // Degrees

        // Base Pillar
        const pillarGeom = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
        const pillarMesh = new THREE.Mesh(pillarGeom, materialStone);
        pillarMesh.position.y = 2; // Center of 4h pillar
        instrumentGroup.add(pillarMesh);

        // Tilted Circular Dial
        const dialGeom = new THREE.CylinderGeometry(radius, radius, 0.5, 32);
        const dialMesh = new THREE.Mesh(dialGeom, materialStone);

        // Position on top of pillar
        dialMesh.position.y = 4;

        // Tilt the dial. The calculation said tilt = 90 - lat.
        // Rotating around X axis tilts it north/south
        dialMesh.rotation.x = THREE.MathUtils.degToRad(tilt);
        instrumentGroup.add(dialMesh);

        // Labels
        const sF = radius / 30;
        const lblTilt = createTextSprite("Tilt Angle: " + tilt.toFixed(1) + "°");
        lblTilt.position.set(0, 6 + radius / 2, 0);
        lblTilt.scale.multiplyScalar(sF);
        instrumentGroup.add(lblTilt);

        const lblRad = createTextSprite("Radius: " + radius.toFixed(1) + "m");
        lblRad.position.set(radius + 2, 4, 0);
        lblRad.scale.multiplyScalar(sF);
        instrumentGroup.add(lblRad);

    } else if (geometryData.instrument === 'bhitti_yantra') {
        const radius = geometryData.angles.arc_radius;

        // Base Wall (Local meridian plane -> North/South aligned)
        const wallDepth = 0.5;
        const wallHeight = radius + 2;
        const wallWidth = (radius * 2) + 2;

        const wallGeom = new THREE.BoxGeometry(wallDepth, wallHeight, wallWidth);
        const wallMesh = new THREE.Mesh(wallGeom, materialStone);
        wallMesh.position.y = wallHeight / 2;
        instrumentGroup.add(wallMesh);

        // Center of the arc
        const centerY = wallHeight - 1;

        // Semicircular arc on the face of the wall (lower half for measuring altitude)
        const curve = new THREE.EllipseCurve(
            0, 0,
            radius, radius,
            Math.PI, 2 * Math.PI, // Lower half
            false,
            0
        );
        const points = curve.getPoints(50);
        const arcShape = new THREE.Shape();
        arcShape.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            arcShape.lineTo(points[i].x, points[i].y);
        }

        // Create a thicker scale material
        const materialWhiteScale = new THREE.MeshLambertMaterial({ color: 0xffffff });

        const tubePath = new THREE.CatmullRomCurve3(
            points.map(p => new THREE.Vector3(0, p.y + centerY, p.x))
        );
        const tubeGeom = new THREE.TubeGeometry(tubePath, 64, 0.15, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeom, materialWhiteScale);

        // Push outwards slightly onto the face
        tubeMesh.position.x = (wallDepth / 2) + 0.08;
        instrumentGroup.add(tubeMesh);

        const pinLength = 0.5;
        const pinGeom = new THREE.CylinderGeometry(0.04, 0.04, pinLength, 16);
        const pinMesh = new THREE.Mesh(pinGeom, materialBrass);
        pinMesh.rotation.z = Math.PI / 2; // Point outwards along X-axis
        pinMesh.position.set((wallDepth / 2) + (pinLength / 2), centerY, 0);
        instrumentGroup.add(pinMesh);

        // Labels
        const sFb = radius / 30;
        const lblArc = createTextSprite("Arc Radius: " + radius.toFixed(1) + "m");
        lblArc.position.set(wallDepth + 2, centerY - radius / 2, wallWidth / 4);
        lblArc.scale.multiplyScalar(sFb);
        instrumentGroup.add(lblArc);
    }



    // 6. Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    // 6. Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});
