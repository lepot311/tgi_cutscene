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
        'name': 'Devotress',
        'thumb': '_devotress.jpg',
        'src': 'devotress.png'
    },
    {
        'name': 'Pangolan',
        'thumb': '_pangolan.jpg',
        'src': 'pangolan.png'
    },
    {
        'name': 'Illusionist',
        'thumb': '_illusionist.jpg',
        'src': 'illusionist.png'
    },
    {
        'name': 'Pitfighter',
        'thumb': '_pitfighter.jpg',
        'src': 'pitfighter.png'
    },
    {
        'name': 'Dungeon Archer',
        'thumb': '_dungeonarcher.jpg',
        'src': 'dungeonarcher.png'
    }]
}

data['slide'] = [{
                    'name': 'Test Slide 1',
                    'layers': [
                        {
                            'name': 'bgImg',
                            'data': data['bgImg'][0]
                        },
                        {
                            'name': 'charImg',
                            'data': data['charImg'][0]
                        }
                    ]
                },
                {
                    'name': 'Test Slide 2',
                    'layers': [
                        {
                            'name': 'bgImg',
                            'data': data['bgImg'][1]
                        },
                        {
                            'name': 'charImg',
                            'data': data['charImg'][0]
                        }
                    ]
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