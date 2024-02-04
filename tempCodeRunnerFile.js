const PORT = 8000
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
        "name": 'climatecentral.org',
        "address": 'https://www.climatecentral.org/',
        "base": 'https://www.climatecentral.org'
    },
    {
        "name": 'climatenexus.org',
        "address": 'https://climatenexus.org/',
        "base": 'https://climatenexus.org'
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
        "name": 'insideclimatenews.org',
        "address": 'https://insideclimatenews.org/',
        "base": 'https://insideclimatenews.org'
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
        "name": 'climateinteractive.org',
        "address": 'https://www.climateinteractive.org/',
        "base": 'https://www.climateinteractive.org'
    },

    {
        "name": 'climatefeedback.org',
        "address": 'https://climatefeedback.org/',
        "base": 'https://climatefeedback.org'
    },

    {
        "name": 'climateone.org',
        "address": 'https://climateone.org/',
        "base": 'https://climateone.org'
    },

    {
        "name": 'climateoutreach.org',
        "address": 'https://climateoutreach.org/',
        "base": 'https://climateoutreach.org'
    },

    {
        "name": 'climaterealityproject.org',
        "address": 'https://www.climaterealityproject.org/',
        "base": 'https://www.climaterealityproject.org'
    },

    {
        "name": 'climatecommunication.org',
        "address": 'https://www.climatecommunication.org/',
        "base": 'https://www.climatecommunication.org'
    },

    {
        "name": 'climateinstitute.org.au',
        "address": 'https://www.climateinstitute.org.au/',
        "base": 'https://www.climateinstitute.org.au'
    },

    {
        "name": 'climatehome.org',
        "address": 'https://www.climatehome.org/',
        "base": 'https://www.climatehome.org'
    },

    {
        "name": 'climatenetwork.org',
        "address": 'https://climatenetwork.org/',
        "base": 'https://climatenetwork.org'
    },

    {
        "name": 'climateadaptationplatform.com',
        "address": 'https://climateadaptationplatform.com/',
        "base": 'https://climateadaptationplatform.com'
    },

    {
        "name": 'climatechangeconnection.org',
        "address": 'https://climatechangeconnection.org/',
        "base": 'https://climatechangeconnection.org'
    }
    
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
