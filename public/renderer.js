window.addEventListener('load', renderer);

function renderer() {
  const Container = document.getElementById('Container');
  let width = Container.offsetWidth;
  let height = Container.offsetHeight;
  
  const Scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  Container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);

  const controls = new THREE_ADDONS.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const loader = new THREE_ADDONS.GLTFLoader();
  loader.load('gltf/lidvi.glb', loadGLTF);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(1, 3, 1);
  Scene.add(directionalLight);

  animate();

  // var angle = 0; // Auto-oscillate
  function animate() {
    // Scene.rotation.y = (Math.PI / 4) * Math.sin(Math.PI * angle);
    // angle += 0.002;
    // if (angle >= 2) angle = 0;

    controls.update();

    requestAnimationFrame(animate);
    renderer.render(Scene, camera);
  }

  function loadGLTF(gltf) {
    // Load GLTF model
    gltf.scene.traverse((child) => {
      if (child.name === 'View') {
        child.visible = false;

        const boundingBox = new THREE.Box3().setFromObject(child);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        const dist = size.y / (2 * Math.tan((camera.fov * Math.PI) / 360));
        camera.position.set(0, center.y, dist);
        camera.lookAt(center);

        controls.target.copy(center);
        controls.update();
      }

      // return; // TODO remove
      if (child.isMesh && child.material) {
        switch (child.material.name) {
          case 'Skin':
            child.material = new THREE.MeshToonMaterial({ color: 0x222222 });
            break;
          case 'Sclera':
            child.material = new THREE.MeshToonMaterial({ color: 0xffffff });
            break;
          case 'Iris':
            child.material = new THREE.MeshToonMaterial({ color: 0x111111 });
            break;
          case 'Blade':
            child.material = new THREE.MeshToonMaterial({ color: 0xcccccc });
            break;
          case 'Hair':
            child.material = new THREE.MeshToonMaterial({ color: 0xffffff });
            break;
          case 'Eyelashes':
            child.material = new THREE.MeshToonMaterial({ color: 0xcccccc });
            break;
        }
      }
    });

    Scene.add(gltf.scene);
  }

  // To maintain aspect ratio
  window.addEventListener('resize', () => {
    width = Container.offsetWidth;
    height = Container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  });
}
