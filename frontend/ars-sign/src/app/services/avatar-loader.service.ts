import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({
  providedIn: 'root'
})
export class AvatarLoaderService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private mixer!: THREE.AnimationMixer;
  private clock = new THREE.Clock();

  public avatar!: THREE.Group;
  public animations: THREE.AnimationClip[] = [];
  private animationCache: Map<string, THREE.AnimationClip> = new Map();

  constructor(private zone: NgZone) {}

  initScene(canvas: HTMLCanvasElement): void {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; 

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    this.camera.position.set(0, 1.2, 2.2); 

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 2, 3);
    this.scene.add(directionalLight);

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  loadModel(url: string = 'assets/avatar.glb'): Promise<void> {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        this.avatar = gltf.scene;
        this.animations = gltf.animations;
        
        console.log(`[AvatarLoader] Global animations found:`, this.animations.map(a => a.name));
        
        // Auto-scale and Center the model to ensure visibility
        this.fitModelToFrame(this.avatar);
        
        this.scene.add(this.avatar);

        this.mixer = new THREE.AnimationMixer(this.avatar);
        this.startAnimationLoop();
        resolve();
      }, undefined, (error) => {
        console.error("Failed to load 3D Avatar", error);
        reject(error);
      });
    });
  }

  /**
   * Calculates the bounding box of the model and adjusts its scale/position
   * so it appears centered and at a consistent height.
   */
  private fitModelToFrame(object: THREE.Object3D): void {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    
    // 1. Scale the model for a perfect waist-up view
    const targetHeight = 2.2; 
    if (size.y > 0) {
      const scale = targetHeight / size.y;
      object.scale.set(scale, scale, scale);
    }

    // 2. Adjust vertical position to center the upper body
    box.setFromObject(object);
    box.getCenter(center);
    
    object.position.x = -center.x;
    object.position.y = -center.y + 0.45; // Centered for waist-up
    object.position.z = -center.z;

    // 3. Ensure materials are visible
    object.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.side = THREE.DoubleSide;
        }
      }
    });

    // 4. Camera positioning to match reference image
    this.camera.position.set(0, 0.45, 3.0); 
    this.camera.lookAt(0, 0.4, 0); 
  }

  /**
   * Loads an external animation GLB and caches its first clip
   */
  async loadExternalAnimation(url: string): Promise<THREE.AnimationClip | null> {
    if (this.animationCache.has(url)) {
      return this.animationCache.get(url)!;
    }

    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        if (gltf.animations.length > 0) {
          const clip = gltf.animations[0];
          // Ensure the clip name matches what we might expect, or use original
          this.animationCache.set(url, clip);
          resolve(clip);
        } else {
          console.warn(`No animations found in GLB: ${url}`);
          resolve(null);
        }
      }, undefined, (err) => {
        console.error(`Error loading external animation: ${url}`, err);
        resolve(null);
      });
    });
  }

  getMixer(): THREE.AnimationMixer {
    return this.mixer;
  }

  getAnimations(): THREE.AnimationClip[] {
    return this.animations;
  }

  private startAnimationLoop() {
    this.zone.runOutsideAngular(() => {
      const animate = () => {
        requestAnimationFrame(animate);
        const delta = this.clock.getDelta();
        if (this.mixer) this.mixer.update(delta);
        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }
      };
      animate();
    });
  }

  private onWindowResize(): void {
    if (this.camera && this.renderer) {
      const canvas = this.renderer.domElement;
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }
}
