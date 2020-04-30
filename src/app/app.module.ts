import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GameComponent } from './game/game';
import {RouterModule, Routes} from '@angular/router';
import { InventoryComponent } from './inventory/inventory.component';
import {FormsModule} from '@angular/forms';

const appRoutes: Routes = [
  { path: '', component: GameComponent},
  { path: '**', component: GameComponent },
  { path: 'game', component: GameComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GameComponent,
    InventoryComponent,
  ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
