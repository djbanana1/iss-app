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
    let loader = new GLTFLoader()

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.z = 1000

    loader.load(
      'assets/model/iss.glb',
      function (gltf) {
        console.log(gltf)
        this.scene.add(gltf.scene)
      },
      undefined,
      function (error) {
        console.error(error)
      },
    )
  }

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)
    this.animate()
  }

  animate() {}
}
