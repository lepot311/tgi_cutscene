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

FF.slideshow = [
  {
    name: 'Intro',
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
        text: "Hello and welcome to Faxion News at "+localTime()+"."
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
        text: "We're reporting live from the Netherworld."
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
        text: "Tonight's Big Story: Fiber. Are you getting enough?"
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
      },
      {
        name: 'heaven',
        data: FF.assets[2],
        side: 'right',
        text: "A new study may surprise you."
      }
    ]
  },
]

