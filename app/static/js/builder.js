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
      currentSlide = {},
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
    util: {},
    setCurrentSlide: function(slide){
      currentSlide = slide
    },
    getCurrentSlide: function(){ return currentSlide },
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

//////////////////////////// default settings
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

console.log('D', D)

//////////////////////////// Objects
D.Viewer = {}
D.Viewer.clearLog = function(){
  $(this.element).find('.info div').remove()
}
D.Viewer.updateLog = function(){
  this.clearLog()
  var output = []
  // console.log('current slide ->', D.getCurrentSlide())
  output.push(D.getCurrentSlide().name)
  $.each(D.getCurrentSlide().layers, function(){
    output.push(this.depth + ' ' + this.name)
  })
  $.each(output, function(){
    $(D.Viewer.element).find('.info').append('<div>'+this+'</div>')
    $(D.Viewer.element).find('.info')
      // Zebra stripe
      .find(':even').addClass('even')
  })
}
D.Viewer.clear = function(f){
  D.Viewer.clearLog()
  if ($(this.element).find('.layer').length === 0){
  // If the viewer is empty
    if (f) f()
  } else {
    $(this.element).find('.slide').stop().remove()
    if (f) f()
  }
}
D.Viewer.loadCurrentSlide = function(f){
  // Clear current viewer
  this.clear(function(){
    // Add new image to this layer
    // console.log('loading current slide assets -> viewer')
    var slide = clone(D.Slide)
    slide.data = D.getCurrentSlide()
    slide.element = $div(false, 'slide')
    slide.init()
    $(D.Viewer.element).append(slide.element)
    D.Viewer.updateLog()
    if (f) f()
  })
}
D.Viewer.init = function(){
  // console.log('Initializing Viewer')
  // Create console if needed
  var viewer = this
  if (D.util.get('debug') === true){
    if ($(viewer.element).find('.info').length === 0){
      console.log('Viewer debug console ENABLED')
      $(viewer.element).append($div(false, 'info'))
    }
  }
}

  // LayerPalette: function()
  // {
  //   var palette = this
  //   this.element = $div('layer_palette')
  //   
  //   // Initialize
  //   // console.log('init layer palette')
  // },

D.Slide = {}
D.Slide.renderLayers = function(){
  var slide = this
  $.each(this.data.layers, function(){
    // console.log('rendering layer', this.name, '-> viewer')
    var layer = clone(D.Layer)
    layer.data = this
    layer.slide = slide
    layer.element = $div(false, 'layer').hide()
    layer.init()
  })
}
D.Slide.init = function(){
  // console.log('new slide')
  this.renderLayers()
}

D.Layer = {}
D.Layer.populate = function(){
  var layer = this
  $(this.slide.element)
    .append($(this.element)
      .append($img(D.util.get('slideDir')+layer.data.data.src, function(){
        layer.appear()
    }))
  )
  if (D.util.get('debug')){
    var tooltip = $div(false, 'tooltip').text(layer.data.name),
        offset = 10
    // $(D.Viewer.element).mousemove(function(e){
    //   $(tooltip).offset({top:e.pageY+offset, left:e.pageX+offset})
    // })
    $(layer.element).append(tooltip)
  }
}
D.Layer.highlight = function(){
  $(D.Viewer.element)
    .find('.layer').removeClass('active')
    .find('.highlight').remove()
  $(this.element).addClass('active').append($div(false, 'highlight'))
}
D.Layer.select = function(){
  console.log('select')
  D.Viewer.updateLog()
  this.highlight()
}
D.Layer.appear = function(){
  // Set side to animate in from
  var params = {},
      side = this.data.side || 'left'
  params[side] = 0
  if (this.data.animated){
    $(this.element)
      .css(side, -$(this.element).width())
      .show()
      .delay(this.data.delay || 0)
      .animate(params, this.speed || D.util.get('transitionSpeed'), function(){
        // console.log('animated', this.data.name)
      })
  } else {
    $(this.element).show()
  }
}
D.Layer.init = function(){
  var layer = this
  // console.log('new layer ->', this)
  this.populate()
  // $(this.element).hover(function(){
  //   $(D.Viewer.element).find('.tooltip').hide()
  //   $(layer.element).find('.tooltip').show()
  // })
}
  
