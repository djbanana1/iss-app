import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx'
import { Platform } from '@ionic/angular'
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
  iss_latitude_2: number
  iss_longitude_2: number

  sineB: number

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

  timeTillIssAppear

  loading = true

  constructor(
    private geolocation: Geolocation,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
  ) {
    this.itemForm = this.formBuilder.group({
      latitude: '',
      longitude: '',
      zip: '',
      location: '',
    })
    this.platform.ready().then(async () => {
      this.screenOrientation.onChange().subscribe(() => {
        console.log(this.screenOrientation.type)
        if (this.screenOrientation.type == 'landscape-primary') {
          document.getElementById('tracker-container').classList.add('fullscreen')
        } else {
          document.getElementById('tracker-container').classList.remove('fullscreen')
        }
      })
    })
  }

  async ionViewDidEnter() {
    this.loading = true
    this.getCanvas()

    this.platform.ready().then(async () => {
      await this.getMyLocation()
      await this.getIssLocation()
      console.log('here')
      this.autoCalculation()
      this.loading = false
    })
  }

  autoCalculation() {
    this.swiper = false
    this.getCanvas()
    if (this.userInfos.latitude) {
      this.drawMyPosition(this.userInfos)
    }

    this.calculate(this.userInfos.latitude, this.userInfos.longitude)
    this.drawMyPosition(this.userInfos)
    this.drawIssPosition(this.issInfos)
    this.infinitDrawIss()
  }

  changeCalculationType($event) {
    this.calculationType = $event
  }

  infinitDrawIss() {
    setTimeout(async () => {
      await this.getIssLocation()
      this.drawIssPosition(this.issInfos)
      this.infinitDrawIss()
    }, 5000)
  }

  getMyLocation(): Promise<void> {
    return new Promise((resolve) => {
      this.geolocation
        .getCurrentPosition()
        .then((resp) => {
          this.userInfos.latitude = resp.coords.latitude
          this.userInfos.longitude = resp.coords.longitude
          this.getLocation(resp.coords.longitude, resp.coords.latitude)
          resolve()
        })
        .catch(async (error) => {
          console.log('Error getting location', error)
        })
    })
  }

  getIssLocation(): Promise<void> {
    return new Promise((resolve) => {
      this.httpClient
        .get('http://api.open-notify.org/iss-now.json')
        .subscribe(async (response: any) => {
          this.issInfos.latitude = response.iss_position.latitude
          this.issInfos.longitude = response.iss_position.longitude
          await this.getIssLocation2()
          if (response.iss_position.latitude == this.issInfos.latitude) {
            await setTimeout(async () => {
              await this.getIssLocation2()
            }, 100)
          }
          resolve()
        })
    })
  }

  async getIssLocation2(): Promise<void> {
    return new Promise((resolve) => {
      this.httpClient.get('http://api.open-notify.org/iss-now.json').subscribe((response: any) => {
        this.iss_latitude_2 = response.iss_position.latitude
        this.iss_longitude_2 = response.iss_position.longitude
        resolve()
      })
    })
  }

  getLocation(long, late): Promise<void> {
    return new Promise((resolve) => {
      this.httpClient
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
            resolve()
          },
          (error) => {
            console.log(error)
          },
        )
    })
  }

  getCoordinates(location, zip) {
    return new Promise((resolve) => {
      this.httpClient
        .get(
          'http://open.mapquestapi.com/geocoding/v1/address?key=ZohDzfogWWQncGWVtf3ZNQddHR6wZpZv&location=' +
            location +
            ' ,' +
            zip,
        )
        .subscribe(
          (response: any) => {
            let coordinates = {
              latitude: response.results[0].locations[0].displayLatLng.lat,
              longitude: response.results[0].locations[0].displayLatLng.lng,
            }
            resolve(coordinates)
          },
          (error) => {
            console.log(error)
          },
        )
    })
  }

  async submit() {
    this.getCanvas()
    if (this.calculationType == 'location_input') {
      let coordinates: any = await this.getCoordinates(
        this.itemForm.get('location').value,
        this.itemForm.get('zip').value,
      )
      this.drawMyPosition(coordinates)
      this.calculate(coordinates.latitude, coordinates.longitude)
    }
    if (this.calculationType == 'coordinates_input') {
      let coordinates: any = await this.getCoordinates(
        this.itemForm.get('latitude').value,
        this.itemForm.get('longitude').value,
      )
      this.drawMyPosition(coordinates)
      this.calculate(coordinates.latitude, coordinates.longitude)
    }
  }

  calculate(lat: number, long: number) {
    // Setup
    const a = 51.6219
    const c = 360 / 383.568

    var lat2 = this.iss_latitude_2
    var long2 = this.iss_longitude_2

    var lat1 = this.issInfos.latitude
    var long1 = this.issInfos.longitude

    console.log(lat2, '-----lat2')
    console.log(lat1, '-----lat1')

    // Calc
    var y_a = Number(lat2) / a // y:a

    var b = (Math.asin(y_a) * 180) / Math.PI / c - long2
    console.log(b)
    console.log(lat1 + '>' + lat2)
    if (Number(lat1) > Number(lat2)) {
      var x2 = (90 / c - Number(long2)) * 2 + Number(long2)
      b = x2 - (Math.asin(y_a) * 180) / Math.PI / c
    }

    this.sineB = b
    console.log(b)
    b = (Math.PI / 180) * b
    // Circle
    var r = (4.5170801 * Math.PI) / 180 // 80km
    lat = (lat * Math.PI) / 180
    long = (long * Math.PI) / 180

    var x1 = long - r
    x2 = long + r
    var center = long
    var x4 = long - r / 2
    var x5 = long + r / 2

    var s1 = 0
    var s2 = 0
    var s3 = 0
    var s4 = 0
    var s5 = 0

    let ctr = 0
    while (true) {
      s1 = ((a * Math.PI) / 180) * Math.sin(c * (x1 + b))
      s2 = ((a * Math.PI) / 180) * Math.sin(c * (x2 + b))
      s3 = ((a * Math.PI) / 180) * Math.sin(c * (center + b))
      s4 = ((a * Math.PI) / 180) * Math.sin(c * (x4 + b))
      s5 = ((a * Math.PI) / 180) * Math.sin(c * (x5 + b))

      b -= 2 * Math.PI
      ctr++

      var circle = Math.pow(x1 - center, 2) + Math.pow(s1 - lat, 2)
      var circle2 = Math.pow(x2 - center, 2) + Math.pow(s2 - lat, 2)
      var circle3 = Math.pow(center - center, 2) + Math.pow(s3 - lat, 2)
      var circle4 = Math.pow(x4 - center, 2) + Math.pow(s4 - lat, 2)
      var circle5 = Math.pow(x5 - center, 2) + Math.pow(s5 - lat, 2)
      if (
        circle < Math.pow(r, 2) ||
        circle2 < Math.pow(r, 2) ||
        circle3 < Math.pow(r, 2) ||
        circle4 < Math.pow(r, 2) ||
        circle5 < Math.pow(r, 2)
      ) {
        break
      }
    }

    var strecke = (6371 + 425) * 2 * Math.PI
    var rest_strecke = 0
    var speed = 25576
    var avg_time = 99
    var rest_s = 0
    long = (long / Math.PI) * 180

    if (Number(long1) < 0) {
      rest_strecke += ((long - long1) / 383) * strecke
      rest_s += (long - long1) / 383
    } else {
      rest_strecke += ((360 - long1 - long) / 383) * strecke
      rest_s += (360 - long1 - long) / 383
    }

    //calc time
    var rest_time = ((rest_strecke + strecke * ctr) / speed) * 60
    var date = new Date()
    date.setMinutes(date.getMinutes() + rest_time)
    var seconds = date.getSeconds()
    var minutes = date.getMinutes()
    var hour = date.getHours()

    let hourNew: String = hour.toString()
    if (hourNew.length <= 1) {
      hourNew = '0' + hourNew
    }

    let minNew: String = minutes.toString()
    if (minNew.length <= 1) {
      minNew = '0' + minNew
    }
    console.log(hour + ':' + minutes + ' Uhr (calc_speed)')
    this.timeTillIssAppear = hourNew + ':' + minNew + ' Uhr'

    //avg time
    rest_time = ctr * avg_time + avg_time * rest_s
    var date = new Date()
    date.setMinutes(date.getMinutes() + rest_time)

    var seconds = date.getSeconds()
    var minutes = date.getMinutes()
    var hour = date.getHours()
    console.log(hour + ':' + minutes + ' Uhr (avg_time)')

    console.log(ctr)
    console.log(Number(lat2))
  }

  calculateSineB(lat: number, long: number) {
    // Setup
    const a = 51.6219
    const c = 360 / 383.568
    console.log(a)

    var lat2: number = this.iss_latitude_2
    var long2: number = this.iss_longitude_2

    var lat1: number = this.issInfos.latitude
    var long1: number = this.issInfos.longitude

    // Calc
    var y_a = lat1 / a // y:a

    var b = (Math.asin(y_a) * 180) / Math.PI / c - long2
    console.log(b)
    console.log(lat1 + '>' + lat2)
    if (lat1 > lat2) {
      var x2: number = (90 / c - Number(long2)) * 2 + Number(long2)
      b = x2 - (Math.asin(y_a) * 180) / Math.PI / Number(c)
    }
    console.log(b)
    this.sineB = b
  }

  drawMyPosition(coordinates) {
    let canvasMyPosition: GeoLocation = this.calculateCanvasPositions(coordinates)
    this.ctx.beginPath()
    this.ctx.arc(canvasMyPosition.longitude, canvasMyPosition.latitude, 2, 0, 2 * Math.PI, true)
    this.ctx.fillStyle = 'red'
    this.ctx.fill()
    this.ctx.beginPath()
    this.ctx.arc(canvasMyPosition.longitude, canvasMyPosition.latitude, 6, 0, 2 * Math.PI, true)
    this.ctx.strokeStyle = 'red'
    this.ctx.stroke()
  }

  drawIssPosition(coordinates: GeoLocation) {
    let map = document.getElementById('iss-location').getBoundingClientRect()
    let c = <HTMLCanvasElement>document.getElementById('iss-location')
    let ctx = c.getContext('2d')
    ctx.canvas.width = this.map.width
    ctx.canvas.height = this.map.height

    this.drawIssSine(ctx, this.map.width, this.map.height)

    let canvasIssPosition: GeoLocation = this.calculateCanvasPositions(coordinates)
    ctx.beginPath()
    ctx.arc(canvasIssPosition.longitude, canvasIssPosition.latitude, 4, 0, 2 * Math.PI, true)
    ctx.fillStyle = 'green'
    ctx.fill()
  }

  drawIssSine(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)

    ctx.strokeStyle = '#FFFF00'

    ctx.beginPath()
    ctx.moveTo(0, height / 2)

    for (let x = 0, amplitude = 51.629; x < width; x++) {
      let y = Math.sin(0.9386 * (x * (Math.PI / 180) + this.sineB)) * amplitude
      ctx.lineTo(x, y + height / 2)
    }

    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.lineTo(0, height / 2)

    ctx.stroke()
  }

  calculateCanvasPositions(coordinates: GeoLocation) {
    let canvasCoordinates = {
      latitude: ((90 - Number(coordinates.latitude)) * this.map.height) / 180,
      longitude: ((180 + Number(coordinates.longitude)) * this.map.width) / 360,
    }
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
