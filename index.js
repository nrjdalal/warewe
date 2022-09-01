import puppeteer from 'puppeteer'
import express from 'express'
const app = express()
const port = 3000

const searcher = async (search) => {
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

    return data
  } catch {
    console.log('Something Went Wrong!')
  }

  await browser.close()
}

app.get('/', function async(req, res) {
  searcher(req.query.q).then((data) =>
    res.status(200).json({ meta: { query: req.query.q, info: 'DuckDuckGo Top 10 Organic Search Results' }, data })
  )
})

app.listen(port, () => {
  console.log(`Searcher is listening on port ${port}`)
})
