import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { IonicModule } from '@ionic/angular'
import { ModelRoutingModule } from './model-routing.module'
import { ModelComponent } from './model.component'

@NgModule({
  declarations: [ModelComponent],
  imports: [CommonModule, ModelRoutingModule, IonicModule],
})
export class ModelModule {}
