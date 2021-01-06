import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { IonicModule } from '@ionic/angular'
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer'
import { DocumentRoutingModule } from './document-routing.module'
import { DocumentComponent } from './document.component'

@NgModule({
  declarations: [DocumentComponent],
  imports: [CommonModule, DocumentRoutingModule, PdfViewerModule, IonicModule],
  providers: [PdfViewerComponent],
})
export class DocumentModule {}
