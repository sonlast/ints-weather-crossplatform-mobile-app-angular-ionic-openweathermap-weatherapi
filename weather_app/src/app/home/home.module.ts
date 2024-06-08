import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { CapitalizePipe } from '../pipe/capitalize.pipe';
import { UnixtotimePipe } from '../pipe/unixtotime.pipe';
import { MeterstokmPipe } from '../pipe/meterstokm.pipe';
import { WindspeedmeasurementPipe } from '../pipe/windspeedmeasurement.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FontAwesomeModule,
  ],
  declarations: [HomePage, CapitalizePipe, UnixtotimePipe, MeterstokmPipe, WindspeedmeasurementPipe]
})
export class HomePageModule {}
