import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { GeoLocation, UserInformation } from './calculation'

@Component({
  selector: 'calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss'],
})
export class CalculationComponent {
  issInfos: GeoLocation = {
    latitude: null,
    longitude: null,
  }
  userInfos: UserInformation = {
    latitude: null,
    longitude: null,
    zip: null,
    place: null,
  }

  //Canvas
  ctx
  map

  swiper = false
  itemForm
  calculationType = 'location_input'

  constructor(
    private geolocation: Geolocation,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
  ) {
    this.itemForm = this.formBuilder.group({
      lat: '',
      lng: '',
      zip: '',
      location: '',
    })
  }

  async ionViewDidEnter() {
    this.getMyLocation()
    this.autoCalculation()
    await this.getCanvas()
    await this.getIssLocation()
    this.drawIssPosition(this.issInfos)
    this.infinitDrawIss()
  }

  async autoCalculation() {
    this.swiper = false
    await this.getMyLocation()
    this.drawMyPosition(this.userInfos)
  }

  changeCalculationType($event) {
    this.calculationType = $event
  }

  infinitDrawIss() {
    setTimeout(async () => {
      await this.getIssLocation()
      console.log('Iss', this.issInfos)
      this.drawIssPosition(this.issInfos)
      this.infinitDrawIss()
    }, 5000)
  }

  async getMyLocation() {
    await this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.userInfos.latitude = resp.coords.latitude
        this.userInfos.longitude = resp.coords.longitude
        this.getLocation(resp.coords.longitude, resp.coords.latitude)
      })
      .catch((error) => {
        console.log('Error getting location', error)
      })
  }

  async getIssLocation(): Promise<void> {
    return new Promise((resolve) => {
      this.httpClient.get('http://api.open-notify.org/iss-now.json').subscribe((response: any) => {
        this.issInfos.latitude = response.iss_position.latitude
        this.issInfos.longitude = response.iss_position.longitude
        resolve()
      })
    })
  }

  async getLocation(long, late) {
    await this.httpClient
      .get(
        'http://open.mapquestapi.com/geocoding/v1/reverse?key=ZohDzfogWWQncGWVtf3ZNQddHR6wZpZv&location=' +
          late +
          ',' +
          long,
      )
      .subscribe(
        (response: any) => {
          this.userInfos.place = response.results[0]['locations'][0]['adminArea5']
          this.userInfos.zip = response.results[0]['locations'][0]['postalCode']
        },
        (error) => {
          console.log(error)
        },
      )
  }

  async getCoordinates(location, zip) {
    await this.httpClient
      .get(
        'http://open.mapquestapi.com/geocoding/v1/address?key=ZohDzfogWWQncGWVtf3ZNQddHR6wZpZv&location=' +
          location +
          ' ,' +
          zip,
      )
      .subscribe(
        (response: any) => {
          let coordinates = {
            latitude: response.results[0]['locations'][0].displayLatLng.lat,
            longitude: response.results[0]['locations'][0].displayLatLng.lng,
          }
          return coordinates
        },
        (error) => {
          console.log(error)
        },
      )
  }

  submit() {
    if (this.calculationType == 'location_input') {
      let coordinates = this.getCoordinates(
        this.itemForm.get('location').value,
        this.itemForm.get('zip').value,
      )
      this.drawMyPosition(coordinates)
    }
    if (this.calculationType == 'coordinates_input') {
      // @TODO implement calculation
    }
  }

  calculate() {
    // Setup
    const a = 51.6219
    const c = 360 / 383.568

    var lat1 = -51.6219
    var long1 = -92.2547

    var lat2 = -51.6199
    var long2 = 24.7959

    // Calc
    var y_a = lat1 / a // y:a

    var b = (Math.asin(y_a) * 180) / Math.PI / c - long1
    if (lat1 > lat2) {
      var x2 = (90 / c - long1) * 2 + long1
      b = x2 - (Math.asin(y_a) * 180) / Math.PI / c
    }

    b = (Math.PI / 180) * b
  }

  drawMyPosition(coordinates) {
    let canvasMyPosition: GeoLocation = this.calculateCanvasPositions(coordinates)
    this.ctx.beginPath()
    this.ctx.arc(canvasMyPosition.longitude, canvasMyPosition.latitude, 3, 0, 2 * Math.PI, true)
    this.ctx.fillStyle = 'red'
    this.ctx.fill()
  }

  drawIssPosition(coordinates: GeoLocation) {
    let map = document.getElementById('tracker').getBoundingClientRect()
    let c = <HTMLCanvasElement>document.getElementById('tracker')
    let ctx = c.getContext('2d')
    ctx.canvas.width = this.map.width
    ctx.canvas.height = this.map.height

    let canvasIssPosition: GeoLocation = this.calculateCanvasPositions(coordinates)
    ctx.beginPath()
    ctx.arc(canvasIssPosition.longitude, canvasIssPosition.latitude, 3, 0, 2 * Math.PI, true)
    ctx.fillStyle = 'green'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(canvasIssPosition.longitude, canvasIssPosition.latitude, 10, 0, 2 * Math.PI, true)
    ctx.strokeStyle = 'green'
    ctx.stroke()
  }

  drawIssSine() {}

  calculateCanvasPositions(coordinates: GeoLocation) {
    let canvasCoordinates = {
      latitude: ((90 - Number(coordinates.latitude)) * this.map.height) / 180,
      longitude: ((180 + Number(coordinates.longitude)) * this.map.width) / 360,
    }
    console.log(canvasCoordinates)
    return canvasCoordinates
  }

  getCanvas(): Promise<void> {
    return new Promise((resolve) => {
      this.map = document.getElementById('tracker').getBoundingClientRect()
      let c = <HTMLCanvasElement>document.getElementById('tracker')
      this.ctx = c.getContext('2d')
      this.ctx.canvas.width = this.map.width
      this.ctx.canvas.height = this.map.height
      resolve()
    })
  }
}
