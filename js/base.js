//= require_tree ./widgets

function js_for(controller_ids, func) {
  $.js_content = $.js_content || {};
  controller_ids = controller_ids instanceof Array ? controller_ids : [controller_ids];

  $.each(controller_ids, function(){
    $.js_content[this] = func;
  })
}


