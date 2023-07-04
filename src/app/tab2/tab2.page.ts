import { Component } from '@angular/core';
import { Photo } from '../models/photo.interface';

import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {

  public photos: Photo[] = [];

  constructor(public photoService : PhotoService) {}

  // Todo lo que comienza con ng es de Angular
  // Cuando se cargue la aplicación
  ngOnInit() {
    this.photoService.loadSaved().then( () => {
      this.photos = this.photoService.getPhotos();
    });
  }

  addNewPhotoToGallery() {
    this.photoService.addNewPhotoToGallery();
  }
}
