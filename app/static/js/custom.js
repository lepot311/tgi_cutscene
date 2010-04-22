$(document).ready(function() {
  var bg
  var c
  var d
  var direction
  var t
  // $('.dialog div').append(text)
  var textLength = 0
  var textSpeed = 30
  var transitionSpeed = 1000
  var currentSlideNum = -1
  var currentSlide
  var prevBg
  var imagePath = '/static/img/'
  //stylize form validation errors
  $('form .wrong').hide().prev('input').css('background-color', '#FFB8BA').css('border-color', '#FF444D')
  //bg listener
  $('#palette #bg .thumb').click(function(e){
    e.preventDefault()
    var t = $(e.target)
    $('form input#bg').val(t.attr('href'))
    $('.bg').stop().fadeTo(transitionSpeed, 0, function(){
      $(this).css('background-image', 'url('+imagePath+t.attr('href')+')').fadeTo(transitionSpeed, 1)
    })
  })
  //char listener
  $('#palette #char .thumb').click(function(e){
    e.preventDefault()
    var t = $(e.target)
    $('form input#img').val(t.attr('href'))
  })
  
  // $('.slide').click(function(){
  //       fadeSlide()
  //   })
  
  $('.thumb.slide').click(function(){
    var i = $(this).find('.title').text()
    runSlide(getSlide(parseInt(i-1)))
  })
  
  slides = []

  buildSlides()
  showDialogBox()
  runSlide(getSlide(0))

  function buildSlides(){
    $('.thumb.slide').each(function(){
      var n = $(this).find('.title').text()
      var bg = $(this).find('.bg').text()
      var c = $(this).find('.c').text()
      var d = $(this).find('.dialog').text()
      // console.log(n, bg, c, d)
      slides.push({
        'n': n,
        'bgImg': bg,
        'c': c,
        'd': d
        })
    })
    console.log(slides)
  }

  function stopSlide(slide){
    $(slide).find('.layer').stop()
  }

  function runSlide(slide){
      try {
        clearInterval(bt)
      } catch(e) {
        console.log(e)
      }
      bg = slide['bgImg']
      c = slide['charImg']
      d = slide['dialogImg']
      direction = slide['direction']
      text = slide['text']
      // console.log(text)
      animateBg(bg, transitionSpeed)
      animateChar(transitionSpeed, direction, c)
      textLength = 0
      var bt = setInterval(function(){buildText(text)}, textSpeed)
  }

  // function runNext(){
  //       try {
  //           runSlide(getNextSlide())
  //       } catch(e){
  //           console.log(e)
  //           alert('out of slids')
  //       }
  //   }
  
  function fadeSlide(){
      var d = $('.dialog div')
      d.fadeOut(transitionSpeed, function(){
          d.text('').show()
          $('.char').fadeOut(transitionSpeed, function(){
              runNext()
          })
      })
  }
  
  function getSlide(i){
    try {
      return slides[i] 
    } catch(e) {
      console.log(e)
    }
  }
  
  function getNextSlide(){
      currentSlideNum++
      // console.log('getNextSlide got '+currentSlideNum)
      currentSlide = slides[currentSlideNum]
      // console.log('current slide object: '+currentSlide)
      return currentSlide
  }
  
  function showDialogBox(){
    var d = $('.dialog')
    d.animate({
      bottom: 0
    }, transitionSpeed)
  }
  
  function animateBg(img, transitionSpeed){
      if (img != prevBg) {
          prevBg = img
          // console.log('previous bg was '+prevBg)
          $('.slide .bg').hide().css('background-image', 'url('+imagePath+bg+')').fadeIn(transitionSpeed)
      }
  }
  
  function animateChar(transitionSpeed, direction, c){
      ch = $('.char')
      // console.log('character on '+direction)
      //reset position
      ch.css('left', 'auto').css('right', 'auto')
      // console.log('char left: '+ch.css('left'))
      // console.log('char right: '+ch.css('right'))

      //set new starting position
      ch.css(direction, ch.width()*-1+'px')
      // console.log('char left: '+ch.css('left'))
      // console.log('char right: '+ch.css('right'))
      ch.css('background-image', 'url('+imagePath+c+')').show()
      if (direction == 'left') {
          ch.animate({
              left: 0
          }, transitionSpeed, 'swing')
      }
      else if (direction == 'right') {
          ch.animate({
              right: 0
          }, transitionSpeed, 'swing')
      }
  }
  function buildText(text) {
      if (textLength < text.length) {
          // console.log('buildText: '+textLength)
          textLength++
          $('.dialog div').text(text.slice(0, textLength))
      }
  }
});