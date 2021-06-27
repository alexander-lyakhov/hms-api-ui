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
      this.terminal.insertAdjacentHTML('beforeend', `
        <pre class="status success">
          <span>${data.code}</span>
          <span>SUCCESS</span>
        </pre>
      `)
      return this
    },

    error(data = {}) {
      this.terminal.insertAdjacentHTML('beforeend', `
        <pre class="status error">
          <span>${data.code}</span>
          <span>ERROR</span>
        </pre>
      `)
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
          data.ok = res.ok
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
      const data = await this.fetch('https://jsonplaceholder.typicode.com/sers')

      echo.clear()

      echo.title('[ Get Users ]')
      data.ok ? echo.success(data):echo.error(data)
      console.log('data', data)
      echo.text(data)
    },

    async getAlbums() {
      echo.clear()
      echo.title('[ Get Albums ]')
      const data = await this.fetch('https://jsonplaceholder.typicode.com/albums')
      data.ok ? echo.success(data):echo.error(data)
      console.log('data', data)
      echo.text(data)
    },

    async getPosts() {
      echo.clear()
      echo.title('[ Get Posts ]')
      const data = await this.fetch('https://jsonplaceholder.typicode.com/posts')
      data.ok ? echo.success(data):echo.error(data)
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