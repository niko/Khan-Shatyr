// Khan Shatyr ("Royal Marquee") (see http://en.wikipedia.org/wiki/Khan_Shatyr_Entertainment_Center).
// Author: Niko Dittmann
// License: MIT
// 
// Works pretty much like a marqee tag, but smoother. Uses jQuery animation for that.
// 
// Options:
// * pause:       The pause when changing the direction. Defaults to 300.
// * delay:       The duration for the animation (aka "speed"). Defaults to 2000.
// * max_kerning: Try to fit content up to this kerning. Defaults to -0.07.
// * easing:      Animation easing function. Defaults to 'linear'.
// 
// Features:
// * Doesn't scroll content that already fits.
// * Adjustable pause when changing direction.
// * Tries to fit content by reducing the fonts kerning.
// * Detects content changes and reinits the scroller.
// 

(function( $ ) {
  
  // on window resize: reinit.
  var timer;
  $(window).resize(function(){
    if(timer) window.clearTimeout(timer);
    timer = window.setTimeout(function(){ $(window).trigger('reinit_khan_shatyr'); }, 1000)
  });
  
  var methods = {
      // Calculates the amount of overflow of an element.
      overflowAmount: function(elm){
        var content_width   = parseFloat(elm.contents().width());
        var container_width = parseFloat(elm.width());
        return content_width - container_width;
      },
      
      // Trys to condense the font of an element
      // up to max to make its content fit.
      // Reverts condensing, if not successfull.
      // Returns the overflow amount.
      // Returns null as overflow amount if successfull.
      condenseToFit: function(elm, max){
        var s=0.0;
        while (s >= max){
          elm.css('letter-spacing', s+'em');
          if(this.overflowAmount(elm) <= 0) return null;
          s = s-0.003;
        }
        
        elm.css('letter-spacing', '0em');
        return this.overflowAmount(elm);
      },
      
      // Scrolls an element left and right by given scroll amount.
      // It does so by adjusting the left margin and restoring it again.
      // delay defines the speed, pause the delay on direction change
      // and easing the easing function of the animation.
      scroll: function(elm, scroll_amount, delay, pause, easing){
        var left_margin = elm.css('marign-left');
        if(left_margin=='') left_margin = '0px';
        
        var scroll_left = function(){
          if (!elm.attr('scrolling')) return;
          window.setTimeout(function(){ elm.stop(true); elm.animate({'margin-left': -scroll_amount}, delay, easing, scroll_right); }, pause);
        };
        var scroll_right = function(){
          window.setTimeout(function(){ elm.stop(true); elm.animate({'margin-left': left_margin}, delay, easing, scroll_left); }, pause)
        }
        
        scroll_left();
      },
        
      init: function(scroller, opts){
        var self = this;
        
        // only check once for changes
        if(!scroller.attr('khan_shatyr_checker')){
          $(window).bind('reinit_khan_shatyr', function(){ self.init(scroller, opts); });
          
          scroller.attr('khan_shatyr_checker',
            setInterval(function(){
              if(scroller.find('span.khan_shatyr_scroller').length!=1) self.init(scroller, opts); // watch scroller for changes
            }, 1000)
          );
        };
        
        if( scroller.find('span.khan_shatyr_scroller').length==0 )
          scroller.wrapInner('<span class="khan_shatyr_scroller"></span>');     // wrap the content so we can do the math
        
        var scrolled = scroller.find('span.khan_shatyr_scroller');
        
        scrolled.attr('scrolling', true);
        var scroll_amount = this.condenseToFit(scroller, opts['max_kerning']);  // try to squeeze the content into the container…
        if(scroll_amount == null) {                                             // … if succeeded: return.
          scrolled.removeAttr('scrolling');
          return;
        }
        
        self.scroll(scrolled, scroll_amount, opts['delay'], opts['pause'], opts['easing']); // … else scroll.
      }
  };
  
  
  $.fn.khanShatyr = function(custom_opts){
    var opts = $.extend( {
      pause: 300,           // the pause when changing the direction
      delay: 2000,          // the duration for the animation (aka "speed")
      max_kerning: -0.05,   // try to fit content up to this kerning
      easing: 'linear',     // animation easing function
    }, custom_opts);
      
    var self = this;
    return this.each(function(i, scroller) { methods.init($(scroller), opts); });
  };
})( jQuery );