D.Thumb = {}
D.Thumb.resizeFill = function(){
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

D.BinThumb = clone(D.Thumb)
D.BinThumb.init = function(){
    var thumb = this
    $.each(this.slide.layers, function(){
      // Create img and append to thumb
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
D.BinThumb.deactivate = function(){
    var thumb = this
    // console.log('deactivate ->', this)
    // Attach listeners
    $(this.element).removeClass('active')// .click(function(){ thumb.activate() })
    // $(D.util.get('viewer')).find('.layer.' + this.layer.name).remove()
  }
D.BinThumb.activate = function(){
    // Set current slide to target
    var thumb = this
    D.setCurrentSlide(this.slide)
    console.log('activate ->', this, ':', D.getCurrentSlide())
    this.makeActive()
    // Add loader icon
    $(this.element).append($div(false, 'icon loader'))
    D.Viewer.loadCurrentSlide(function(){
      $(thumb.element).find('.loader').remove()
    })
  }
D.BinThumb.makeActive = function(){
  $(D.util.get('bin')).find('.thumb.active').removeClass('active')
  $(this.element).addClass('active')
}

D.PaletteThumb = clone(D.Thumb)
D.PaletteThumb.init = function(){
  // console.log('--initializing Palette Thumb')
  // Create img and append to thumb
  var thumb = this
  $(this.element)
    .append($div(false, 'icon loader'))
    .append($img(D.util.get('slideDir') + this.img.src, function(){
      // Resize image to fill thumb
      thumb.resizeFill()
      $(thumb.element).find('.loader').remove()
      // Fade in gracefully
      $(this).hide().css('visibility', 'visible').fadeIn(D.util.get('transitionSpeed'))
    }).css('visibility', 'hidden'))
}

D.Dialog = {}
D.Dialog.count = 0
D.Dialog.element = $div(false, 'dialogWrapper').append($div(false, 'dialog'))
D.Dialog.element.click(function(){
  D.Dialog.clear()
})
D.Dialog.message = "Default dialog message"
D.Dialog.init = function(){
  console.log('--init dialog box')
  return this
}
D.Dialog.buildIn = function(){
  console.log('--dialog: buiding in')
}
D.Dialog.buildingOut = function(){
  console.log('--dialog: buiding out')
}
D.Dialog.nextLetter = function(){
  this.count++
  console.log('--dialog: count', this.count)
}
D.Dialog.clear = function(){
  console.log('--dialog: clear')
}
D.Dialog.popIn = function(){
  $(this.element)
    .css('bottom', -180)
    .delay(D.util.get('transitionSpeed'))
    .animate({
      bottom: -50
    }, 1200, 'easeOutElastic', function(){
      console.log('done')
    })
    .text('some text')
}

//////////////////////////// Helper functions
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
  thumb.element = $div(false, 'thumb').click(function(){
    thumb.activate()
  })
  thumb.slide = slide
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
    // console.log('palettes ->', D.getPalettes())
    $.each(D.getPalettes(), function(){
      // Create image palettes
      var palette = $div(false, 'drawer').text(this.name)
      $(D.util.get('palette'))
        .append(palette)
      // Create Palette thumbs
      $.each(this.data, function(){
        var thumb = clone(D.PaletteThumb)
        thumb.img = this
        thumb.element = $div(false, 'thumb')
        thumb.init()
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
  var viewer = D.Viewer
  viewer.element = $div('viewer')
  viewer.init()
  $(D.util.get('container'))
    .append(viewer.element)
    .append($div(D.util.get('palette')))
    .append($div(D.util.get('toolbar')))
    .append($div(D.util.get('bin')))
    // .append(D.layerPalette.element)
    // Create edit form
    // .append($("<form id='edit' action='' method='post'></form>"))
  $(D.util.get('toolbar'))
    // Create some buttons
    .append($div('add', 'button').text('Add slide').click(function(){ D.addSlide() }))
    .append($div('saveSlide', 'button').text('Save to Bin').click(function(){ D.saveSlide }))
  var dialog = D.Dialog
  $(D.util.get('viewer')).append(dialog.init().element)
}
////////////////////////////
D.init()
});
