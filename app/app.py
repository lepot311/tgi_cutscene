import web
from forms import createSlideForm
import pdb

render = web.template.render('templates/')

urls = ('/', 'index',
       '/slide/create', 'createSlide',
       '/slide/show', 'showSlide')

app = web.application(urls, globals())

slides = []
bgThumbs = ['aberas.jpg', 'faustusestate.jpg', 'trogkenswamps.jpg']
charThumbs = ['devotress.jpg', 'dungeonarcher.jpg', 'illusionist.jpg', 
              'pangolan.jpg', 'pitfighter.jpg']

class index:
    def GET(self):
        return render.index()

class createSlide:
    def GET(self):
        form = createSlideForm()
        return render.createSlide(form, slides, bgThumbs, charThumbs)
    def POST(self):
        form = createSlideForm()
        if form.validates():
            slides.append(form.d)
            print slides
            return render.createSlide(form, slides, bgThumbs, charThumbs)
        else:
            return render.createSlide(form, slides, bgThumbs, charThumbs)

if __name__ == "__main__": app.run()