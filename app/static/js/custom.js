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
  var currentSlideNum
  var currentSlide
  var prevBg
  var imagePath = '/static/img/'

  $('#palette .thumb').click(function(){
    console.log(currentSlide)
  })

  //stylize form validation errors
  $('form .wrong').hide().prev('input').css('background-color', '#FFB8BA').css('border-color', '#FF444D')

  //bg listener
  $('#palette #bg .thumb').click(function(e){
    e.preventDefault()
    currentSlide.bgImg = $(this).attr('href')
    $('form input#bgImg').val(currentSlide.bgImg)
    $('#viewer .layer.bg').stop().fadeTo(transitionSpeed, 0, function(){
      $(this).css('background-image', 'url('+imagePath+currentSlide.bgImg+')').fadeTo(transitionSpeed, 1)
    })
    updateSlideBin()
    // // If successful, set bin thumbnail to match
    // getCurrentSlideBin().find('.thumb.bgImg').css('background-image', $(this).css('background-image'))
  })

  //char listener
  $('#palette #char .thumb').click(function(e){
    e.preventDefault()
    currentSlide.charImg = $(this).attr('href')
    $('form input#charImg').val(currentSlide.charImg)
    changeCharImg()
    updateSlideBin()
    // If successful, set bin thumbnail to match
    // getCurrentSlideBin().find('.thumb.charImg').css('background-image', $(this).css('background-image'))
  })
  
  //direction listener
  $('form select#direction').change(function(){
      currentSlide.direction = $(this).val()
      runSlide()
  })
  
  //dialog listener
  $('form #dialog').change(function(){
    currentSlide.dialog = $(this).val()
    runSlide()
  })
  
  // Bin listener
  $('#bin .slide').click(function(){
    if (!$(this).hasClass('active')){
      $('#bin .slide').removeClass('active')
      // $(this).addClass('active')
      var i = $(this).find('.title').text()
      setCurrentSlide(getSlide(i))
      runSlide()
    }
  })
  
  // Bin delete listener
  $('#bin .slide .delete').click(function(e){
    e.preventDefault()
    alert('Delete?')
  })
  
  function getCurrentSlideBin(){
    return $('#bin .slide#'+currentSlide.n)
  }

  function updateSlideBin(){
    getCurrentSlideBin().find('.thumb.bgImg').css('background-image', '_'+currentSlide.bgImg)
    getCurrentSlideBin().find('.thumb.charImg').css('background-image', '_'+currentSlide.charImg.slice(0, -3)+'jpg')
      // .find('.thumb.dialogImg').text(currentSlide.dialogImg)
      // .find('.thumb.direction').text(currentSlide.direction)
      // .find('.thumb.dialog').text(currentSlide.dialog)
  }
  
  function addSlide(n, bgImg, charImg, dialogImg, direction, dialog){
    slides.push({
      'n': n,
      'bgImg': bgImg,
      'charImg': charImg,
      'dialogImg': dialogImg,
      'direction': direction,
      'dialog': dialog
    })
  }

  function buildSlides(){
    $('#bin .slide').each(function(){
      var n = $(this).attr('id')
      var bgImg = $(this).find('.bgImg').text()
      var charImg = $(this).find('.charImg').text()
      var dialogImg = $(this).find('.dialogImg').text()
      var direction = $(this).find('.direction').text()
      var dialog = $(this).find('.dialog').text()
      addSlide(n, bgImg, charImg, dialogImg, direction, dialog)
    })
    console.log(slides)
  }

  function stopSlide(slide){
    $(slide).find('.layer').stop()
  }

  function runSlide(){
      // console.log('running slide: '+currentSlide.n)
      getCurrentSlideBin().addClass('active')
      clearInterval(bt)
      console.log('! '+currentSlide.bgImg)
      console.log('? '+getSlide(parseInt(currentSlide.n)-1).bgImg)
      if (currentSlide.bgImg != '') {
        if (!currentSlide.bgImg == getSlide(currentSlide.n-1).bgImg) {
          setBgImg()
          console.log('same bg?')
        } else {
          animateBg()
        }
      }
      animateChar()
      showDialogBox()
      if (currentSlide.dialog != undefined){
        textLength = 0
        var bt = setInterval(function(){
          if (textLength < currentSlide.dialog.length) {
            textLength++
            $('.dialog div').text(currentSlide.dialog.slice(0, textLength))
          } else {
            clearInterval(bt)
          }
        }, textSpeed)
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
  
  function setCurrentSlide(slide){
    currentSlide = slide
    $('form #bgImg').val(currentSlide.bgImg)
    $('form #charImg').val(currentSlide.charImg)
    $('form #dialogImg').val(currentSlide.dialogImg)
    $('form #direction').val(currentSlide.direction)
    $('form #dialog').val(currentSlide.dialog)
  }
  
  function getSlide(i){
    if (slides[i-1] == undefined){
      console.log("Oops! Slide undefined")
      return false
    } else {
      return slides[i-1]
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
    $('.dialogWrapper').animate({
      bottom: 0
    }, transitionSpeed)
  }
  
  function setBgImg(){
    $('#viewer .layer.bg').css('background-image', 'url('+imagePath+currentSlide.bgImg+')')
  }
  
  function animateBg(){
    $('#viewer .layer.bg').hide()
    setBgImg()
    $('#viewer .layer.bg').fadeTo(transitionSpeed, 1)
  }
  
  function setCharImg(){
    // Sets background-image property of character layer in viewer.
    // Returns the character layer as a jQuery object
    charImgBase = currentSlide.charImg.slice(0, currentSlide.charImg.length-4)
    $('#viewer .layer.char').css('background-image', 'url('+imagePath+charImgBase+'_'+currentSlide.direction+'.png)')
  }
  
  function changeCharImg(){
    // Fade in and out
    $('#viewer .layer.char').stop().fadeTo(transitionSpeed, 0, function(){
      setCharImg()
      $(this).fadeTo(transitionSpeed, 1)
    })
  }
  
  function animateChar(){
      // console.log('character on '+currentSlide.direction)
      //reset position
      $('#viewer .layer.char').stop().css('left', 'auto').css('right', 'auto')
      // console.log('char left: '+ch.css('left'))
      // console.log('char right: '+ch.css('right'))

      //set new starting position
      $('#viewer .layer.char').css(currentSlide.direction, $('#viewer .layer.char').width()*-1+'px')
      setCharImg()
      // console.log('char left: '+ch.css('left'))
      // console.log('char right: '+ch.css('right'))
      if (currentSlide.direction == 'left') {
          $('#viewer .layer.char').animate({
              left: 0
          }, transitionSpeed, 'swing')
      }
      else if (currentSlide.direction == 'right') {
          $('#viewer .layer.char').animate({
              right: 0
          }, transitionSpeed, 'swing')
      }
  }
  function buildText(text) {
    console.log('in buildText()')
    if (textLength < text.length) {
      // console.log('buildText: '+textLength)
      textLength++
      $('.dialog div').text(text.slice(0, textLength))
    }
  }
  
  slides = []

  buildSlides()
  if (!getSlide(1)) {
    console.log('No slides exist') //let's make one
    var n = 1
    var bgImg = ''
    var charImg = ''
    var dialogImg = ''
    var direction = 'left'
    var dialog = ''
    addSlide(n, bgImg, charImg, dialogImg, direction, dialog)
    console.log('-Created initial slide')
  }
  setCurrentSlide(getSlide(1))
  runSlide()
});