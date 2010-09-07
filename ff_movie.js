var themePath = '/sites/all/themes/faxion/',
    imagePath = themePath + 'img/',
    jsImgPath = themePath + 'js/tgi_cutscene/img/'

FF = {}
FF.assets = [
  {
    name: 'Faxion News Studio A',
    src: imagePath + 'fax_news_bg1.jpg'
  },
  {
    name: 'Sonic',
    src: jsImgPath + 'sonic.png'
  },
  {
    name: 'Amy',
    src: jsImgPath + 'amy.png'
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
        name: 'Sonic',
        data: FF.assets[1],
        resize: true,
        side: 'left'
      },
      {
        name: 'Amy',
        data: FF.assets[2],
        resize: true,
        side: 'right',
        text: "Hello and welcome to Faxion News at 8. I'm Amy the Cat."
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
        name: 'Sonic',
        data: FF.assets[1],
        resize: true,
        side: 'left',
        text: "And I'm Sonic the Hedgehog, reporting live from the Netherworld."
      },
      {
        name: 'Amy',
        data: FF.assets[2],
        resize: true,
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
        name: 'Sonic',
        data: FF.assets[1],
        resize: true,
        side: 'left',
        text: "Tonight's Big Story: Fiber. Are you getting enough? Results of a new study may surprise you."
      },
      {
        name: 'Amy',
        data: FF.assets[2],
        resize: true,
        side: 'right'
      }
    ]
  },
]

console.log('FF', FF)