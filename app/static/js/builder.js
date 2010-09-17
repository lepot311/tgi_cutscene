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

String.prototype.startsWith = function(str){
  return (this.indexOf(str) === 0)
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

function $img(src, c, f){
  var i = new Image()
  $(i).attr('class', c)
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
    getCurrentSlideshow: function(){ return this.currentSlideshow },
    setViewer: function(object){
      viewer = object
    },
    getViewer: function(){ return viewer },
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
  assets:           undefined,
  bin:              '#bin',
  colors:           {
    'delay': 'blue',
    'appear': 'red'
  },
  container:        '#disgaea',
  debug:            true,
  dialogWrapperHeight:   180,
  direction:        undefined,
  form:             '#edit',
  imagePath:        '../img/',
  jsonPath:         '/json/',
  palette:          '#palette',
  slideDir:         '../img/',
  slideshow:        undefined,
  textColor:        '#46372A',
  textLength:       0,
  textSpeed:        30,
  thumbDir:         '../img/',
  timeout:          1600,
  toolbar:          '#toolbar',
  transitionSpeed:  300,
  viewer:           '#viewer'
}
// console.log('D', D)

//////////////////////////// Objects
D.Viewer = {}
D.Viewer.element = $div('viewer')
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
    $(D.getViewer().element).find('.info').append('<div>'+this+'</div>')
    $(D.getViewer().element).find('.info')
      // Zebra stripe
      .find(':even').addClass('even')
  })
}
D.Viewer.clear = function(f){
  this.clearLog()
  $(this.element).find('.slide').stop().remove()
  if (f) f()
}
D.Viewer.loadCurrentSlide = function(f){
  // Clear current viewer
  this.clear()
  // Add new image to this layer
  // console.log('loading current slide assets -> viewer')
  var viewer = this,
      slide = clone(D.Slide)
  if (this.dialog) this.dialog.clear()
  slide.data = D.getCurrentSlide()
  slide.element = $div(false, 'slide')
  slide.queue = []
  slide.init()
  viewer.slide = slide
  $(this.element).append(slide.element)
  this.updateLog()
  if (f) f()
}
D.Viewer.play = function(){
  // console.log('said play')
  if (this.isPlaying === true){
    this.pause()
  } else {
    this.isPlaying = true
    this.loadCurrentSlide()
  }
}
D.Viewer.pause = function(){
  this.isPlaying = false
}
D.Viewer.seek = function(delta){
  // console.log('seeking by', delta || 1)
  // Set the current slide to be the current slide plus the delta
  var current = D.getCurrentSlideshow().indexOf(D.getCurrentSlide()),
      next = current + (delta || 1)
      target = D.getCurrentSlideshow()[next]
  // console.log('delta', delta, 'current', current, 'next', next)
  // console.log(target)
  if (target){
    D.setCurrentSlide(target)
    this.loadCurrentSlide()
  } else {
    if (D.getViewer().loop){
      // Seek to beginning
      // console.log('loop')
      D.setCurrentSlide(D.getCurrentSlideshow()[0])
      this.loadCurrentSlide()
    } else {
      this.pause()
    }
  }
}
D.Viewer.slideFinished = function(){
  if (this.isPlaying === true){
    this.seek()
  }
}
D.Viewer.renderTransport = function(){
  var viewer = this,
      transport = $div('transport')
  $(this.element).append($div('transportWrapper')
    .width(D.getViewer().w - 20)
    .append(transport
      .append($div(false, 'button')
        .click(function(){
          viewer.play()
          // console.log('pushed play button', viewer.isPlaying)
        }))))
  this.transport = transport
}
D.Viewer.renderDialog = function(layer){
  // console.log('renderDialog received', layer)
  // Update text)
  if (layer){
    if (!this.dialog){
      var dialog = clone(D.Dialog)
      dialog.init()
      // console.log('creating dialog ->', dialog.wrapper)
      $(this.element).append(dialog.wrapper)
      dialog.popIn()
      this.dialog = dialog
    }

    this.dialog.layer = layer
    this.dialog.clear()
    // console.log('text length', this.dialog.text, this.dialog.text.length)
    this.dialog.buildIn()
  }
}
D.Viewer.init = function(){
  // console.log('Initializing Viewer')
  // Create console if needed
  var viewer = this
  // if (D.util.get('debug') === true){
  //   if ($(viewer.element).find('.info').length === 0){
  //     console.log('Viewer debug console ENABLED')
  //     $(viewer.element).append($div(false, 'info'))
  //   }
  // }
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
    slide.layersRemaining++
    // console.log('rendering layer', this.name, '-> viewer')
    var layer = clone(D.Layer)
    layer.data = this
    layer.slide = slide
    if (layer.data.animated){
      layer.element = $div().hide().addClass('layer')
    } else {
      layer.element = $div(false, 'layer')
    }
    // If a layer has character dialog
    // if (layer.data.text){
    //   D.getViewer().renderDialog({'layer': layer, 'text': layer.data.text})
    // }
    layer.init()
  })
}
D.Slide.hasFinished = function(){
  // Signal the viewer
  D.getViewer().slideFinished()
}
D.Slide.ready = function(){
  // console.log('slide said ready')
  this.isReady = true
  // this.addMarkers()
  this.animate()
}
// D.Slide.addMarkers = function(m){
//   $(D.getViewer().transport).find('#markers').remove()
//   console.log('adding markers')
//   var markers = [],
//       total = 0,
//       width = 0,
//       element = $div('markers'),
//       type = ''
//   $.each(this.queue, function(){
//     console.log('***', this)
//     var marker = {}
//     if (this.slide.data.delay){
//       marker['type'] = 'delay'
//       marker['duration'] = this.slide.data.delay
//       total += marker.duration
//       markers.push(marker)
//     }
//     if (this.slide.data.speed){
//       marker['type'] = 'appear'
//       marker['duration'] = this.slide.data.speed
//       total += marker.duration
//       markers.push(marker)
//     }
//   })
//   // unit = D.getViewer().transport.parent().width() / total
//   $.each(markers, function(){
//     // offset = this * unit
//     width = Math.round((this.duration / total) * 100)
//     console.log(width, D.util.get('colors')[this.type])
//     // Add a marker element
//     $(element)
//       .append($div(false, 'marker')
//         .css('background', D.util.get('colors')[this.type])
//         .height(30)
//         .width(width + '%'))
//   })
//   $(D.getViewer().transport).append(element)
//   console.log('*****', markers)
// }
D.Slide.animate = function(){
  if (this.queue.length > 0){
    var target = this.queue.shift()
    // console.log('-- animate ->', target)
    target.slide.animate()
  } else {
    // console.log('slide finished all animations')
    $.each(this.data.layers, function(){
      // console.log('+', this)
      if (this.text){
        // D.getViewer().dialog.moveArrow()
        D.getViewer().renderDialog(this)
      }
    })
    // D.getViewer().slideFinished()
  }
}
D.Slide.init = function(){
  // console.log('new slide', this)
  this.layersRemaining = 0
  this.renderLayers()
}

