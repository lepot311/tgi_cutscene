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

// Return number of keys in object
Object.size = function(obj) {
  var size = 0, key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++
  }
  return size
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
      // layers: [
      //   {
      //     name:      'bgImg',
      //     depth:     0,
      //     maxImages: 1
      //   },
      //   {
      //     name:      'charImg',
      //     depth:     1,
      //     maxImages: 2
      //   }
      // ],
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
  currentSlide: undefined,
  currentSlideshow: [],
  layers: {},
  totalSlides: 0,
  viewer: undefined,

  // Objects
  Viewer: function()
  {
    var viewer = this
    this.element = $div('viewer')
    
    this.clearLog = function(){
      $(this.element).find('.info div').remove()
    }
    
    this.log = function(msg)
    {
      // Unpack messages
      var output = ''
      $.each(msg, function(){
        output += this+' '
      })
      // Create console if needed
      if ($(this.element).find('.info').length === 0)
      {
        console.log('Viewer debug console ENABLED')
        $(this.element).append($div(false, 'info'))
      }
      $(this.element).find('.info')
        .append($div().text(output))
        // Zebra stripe
        .find(':even').addClass('even')
    }
    
    this.clear = function(f)
    {
      viewer.clearLog()
      if ($(viewer.element).find('.layer').length === 0)
      // If the viewer is empty
      {
        if (f) f()
      }
      else
      {
        $(viewer.element).find('.slide').stop().fadeTo(DISGAEA.get('transitionSpeed'), 0, function()
        {
          $(this).remove()
          if (f) f()
        })
      }
    }
    
    this.loadCurrentSlide = function()
    {
      // Clear current viewer
      this.clear(function()
      {
        // Add new image to this layer
        // console.log('loading current slide assets -> viewer')
        var slide = $div(false, 'slide')
        $(viewer.element).append(slide)
        $.each(DISGAEA.currentSlide.layers, function()
        {
          // console.log('loading layer', this.name, '-> viewer')
          viewer.log(['layer', this.depth, this.name, 'delay', this.delay || 0, 'side', this.side || 0])
          var layer = this
          layer.element = $div(false, 'layer '+this.name)
          $(slide).append($(layer.element)
            .hide()
            .append($img(DISGAEA.get('slideDir')+this.data.src, function()
            {
              // console.log('fade in ->', element, 'delay ->', layer.delay)
              $(layer.element)
                .css('left', $(viewer.element).width() * layer.side - $(layer.element).width() * layer.side)
                .delay(layer.delay)
                .fadeTo(DISGAEA.get('transitionSpeed'), 1)
            }))
          )
        })
      })
    }
    
    // Initialize
    console.log('Initializing Viewer')
  },
  
  Thumb: function(slide)
  {
    // console.log('thumb ->', this)
    var thumb = this
    this.element = $div(false, 'thumb')
    this.slide = slide
    
    this.deactivate = function()
    {
      // console.log('deactivate ->', this)
      // Attach listeners
      $(this.element).click(thumb.activate)
      // $(DISGAEA.get('viewer')).find('.layer.' + this.layer.name).remove()
    }
    
    this.activate = function()
    {
      // Set current slide to target
      DISGAEA.currentSlide = thumb.slide
      console.log('activate ->', thumb, ':', DISGAEA.currentSlide)
      DISGAEA.viewer.loadCurrentSlide()
      // Remove delete icon
      // $(this.element).find('.icon.delete').remove()
      // Add loader icon
      $(this.element).append($div(false, 'icon loader'))
        // .click(thumb.deactivate)
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
    $.each(this.slide.layers, function()
    {
      // Create img and append to thumb
      $(thumb.element)
        .append($div(false, 'icon loader'))
        .append($img(DISGAEA.get('slideDir') + this.data.src, function()
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
  

  loadSlide: function(slide)
  {
    var thumb = new DISGAEA.Thumb(slide)
    // Add to bin
    DISGAEA.currentBin.push(thumb)
    $(DISGAEA.get('bin')).append(thumb.element)
  },
  
  loadSlideshow: function()
  {
    // $.each(DISGAEA.get('layers'), function()
    // {
    //   $(DISGAEA.get('palette'))
    //     .append($div(false, this.name).addClass('drawer'))
    //   $(DISGAEA.get('viewer'))
    //     .append($div(false, this.name).addClass('layer').hide())
    // })
    // // Populate layer palettes
    // $.each(DISGAEA.layers, function()
    // {
    //   DISGAEA.loadPalette(this)
    // })
    
    // Iterate over all slides
    $.each(DISGAEA.currentSlideshow, function()
    {
      // Create layers from slides
      $.each(this.layers, function(index)
      {
        DISGAEA.layers[this.name] = this
      })
      // Create bin thumbnail
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
    DISGAEA.viewer = new DISGAEA.Viewer()
    // Insert elements
    $(DISGAEA.get('container'))
      .append(DISGAEA.viewer.element)
      .append($div(DISGAEA.get('palette')))
      .append($div(DISGAEA.get('toolbar')))
      .append($div(DISGAEA.get('bin')))
      // Create edit form
      // .append($("<form id='edit' action='' method='post'></form>"))
    $(DISGAEA.get('toolbar'))
      // Create some buttons
      .append($div('add', 'button').text('Add slide').click(DISGAEA.addSlide))
      .append($div('saveSlide', 'button').text('Save to Bin').click(DISGAEA.saveSlide))
  }
}

DISGAEA.init()
});
