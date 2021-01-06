import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'calculation', loadChildren: () => import('./pages/calculation/calculation.module').then(m => m.CalculationModule) },
  { path: 'model', loadChildren: () => import('./pages/model/model.module').then(m => m.ModelModule) },
  { path: 'document', loadChildren: () => import('./pages/document/document.module').then(m => m.DocumentModule) }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
