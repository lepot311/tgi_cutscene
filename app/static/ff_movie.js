var themePath = '/sites/all/themes/faxion/',
    imagePath = themePath + 'images/',
    jsImgPath = themePath + 'js/tgi_cutscene/img/'

function localTime(){
  var d = new Date(),
      hour = d.getHours()
  if (hour > 12){
    hour -= 12
  }
  return hour
}

FF = {}
FF.assets = [
  {
    name: 'Faxion News Studio B',
    src: imagePath + 'fax_news_bg2.jpg'
  },
  {
    name: 'hell',
    src: imagePath + 'chars/hell_male.png'
  },
  {
    name: 'heaven',
    src: imagePath + 'chars/heaven_fem.png'
  },
]

FF.transitions = {
  fadeIn: {
    opacity: 1
  },
  fadeOut: {
    opacity: 0
  }
}

FF.slideshow = [
  {
    name: 'Intro',
    transition: {
      In: {
        effect: FF.transitions.fadeIn,
        speed: 1000,
        pre: {
          opacity: 0
        }
      }
    },
    layers: [
      {
        name: 'Newsroom A',
        data: FF.assets[0]
      },
      {
        name: 'heaven',
        data: FF.assets[2],
        side: 'right',
        animated: true,
        speed: 1000,
        dialog: {
          text: "Hello and welcome to Faxion News at "+localTime()+"."
        }
      }
    ]
  },
  
  {
    name: 'A',
    layers: [
      {
        name: 'Newsroom A',
        data: FF.assets[0]
      },
      {
        name: 'hell',
        data: FF.assets[1],
        side: 'left',
        animated: true,
        speed: 1000,
        dialog: {
          text: "We're reporting live from the Netherworld."
        }
      },
      {
        name: 'heaven',
        data: FF.assets[2],
        side: 'right'
      }
    ]
  },
  
  {
    name: 'B',
    layers: [
      {
        name: 'Newsroom A',
        data: FF.assets[0]
      },
      {
        name: 'hell',
        data: FF.assets[1],
        side: 'left',
        dialog: {
          text: "Tonight's Big Story: Fiber. Are you getting enough?"
        }
      },
      {
        name: 'heaven',
        data: FF.assets[2],
        side: 'right'
      }
    ]
  },
  
  {
    name: 'B',
    transition: {
      Out: {
        effect: FF.transitions.fadeOut,
        speed: 1000
      }
    },
    layers: [
      {
        name: 'Newsroom A',
        data: FF.assets[0]
      },
      {
        name: 'hell',
        data: FF.assets[1],
        side: 'left',
      },
      {
        name: 'heaven',
        data: FF.assets[2],
        side: 'right',
        dialog: {
          text: "A new study may surprise you."
        }
      }
    ]
  },
]

