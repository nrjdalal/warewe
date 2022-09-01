const puppeteer = require('puppeteer')

const search = 'latest news'

const searcher = async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    // args: ['--window-size=1280,720'],
  })
  const context = await browser.createIncognitoBrowserContext()
  const page = await context.newPage()
  await page.setViewport({ width: 1280, height: 720 })
  await page.goto(`https://duckduckgo.com/?q=${search}&kl=us-en`)
  await page.waitForNavigation()

  try {
    const data = await page.$$eval('article>div>h2>a', (results) =>
      results.map((result) => {
        return { title: result.textContent, link: result.href }
      })
    )

    console.log(data)
  } catch {
    console.log('Something Went Wrong!')
  }

  await browser.close()
}

searcher()
