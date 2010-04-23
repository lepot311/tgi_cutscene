import web
from web.contrib.template import render_jinja
from forms import createSlideForm
import pdb

render = render_jinja('templates/', encoding = 'utf-8')

urls = ('/', 'index',
       '/slide/create', 'createSlide',
       '/slide/show', 'showSlide')

app = web.application(urls, globals())

slides = []
bgThumbs = ['aberas.jpg', 'faustusestate.jpg', 'trogkenswamps.jpg']
charThumbs = ['devotress.png', 'dungeonarcher.png', 'illusionist.png', 
              'pangolan.png', 'pitfighter.png']

class index:
    def GET(self):
        return render.index()

class createSlide:
    def GET(self):
        form = createSlideForm()
        context = {'slides':slides, 'bgThumbs':bgThumbs,
                   'charThumbs':charThumbs, 'form':form}
        return render.createSlide(context)
    def POST(self):
        form = createSlideForm()
        context = {'slides':slides, 'bgThumbs':bgThumbs,
                   'charThumbs':charThumbs, 'form':form}
        if form.validates():
            slides.append(form.d)
            return render.createSlide(context)
        else:
            return render.createSlide(context)

if __name__ == "__main__": app.run()