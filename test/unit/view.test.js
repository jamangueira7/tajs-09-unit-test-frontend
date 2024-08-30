import { describe, it, jest, expect, beforeEach } from '@jest/globals'
import View from '../../public/src/view.js'

describe('View test suite', () => {

    beforeEach(() => {
        document.body.innerHTML = ``
    })

    it('#updateList should append content to card-list innerHTML', () => {
        const innerHTMLSpy = jest.fn()
        const baseHTML = '<div></div>'
        const querySelectorProxy = new Proxy({
            innerHTML: baseHTML
        }, {
            set(obj, key, value) {
                obj[key] = value
                
                innerHTMLSpy(obj[key])

                return true
            }
        })

        jest
        .spyOn(document, document.querySelector.name)
        .mockImplementation((key) => {
            if(key !== '#card-list') return;

            return querySelectorProxy
        })

        const view = new View()
        const data = {
            title: 'title',
            imageUrl: 'https://img.com/img.png'
        }

        const generatedContent =  `
        <article class="col-md-12 col-lg-4 col-sm-3 top-30">
                <div class="card">
                    <figure>
                        <img class="card-img-top card-img"
                            src="${data.imageUrl}"
                            alt="Image of an ${data.title}">
                        <figcaption>
                            <h4 class="card-title">${data.title}</h4>
                        </figcaption>
                    </figure>
                </div>
            </article>
        `

        view.updateList([data])

        expect(innerHTMLSpy).toHaveBeenNthCalledWith(
            1,
            baseHTML + generatedContent
        )

        view.updateList([data])

        expect(innerHTMLSpy).toHaveBeenNthCalledWith(
            2,
            baseHTML + generatedContent + generatedContent
        )

    })

    it('#initialize should initialize and listen to events on the form', () => {
        document.body.innerHTML = `
                <form class="needs-validation">
                    <input name="title" required />
                    <input name="imageUrl" required />
                    <button type="submit">Submit</button>
                </form> 
            `;

        const view = new View();
        const forms = document.querySelectorAll('.needs-validation');
        
        const addEventListenerSpy = jest.spyOn(forms[0], 'addEventListener');
        
        view.initialize();
        const classSpy = jest.spyOn(forms[0].classList, 'add')

        const submitEvent = new Event("submit", { bubbles: true})
        forms[0].dispatchEvent(submitEvent)

        expect(addEventListenerSpy).toHaveBeenCalledWith('submit', expect.any(Function), false);
        expect(classSpy).toHaveBeenNthCalledWith(
            1,
            'was-validated'
        )
    });

    it('#initialize should initialize and remove class validation', () => {
        document.body.innerHTML = ` 
                <form class="needs-validation">
                    <input id="title" class="title" required />
                    <input name="imageUrl" required />
                    <button type="submit">Submit</button>
                </form>
        `
        
        const view = new View();

        let forms = document.querySelectorAll('.needs-validation')

        const addEventListenerSpy = jest.spyOn(forms[0], 'addEventListener')
        
        jest.spyOn(forms[0], 'checkValidity').mockReturnValue(true)

        const classSpy = jest.spyOn(forms[0].classList, 'remove')
        view.initialize();

        const submitEvent = new Event("submit", { bubbles: true })
        forms[0].dispatchEvent(submitEvent)

                expect(addEventListenerSpy).toHaveBeenCalledWith('submit', expect.any(Function), false);
        expect(classSpy).toHaveBeenCalled()
    });

    it('#configureOnSubmit should call this function', () => {
        const view = new View()
        const data = {
            title: 'title',
            imageUrl: 'https://img.com/img.png'
        }

        view.initialize();
        const classSpy = jest.spyOn(view, 'configureOnSubmit')
        view.configureOnSubmit(data)

        expect(classSpy).toHaveBeenCalled()
    });
})