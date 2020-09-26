import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TabsPage } from './tabs.page'

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'calculation',
        loadChildren: () =>
          import('../pages/calculation/calculation.module').then((m) => m.CalculationModule),
      },
      {
        path: 'model',
        loadChildren: () => import('../pages/model/model.module').then((m) => m.ModelModule),
      },
      {
        path: '',
        redirectTo: '/tabs/calculation',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/calculation',
    pathMatch: 'full',
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
