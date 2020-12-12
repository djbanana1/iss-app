import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { IssInformation, UserInformation } from './calculation'

@Component({
  selector: 'calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss'],
})
export class CalculationComponent {
  issInfos: IssInformation = {
    latitude: null,
    longitude: null,
  }
  userInfos: UserInformation = {
    latitude: null,
    longitude: null,
    zip: null,
    place: null,
  }

  swiper = false
  itemForm
  calculationType = 'location_input'

  constructor(
    private geolocation: Geolocation,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
  ) {
    this.getIssLocation()
    this.itemForm = this.formBuilder.group({
      lat: '',
      lng: '',
      zip: '',
      location: '',
    })
  }

  ionViewDidEnter(): void {
    this.drawIss()
    this.getMyLocation()
  }

  autoCalculation() {
    this.swiper = false
    this.getMyLocation()
    this.drawMyPosition(this.userInfos)
  }

  changeCalculationType($event) {
    this.calculationType = $event
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

  async getIssLocation() {
    await this.httpClient
      .get('http://api.open-notify.org/iss-now.json')
      .subscribe((response: any) => {
        this.issInfos.latitude = response.iss_position.latitude
        this.issInfos.longitude = response.iss_position.longitude
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
          console.log(response)
          return response.results[0]['locations'][0]['adminArea5'].latLng
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

  drawIss() {
    let e = document.getElementById('tracker').getBoundingClientRect()
    let width = e.width
    let height = e.height

    let c = <HTMLCanvasElement>document.getElementById('tracker')
    let ctx = c.getContext('2d')
  }

  drawMyPosition(coordinates) {
    console.log('circle')
    let e = document.getElementById('tracker').getBoundingClientRect()
    let width = e.width
    let height = e.height

    let c = <HTMLCanvasElement>document.getElementById('tracker')
    let ctx = c.getContext('2d')
    ctx.beginPath()
    ctx.arc(2, 1, 1, 0, 2 * Math.PI, true)
    ctx.fillStyle = 'red'
    ctx.fill()
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
}
