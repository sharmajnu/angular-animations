import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgendaItemComponent } from './agenda-item/agenda-item.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports:      [ 
    BrowserModule, FormsModule, BrowserAnimationsModule,
    FormsModule,
    CommonModule
   ],
  declarations: [ AppComponent, HelloComponent, AgendaItemComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
