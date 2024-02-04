const PORT = process.env.PORT || 8000
const express = require('express')    
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        "name": 'thetimes',
        "address": 'https://www.thetimes.co.uk/environment/climate-change',
        "base": ''
    },

    {
        "name": 'guardian',
        "address": 'https://www.theguardian.com/environment/climate-crisis',
        "base": ''
    },

    {
        "name": 'telegraph',
        "address": 'https://www.telegraph.co.uk/climate-change/',
        "base": 'https://www.telegraph.co.uk'
    },

    {
        "name": 'climate.nasa.gov',
        "address": 'https://climate.nasa.gov/',
        "base": 'https://climate.nasa.gov'
    },

    {
        "name": 'climate.gov',
        "address": 'https://www.climate.gov/',
        "base": 'https://www.climate.gov'
    },

    {
        "name": 'ipcc.ch',
        "address": 'https://www.ipcc.ch/',
        "base": 'https://www.ipcc.ch'
    },
   
    {
        "name": 'nytimes.com',
        "address": 'https://www.nytimes.com/section/climate',
        "base": 'https://www.nytimes.com'
    },

    {
        "name": 'bbc.com',
        "address": 'https://www.bbc.com/news/science_and_environment',
        "base": 'https://www.bbc.com'
    },

    {
        "name": 'washingtonpost.com',
        "address": 'https://www.washingtonpost.com/climate-environment/',
        "base": 'https://www.washingtonpost.com'
    },

    {
        "name": 'nationalgeographic.com',
        "address": 'https://www.nationalgeographic.com/environment/climate-change/',
        "base": 'https://www.nationalgeographic.com'
    },

    {
        "name": 'climateaction.org',
        "address": 'https://www.climateaction.org/',
        "base": 'https://www.climateaction.org'
    },

    {
        "name": 'climatechange.org',
        "address": 'https://www.climatechange.org/',
        "base": 'https://www.climatechange.org'
    },

    {
        "name": 'climatechangenews.com',
        "address": 'https://www.climatechangenews.com/',
        "base": 'https://www.climatechangenews.com'
    },

    {
        "name": 'climatenewsnetwork.net',
        "address": 'https://climatenewsnetwork.net/',
        "base": 'https://climatenewsnetwork.net'
    },

    {
        "name": 'carbonbrief.org',
        "address": 'https://www.carbonbrief.org/',
        "base": 'https://www.carbonbrief.org'
    },

    {
        "name": 'climaticoanalysis.org',
        "address": 'https://www.climaticoanalysis.org/',
        "base": 'https://www.climaticoanalysis.org'
    },

    {
        "name": 'climatefeedback.org',
        "address": 'https://climatefeedback.org/',
        "base": 'https://climatefeedback.org'
    },  
]

const articles = []

newspapers.forEach(async newspaper => {
    try {
        const response = await axios.get(newspaper.address)
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = newspaper.base + $(this).attr('href')

            articles.push({
                title, 
                url,
                source: newspaper.name
            })
        })
    } catch (err) {
        console.log(err)
    }
})

app.get('/', (req,res) => {
    res.json('Welcome to my Climate Change NEWS API')
})

app.get('/news' , (req, res) => {
    res.send(articles)
})

app.get('/news/:newspaperId', async(req, res) => {
    const newspaperId = req.params.newspaperId 

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base
    
    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
