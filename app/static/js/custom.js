$(document).ready(function() {
  //stylize form validation errors
  $('form .wrong').hide().prev('input').css('background-color', '#FFB8BA').css('border-color', '#FF444D')
  //bg listener
  $('#palette #bg .thumb').click(function(e){
    e.preventDefault()
    var t = $(e.target)
    $('form input#bg').val(t.attr('href'))
  })
  //char listener
  $('#palette #char .thumb').click(function(e){
    e.preventDefault()
    var t = $(e.target)
    $('form input#img').val(t.attr('href'))
  })
  
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
  $('.slide').click(function(){
      fadeSlide()
  })
  
  slides = [
    {'bgImg':'aberas.jpg',
     'charImg':'devotress.png',
     'dialogImg':'d2.jpg',
     'direction':'left',
     'text':'I dare say that you be right, Hermogenes: let us see;- Your meaning is, that the name of each thing is only that which anybody agrees to call it?'},
    {'bgImg':'aberas.jpg',
     'charImg':'devotress.png',
     'dialogImg':'d2.jpg',
     'direction':'right',
     'text':'That is my notion.'},
    {'bgImg':'aberas.jpg',
     'charImg':'devotress.png',
     'dialogImg':'d2.jpg',
     'direction':'left',
     'text':'Whether the giver of the name be an individual or a city?'},
    {'bgImg':'aberas.jpg',
     'charImg':'devotress.png',
     'dialogImg':'d2.jpg',
     'direction':'right',
     'text':'Yes'},
        
  ]

  showDialogBox()
  runNext()

  function runNext(){
      try {
          runSlide(getNextSlide())
      } catch(e){
          console.log(e)
          alert('out of slids')
      }
  }

  function fadeSlide(){
      var d = $('.dialog div')
      d.fadeOut(transitionSpeed, function(){
          d.text('').show()
          $('.char').fadeOut(transitionSpeed, function(){
              runNext()
          })
      })
  }
  
  function getNextSlide(){
      currentSlideNum++
      console.log('getNextSlide got '+currentSlideNum)
      currentSlide = slides[currentSlideNum]
      console.log('current slide object: '+currentSlide)
      return currentSlide
  }
  
  function showDialogBox(){
    var d = $('.dialog')
    d.animate({
      bottom: 0
    }, transitionSpeed)
  }
  
  function runSlide(currentSlide){
      bg = currentSlide['bgImg']
      c = currentSlide['charImg']
      d = currentSlide['dialogImg']
      direction = currentSlide['direction']
      text = currentSlide['text']
      console.log(text)
      animateBg(bg, transitionSpeed)
      animateChar(transitionSpeed, direction, c)
      textLength = 0
      var bt = setInterval(function(){buildText(text)}, textSpeed)
  }
  
  function animateBg(img, transitionSpeed){
      if (img != prevBg) {
          prevBg = img
          console.log('previous bg was '+prevBg)
          $('.bg').hide().css('background-image', 'url('+imagePath+bg+')').fadeIn(transitionSpeed)
      }
  }
  
  function animateChar(transitionSpeed, direction, c){
      ch = $('.char')
      console.log('character on '+direction)
      //reset position
      ch.css('left', 'auto').css('right', 'auto')
      console.log('char left: '+ch.css('left'))
      console.log('char right: '+ch.css('right'))

      //set new starting position
      ch.css(direction, ch.width()*-1+'px')
      console.log('char left: '+ch.css('left'))
      console.log('char right: '+ch.css('right'))
      ch.css('background-image', 'url('+imagePath+c+')').show()
      if (direction == 'left') {
          ch.animate({
              left: 0
          }, transitionSpeed, 'swing')
      }
      if (direction == 'right') {
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