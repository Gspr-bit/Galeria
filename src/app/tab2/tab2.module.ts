import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './tab2-routing.module';

import { PhotoService } from '../services/photo.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule
  ],
  declarations: [Tab2Page]
})

export class Tab2PageModule {
  constructor(public photoService : PhotoService) {}

  // No debe ser necesariamente el mismo nombre
  addNewPhotoToGallery() {
    this.photoService.addNewPhotoToGallery();
  }
}
