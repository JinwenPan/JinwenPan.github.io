(function () {
  // Check for WebGL support
  try {
    var testCanvas = document.createElement('canvas');
    var gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) return;
    // Free the test context immediately
    var loseCtx = gl.getExtension('WEBGL_lose_context');
    if (loseCtx) loseCtx.loseContext();
    testCanvas = null;
    gl = null;
  } catch (e) {
    return;
  }

  // Respect prefers-reduced-motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 100;

  var renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    powerPreference: 'low-power'
  });
  var dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x121212);
  document.body.appendChild(renderer.domElement);

  var count = 42;
  var positions = new Float32Array(count * 3);
  for (var i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 200;
  }
  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  var material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 1 },
      uColor: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: [
      'precision mediump float;',
      'uniform float uTime;',
      'uniform float uSize;',
      'varying float vZ;',
      '',
      'vec3 rotateAroundAxis(vec3 p, vec3 axis, float angle) {',
      '  axis = normalize(axis);',
      '  float cosA = cos(angle);',
      '  float sinA = sin(angle);',
      '  return p * cosA + cross(axis, p) * sinA + axis * dot(axis, p) * (1.0 - cosA);',
      '}',
      '',
      'void main() {',
      '  vec3 pos = position;',
      '  pos = rotateAroundAxis(pos, vec3(1.0, 1.0, 0.0), uTime * 0.1);',
      '  vZ = pos.z;',
      '  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);',
      '  float depthSize = clamp((pos.z + 200.0) / 400.0, 0.0, 1.0);',
      '  depthSize = pow(depthSize, 4.0);',
      '  gl_PointSize = uSize * (1.0 + depthSize * 15.0);',
      '  gl_Position = projectionMatrix * mvPosition;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'precision mediump float;',
      'uniform vec3 uColor;',
      'void main() {',
      '  float d = distance(gl_PointCoord, vec2(0.5));',
      '  if (d > 0.5) discard;',
      '  gl_FragColor = vec4(uColor, 0.7);',
      '}'
    ].join('\n')
  });

  var points = new THREE.Points(geometry, material);
  scene.add(points);

  // Throttle to ~30fps — more than enough for slow-rotating particles
  var animationId;
  var lastFrame = 0;
  var frameInterval = 1000 / 30;

  function animate(t) {
    animationId = requestAnimationFrame(animate);
    if (t - lastFrame < frameInterval) return;
    lastFrame = t;
    material.uniforms.uTime.value = t * 0.001;
    renderer.render(scene, camera);
  }
  animate(0);

  // Debounced resize handler
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150);
  });

  // Pause animation when tab is not visible
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      lastFrame = 0;
      animate(0);
    }
  });
})();