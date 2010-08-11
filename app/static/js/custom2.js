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
  
  jsonLayer: function(layer)
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
              // Cache the thumbnail for callback
              var thumb = $(this)
              // Remove all icons from thumbnail
              thumb.find('.icon').remove()
              // Add loader icon
              thumb.append($div(false, 'icon loader'))
              // Refresh the viewer layer and callback when finished
              DISGAEA.refreshLayer($(DISGAEA.get('viewer')).find('.layer.'+layer), $(this).attr('href'), function(){
                thumb.find('.loader').remove()
                thumb.append($div(false, 'icon delete'))
              })
            }))
      })
    })
  },
  
  refreshLayer: function(layer, src, f)
  {
    // console.log('refreshing', layer, src)
    $(layer).stop().fadeTo(DISGAEA.get('transitionSpeed'), 0, function()
    {
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
    // console.log(slide)
    var thumb = $div(false, 'slide').hide()
    $.each(slide.layers, function()
    {
      $(thumb).append($img(DISGAEA.get('slideDir') + this.data.src))
    })
    $(DISGAEA.get('bin')).append(thumb)
    $(thumb).fadeIn()
  },

  loadSlide: function(data)
  {
    // console.log('loading slide "', data.name, '"')
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
    $.each(DISGAEA.currentSlideshow[0].layers, function(){
      // Refresh each layer in slide
      DISGAEA.refreshLayer($(DISGAEA.get('viewer')).find('.'+this.name), this.data.src)
    })
    // Add "active" class to first bin slide
    $(DISGAEA.get('bin')).find('.slide:first').addClass('active')
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
    
    
    
    
    // Load test slide
    DISGAEA.jsonSlideshow()
  }
  
}

DISGAEA.init()

});
