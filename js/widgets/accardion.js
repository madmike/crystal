// Accardion
(function($) {
  var methods = {
    init: function(options) {
      return this.each(function() {
        var $this = $(this);
        var settings = $this.data('accardion');

        if (typeof(settings) == 'undefined') {
          var defaults = {
//            ride: $this.data('ride') || false
          }

          settings = $.extend({}, defaults, options);
          $this.data('accardion', settings);

          $this.find('a').off('click', methods.click);
          $this.find('a').on('click', methods.click);
//          $this.on('remove', methods.destroy);
        }
        else settings = $.extend({}, settings, options);
      });
    },

    click: function(e) {
      var li = $(e.target).parent();

      if (li.hasClass('parent'))
        e.preventDefault();

      if (li.hasClass('active')) {
        li.find('ul').slideUp('fast');
        li.add(li.find('ul li')).removeClass('active');
      }
      else {
        li.siblings().filter('.active').removeClass('active')
          .find('ul').slideUp('fast')
          .find('li.active').removeClass('active');
        li.addClass('active').find('>ul').slideDown('fast');
      }
    },

    collapseAll: function() {
      $(this).find('li.active').removeClass('active').find('ul').slideUp('fast');
    }
  };

  $.fn.accardion = function() {
    var method = arguments[0];

    if (methods[method]) {
      method = methods[method];
      arguments = Array.prototype.slice.call(arguments, 1);
    }
    else if (typeof(method) == 'object' || !method) method = methods.init;
    else {
      $.error('Method ' +  method + ' does not exist on jQuery.accardion');
      return this;
    }

    return method.apply(this, arguments);
  };
})(jQuery);