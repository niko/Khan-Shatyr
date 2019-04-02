Khan Shatyr ("Royal Marquee") - Smooth scrolling text
===========

(see http://en.wikipedia.org/wiki/Khan_Shatyr_Entertainment_Center)

Author: Kai Himken
Forked from: https://github.com/niko/Khan-Shatyr
License: MIT

Works pretty much like a marqee tag, but smoother. Uses jQuery animation for that.

Options:

* pause:       The pause when changing the direction. Defaults to 300.
* delay:       The duration for the animation (aka "speed"). Defaults to 2000.
* max_kerning: Try to fit content up to this kerning. Defaults to -0.07.
* easing:      Animation easing function. Defaults to 'linear'.

Features:

* Doesn't scroll content that already fits.
* Adjustable pause when changing direction.
* Tries to fit content by reducing the fonts kerning.
* Detects content changes and reinits the scroller.

Synopsis:

```
$(document).ready(function(){
  $('div.demo').khanShatyr({delay: 2000, pause: 300, max_kerning: -0.05}).css('color', 'red');
})
```

Issues: https://github.com/niko/Khan-Shatyr/issues 
