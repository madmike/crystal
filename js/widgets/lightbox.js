//  Lightbox
(function($) {
  var methods = {
    init: function(options) {
      var images = []
      var $obj = this.first

      this.each(function() {
        var $this = $(this);
        var images_arr = $this.data('images') || [];

        images.push($this.attr('href'));
        images = images.concat(images_arr);

        $this.click(function(e){
          e.preventDefault();
          methods.show(images);
        });
      });
    },

    show: function(images) {
      var block = $('<div class="lightbox" data-slide="true"> \
          <a href="#" class="close"></a> \
          <a href="#" class="left arrow"></a> \
          <div class="container"><div class="wrapper"></div></div> \
          <a href="#" class="right arrow"></a> \
        </div>');
      var wrapper = block.find('.wrapper');

      block.find('a.arrow').on('click', methods.slide);
      block.find('a.close').on('click', methods.close);

      $(document).on('keyup.lightbox', function(e) {
        if (e.keyCode == 37) methods.slide(block, -1);
        else if (e.keyCode == 39) methods.slide(block, 1);
        else if (e.keyCode == 13 || e.keyCode == 27) methods.close(block);
      });

      for (i in images) {
        var section = $('<div />').addClass('section');//.append(image);
        var image = new Image();
        $(image).data('section', section)

        $(image).on('load', function() {
          $(this).data('section').css({/* 'max-height': this.height, */'background-image': 'url("'+this.src+'")'});
        });

        image.src = images[i];
        wrapper.append(section);
      }
      wrapper.find('.section').eq(0).addClass('current').css('left', 0);
      block.overlay({position: false});
    },

    close: function(event_or_object) {
      if (typeof event_or_object == 'undefined' || event_or_object == null) carusel = this;
      else if (event_or_object instanceof $.Event) {
        event_or_object.preventDefault();
        event_or_object.stopPropagation();
        carusel = $(event_or_object.target).closest('.lightbox');
      }
      else carusel = event_or_object;

      $(document).off('keyup.lightbox');
      carusel.overlay('close');
    },

    slide: function(event_or_object, dirrection) {
      var carusel;

      if (typeof event_or_object == 'undefined' || event_or_object == null) carusel = this;
      else if (event_or_object instanceof $.Event) {
        event_or_object.preventDefault();
        event_or_object.stopPropagation();
        carusel = $(event_or_object.target).closest('.lightbox');
        dirrection = $(event_or_object.target).hasClass('arrow') && $(event_or_object.target).hasClass('left') ? -1 : 1;
      }
      else carusel = event_or_object;

      dirrection = dirrection || 1;

      methods.stop(carusel);
      var sections = carusel.find('.section');
      var cur = carusel.find('.section.current');
      var next = null;

      if (sections.length < 2) return false;

      if (dirrection > 0) next = cur.is(sections.last()) ? sections.first() : cur.next();
      else next = cur.is(sections.first()) ? sections.last() : cur.prev();
      next.css({display: '', left: (dirrection * 100)+'%'});

      cur.animate({left: (dirrection * -100)+'%'}, {
        duration: 500,
        queue: false,
        easing: 'easeInOutQuad',
        step: function(n,f){ next.css({left: (n+dirrection * 100)+'%'}); },
        complete: function(){ cur.hide(); cur.removeClass('current'); next.addClass('current'); }
      });
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
      carusel.find('.section.current').stop(true, true);
      if (timer) clearInterval(timer);
    }
  };

  $.fn.lightbox = function() {
    var method = arguments[0];

    if (methods[method]) {
      method = methods[method];
      arguments = Array.prototype.slice.call(arguments, 1);
    }
    else if (typeof(method) == 'object' || !method) method = methods.init;
    else {
      $.error('Method ' +  method + ' does not exist on jQuery.lightbox');
      return this;
    }

    return method.apply(this, arguments);
  };
})(jQuery);