var themePath = '/sites/all/themes/faxion/',
    imagePath = themePath + 'img/',
    jsImgPath = themePath + 'js/tgi_cutscene/img/'

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

FF.slideshow = [
  {
    name: 'Intro',
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
        speed: 1000
      },
      {
        name: 'heaven',
        data: FF.assets[2],
        side: 'right',
        animated: true,
        speed: 1000,
        text: "Hello and welcome to Faxion News at 8."
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

