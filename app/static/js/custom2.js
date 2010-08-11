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
function $div(id, c, css)
{
  id = id ? ' id="' + id.normalize() + '"' : ''
  c = c ? ' class="' + c.normalize() + '"' : ''
  css = css ? ' style="' + css + '"' : ''
  return $('<div' + id + c + css + '/>')
}

function $img(src, f)
{
  var i = new Image()
  i.src = src
  if (f) f()
  return $(i)
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
      layers: [
        {
          name:   'bgImg',
          depth:  0,
          images: 1
        },
        {
          name:   'charImg',
          depth:  1,
          images: 2
        }
      ],
      // layers:           ['bgImg', 'charImg'],
      palette:          '#palette',
      slideDir:         '/static/img/',
      textLength:       0,
      textSpeed:        30,
      thumbDir:         '/static/img/',
      toolbar:          '#toolbar',
      transitionSpeed:  300,
      viewer:           '#viewer'
    },
  currentSlideshow: [],
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

  jsonLayer: function(layer)
  {
    $.getJSON(DISGAEA.get('jsonPath') + layer, function(data)
    {
      // Add thumbs to palette
      $.each(data, function()
      {
        var image = this
        var thumb = $div(false, 'thumb', 'background:url('+DISGAEA.get('thumbDir')+this.thumb+')')
        $.extend(thumb, {
          loadViewer: function()
          {
            // Add loader icon
            $(this).append($div(false, 'icon loader'))
            // Refresh the viewer layer and callback when finished
            DISGAEA.refreshLayer($(DISGAEA.get('viewer')).find('.layer.'+layer), image.src, function(){
              thumb.find('.loader').remove()
              thumb.append($div(false, 'icon delete'))
            })
          }
        }).click(thumb.loadViewer)
        .appendTo($(DISGAEA.get('palette')).find('.drawer.'+layer))
      })
    })
  },
  
  refreshLayer: function(layer, src, f)
  {
    // console.log('refreshing', layer, src)
    $(layer).stop().fadeTo(DISGAEA.get('transitionSpeed'), 0, function()
    {
      // First, remove all old images from this layer
      $(this).find('img').remove()
        // Add new image to this layer
      $(this).append($img(DISGAEA.get('slideDir')+src, function()
      {
        // console.log('loaded:', layer)
        $(layer).fadeTo(DISGAEA.get('transitionSpeed'), 1)
      }))
      if (f) f()
    })
  },

  addSlideBin: function(slide)
  // Add a slide representation to the bin
  {
    var thumb = $div(false, 'thumb')
    // Add some methods to thumb
    $.extend(thumb, {
        activate: function()
        {
          console.log('activating ->', slide.name)
          // Refresh viewer with slide
          $.each(slide.layers, function(){
            // Refresh each layer in slide
            DISGAEA.refreshLayer($(DISGAEA.get('viewer')).find('.'+this.name), this.data.src)
          })
          
          // Activate thumbnail in bin
          $(DISGAEA.get('bin')).find('.thumb')
            .removeClass('active')
            .find('.reload').remove()
          $(this)
            .addClass('active')
            .append($div(false, 'icon reload'))
        }
      })
    
    // Collect layers to build thumb
    $.each(slide.layers, function()
    {
      // Composite layers
      $(thumb).append($img(DISGAEA.get('slideDir') + this.data.src))
    })
    // Add to bin
    $(thumb)
      .click(thumb.activate)
      .hide()
      .appendTo($(DISGAEA.get('bin')))
      .fadeIn()
    // Add "active" class to first bin slide
    if (slide === DISGAEA.currentSlideshow[0]){
      thumb.activate()
    }
  },

  loadSlide: function(data)
  {
    // console.log(data)
    // $.each(data.layers, function(){
    //   // var slide = this
    //   DISGAEA.refreshLayer($(DISGAEA.get('viewer')).find('.'+this.name), this.data.src)
    // })
    DISGAEA.addSlideBin(data)
  },
  
  // jsonSlide: function()
  // // Gets a single slide
  // {
  //   $.getJSON(DISGAEA.get('jsonPath') + 'slide', function(data)
  //   {
  //     // console.log(data)
  //     DISGAEA.loadSlide(data)
  //   })
  // },
  
  loadSlideshow: function()
  {
    $.each(DISGAEA.currentSlideshow, function()
    {
      DISGAEA.loadSlide(this)
    })
    // Refresh viewer with first slide
    // $.each(DISGAEA.currentSlideshow[0].layers, function(){
    //   // Refresh each layer in slide
    //   DISGAEA.refreshLayer($(DISGAEA.get('viewer')).find('.'+this.name), this.data.src)
    // })
  },
  
  jsonSlideshow: function()
  // Gets an array of slides
  {
    $.getJSON(DISGAEA.get('jsonPath') + 'slide', function(data)
    {
      // console.log(data)
      DISGAEA.currentSlideshow = data
      DISGAEA.loadSlideshow()
    })
  },
  
  loadPalette: function(layer)
  {
    DISGAEA.jsonLayer(layer)
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
  
  saveSlide: function()
  {
    console.log('saving slide')
  },
  
  init: function(options)
  {
    if (options) DISGAEA.options = options
    // Load test slide
    DISGAEA.jsonSlideshow()
    
    //// Create markup
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
        .append($div(false, this.name).addClass('drawer'))
      $(DISGAEA.get('viewer'))
        .append($div(false, this.name).addClass('layer').hide())
    })
    // Populate layer palettes
    $.each(DISGAEA.get('layers'), function()
    {
      DISGAEA.loadPalette(this.name)
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
