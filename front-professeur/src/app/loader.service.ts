import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private displayLoader = false;

  constructor() { }

  setDisplayLoader(status: boolean) {
    setTimeout(() => {
      this.displayLoader = status;
    }, 0);
  }

  getDisplayLoader() {
    return this.displayLoader;
  }
}
