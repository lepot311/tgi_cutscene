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
  {
    name: 'an overlay',
    fill: {
      opacity: 0.8,
      color: '#333333'
    }
  }
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
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut erat tellus, ac pulvinar elit. Morbi ultrices metus vel magna convallis id tempor enim cursus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut erat tellus, ac pulvinar elit. Morbi ultrices metus vel magna convallis id tempor enim cursus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut erat tellus, ac pulvinar elit. Morbi ultrices metus vel magna convallis id tempor enim cursus."
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
          text: "............."
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
    timeout: 4000,
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
        dialog: {
          text: "I forgot my line."
        }
      }
    ]
  },
  
  {
    name: 'Background test',
    timeout: 4000,
    layers: [
      {
        name: 'Newsroom A',
        data: FF.assets[0]
      },
      {
        name: 'heaven',
        data: FF.assets[2],
        side: 'right'
      },
      {
        name: 'overlay',
        data: FF.assets[3]
      },
      {
        name: 'hell',
        data: FF.assets[1],
        side: 'left',
        dialog: {
          style: 'cinematic',
          text: 'When he said that, I knew something had to be amiss.. He NEVER forgets his lines.'
        }
      }
    ]
  },
  
  {
    name: 'C',
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
  
  {
    name: 'D',
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
        dialog: {
          text: "OOPS!"
        }
      },
      {
        name: 'heaven',
        data: FF.assets[2],
        side: 'right'
      }
    ]
  }
]

