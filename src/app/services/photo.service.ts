import { ReadVarExpr } from '@angular/compiler';
import { Injectable } from '@angular/core';

import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, CameraPhoto, CameraSource } from '@capacitor/core';
// import { rejects } from 'node:assert';
// import { resolve } from 'node:path';
import { Photo } from '../models/photo.interface';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private photos : Photo[] = [];
  private PHOTO_STORAGE = 'photos';

  constructor() { }

  public async addNewPhotoToGallery() {
    // Take a picture!
    const capturedPhoto = await Camera.getPhoto({
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera,      
      quality : 100
    });

    const saveImageFile = await this.savePicture(capturedPhoto);

    this.photos.unshift(saveImageFile);

    Storage.set( {
      // Esto es una llave, es una ubicación
      key: this.PHOTO_STORAGE,
      // Esto es una función flecha
      value: JSON.stringify(this.photos.map( p => {
        // ...p es para indicar que esta es una función de flecha
        const photoCopy = {...p};

        // estamos borrando la foto temporal
        delete photoCopy.base64;

        return photoCopy;
      } ))
    } );
  }

  // Aquí vamos a cargar todas las fotografías guardadas
  public async loadSaved() {
    const photos = await Storage.get( {
      key: this.PHOTO_STORAGE
    } );

    this.photos = JSON.parse(photos.value) || [];

    for (let photo of this.photos) {
      const readFile = await Filesystem.readFile( {
        path: photo.filePath,
        directory: FilesystemDirectory.Data
      } )

      // Estas cosas están bien raras, son para concatenar datos
      photo.base64 = `data: image/jpeg;base64,${readFile.data}`;
    }
  }

  public getPhotos(): Photo[] {
    return this.photos;
  }

  public async savePicture(cameraPhoto : CameraPhoto) {
    const base64Data = await this.readAsBase64(cameraPhoto);

    const fileName = new Date().getTime + '.jpeg';

    await Filesystem.writeFile({
      path      : fileName,
      data      : base64Data,
      directory : FilesystemDirectory.Data
    });

    return await this.getPhotoFile(cameraPhoto, fileName);
  }

  private async getPhotoFile(cameraPhoto : CameraPhoto, fileName : string) : Promise<Photo> {
    return {
      filePath : fileName,
      webviewPath : cameraPhoto.webPath,
    }
  }

  private async readAsBase64(cameraPhoto : CameraPhoto) {
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob : Blob) => new Promise( (resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;

    reader.onload = () => {
      resolve(reader.result);
    },

    reader.readAsDataURL(blob)
  } )
}
