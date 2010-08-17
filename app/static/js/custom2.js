$(document).ready(function() {
// Disgaea-style slide plugin
// Erik Potter 2010

String.prototype.normalize = function(){
  // Strip leading hash(#) and dot(.) characters from html id and class names
  if (this.charAt(0) === '#' || this.charAt(0) === '.'){
    return this.slice(1)
  } else {
    return this
  }
}

Object.prototype.size = function(obj){
  // Return number of keys in object
  var size = 0, key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++
  }
  return size
}

function $div(id, c, css){
// jQuery object generator to reduce code size (thanks to Jack Moore)
  id = id ? ' id="' + id.normalize() + '"' : ''
  c = c ? ' class="' + c.normalize() + '"' : ''
  css = css ? ' style="' + css + '"' : ''
  return $('<div' + id + c + css + '/>')
}

function $img(src, f){
  var i = new Image()
  i.src = src
  if (f) i.onload = f
  return $(i)
}

function clone(object){
  function F() {}
  F.prototype = object
  return new F
}

var D = (function(){
  // private vars
  var currentBin = [],
      currentSlideshow = [],
      layers = {},
      layerPalette = undefined,
      palettes = [],
      totalSlides = 0,
      viewer = undefined
  // private methods
  function _push(array, value){
    array.push(value)
  }
  return {
    currentSlide: undefined,
    util: {},
    // setCurrentSlide: function(slide){
    //   this.currentSlide = slide
    // },
    setCurrentSlideshow: function(slideshow){
      this.currentSlideshow = slideshow
    },
    addLayer: function(name, layer){
      if (this.layers === undefined){
        this.layers = {}
      } else {
        this.layers[name] = layer
      }
    },
    appendCurrentBin: function(thumb){
      _push(currentBin, thumb)
    },
    appendPalettes: function(palette){
      _push(palettes, palette)
    },
    getPalettes: function(){ return palettes },
    getCurrentBin: function(){ return currentBin }
  }
})()

// default settings
D.defaults = {
  bin:              '#bin',
  container:        '#disgaea',
  debug:            true,
  direction:        undefined,
  form:             '#edit',
  imagePath:        '/static/img/',
  jsonPath:         '/json/',
  palette:          '#palette',
  slideDir:         '/static/img/',
  textLength:       0,
  textSpeed:        30,
  thumbDir:         '/static/img/',
  toolbar:          '#toolbar',
  transitionSpeed:  300,
  viewer:           '#viewer'
}

console.log('testing stuff:')
console.log('D', D)
console.log('defaults', D.defaults.length)
console.log('privates', D.totalSlides)

// Objects
D.Viewer = (function(){
  return {
    viewer: this,
    element: $div('viewer'),
    clearLog: function(){
      $(this.element).find('.info div').remove()
    },
    updateLog: function(){
      this.clearLog()
      var output = []
      output.push(D.currentSlide.name)
      $.each(D.currentSlide.layers, function()
      {
        output.push(this.depth + ' ' + this.name)
      })
      $.each(output, function()
      {
        $(D.Viewer.element).find('.info').append('<div>'+this+'</div>')
        $(D.Viewer.element).find('.info')
          // Zebra stripe
          .find(':even').addClass('even')
      })
    },
    clear: function(f){
      D.Viewer.clearLog()
      if ($(D.Viewer.element).find('.layer').length === 0){
      // If the viewer is empty
        if (f) f()
      } else {
        $(D.Viewer.element).find('.slide').stop().remove()
        if (f) f()
      }
    },
    loadCurrentSlide: function(f){
      // Clear current viewer
      this.clear(function()
      {
        // Add new image to this layer
        // console.log('loading current slide assets -> viewer')
        var slide = clone(D.Slide)
        slide.slide = D.currentSlide  // really? =p
        $(D.Viewer.element).append(slide.element)
        D.Viewer.updateLog()
        if (f) f()
      })
    },
    init: function(){
      // console.log('Initializing Viewer')
      // Create console if needed
      if (D.util.get('debug') === true)
      {
        if ($(viewer.element).find('.info').length === 0)
        {
          console.log('Viewer debug console ENABLED')
          $(viewer.element).append($div(false, 'info'))
        }
      }
    }
  }
})()

  // LayerPalette: function()
  // {
  //   var palette = this
  //   this.element = $div('layer_palette')
  //   
  //   // Initialize
  //   // console.log('init layer palette')
  // },

D.Slide = {
  slide: this,
  data: {'name': 'default'},
  element: $div(false, 'slide'),
  renderLayers: function(){
    $.each(this.data.layers, function(){
      // console.log('rendering layer', this.name, '-> viewer')
      var layer = new D.Layer(slide, this)
    })
  },
  init: function(){
    console.log('new slide')
    this.renderLayers()
  }
}

D.Layer = {
  layer: this,
  element: $div(false, 'layer'),
  slide: {'name': 'default'},
  data: {'name': 'default'},
  populate: function(){
    $(layer.slide.element)
      .append($(layer.element)
        // .hide()
        .append($img(D.util.get('slideDir')+layer.data.data.src, function(){
        // console.log('fade in ->', element, 'delay ->', layer.delay)
        // $(layer.element)
        //   .css('left', $(viewer.element).width() * layer.side - $(layer.element).width() * layer.side)
        //   .delay(layer.delay)
          // .fadeTo(D.util.get('transitionSpeed'), 1)
          $(layer.element).click(layer.select)
      }))
    )
    if (D.util.get('debug')){
      var tooltip = $div(false, 'tooltip').text(layer.data.name),
          offset = 10
      $(D.viewer.element).mousemove(function(e){
        $(tooltip).offset({top:e.pageY+offset, left:e.pageX+offset})
      })
      $(layer.element).append(tooltip)
    }
  },
  highlight: function(){
    $(D.viewer.element)
      .find('.layer').removeClass('active')
      .find('.highlight').remove()
    $(layer.element).addClass('active').append($div(false, 'highlight'))
  },
  select: function(){
    D.viewer.updateLog()
    layer.highlight()
  },
  init: function(){
    console.log('new layer ->', this, data)
    this.populate()
    $(layer.element).hover(function(){
      $(D.viewer.element).find('.tooltip').hide()
      $(layer.element).find('.tooltip').show()
    })
  }
}
  
D.Thumb = {
  thumb: this,
  element: $div(false, 'thumb'),
  resizeFill: function(){
    // Resize images to fill thumb
    var cw = $(this.element).width(),
        ch = $(this.element).height()
    $.each(this.element.find('img'), function(){
      var iw = $(this).width(),
          ih = $(this).height(),
          big = Math.max(iw, ih),
          small = Math.min(iw, ih),
          ratio = big / small
      while (iw / ratio > ch && ih * ratio > cw && iw > cw && ih > ch){
        iw -= 10
      }
      $(this).width(iw)
    })
  }
}

D.BinThumb = clone(D.Thumb)
D.BinThumb.deactivate = function(){
    console.log('deactivate ->', this)
    // Attach listeners
    $(this.element).removeClass('active').click(this.activate)
    // $(D.util.get('viewer')).find('.layer.' + this.layer.name).remove()
  }
D.BinThumb.activate = function(){
    // Set current slide to target
    D.currentSlide = this.slide
    console.log('activate ->', this, ':', D.currentSlide)
    // Remove delete icon
    // $(this.element).find('.icon.delete').remove()
    $(D.util.get('bin')).find('.thumb.active').removeClass('active')
    $(this.element).addClass('active')
    // Add loader icon
    $(this.element).append($div(false, 'icon loader'))
      // .click(thumb.deactivate)
    D.Viewer.loadCurrentSlide(function(){
    // Remove loader icon
    $(this.element).find('.loader').remove()
    })
  }
D.BinThumb.init = function(){
    var thumb = this
    $.each(this.slide.layers, function(){
      // Create img and append to thumb
      console.log(thumb.element)
      $(thumb.element)
        .append($div(false, 'icon loader'))
        .append($img(D.util.get('slideDir') + this.data.src, function(){
          // Resize image to fill thumb
          thumb.resizeFill()
          $(thumb.element).find('.loader').remove()
          // Fade in gracefully
          $(this).hide().css('visibility', 'visible').fadeIn(D.util.get('transitionSpeed'))
        }).css('visibility', 'hidden'))
    })
    this.deactivate()
  }

D.PaletteThumb = {
  thumb: this,
  img: {'name': 'default'},
  init: function(){
    console.log('--initializing Palette Thumb')
    // Create img and append to thumb
    $(thumb.element)
      .append($div(false, 'icon loader'))
      .append($img(D.util.get('slideDir') + this.img.src, function(){
        // Resize image to fill thumb
        thumb.resizeFill()
        $(thumb.element).find('.loader').remove()
        // Fade in gracefully
        $(this).hide().css('visibility', 'visible').fadeIn(D.util.get('transitionSpeed'))
      }).css('visibility', 'hidden'))
  }
}

// Helper functions
D.util.get = function(key){
  // Get variable or default
  return D.options ? D.options[key] : D.defaults[key]
}

D.util.jsonPalettes = function(f){
  $.getJSON(D.util.get('jsonPath') + 'palettes', function(data)
  {
    // console.log('response from jsonPalettes', data)
    // Add thumbs to palette
    $.each(data, function()
    {
      D.appendPalettes(this)
    })
    if (f) f()
  })
}

D.util.loadSlide = function(slide){
  var thumb = clone(D.BinThumb)
  thumb.element = $div(false, 'thumb')
  thumb.slide = slide
  console.log('thumb ->', thumb)
  thumb.init()
  // Add to bin
  D.appendCurrentBin(thumb)
  $(D.util.get('bin')).append(thumb.element)
}

D.util.loadSlideshow = function(){
  // Iterate over all slides
  $.each(D.currentSlideshow, function(){
    // Create layers from slides
    $.each(this.layers, function(index){
      D.addLayer(this.name, this)
    })
    // Create bin thumbnail
    D.util.loadSlide(this)
  })
  // Create palettes
  D.util.loadPalettes()
  D.getCurrentBin()[0].activate()
}

D.util.jsonSlideshow = function(){
  // Gets an array of slides
  $.getJSON(D.util.get('jsonPath') + 'slideshow', function(data){
    // console.log(data)
    D.setCurrentSlideshow(data)
    D.util.loadSlideshow()
  })
}

D.util.loadPalettes = function(layer){
  // Render palette assets from JSON request
  D.util.jsonPalettes(function(){
    console.log('palettes ->', D.palettes)
    $.each(D.getPalettes(), function(){
      // Create image palettes
      var palette = $div(false, 'drawer').text(this.name)
      $(D.util.get('palette'))
        .append(palette)
      // Create Palette thumbs
      $.each(this.data, function(){
        var thumb = clone(D.PaletteThumb)
        thumb.img = this
        $(palette).append(thumb.element)
      })
      // Create layer palette
      // $(D.layerPalette.element)
      //   .append($div(false, 'layer')
      //     .append($div(false, 'depth').text(this.depth))
      //     .append($div(false, 'name').text(this.name)))
    })
  })
}

D.util.addSlide = function(){
  D.totalSlides += 1
  console.log('adding slide (', D.totalSlides, 'total)')
}
  
D.util.saveSlide = function(){
  console.log('saving slide')
}

D.init = function(options){
  if (options) D.options = options
  // Load test slide
  D.util.jsonSlideshow()
  //// Create markup
  // Create containers
    // D.layerPalette = new D.LayerPalette()
  // Insert elements
  $(D.util.get('container'))
    .append(D.Viewer.element)
    .append($div(D.util.get('palette')))
    .append($div(D.util.get('toolbar')))
    .append($div(D.util.get('bin')))
    // .append(D.layerPalette.element)
    // Create edit form
    // .append($("<form id='edit' action='' method='post'></form>"))
  $(D.util.get('toolbar'))
    // Create some buttons
    .append($div('add', 'button').text('Add slide').click(D.addSlide))
    .append($div('saveSlide', 'button').text('Save to Bin').click(D.saveSlide))
}

D.init()
});
