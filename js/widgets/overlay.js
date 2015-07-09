// Overlay
(function($) {
  var methods = {
    init: function(options) {
      return this.each(function() {
        var $this = $(this);
        var settings = $this.data('overlay');

        if (typeof(settings) == 'undefined') {
          var defaults = {
            auto: false,
            position: 'center'
          }

          settings = $.extend({}, defaults, options);
//          $this.on('remove', methods.destroy);
          $this.data({overlay: settings, active: true})
        }
        else settings = $.extend({}, settings, options);

        overlay.show($this);
      });
    },

    close: function() {
      overlay.close();
    }
  };

  $.fn.overlay = function() {
    var method = arguments[0];

    if (methods[method]) {
      method = methods[method];
      arguments = Array.prototype.slice.call(arguments, 1);
    }
    else if (typeof(method) == 'object' || !method) method = methods.init;
    else {
      $.error('Method ' +  method + ' does not exist on jQuery.overlay');
      return this;
    }

    return method.apply(this, arguments);
  };


  var overlay = {
    show: function(obj) {
      var overlay_obj = $('<div />').addClass('overlay');
      overlay_obj.appendTo(document.body);
      overlay_obj.data('dialog', $(obj));

      options = obj.data('overlay');
      if (options.position)
        overlay_obj.on('click.overlay', this.close);

      $(window).on('resize.overlay', overlay.position);
      $(document).on('keyup.overlay', function(e) { if (e.keyCode == 13 || e.keyCode == 27) overlay.close() });

/*
      if ($(obj).css('position') == 'static')
        $(obj).css('position', 'relative');
*/

      $(document.body).css('overflow', 'hidden');

      $(obj).css({position: 'relative', display: 'none', 'z-index': 1001});
      $(obj).appendTo(overlay_obj);
      $(obj).fadeIn('slow');

      if (options.position)
        overlay.position(obj);
    },

    close: function(event) {
      var overlay_obj = null;
      if (typeof event != 'undefined') {
        if (event.target != event.currentTarget)
          return;

        event.preventDefault();
        overlay_obj = $(event.target);
      }
      else overlay_obj = $('.overlay');

      var dialog = overlay_obj.data('dialog');
      if (!dialog) return;

      dialog.fadeOut('fast');
      dialog.trigger('close');
      dialog.detach();

      $(document.body).css('overflow', 'inherit');

      overlay_obj.fadeOut('fast', function(){ overlay_obj.detach(); delete overlay_obj; });
      $(window).off('resize.overlay');
      $(document).off('keyup.overlay');

      delete overlay_obj;
    },

    position: function(event_or_object) {
      var dialog = null;

      if (typeof event_or_object == 'undefined' || event_or_object instanceof $.Event)
        dialog = $('.overlay').data('dialog');
//      else if (event_or_object instanceof $.Event) dialog = $(event_or_object.target);
      else dialog = event_or_object;

      var options = dialog.data('overlay');

      if (options.position == false) return;
      $(dialog).position({my: options.position, at: options.position, of: document.body});
      if (parseInt($(dialog).css('top')) < 0) $(dialog).css('top', 0);
    }
  }
  //$.overlay.click($.overlay.close);
})(jQuery);

