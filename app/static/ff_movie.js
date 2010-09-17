var imagePath = 'img/'

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
    src: imagePath + 'trogkenswamps.jpg'
  },
  {
    name: 'hell',
    src: imagePath + 'knuckles.png'
  },
  {
    name: 'heaven',
    src: imagePath + 'big.png'
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
        speed: 1000
        // text: "Hello and welcome to Faxion News at "+localTime()+"."
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
        text: "............."
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
        side: 'left'
      },
      {
        name: 'heaven',
        data: FF.assets[2],
        side: 'right',
        text: "I forgot my line."
      }
    ]
  },
  
  {
    name: 'C',
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
        side: 'left'
      },
      {
        name: 'heaven',
        data: FF.assets[2],
        side: 'right'
      }
    ]
  },
]

