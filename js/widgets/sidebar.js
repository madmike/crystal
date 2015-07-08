// Sidebar
(function($) {
  $.sidebar = function(tree, options) {
    var defaults = {
      id: null,
      url: '/category',
      sub: false,
    }
    settings = $.extend({}, defaults, options);

    return this.create_list(tree, settings);
  };

  $.sidebar.prototype.create_list = function(tree, settings) {
    var items = $('<ul />');

    if (!settings.sub) {
      items.addClass('accardion');
      settings.sub = true;
    }

    for (var cat in tree) {
      cat = tree[cat]
      var url = settings.url + cat.link;

      var is_descedent = this.is_descedent(settings.id, cat);
      var klass = [];
      if (is_descedent) klass.push('active');
      if (cat.children) klass.push('parent');

      var item = $('<li />').addClass(klass.join(' ')).append($('<a />').attr('href', url).text(cat.name));

      if (cat.children) {
        var subitem = this.create_list(cat.children, settings);
        if (!is_descedent) subitem.addClass('hidden');

        item.append(subitem);
      }

      items.append(item);
    }

    return items;
  }

  $.sidebar.prototype.is_descedent = function(id, cat) {
    if (id == null) return false;

    if (cat.link == parseInt(id))
      return true;
    else if (cat.children) {
      matched = false;
      for (i in cat.children)
        if (this.is_descedent(id, cat.children[i])) matched = true;

      return matched;
    }
    else return false;
  };
})(jQuery);