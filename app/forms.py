from web import form
# from app import bgThumbs, charThumbs

createSlideForm = form.Form(
    form.Textbox('bg', form.notnull),
    form.Textbox('img', form.notnull),
    form.Textbox('dialog', form.notnull),
    form.Button('Add slide')
)