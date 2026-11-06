import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeComment',
  pure: true
})
export class CommentPipe implements PipeTransform {
    constructor(protected _sanitizer: DomSanitizer) {}
    transform(items): SafeHtml{
        return this._sanitizer.bypassSecurityTrustHtml(items);
        // return this._sanitizer.sanitize(SecurityContext.HTML, items);
    }
}