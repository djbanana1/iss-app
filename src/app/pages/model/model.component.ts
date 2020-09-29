import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import * as THREE from 'three'
import 'three/examples/js/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

@Component({
  selector: 'model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements AfterViewInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef

  renderer = new THREE.WebGLRenderer({ antialias: true })
  scene = null
  camera = null
  mesh = null

  constructor() {
    var loader = new GLTFLoader()

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.z = 200

    let controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
    controls.addEventListener('change', this.renderer)

    // let hLight = new THREE.AmbientLight(0x404040, 100)
    // this.scene.add(hLight)

    let directionalLight = new THREE.DirectionalLight(0xffffff, 100)
    directionalLight.position.set(0, 10, 0)
    directionalLight.castShadow = true
    this.scene.add(directionalLight)

    loader.load(
      'assets/model/iss.glb',
      (gltf) => {
        gltf.scene.rotateY((45 / 180) * Math.PI)
        this.scene.add(gltf.scene)
      },
      (loading) => {},
      (error) => {
        console.error(error)
      },
    )
  }

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth, window.innerHeight - 62)
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)
    this.animate()
  }

  animate() {
    window.requestAnimationFrame(() => this.animate())
    this.renderer.render(this.scene, this.camera)
  }
}
