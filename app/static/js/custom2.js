$(document).ready(function() {
// Disgaea-style slide plugin
// Erik Potter 2010

// Strip leading hash(#) and dot(.) characters from html id and class names
String.prototype.normalize = function()
{
  if (this.charAt(0) === '#' || this.charAt(0) === '.')
  {
    return this.slice(1)
  } else {
    return this
  }
}

// jQuery object generator to reduce code size (thanks to Jack Moore)
function $div(id, class, css)
{
  id = id ? ' id="' + id.normalize() + '"' : '';
  class = class ? ' class="' + class.normalize() + '"' : '';
  css = css ? ' style="' + css + '"' : '';
  return $('<div' + id + class + css + '/>');
}

var DISGAEA = {
  // default settings
  defaults:
    {
      bin:              '#bin',
      container:        '#disgaea',
      debug:            true,
      direction:        undefined,
      form:             '#edit',
      imagePath:        '/static/img/',
      jsonPath:         '/json/',
      layers:           ['bgImg', 'charImg'],
      palette:          '#palette',
      slideDir:         '/static/img/',
      textLength:       0,
      textSpeed:        30,
      thumbDir:         '/static/img/',
      toolbar:          '#toolbar',
      transitionSpeed:  300,
      viewer:           '#viewer'
    },
  totalSlides: 0,
  
  layer: function(shortName)
  {
    // console.log('element', $(DISGAEA.defaults.palette).find('.'+shortName+' .thumb'))
    // console.log('form', $(DISGAEA.defaults.form).find('input#'+shortName))
    // console.log('viewer', $(DISGAEA.defaults.viewer).find('.layer.'+shortName))
  },
  
  // Helper functions
  get: function(key)
  {
    // Get variable or default
    return this.options ? this.options[key] : this.defaults[key]
  },

  debug: function(string)
  {
    if (this.get('debug') == true)
    {
      console.log('DEBUG', string)
    }
  },

  // listen: function(element, trigger, variable)
  // {
  //   // Set up a listener
  //   $(element).bind(trigger, function(e)
  //   {
  //     e.preventDefault()
  //     DISGAEA.debug('> ' + element + ' <')
  //     currentSlide[variable] = $(this).attr('href')
  //     $('form input').find('#'+variable).val(currentSlide[variable])
  //     $('#viewer .layer.'+variable)
  //       .stop()
  //       .fadeTo(get(transitionSpeed), 0, function()
  //       {
  //         $(this)
  //           .css('background-image', 'url('+get(imagePath)+currentSlide[variable]+')')
  //           .fadeTo(get(transitionSpeed), 1)
  //       })
  //     updateSlideBin()
  //     // // If successful, set bin thumbnail to match
  //     // getCurrentSlideBin().find('.thumb.bgImg').css('background-image', $(this).css('background-image'))
  //   })
  // },
  
  json: function(layer)
  {
    $.getJSON(DISGAEA.get('jsonPath') + layer, function(data)
    {
      // Add thumbs to palette
      $.each(data, function()
      {
        $(DISGAEA.get('palette')).find('.drawer.'+layer)
          .append($div(false, 'thumb', 'background:url('+DISGAEA.get('thumbDir')+this.thumb+')').attr('href', this.src)
            .click(function(e)
            {
              e.preventDefault()
              DISGAEA.refreshLayer($(DISGAEA.get('viewer')).find('.layer.'+layer), $(this).attr('href'))
            }))
      })
    })
  },

  refreshLayer: function(layer, src)
  {
    $(layer).stop().fadeTo(DISGAEA.get('transitionSpeed'), 0, function()
    {
      $(this).css('background-image', 'url('+DISGAEA.get('slideDir')+src+')').fadeTo(DISGAEA.get('transitionSpeed'), 1)
    })
  },

  loadPalette: function(layer)
  {
    DISGAEA.json(layer)
  },

  addSlide: function()
  {
    DISGAEA.totalSlides += 1
    console.log('adding slide (', DISGAEA.totalSlides, 'total)')
    // $.each(DISGAEA.defaults.layers, function()
    // {
    //   DISGAEA.layer(this)
    // })
  },
  
  init: function(options)
  {
    if (options) DISGAEA.options = options
  // Create markup
    // Create containers
    $(DISGAEA.get('container'))
      .append($div(DISGAEA.get('viewer')))
      .append($div(DISGAEA.get('palette')))
      .append($div(DISGAEA.get('toolbar')))
      .append($div(DISGAEA.get('bin')))
      // Create edit form
      .append($("<form id='edit' action='' method='post'></form>"))
    $(DISGAEA.get('toolbar'))
      // Create some buttons
      .append($div('add', 'button').text('Add slide').click(DISGAEA.addSlide))
      .append($div('saveSlide', 'button').text('Save to Bin').click(DISGAEA.saveSlide))
    // Create layers
    $.each(DISGAEA.get('layers'), function()
    {
      $(DISGAEA.get('palette'))
        .append($div(false, this).addClass('drawer'))
      $(DISGAEA.get('viewer'))
        .append($div(false, this).addClass('layer').hide())
    })
    // Populate layer palettes
    $.each(DISGAEA.get('layers'), function()
    {
      DISGAEA.loadPalette(this)
    })
    
    // $.each(DISGAEA.defaults.layers, function()
    // {
    //   DISGAEA.layer(this.shortName)
    // })
    
    // this.listen($('.thumb'), 'click', 'bgThingyTest')
  }
  
}

DISGAEA.init()

});
