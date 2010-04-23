from web import form
# from app import bgThumbs, charThumbs

createSlideForm = form.Form(
    form.Textbox('bgImg', form.notnull),
    form.Textbox('charImg', form.notnull),
    form.Textbox('dialogImg'),
    form.Dropdown('direction', [('left', 'left'), ('right', 'right')]),
    form.Textbox('dialog', form.notnull),
    form.Button('Save')
)