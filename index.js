const puppeteer = require('puppeteer')
const fs = require('fs')
const iPhone = puppeteer.devices['iPhone 8']
const BASE_URL = 'https://codepen.io/'

const scrap = async ({user}) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.emulate(iPhone)

  let codepenCoders = []

  const getPageData = async () => {
    await page.goto(`${BASE_URL}${user}`)
    await page.screenshot({
      path: `screenshots/${user}.png`,
      fullPage: true
    })
    const data = await page.evaluate(() => {
      const name = document.querySelector('#profile-name-header').textContent
      const avatar = document.querySelector('#profile-image').src
      const followers = document.querySelector('#followers-count').textContent
      const bio = document.querySelector('#profile-bio').textContent
      const isPro = !!document.querySelector('#profile-badge-pro')

      return {
        name,
        avatar,
        followers,
        bio,
        isPro
      }
    })
    codepenCoders = [...codepenCoders, data]
    fs.writeFile('codepenCoders.js', JSON.stringify(codepenCoders), () => {
      console.log('CodePen Coders writed 😊')
    })
    await browser.close()
  }

  getPageData()
}

scrap({user: 'nucliweb'})
