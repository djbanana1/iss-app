import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { OrbitControls } from '@avatsaev/three-orbitcontrols-ts'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

@Component({
  selector: 'model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements AfterViewInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef

  renderer = new THREE.WebGLRenderer({ alpha: true })
  scene = null
  camera = null
  mesh = null
  controls = null
  loader = null

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000)
    this.controls = new OrbitControls(this.camera)
    this.loader = new GLTFLoader()

    // add lights
    var light = new THREE.AmbientLight(0xffffff)
    this.scene.add(light)
  }

  ngAfterViewInit() {
    this.configCamera()
    this.configRenderer()
    this.configControls()

    this.createMesh()

    this.animate()
  }

  configCamera() {
    this.camera.position.set(300, 300, 300)
  }

  configRenderer() {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(new THREE.Color('hsl(0, 0%, 10%)'))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.domElement.style.display = 'block'
    this.renderer.domElement.style.margin = 'auto'
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)
  }

  configControls() {
    this.controls.autoRotate = true
    this.controls.enableZoom = true
    this.controls.enablePan = false
    this.controls.update()
  }

  async createMesh() {
    await this.loader.load(
      'assets/model/iss.glb',
      (gltf) => {
        console.log(gltf)
        let sceneModel = gltf.scene
        this.scene.add(sceneModel)
      },
      (loading) => {},
      (error) => {
        console.error(error)
      },
    )
  }

  animate() {
    window.requestAnimationFrame(() => this.animate())
    this.renderer.render(this.scene, this.camera)
  }
}
