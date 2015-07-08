// Carusel
(function($) {
  var methods = {
    init: function(options) {
      return this.each(function() {
        var $this = $(this);
        var settings = $this.data('carusel');

        if (typeof(settings) == 'undefined') {
          var defaults = {
            ride: $this.data('ride') || false
          }

          settings = $.extend({}, defaults, options);
          $this.data('carusel', settings);

          $this.find('a.r.arrow').on('click', methods.next);
          $this.find('a.l.arrow').on('click', methods.prev);
          $this.on('remove', methods.destroy);
        }
        else settings = $.extend({}, settings, options);

        sections = $this.find('.section');
        cur = $this.data('cur') || sections.eq(0);
        cur.css('left', 0);

        $this.data('sections', sections);
        $this.data('cur', cur);

        if (settings.ride) {
          methods.stop($this);
          methods.start($this);
        }
      });
    },

    next: function(event_or_object) {
      var carusel;

      if (typeof event_or_object == 'undefined') carusel = this;
      else if (event_or_object instanceof $.Event) {
        event_or_object.preventDefault();
        event_or_object.stopPropagation();
        carusel = $(event_or_object.target).closest('.carusel');
      }
      else carusel = event_or_object;

      methods.stop(carusel);
      var sections = carusel.data('sections');
      var cur = carusel.data('cur');

      if (sections.length < 2) return false;

      var next = cur.is(sections.last()) ? sections.first() : cur.next();
      next.css({display: 'block', left: '100%'});

      cur.animate({left: '-100%'}, {
        duration: 500,
        queue: false,
        easing: 'easeInOutQuad',
        step: function(n,f){ next.css({left: (100+n)+'%'}); },
        complete: function(){ cur.hide(); carusel.data('cur', next); }
      });

      var settings = carusel.data('carusel');
      if (settings.ride) methods.start(carusel);
    },

    prev: function(event_or_object) {
      var carusel;

      if (typeof event_or_object == 'undefined') carusel = this;
      else if (event_or_object instanceof $.Event) {
        event_or_object.preventDefault();
        event_or_object.stopPropagation();
        carusel = $(event_or_object.target).closest('.carusel');
      }
      else carusel = event_or_object;

      methods.stop(carusel);
      var sections = carusel.data('sections');
      var cur = carusel.data('cur');

      if (sections.length < 2) return false;

      var prev = cur.is(sections.first()) ? sections.last() : cur.prev();
      prev.css({display: 'block', left: '-100%'});

      cur.animate({left: '100%'}, {
        duration: 500,
        queue: false,
        easing: 'easeInOutQuad',
        step: function(n,f){ prev.css({left: (n-100)+'%'}); },
        complete: function(){ cur.hide(); carusel.data('cur', prev); }
      });

      var settings = carusel.data('carusel');
      if (settings.ride) methods.start(carusel);
    },

    start: function(object) {
      var carusel = object || this;
      carusel.data('timer', setInterval(function(){
        if (document.body.contains(carusel[0])) methods.next(carusel);
        else methods.stop(carusel);
      }, 7000));
    },

    stop: function(object) {
      var carusel = object || this;
      var timer = carusel.data('timer');
      carusel.data('cur').stop(true, true);
      if (timer) clearInterval(timer);
    },

    destroy: function(event) {
      var carusel = $(event.target);
      methods.stop(carusel);
      carusel.data('carusel', '');
      carusel.find('a.r.arrow').off('click', methods.next);
      carusel.find('a.l.arrow').off('click', methods.prev);
      carusel.off('remove', methods.destroy);
    }
  };

  $.fn.carusel = function() {
    var method = arguments[0];

    if (methods[method]) {
      method = methods[method];
      arguments = Array.prototype.slice.call(arguments, 1);
    }
    else if (typeof(method) == 'object' || !method) method = methods.init;
    else {
      $.error('Method ' +  method + ' does not exist on jQuery.carusel');
      return this;
    }

    return method.apply(this, arguments);
  };
})(jQuery);