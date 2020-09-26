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

  constructor(private geolocation: Geolocation) {

    this.geolocation.getCurrentPosition().then((resp) => {
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
      this.gps_latitude = data.coords.latitude
      this.gps_longitude = data.coords.longitude
     });


    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()

    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'http://api.open-notify.org/iss-now.json', true)

    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response)

      if (request.status >= 200 && request.status < 400) {
        this.iss_latitude = data.iss_position.latitude
        this.iss_longitude = data.iss_position.longitude
        this.getRegion(this.iss_longitude, this.iss_latitude)
      } else {
        console.log('error')
      }
    }

    // Send request
    request.send()



  }

  getRegion(long:string, late:string) {

     // Create a request variable and assign a new XMLHttpRequest object to it.
     var request = new XMLHttpRequest()

     // Open a new connection, using the GET request on the URL endpoint
     request.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+late+','+long+'&sensor=false', true)
 
     request.onload = function () {
       // Begin accessing JSON data here
       var data = JSON.parse(this.response)
 
       if (request.status >= 200 && request.status < 400) {
         console.log(data)
       } else {
         console.log('error')
       }
     }
 
     // Send request
     request.send()
  }

  ngOnInit(): void {}
}
