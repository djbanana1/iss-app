import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Geolocation } from '@ionic-native/geolocation/ngx'

@Component({
  selector: 'calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss'],
})
export class CalculationComponent {
  iss_latitude
  iss_longitude
  gps_latitude
  gps_longitude
  current_place
  current_zip

  swiper = false
  itemForm

  constructor(
    private geolocation: Geolocation,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
  ) {
    this.getMyLocation()
    this.getIssLocation()
    this.itemForm = this.formBuilder.group({
      name: '',
      address: '',
    })
  }

  autoCalculation() {
    this.swiper = false
    this.getMyLocation()
  }

  getMyLocation() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.gps_latitude = resp.coords.latitude
        this.gps_longitude = resp.coords.longitude
        this.getRegion(resp.coords.longitude, resp.coords.latitude)
      })
      .catch((error) => {
        console.log('Error getting location', error)
      })
  }

  async getIssLocation() {
    await this.httpClient
      .get('http://api.open-notify.org/iss-now.json')
      .subscribe((response: any) => {
        this.iss_latitude = response.iss_position.latitude
        this.iss_longitude = response.iss_position.longitude
      })
  }

  getRegion(long, late) {
    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()

    // Open a new connection, using the GET request on the URL endpoint
    request.open(
      'GET',
      'http://open.mapquestapi.com/geocoding/v1/reverse?key=ZohDzfogWWQncGWVtf3ZNQddHR6wZpZv&location=' +
        late +
        ',' +
        long,
      true,
    )

    request.onload = () => {
      // Begin accessing JSON data here
      var data = JSON.parse(request.response)

      if (request.status >= 200 && request.status < 400) {
        this.current_place = data.results[0]['locations'][0]['adminArea5']
        this.current_zip = data.results[0]['locations'][0]['postalCode']
      } else {
        console.log('error')
      }
    }

    // Send request
    request.send()
  }
}
