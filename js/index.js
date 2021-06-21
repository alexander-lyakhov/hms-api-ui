(function() {
  const echo = {
    init() {
      this.terminal = document.querySelector('.terminal')
      console.log('init', this.terminal)
    },

    clear() {
      this.terminal.innerHTML = ''
    },

    success(data = {}) {
      this.print(data, 'success')
      return this
    },

    error(data = {}) {
      this.print(data, 'error')
      return this
    },

    title(data = {}) {
      this.print(data, 'title')
      return this
    },

    text(data = {}) {
      this.print(data)
      return this
    },

    print(data = {}, className = 'info') {
      const text = typeof data === 'string' ? data : data.text

      const pre = document.createElement('pre')
      pre.textContent = text
      pre.className = className
      this.terminal.appendChild(pre)

      return pre
    }
  }

  const api = {
    async fetch(url = '') {
      const data = {}

      const res = await fetch(url).then(
        res => {
          console.log(res)
          data.msg = res.ok ? 'success':'error'
          data.code = res.status
          return res.json()
        },
        err => {
          console.log(err)
        }
      )

      return {...data, text: JSON.stringify(res, null, 4)}
    },

    async getUsers() {
      const data = await this.fetch('https://jsonplaceholder.typicode.com/users')

      echo.clear()

      echo.title('--[ Get Users ]--')
      console.log('data', data)
      echo.text(data)
    },

    async getAlbums() {
      echo.clear()
      echo.text('[ Get Albums ]')
      const data = await this.fetch('https://jsonplaceholder.typicode.com/albums')
      console.log('data', data)
      echo.text(data)
    }
  }

  echo.init()

  document.querySelectorAll('.btn-action').forEach(el => {
    //console.log(el)
    el.addEventListener('click', e => {
      api[el.getAttribute('data-action')]()
    })
  })
})()