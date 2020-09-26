import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModelComponent } from './model.component';

const routes: Routes = [{ path: '', component: ModelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelRoutingModule { }
