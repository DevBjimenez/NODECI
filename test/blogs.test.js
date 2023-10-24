const Page = require("./helpers/page");
let page;

beforeEach(async () => {
    page = await Page.build()
    await page.goto('http://localhost:3000')
})

afterEach(async () => {
    await page.close()
})



describe('When logged in', async () => {
    beforeEach(async () => {
        await page.login()
        await page.click('a.btn-floating')
    })

    afterEach(async () => {
        await page.close()
    })

    test('should show the blog create form', async () => {
        const label = await page.getContentsOf('form label')
        expect(label).toEqual('Blog Title')
    })

    describe('and using valid input', () => {
        beforeEach(async () => {
            await page.type('.title input', 'Title')
            await page.type('.content input', 'Content')
            await page.click('form button')
        })

        afterEach(async () => {
            await page.close()
        })

        test('should confirmation page', async () => {
            const text = await page.getContentsOf('h5')
            expect(text).toEqual('Please confirm your entries')
        })

        test('should show the blog when is submited', async () => {
            await page.click('button.green')
            await page.waitFor('.card')
            const title = await page.getContentsOf('.card-title')
            const content = await page.getContentsOf('p')

            expect(title).toEqual('Title')
            expect(content).toEqual('Content')
        })
    })


    describe('And usin invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button')
        })

        afterEach(async () => {
            await page.close()
        })

        test('should show error messages when inputs are empty', async () => {
            const titleError = await page.getContentsOf('.title .red-text')
            const contentError = await page.getContentsOf('.content .red-text')

            expect(titleError).toMatch(/you must provide a value/i)
            expect(contentError).toMatch(/you must provide a value/i)
        })
    })


})

describe('User is not logged in', async () => {
    test('should not create blog post', async () => {
        const result = await page.post('/api/blogs',)
        expect(result).toEqual({ error: 'You must log in!' })
    })

    test('should not get blog post list', async () => {
        const result = await page.get('/api/blogs')
        expect(result).toEqual({ error: 'You must log in!' })
    })

    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
        },
        {
            method: 'post',
            path: '/api/blogs',
            data: { title: 'Refactor title', content: 'Content refactor' }
        }
    ]

    test('should tese all actions method', async () => {
        const results = await page.execRequest(actions)

        for (let result of results) {
            expect(result).toEqual({ error: 'You must log in!' })
        }
    })
})