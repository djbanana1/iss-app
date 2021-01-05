import { Component } from '@angular/core'
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx'
import { Platform } from '@ionic/angular'

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(private platform: Platform, private screenOrientation: ScreenOrientation) {
    this.platform.ready().then(async () => {
      this.screenOrientation.onChange().subscribe(() => {
        console.log(this.screenOrientation.type)
        if (this.screenOrientation.type == 'landscape-primary') {
          document.getElementById('ion-tabs').classList.add('hidden')
        } else {
          document.getElementById('ion-tabs').classList.remove('hidden')
        }
      })
    })
  }
}
