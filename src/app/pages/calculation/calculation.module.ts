import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { IonicModule } from '@ionic/angular'
import { CalculationRoutingModule } from './calculation-routing.module'
import { CalculationComponent } from './calculation.component'

@NgModule({
  declarations: [CalculationComponent],
  imports: [CommonModule, CalculationRoutingModule, IonicModule, FormsModule, ReactiveFormsModule],
  providers: [Geolocation],
})
export class CalculationModule {}
