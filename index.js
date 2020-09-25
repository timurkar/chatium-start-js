const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

require('dotenv').config()

const {
    screenResponse, apiCallResponse,
    navigate, apiCall, copyToClipboard, refresh,
    Screen, Text, Button, Image, ListItem
} = require('@chatium/json')

const { chatiumPost, getChatiumContext, triggerHotReload } = require('@chatium/sdk')

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))

app.get('/', async (req, res) => res.json(
    screenResponse({ data: await Screen({ title: 'New Application' }, [
        Text({ text: 'Это наш новый функционал' }),
        Button({ title: 'Нажми меня', onClick: navigate( "https://ya.ru" ) }),
    ])})
))




const listen = (app, port) => app.listen(port, '0.0.0.0', () => {
    console.log(`Listening at port :${port}`)
})

if (process.env.NODE_ENV === 'development') {
    const fs = require('fs')

    fs.readFile('vendor/index.html', 'utf8', function(err, data) {
        const index = data.replace('~~API_SECRET~~', process.env.API_SECRET)

        const vendor = express()
        vendor.use(cors())

        vendor.get('/', (req, res) => res.send(index))
        vendor.use(express.static('vendor'))
        vendor.get('*', (req, res) => res.send(index))

        listen(vendor, 5000)
    })
}

console.log(``)
console.log(`Application started:`)
const port = process.env.PORT || 5050
app.listen(port, '0.0.0.0', () => {
    console.log(`Listening at port :${port}`)
    triggerHotReload(appCtx).catch(err => console.log('triggerHotReload error:', err));
})
console.log(``)
console.log(`   APP_ENDPOINT = ${process.env.APP_ENDPOINT ? process.env.APP_ENDPOINT : 'undefined (setup .env file)'}`)
console.log(`        API_KEY = ${process.env.API_KEY ? process.env.API_KEY : 'undefined (setup .env file)'}`)
console.log(`     API_SECRET = ${process.env.API_SECRET ? process.env.API_SECRET.slice(0, 10) + 'xXxXxXxXxXxXxXxXxXxXxX' : 'undefined  (setup .env file)'}`)
console.log(``)

const fs = (hash, size = '100x100') => `https://fs.chatium.io/fileservice/file/thumbnail/h/${hash}/s/${size}`

const appCtx = {
    app: {
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET,
    }
}

function getContext(req) {
  return getChatiumContext(appCtx, req.headers)
}
