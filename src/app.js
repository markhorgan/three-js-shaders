import { 
  PerspectiveCamera, 
  WebGLRenderer, 
  Scene, 
  Mesh,
  ShaderMaterial,
  IcosahedronGeometry,
  ShaderMaterial
} from 'three';
import * as dat from 'dat.gui';
import { toIndexedVertices } from './utils';
import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';

class App {
  constructor() {
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.setCameraPosition();
    this.scene = new Scene();
    this.scene.background = null;
    this.renderer = new WebGLRenderer({
        antialias: true,
        alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.createScene();
    if (this.showGui) {
      this.createGui();
    }

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  createScene() {
    const geometry = new IcosahedronGeometry(2, 40);
    toIndexedVertices(geometry);
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },

        uTimeScaleVert: { value: 0.01 },
        uNoiseScaleVert: { value: 1 },
        uDisplacementScale: { value: 0.3 },

        uTimeScaleFrag: { value: 0.01 },
        uNoiseScaleRed: { value: 0.8 },
        uNoiseScaleGreen: { value: 0.8 },
        uNoiseScaleBlue: { value: 0.8 }
      },
      vertexShader,
      fragmentShader
    });
    const mesh = new Mesh(geometry, this.material);
    this.scene.add(mesh);
  }

  createGui() {
    const uniforms = this.material.uniforms;

    if (!this.gui) {
      this.gui = new dat.GUI();

      const vertexFolder = this.gui.addFolder('Vertex Shader');
      vertexFolder.open();
      vertexFolder.add(uniforms.uTimeScaleVert, 'value', 0, 0.1, 0.001).name('Speed');
      vertexFolder.add(uniforms.uNoiseScaleVert, 'value', 0, 2, 0.01).name('Noise scale');
      vertexFolder.add(uniforms.uDisplacementScale, 'value', 0, 1.2, 0.01).name('Displacement scale');
  
      const fragmentFolder = this.gui.addFolder('Fragment Shader');
      fragmentFolder.open();
      fragmentFolder.add(uniforms.uTimeScaleFrag, 'value', 0, 0.1, 0.001).name('Speed');
  
      const noiseScaleFolder = fragmentFolder.addFolder('Noise scale');
      noiseScaleFolder.open();
      noiseScaleFolder.add(uniforms.uNoiseScaleRed, 'value', 0, 2, 0.01).name('Red');
      noiseScaleFolder.add(uniforms.uNoiseScaleGreen, 'value', 0, 2, 0.01).name('Green');
      noiseScaleFolder.add(uniforms.uNoiseScaleBlue, 'value', 0, 2, 0.01).name('Blue');
    }
  }

  removeGui() {
    if (this.gui) {
      this.gui.destroy();
      this.gui = null;
    }
  }

  render() {
    this.material.uniforms.uTime.value++;
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.setCameraPosition();
    if (this.showGui) {
      this.createGui();
    } else {
      this.removeGui();
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera); 
  }

  get showGui() {
    return parseInt(window.innerWidth) >= 650;
  }

  setCameraPosition() {
    const x = this.showGui && parseInt(window.innerWidth) < 750 ? 2 : 0;
    this.camera.position.set(x, 0, 5);
  }
}

new App();