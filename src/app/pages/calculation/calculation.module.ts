import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { IonicModule } from '@ionic/angular'
import { CalculationRoutingModule } from './calculation-routing.module'
import { CalculationComponent } from './calculation.component'

@NgModule({
  declarations: [CalculationComponent],
  imports: [CommonModule, CalculationRoutingModule, IonicModule],
})
export class CalculationModule {}
