import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

@Component({
  selector: 'model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements AfterViewInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef

  renderer = new THREE.WebGLRenderer()
  scene = null
  camera = null
  mesh = null

  constructor() {
    var loader = new GLTFLoader()

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.z = 1000

    const geometry = new THREE.BoxGeometry(200, 200, 200)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    this.mesh = new THREE.Mesh(geometry, material)

    loader.load(
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

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth, window.innerHeight - 62)
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)
    this.animate()
  }

  animate() {
    window.requestAnimationFrame(() => this.animate())
    this.mesh.rotation.x += 0.01
    this.mesh.rotation.y += 0.02
    this.renderer.render(this.scene, this.camera)
  }
}
