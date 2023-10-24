const puppeteer = require("puppeteer");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require('./factories/userFactory')
const Page = require('./helpers/page')
let page;


beforeEach(async () => {
    page = await Page.build()
    await page.goto('http://localhost:3000')
})

afterEach(async () => {
    await page.close()
})

test('header should has the correct text', async () => {

    const text = await page.getContentsOf('a.brand-logo')

    expect(text).toEqual('Blogster')
})

test('clicking on login button', async () => {
    await page.click('.right a')
    const url = await page.url()
    expect(url).toMatch(/accounts\.google\.com/)
})

test('should show logout button when signed', async () => {
    await page.login()

    const text = await page.getContentsOf('a[href="/auth/logout"]')

    expect(text).toEqual('Logout')


}, 20000)