import { Component, OnInit } from '@angular/core'
import { Geolocation } from '@ionic-native/geolocation/ngx'

@Component({
  selector: 'calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss'],
})
export class CalculationComponent implements OnInit {
  public iss_latitude;
  public iss_longitude;
  public gps_latitude;
  public gps_longitude;
  public current_place;
  public current_zip;

  constructor(private geolocation: Geolocation) {

    this.geolocation.getCurrentPosition().then((resp) => {
      this.gps_latitude = resp.coords.latitude
      this.gps_longitude = resp.coords.longitude
      this.getRegion(resp.coords.longitude,resp.coords.latitude)
     }).catch((error) => {
       console.log('Error getting location', error);
     });
this.calulate()
    const userAction = async () => {
      const response = await fetch('http://api.open-notify.org/iss-now.json');
      const myJson = await response.json(); //extract JSON from the http response
      this.iss_latitude = myJson.iss_position.latitude
      this.iss_longitude = myJson.iss_position.longitude
    }

    userAction()

  }

  getRegion(long, late) {

     // Create a request variable and assign a new XMLHttpRequest object to it.
     var request = new XMLHttpRequest()

     // Open a new connection, using the GET request on the URL endpoint
     request.open('GET', 'http://open.mapquestapi.com/geocoding/v1/reverse?key=ZohDzfogWWQncGWVtf3ZNQddHR6wZpZv&location='+late+','+long, true)
 
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

  ngOnInit(): void {}



  calulate() {
    // Setup
    const a = 51.6219;
    const c = 360 / 383.568;

    var lat1 = -51.6219;
    var long1 = -92.2547;

    var lat2 = -51.6199;
    var long2 = 24.7959;

    // Calc
    var y_a = lat1/a; // y:a

    var b = Math.asin(y_a)*180/Math.PI / c - long1;
    if (lat1 > lat2) {
      var x2 = (90/c - long1) * 2 + long1;
      b = x2 - (Math.asin(y_a)*180/Math.PI / c);
    }

    b = Math.PI/180 * b;
  }
}
