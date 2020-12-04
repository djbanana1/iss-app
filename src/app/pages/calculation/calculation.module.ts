import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { IonicModule } from '@ionic/angular'
import { CalculationRoutingModule } from './calculation-routing.module'
import { CalculationComponent } from './calculation.component'
import { Geolocation } from '@ionic-native/geolocation/ngx'

@NgModule({
  declarations: [CalculationComponent],
  imports: [CommonModule, CalculationRoutingModule, IonicModule],
  providers: [ Geolocation ],
})
export class CalculationModule {}
