import web
from web.contrib.template import render_jinja
from forms import createSlideForm
import pdb
import json

render = render_jinja('templates/', encoding = 'utf-8')

urls = ('/', 'index',
       '/slide/create', 'createSlide',
       '/slide/show', 'showSlide',
       '/json/([A-Za-z]+)', 'jsonResponse')

app = web.application(urls, globals())

slides = []
bgThumbs = ['aberas.jpg', 'faustusestate.jpg', 'trogkenswamps.jpg']
charThumbs = ['devotress.png', 'dungeonarcher.png', 'illusionist.png', 
              'pangolan.png', 'pitfighter.png']

data = {
    'bgImg': [
    {
        'name': 'Aberas',
        'thumb': '_aberas.jpg',
        'src': 'aberas.jpg'
    },
    {
        'name': 'Da Swamp',
        'thumb': '_trogkenswamps.jpg',
        'src': 'trogkenswamps.jpg'
    },
    {
        'name': 'Faustus Estate',
        'thumb': '_faustusestate.jpg',
        'src': 'faustusestate.jpg'
    }],
    'charImg': [
    {
        'name': 'Sonic',
        'src': 'sonic.png'
    },
    {
        'name': 'Tails',
        'src': 'tails.png'
    },
    {
        'name': 'Knuckles',
        'src': 'knuckles.png'
    },
    {
        'name': 'Amy',
        'src': 'amy.png'
    },
    {
        'name': 'Shadow',
        'src': 'shadow.png'
    },
    {
        'name': 'Shade',
        'src': 'shade.png'
    },
    {
        'name': 'Dr. Robotnik',
        'src': 'robotnik.png'
    },
    {
        'name': 'Big',
        'src': 'big.png'
    }]
}

data['slideshow'] = [{
                    'name': 'Test Slide 1',
                    'layers': [
                        {
                            'name':  'bgImg',
                            'depth': 0,
                            'data':  data['bgImg'][0]
                        },
                        {
                            'name': 'charImg',
                            'depth': 1,
                            'delay': 1000,
                            'data': data['charImg'][0],
                            'animated': True,
                            'side': 'left',
                            'speed': 1000
                        },
                        {
                            'name': 'newLayer',
                            'depth': 3,
                            'data': data['charImg'][4],
                            'animated': True,
                            'side': 'right',
                            'speed': 500
                        }
                    ],
                    'text': "Hey, I'm a registered trademark of Sega Corp! I can't appear in this flick."
                },
                {
                    'name': 'Test Slide 2',
                    'layers': [
                        {
                            'name':  'bgImg',
                            'depth': 0,
                            'data':  data['bgImg'][1]
                        },
                        {
                            'name':  'charImg',
                            'depth': 2,
                            'data':  data['charImg'][2],
                            'side':  'right',
                            'animated': True,
                            'delay': 500,
                            'speed': 1000
                        }
                    ],
                    'text': "Wow, this guy needs to clean his desk. What a mess!"
                },
                {
                    'name': 'Test Slide 2',
                    'layers': [
                        {
                            'name':  'bgImg',
                            'depth': 0,
                            'data':  data['bgImg'][1]
                        },
                        {
                            'name':  'charImg',
                            'depth': 2,
                            'data':  data['charImg'][3],
                            'side':  'right',
                            'animated': True,
                            'delay': 1500,
                            'speed': 2000
                        }
                    ],
                    'text': "Is it lunch time yet?"
                }]

data['palettes'] = [{
                     'name': 'Backgrounds',
                     'data': data['bgImg']
                    },
                    {
                     'name': 'Characters',
                     'data': data['charImg']
                    }]


class index:
    def GET(self):
        return render.index(cache=False)

class createSlide:
    def GET(self):
        form = createSlideForm()
        context = {'slides':slides, 'bgThumbs':bgThumbs,
                   'charThumbs':charThumbs, 'form':form}
        return render.createSlide(context, cache=False)
    def POST(self):
        form = createSlideForm()
        context = {'slides':slides, 'bgThumbs':bgThumbs,
                   'charThumbs':charThumbs, 'form':form}
        if form.validates():
            slides.append(form.d)
            return render.createSlide(context, cache=False)
        else:
            return render.createSlide(context, cache=False)

class jsonResponse:
    def GET(self, kind):
        return json.dumps(data.get(kind))

if __name__ == "__main__": app.run()