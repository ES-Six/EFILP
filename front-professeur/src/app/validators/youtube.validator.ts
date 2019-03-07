import { AbstractControl } from '@angular/forms';

export function YoutubeValidator(control: AbstractControl) {
  const YouTubeGetID = (url) => {
    let ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    } else {
      ID = null;
    }
    return ID;
  };

  if (!control.value) {
    return null;
  }

  if (YouTubeGetID(control.value) && !control.value.startsWith('https://www.youtube.com/embed/')) {
    return { youtubeLinkNotConfigured: true };
  }
  return null;
}
