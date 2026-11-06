import { Injectable } from '@angular/core';

@Injectable()
export default class Utils {
  static cripta(s) {
    return btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, 
        (_, p1) => String.fromCharCode(parseInt(p1, 16))
    ));
  }

  static decripta(s) {
    return decodeURIComponent(Array.prototype.map.call(atob(s), c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
}