import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import gsap from 'gsap';
import * as THREE from 'three';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <div class="relative pt-16 min-h-screen grid place-items-center overflow-hidden bg-gray-50/50">
      <!-- Three.js Background -->
      <canvas #bgCanvas class="absolute top-0 left-0 w-full h-full -z-20 opacity-40"></canvas>

      <!-- CSS Gradients (Fallback/Overlay) -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto" #heroContent>
        <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-sm">
          <span class="block text-primary-900 mb-2">Experience the</span>
          <span class="text-gradient">Extraordinary</span>
        </h1>
        <p class="text-xl md:text-2xl text-primary-600 mb-10 max-w-2xl mx-auto">
          Book tickets for the hottest movies, live events, sports, and more. All in one place.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transform hover:scale-105 transition-all shadow-lg shadow-brand-500/25">
            Explore Events
          </button>
          <button class="px-8 py-4 glass text-primary-900 rounded-xl font-semibold hover:bg-white/80 transform hover:scale-105 transition-all">
            View Schedule
          </button>
        </div>
      </div>
      
      <!-- Feature Grid Mockup -->
      <div class="w-full max-w-7xl mx-auto px-4 mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
         <div class="glass-card p-6 h-64 flex flex-col justify-end group cursor-pointer hover:shadow-xl transition-all duration-300">
            <h3 class="text-2xl font-bold text-primary-900 mb-2 group-hover:text-brand-600 transition-colors">Movies</h3>
            <p class="text-primary-500">Catch the latest blockbusters</p>
         </div>
         <div class="glass-card p-6 h-64 flex flex-col justify-end group cursor-pointer hover:shadow-xl transition-all duration-300">
            <h3 class="text-2xl font-bold text-primary-900 mb-2 group-hover:text-brand-600 transition-colors">Concerts</h3>
            <p class="text-primary-500">Live music and festivals</p>
         </div>
         <div class="glass-card p-6 h-64 flex flex-col justify-end group cursor-pointer hover:shadow-xl transition-all duration-300">
            <h3 class="text-2xl font-bold text-primary-900 mb-2 group-hover:text-brand-600 transition-colors">Sports</h3>
            <p class="text-primary-500">Cheer for your team live</p>
         </div>
      </div>
    </div>
  `
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroContent') heroContent!: ElementRef;
  @ViewChild('bgCanvas') bgCanvas!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private animationId: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initThreeJs();
      this.initGsap();
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private initGsap() {
    gsap.from(this.heroContent.nativeElement.children, {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }

  private initThreeJs() {
    const canvas = this.bgCanvas.nativeElement;
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 30;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const posArray = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 60; // Spread logic
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x38bdf8, // Primary color
      transparent: true,
      opacity: 0.8,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (event) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animate
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);

      this.particles.rotation.y += 0.001;
      this.particles.rotation.x += 0.001;

      // Subtle mouse follow
      this.particles.rotation.x += mouseY * 0.01;
      this.particles.rotation.y += mouseX * 0.01;

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }
}
