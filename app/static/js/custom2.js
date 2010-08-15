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
  layerPalette: undefined,
  palettes: [],
  totalSlides: 0,
  viewer: undefined,

  // Objects

  LayerPalette: function()
  {
    var palette = this
    this.element = $div('layer_palette')
    
    // Initialize
    console.log('init layer palette')
  },

  Slide: function(data)
  {
    var slide = this
    this.element = $div(false, 'slide')

    this.renderLayers = function()
    {
      $.each(data.layers, function()
      {
        // console.log('rendering layer', this.name, '-> viewer')
        // viewer.log(['layer', this.depth, this.name, 'delay', this.delay || 0, 'side', this.side || 0])
        var layer = new DISGAEA.Layer(slide, this)
      })
    }

    // Initialize
    console.log('new slide')
    this.renderLayers()
  },

  Layer: function(slide, data)
  {
    var layer = this
    this.element = $div(false, 'layer')
    this.slide = slide
    this.data = data
    // this.layers = data.layers
    
    // console.log('layer render factory got data ->', data)
    
    this.populate = function()
    {
      $(layer.slide.element)
        .append($(layer.element)
          // .hide()
          .append($img(DISGAEA.get('slideDir')+layer.data.data.src, function()
        {
          // console.log('fade in ->', element, 'delay ->', layer.delay)
          // $(layer.element)
          //   .css('left', $(viewer.element).width() * layer.side - $(layer.element).width() * layer.side)
          //   .delay(layer.delay)
            // .fadeTo(DISGAEA.get('transitionSpeed'), 1)
            $(layer.element).click(layer.select)
        }))
      )
      if (DISGAEA.get('debug'))
      {
        var tooltip = $div(false, 'tooltip').text(layer.data.name),
            offset = 10
        $(DISGAEA.viewer.element).mousemove(function(e)
        {
          $(tooltip).offset({top:e.pageY+offset, left:e.pageX+offset})
        })
        $(layer.element).append(tooltip)
      }
    }
    
    this.highlight = function()
    {
      $(DISGAEA.viewer.element)
        .find('.layer').removeClass('active')
        .find('.highlight').remove()
      $(layer.element).addClass('active').append($div(false, 'highlight'))
    }
    
    this.select = function()
    {
      DISGAEA.viewer.updateLog()
      layer.highlight()
    }
    
    // Initialize
    console.log('new layer ->', this, data)
    this.populate()
    $(layer.element).hover(function()
    {
      $(DISGAEA.viewer.element).find('.tooltip').hide()
      $(layer.element).find('.tooltip').show()
    })
  },
  
  
  Viewer: function()
  {
    var viewer = this
    this.element = $div('viewer')
    
    this.clearLog = function(){
      $(this.element).find('.info div').remove()
    }
    
    this.updateLog = function()
    {
      viewer.clearLog()
      var output = []
      output.push(DISGAEA.currentSlide.name)
      $.each(DISGAEA.currentSlide.layers, function()
      {
        output.push(this.depth + ' ' + this.name)
      })
      $.each(output, function()
      {
        $(viewer.element).find('.info').append('<div>'+this+'</div>')
        $(viewer.element).find('.info')
          // Zebra stripe
          .find(':even').addClass('even')
      })
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
        // $(viewer.element).find('.slide').stop().fadeTo(DISGAEA.get('transitionSpeed'), 0, function()
        $(viewer.element).find('.slide').stop().remove()
        if (f) f()
      }
    }
    
    this.loadCurrentSlide = function(f)
    {
      // Clear current viewer
      this.clear(function()
      {
        // Add new image to this layer
        // console.log('loading current slide assets -> viewer')
        var slide = new DISGAEA.Slide(DISGAEA.currentSlide)
        $(viewer.element).append(slide.element)
        viewer.updateLog()
        if (f) f()
      })
    }
    
    // Initialize
    // console.log('Initializing Viewer')

    // Create console if needed
    if (DISGAEA.get('debug') === true)
    {
      if ($(viewer.element).find('.info').length === 0)
      {
        console.log('Viewer debug console ENABLED')
        $(viewer.element).append($div(false, 'info'))
      }
    }
    
  },
  
  Thumb: function()
  {
    // console.log('thumb ->', this)
    var thumb = this
    this.element = $div(false, 'thumb')
    
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
  },

  BinThumb: function(slide)
  {
    this.prototype = DISGAEA.Thumb
    this.prototype.constructor = this
    DISGAEA.Thumb.call(this)
    var thumb = this
    this.slide = slide
    // Initialize
    console.log('--initializing Bin Thumb', this.slide)

    this.deactivate = function()
    {
      console.log('deactivate ->', this)
      // Attach listeners
      $(this.element).removeClass('active').click(thumb.activate)
      // $(DISGAEA.get('viewer')).find('.layer.' + this.layer.name).remove()
    }
    
    this.activate = function()
    {
      // Set current slide to target
      DISGAEA.currentSlide = thumb.slide
      console.log('activate ->', thumb, ':', DISGAEA.currentSlide)
      // Remove delete icon
      // $(this.element).find('.icon.delete').remove()
      $(DISGAEA.get('bin')).find('.thumb.active').removeClass('active')
      $(thumb.element).addClass('active')
      // Add loader icon
      $(thumb.element).append($div(false, 'icon loader'))
        // .click(thumb.deactivate)
        DISGAEA.viewer.loadCurrentSlide(function()
      {
        // Remove loader icon
        $(thumb.element).find('.loader').remove()
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
  
  PaletteThumb: function(img)
  {
    console.log('--in Palette Thumb', img)
    this.prototype = DISGAEA.Thumb
    this.prototype.constructor = this
    DISGAEA.Thumb.call(this)
    this.img = img
    var thumb = this

    // Initialize
    console.log('--initializing Palette Thumb')
    console.log('----inherit from', this.prototype)
    console.log('----append a div full of images')
    console.log('----', this.img)
    // Create img and append to thumb
    $(thumb.element)
      .append($div(false, 'icon loader'))
      .append($img(DISGAEA.get('slideDir') + this.img.src, function()
      {
        // Resize image to fill thumb
        thumb.resizeFill()
        $(thumb.element).find('.loader').remove()
        // Fade in gracefully
        $(this).hide().css('visibility', 'visible').fadeIn(DISGAEA.transitionSpeed)
      }).css('visibility', 'hidden'))
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

  // jsonLayer: function(layer)
  // {
  //   $.getJSON(DISGAEA.get('jsonPath') + layer.name, function(data)
  //   {
  //     console.log('response from jsonLayer', data)
  //     // Add thumbs to palette
  //     $.each(data, function()
  //     {
  //       var thumb = new DISGAEA.PaletteThumb([{ src: this.src, layer: layer }])
  //       console.log('try', thumb, thumb.element)
  //       $(DISGAEA.get('palette')).find('.drawer.'+layer.name)
  //         .append(thumb.element)
  //       thumb.resizeFill()
  //     })
  //   })
  // },
  
  jsonPalettes: function(f)
  {
    $.getJSON(DISGAEA.get('jsonPath') + 'palettes', function(data)
    {
      // console.log('response from jsonPalettes', data)
      // Add thumbs to palette
      $.each(data, function()
      {
        DISGAEA.palettes.push(this)
      })
      if (f) f()
    })
  },
  
  loadSlide: function(slide)
  {
    var thumb = new DISGAEA.BinThumb(slide)
    // Add to bin
    DISGAEA.currentBin.push(thumb)
    $(DISGAEA.get('bin')).append(thumb.element)
  },
  
  loadSlideshow: function()
  {
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
    // Create palettes
    DISGAEA.loadPalettes()
    
    DISGAEA.currentBin[0].activate()
  },
  
  jsonSlideshow: function()
  // Gets an array of slides
  {
    $.getJSON(DISGAEA.get('jsonPath') + 'slideshow', function(data)
    {
      // console.log(data)
      DISGAEA.currentSlideshow = data
      DISGAEA.loadSlideshow()
    })
  },
  
  // loadPalettes: function(layer)
  // // Render palette assets from layer array
  // {
  //   console.log('palettes ->', DISGAEA.layers)
  //   $.each(DISGAEA.layers, function()
  //   {
  //     // Create image palettes
  //     // console.log(DISGAEA.currentSlideshow[0])
  //     // console.log('pt maker', new DISGAEA.PaletteThumb(DISGAEA.currentSlideshow[0]))
  //     $(DISGAEA.get('palette'))
  //       .append($div(false, this.name).addClass('drawer')
  //         // .append(new DISGAEA.PaletteThumb().element)
  //       )
  //     // Create layer palette
  //     $(DISGAEA.layerPalette.element)
  //       .append($div(false, 'layer')
  //         .append($div(false, 'depth').text(this.depth))
  //         .append($div(false, 'name').text(this.name))
  //       )
  //   })
  // },

  loadPalettes: function(layer)
  // Render palette assets from JSON request
  {
    DISGAEA.jsonPalettes(function()
    {
      console.log('palettes ->', DISGAEA.palettes)
      $.each(DISGAEA.palettes, function()
      {
        // Create image palettes
        var palette = $div(false, 'drawer').text(this.name)
        $(DISGAEA.get('palette'))
          .append(palette)
        // Create Palette thumbs
        $.each(this.data, function()
        {
          $(palette).append(new DISGAEA.PaletteThumb(this).element)
        })
        // Create layer palette
        $(DISGAEA.layerPalette.element)
          .append($div(false, 'layer')
            .append($div(false, 'depth').text(this.depth))
            .append($div(false, 'name').text(this.name))
          )
      })
    })
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
    DISGAEA.layerPalette = new DISGAEA.LayerPalette()
    // Insert elements
    $(DISGAEA.get('container'))
      .append(DISGAEA.viewer.element)
      .append($div(DISGAEA.get('palette')))
      .append($div(DISGAEA.get('toolbar')))
      .append($div(DISGAEA.get('bin')))
      .append(DISGAEA.layerPalette.element)
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