D.Layer = {}
D.Layer.populate = function(){
  var layer = this
  this.imagesRemaining++
  // console.log('images remaining?', layer.imagesRemaining)
  layer.side = layer.data.side || 'left'
  $(this.slide.element)
    .append($(this.element)
      // move layer to correct side
      .css(layer.side, 0)
      .append($img(layer.data.data.src, layer.data.side, function(){
        if (layer.data.animated) $(layer.element).css(layer.side, -this.width)
        // signal slide object
        layer.imagesRemaining--
          // console.log('loaded image. remaining:', layer.imagesRemaining)
        if (layer.imagesRemaining === 0) layer.ready()
    }))
  )
  // auto-resizing per layer
  if (this.data.resize) {
    $(this.element).find('img').height($(D.getViewer().element).height() + 80)
  }
  // if (D.util.get('debug')){
    // var tooltip = $div(false, 'tooltip').text(layer.data.name),
        // offset = 10
    // $(D.Viewer.element).mousemove(function(e){
    //   $(tooltip).offset({top:e.pageY+offset, left:e.pageX+offset})
    // })
    // $(layer.element).append(tooltip)
  // }
}
D.Layer.pushAnim = function(){
  // Queue an array of animations for this layer
  var anim = []
  if (this.delay) anim.push({'delay': this.delay})
  if (this.speed) anim.push({'appear': this.speed})
  this.slide.queue.push({slide: this, data: anim})
}
D.Layer.highlight = function(){
  $(D.Viewer.element)
    .find('.layer').removeClass('active')
    .find('.highlight').remove()
  $(this.element).addClass('active').append($div(false, 'highlight'))
}
D.Layer.select = function(){
  // console.log('select')
  D.Viewer.updateLog()
  this.highlight()
}
D.Layer.animate = function(){
  // console.log('layer.animate()')
  // Set side to animate in from
  var layer = this
  var params = {}
  params[this.side] = 0
  $(this.element)
    .delay(this.data.delay || 0)
    .show()
    .animate(params, this.data.speed || D.util.get('transitionSpeed'), function(){
      layer.slide.animate()
    })
}
D.Layer.ready = function(){
  // console.log('layer ready')
  this.slide.layersRemaining--
  // console.log('slide layers remaining', this.slide.layersRemaining)
  if (this.slide.layersRemaining === 0) this.slide.ready()
}
D.Layer.init = function(){
  // var layer = this
  // console.log('new layer ->', this)
  this.isReady = false
  if (this.data.animated) this.pushAnim()
  this.imagesRemaining = 0
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
  this.index = D.getCurrentSlideshow().indexOf(this.slide)
  $.each(this.slide.layers, function(){
    // Create img and append to thumb
    $(thumb.element)
      .append($div(false, 'icon loader'))
      .append($img(this.data.src, this.side, function(){
        // Resize image to fill thumb
        thumb.resizeFill()
        $(thumb.element).find('.loader').remove()
        // Fade in gracefully
        $(this).hide().css('visibility', 'visible').fadeIn(D.util.get('transitionSpeed'))
      }).css('visibility', 'hidden'))
  })
  // this.deactivate()
}
// D.BinThumb.deactivate = function(){
//   var thumb = this
//   // console.log('deactivate ->', this)
//   // Attach listeners
//   $(this.element).removeClass('active')// .click(function(){ thumb.activate() })
//   // $(D.util.get('viewer')).find('.layer.' + this.layer.name).remove()
// }
D.BinThumb.activate = function(){
  // Set current slide to target
  var thumb = this
  D.setCurrentSlide(D.getCurrentSlideshow()[this.index])
  // console.log('activate ->', this, ':', D.getCurrentSlide())
  this.makeActive()
  // Add loader icon
  $(this.element).append($div(false, 'icon loader'))
  D.getViewer().loadCurrentSlide(function(){
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
  // console.log(this)
  $(this.element)
    .append($div(false, 'icon loader'))
    .append($img(this.img.src, '', function(){
      // Resize image to fill thumb
      thumb.resizeFill()
      $(thumb.element).find('.loader').remove()
      // Fade in gracefully
      $(this).hide().css('visibility', 'visible').fadeIn(D.util.get('transitionSpeed'))
    }).css('visibility', 'hidden'))
}

D.Dialog = {}
D.Dialog.count = 0
D.Dialog.wrapper = $div(false, 'dialogWrapper')
D.Dialog.element = $div(false, 'dialog')
D.Dialog.message = $div(false, 'message')
D.Dialog.arrow = $div(false, 'arrow')
D.Dialog.visible = false
D.Dialog.init = function(){
  $(this.wrapper)
    .append($(this.element)
      .append(this.message)
        .append(this.arrow))
  // console.log('--init dialog box')
}
D.Dialog.buildIn = function(){
  var dialog = this,
      params = {},
      offset = $(D.getViewer().element).find('img[src$="'+this.layer.data.src+'"]').width() / 2
  params[dialog.layer.side] = offset
  $(this.message).css('color', this.layer.color || D.util.get('textColor'))
  // console.log('build in', params)
  $(this.arrow)
    .css({left: 'auto', right: 'auto', top: -15})
    .css(params)
    .animate({
      'top': -30,
      'opacity': 1
    }, 100)
  this.timer = setInterval(function(){
    D.getViewer().dialog.appendLetter()
  }, 30)
}
D.Dialog.appendLetter = function(){
  // console.log('append letter.....')
  if (this.count < this.layer.text.length){
    $(this.message).text($(this.message).text() + this.layer.text[this.count])
    this.count++
  } else {
    clearInterval(this.timer)
    this.timer = setTimeout(function(){
      D.getViewer().slideFinished()
    }, D.getCurrentSlide().timeout || D.util.get('timeout'))
  }
}
D.Dialog.clear = function(){
  // console.log('--dialog: clear')
  $(this.arrow).animate({
    'top': -15,
    'opacity':0
    }, 100)
  clearInterval(this.timer)
  clearTimeout(this.timer)
  this.count = 0
  $(this.message).text('')
}
D.Dialog.popIn = function(){
  this.wrapperHeight = D.util.get('dialogWrapperHeight')
  $(this.wrapper)
    .height(this.wrapperHeight)
    .css('bottom', -this.wrapperHeight)
    .animate({
      bottom: -(this.wrapperHeight / 3.6)
    }, 1400, 'easeOutElastic', function(){
      // console.log('done')
    })
  this.visible = true
}

//////////////////////////// Helper functions
D.util.get = function(key){
  // Get variable or default
  if (D.options) {
    return D.options[key] ? D.options[key] : D.defaults[key]
  } else {
    return D.defaults[key]
  }
}
// D.util.processImagePaths = function(layer){
//   console.log('process:', layer)
//   $.each(D.getCurrentSlideshow(), function(){
//     this.url = (layer.data.src.startsWith('http')) ? layer.data.src : D.util.get('slideDir') + layer.data.src
//   })
// }
D.util.jsonPalettes = function(f){
  $.getJSON(D.util.get('jsonPath') + 'palettes', function(data)
  {
    // console.log('response from jsonPalettes', data)
    // Add thumbs to palette
    $.each(data, function()
    {
      // // Process each image url in palette
      // $.each(this.data, function(){
      //   console.log(this, this.src)
      //   D.util.processImagePaths(this)
      // })
      // console.log(this)
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
  var slideshow = D.util.get('slideshow')
  if (slideshow === undefined){
    D.util.jsonSlideshow()
  } else {
    D.setCurrentSlideshow(slideshow)
    // render slideshow assets
    D.util.renderSlideshow()
  }
  D.getViewer().play()
}
D.util.renderSlideshow = function(){
  // Iterate over all slides
  $.each(D.getCurrentSlideshow(), function(){
    // Create layers from slides
    $.each(this.layers, function(index){
      // D.util.processImagePaths(this)
      D.addLayer(this.name, this)
    })
    // Create bin thumbnail
    D.util.loadSlide(this)
  })
  // Create palettes
  D.util.loadPalettes()
  D.getCurrentBin()[0].activate()
  // console.log('slideshow loaded')
  if (D.options['editor']) D.getViewer().renderTransport()
}
D.util.jsonSlideshow = function(f){
  // Gets an array of slides
  $.getJSON(D.util.get('jsonPath') + 'slideshow', function(data){
    // console.log(data)
    D.setCurrentSlideshow(data)
    // render slideshow assets
    D.util.renderSlideshow()
  })
}
D.util.loadPalettes = function(layer){
  var assets = D.util.get('assets')
  if (assets === undefined){
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
  } else {
    $.each(assets, function()
    {
      D.appendPalettes(this)
    })
  }
}
D.util.addSlide = function(){
  D.totalSlides += 1
  // console.log('adding slide (', D.totalSlides, 'total)')
}
D.util.saveSlide = function(){
  // console.log('saving slide')
}
D.init = function(options){
  if (options) D.options = options
  //// Create markup
  // Create containers
    // D.layerPalette = new D.LayerPalette()
  // Insert elements
  var viewer = clone(D.Viewer)
  viewer.init()
  viewer.loop = true
  D.setViewer(viewer)
  $(D.util.get('container'))
    .append(viewer.element)
  if (D.options['editor'] == true){
    $(D.util.get('container'))
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
  }
  D.util.loadSlideshow()
  // console.log(D.getCurrentSlideshow())
  // D.getViewer().seek()
}
////////////////////////////
D.init({
  assets: FF.assets,
  slideshow: FF.slideshow,
  container: '#disgaea',
  dialogWrapperHeight: 130
  })
});

