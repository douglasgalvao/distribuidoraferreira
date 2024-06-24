import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { ProdutosModule } from './modules/produtos/produtos.module';
import { HttpClientModule } from '@angular/common/http';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { ContentModule } from './modules/content/content.module';
import { CaixaModule } from './modules/caixa/caixa.module';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { FormatoMonetarioDirective } from './directives/money-format.directive';

@NgModule({
  declarations: [
    AppComponent,
    FormatoMonetarioDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    EstoqueModule,
    MaterialModule,
    ProdutosModule,
    ContentModule,
    CaixaModule,
    HttpClientModule
  ],
  providers: [
    provideEnvironmentNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
