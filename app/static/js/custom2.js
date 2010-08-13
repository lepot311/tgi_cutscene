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
  if (f) i.onload = f
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
          name:      'bgImg',
          depth:     0,
          maxImages: 1
        },
        {
          name:      'charImg',
          depth:     1,
          maxImages: 2
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
  currentBin: [],
  currentSlideshow: [],
  totalSlides: 0,

  // Objects
  Thumb: function(images)
  {
    // console.log('thumb ->', this)
    var thumb = this
    this.element = $div(false, 'thumb')
    this.images = images
    
    this.deactivate = function()
    {
      // console.log('deactivate ->', this)
      // Attach listeners
      $(this.element).click(thumb.activate)
      // $(DISGAEA.get('viewer')).find('.layer.' + this.layer.name).remove()
    }
    
    this.activate = function()
    {
      console.log('activate ->', this)
      // Remove delete icon
      // $(this.element).find('.icon.delete').remove()
      // Add loader icon
      $(this.element).append($div(false, 'icon loader'))
        // .click(thumb.deactivate)
        // Refresh the viewer layer and callback when finished
      $.each(images, function(){
        DISGAEA.refreshLayer($(DISGAEA.get('viewer')).find('.layer.'+this.layer.name), this.src, function(){
          // $(thumb.element).find('.loader').remove()
          // $(thumb.element).append($div(false, 'icon delete'))
        })
      })
    }
    
    this.resizeFill = function()
    // Resize images to fill thumb
    {
      var cw = $(this.element).width(),
          ch = $(this.element).height()
      $.each(this.element.find('img'), function()
      {
        while ($(this).width() > cw && $(this).height() > ch)
        {
          $(this).width($(this).width()-1)
        }
      })
    }
    
    // Initialize
    $.each(images, function()
    {
      // Create img and append to thumb
      $(thumb.element).append($img(DISGAEA.get('slideDir') + this.src, function()
      {
        // Resize image to fill thumb
        thumb.resizeFill()
        $(thumb.element).find('.loader').remove()
        // Fade in gracefully
        $(this).hide().css('visibility', 'visible').fadeIn(DISGAEA.transitionSpeed)
      }).css('visibility', 'hidden'))
    })
    this.deactivate()
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
    $.getJSON(DISGAEA.get('jsonPath') + layer.name, function(data)
    {
      // Add thumbs to palette
      $.each(data, function()
      {
        var thumb = new DISGAEA.Thumb([{ src: this.src, layer: layer }])
        $(DISGAEA.get('palette')).find('.drawer.'+layer.name)
          .append(thumb.element)
        thumb.resizeFill()
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
    // var thumb = $div(false, 'thumb')
    // // Add some methods to thumb
    // $.extend(thumb, {
    //       // Activate thumbnail in bin
    //       $(DISGAEA.get('bin')).find('.thumb')
    //         .removeClass('active')
    //         .find('.reload').remove()
    //       $(this)
    //         .addClass('active')
    //         .append($div(false, 'icon reload'))
    //     }
    //   })
    // 
    // Collect layers to build thumb
    var images = []
    $.each(slide.layers, function()
    {
      images.push({ src: this.data.src, layer: this })
    })
    var slide = new DISGAEA.Thumb(images)
    DISGAEA.currentBin.push(slide)
    $(DISGAEA.get('bin'))
      .append(slide.element)

    // slide.resizeFill()

    // Add "active" class to first bin slide
    // if (slide === DISGAEA.currentSlideshow[0]){
    //   thumb.activate()
    // }
  },

  loadSlide: function(data)
  {
    DISGAEA.addSlideBin(data)
  },
  
  loadSlideshow: function()
  {
    $.each(DISGAEA.currentSlideshow, function()
    {
      DISGAEA.loadSlide(this)
    })
    DISGAEA.currentBin[0].activate()
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
  // Request palette assets
  {
    DISGAEA.jsonLayer(layer)
  },

  addSlide: function()
  {
    DISGAEA.totalSlides += 1
    console.log('adding slide (', DISGAEA.totalSlides, 'total)')
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
      // .append($("<form id='edit' action='' method='post'></form>"))
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
      DISGAEA.loadPalette(this)
    })
  }
}

DISGAEA.init()
});
