const express = require('express')
const router = express.Router()
const jokes = require('../../jokes.json')
const Users = require('../../model/Users')

router.get('/', async (req, res) => {
  const apikey = req.headers.apikey

  if (apikey === undefined || apikey === '') {
    return res.status(401).json({ msg: 'API key not provided' })
  }

  const user = await Users.findOne({ apikey })

  if (!user) {
    return res.status(400).json({ msg: 'Invalid API key' })
  }

  let { category, type, blacklistFlags, safe } = req.query

  if (safe !== undefined) {
    if (safe === 'true') {
      safe = true
    } else if (safe === 'false') {
      safe = false
    }
  }

  const flags = {
    nsfw: true,
    religious: true,
    political: true,
    racist: true,
    sexist: true,
    explicit: true,
  }

  let categories = []

  if (category !== undefined) {
    categories = category.split(',')
  }

  if (blacklistFlags !== undefined) {
    const blacklistFlagsArray = blacklistFlags.split(',')

    blacklistFlagsArray.map((flag) => {
      if (flag === 'nsfw') {
        flags.nsfw = false
      } else if (flag === 'religious') {
        flags.religious = false
      } else if (flag === 'political') {
        flags.political = false
      } else if (flag === 'racist') {
        flags.racist = false
      } else if (flag === 'sexist') {
        flags.sexist = false
      } else if (flag === 'explicit') {
        flags.explicit = false
      }
    })
  }

  const filteredJoke = jokes
    .filter((joke) => {
      if (category !== undefined) {
        return categories.includes(joke.category)
      } else {
        return true
      }
    })
    .filter((joke) => {
      if (type !== undefined) {
        return joke.type === type
      } else {
        return joke
      }
    })
    .filter((joke) => {
      if (safe !== undefined) {
        return joke.safe === safe
      } else {
        return joke
      }
    })
    .filter((joke) => {
      if (blacklistFlags !== undefined) {
        return joke.flags.nsfw === flags.nsfw &&
          joke.flags.religious === flags.religious &&
          joke.flags.political === flags.political &&
          joke.flags.racist === flags.racist &&
          joke.flags.sexist === flags.sexist &&
          joke.flags.explicit === flags.explicit
          ? joke
          : undefined
      } else {
        return joke
      }
    })

  const newJokes = {
    length: filteredJoke.length,
    type: type === undefined ? 'any' : type,
    blacklist_flags:
      blacklistFlags === undefined ? 'no blacklist flags' : blacklistFlags,
    safe: safe === undefined ? 'any' : false,
    content: filteredJoke,
  }

  res.status(200).json(newJokes)
})

router.get('/randomJoke', async (req, res) => {
  const apikey = req.headers.apikey

  const user = await Users.findOne({ apikey })

  if (!user) {
    return res.status(404).json({ msg: 'invalid apikey' })
  }

  let { category, type, blacklistFlags, safe } = req.query

  if (safe !== undefined) {
    if (safe === 'true') {
      safe = true
    } else if (safe === 'false') {
      safe = false
    }
  }

  const flags = {
    nsfw: true,
    religious: true,
    political: true,
    racist: true,
    sexist: true,
    explicit: true,
  }

  let categories = []

  if (category !== undefined) {
    categories = category.split(',')
  }

  if (blacklistFlags !== undefined) {
    const blacklistFlagsArray = blacklistFlags.split(',')

    blacklistFlagsArray.map((flag) => {
      if (flag === 'nsfw') {
        flags.nsfw = false
      } else if (flag === 'religious') {
        flags.religious = false
      } else if (flag === 'political') {
        flags.political = false
      } else if (flag === 'racist') {
        flags.racist = false
      } else if (flag === 'sexist') {
        flags.sexist = false
      } else if (flag === 'explicit') {
        flags.explicit = false
      }
    })
  }

  const filteredJoke = jokes
    .filter((joke) => {
      if (category !== undefined) {
        return categories.includes(joke.category)
      } else {
        return true
      }
    })
    .filter((joke) => {
      if (type !== undefined) {
        return joke.type === type
      } else {
        return joke
      }
    })
    .filter((joke) => {
      if (safe !== undefined) {
        return joke.safe === safe
      } else {
        return joke
      }
    })
    .filter((joke) => {
      if (blacklistFlags !== undefined) {
        return joke.flags.nsfw === flags.nsfw &&
          joke.flags.religious === flags.religious &&
          joke.flags.political === flags.political &&
          joke.flags.racist === flags.racist &&
          joke.flags.sexist === flags.sexist &&
          joke.flags.explicit === flags.explicit
          ? joke
          : undefined
      } else {
        return joke
      }
    })

  const randomNum = Math.floor(Math.random() * filteredJoke.length)
  res.status(200).json(filteredJoke[randomNum])
})

module.exports = router
