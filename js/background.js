const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 100;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x121212);
document.body.appendChild(renderer.domElement);

const count = 42;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 200;
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  uniforms: {
    uTime: { value: 0 },
    uSize: { value: 1 },
    uColor: { value: new THREE.Color(0xffffff) }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uSize;
    varying float vZ;

    vec3 rotateAroundAxis(vec3 position, vec3 axis, float angle) {
      axis = normalize(axis);
      float cosA = cos(angle);
      float sinA = sin(angle);
      return position * cosA +
             cross(axis, position) * sinA +
             axis * dot(axis, position) * (1.0 - cosA);
    }

    void main() {
      vec3 pos = position;
      pos = rotateAroundAxis(pos, vec3(1.0, 1.0, 0.0), uTime * 0.1);
      vZ = pos.z;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      float depthSize = clamp((pos.z + 200.0) / 400.0, 0.0, 1.0);
      depthSize = pow(depthSize, 4.0);
      gl_PointSize = uSize * (1.0 + depthSize * 15.0); 
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    void main() {
      float d = distance(gl_PointCoord, vec2(0.5));
      if (d > 0.5) discard;
      gl_FragColor = vec4(uColor, 0.7);
    }
  `
});

const points = new THREE.Points(geometry, material);
scene.add(points);

function animate(t) {
  requestAnimationFrame(animate);
  material.uniforms.uTime.value = t * 0.001;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });