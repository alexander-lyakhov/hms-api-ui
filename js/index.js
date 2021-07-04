(function() {
  const echo00 = {
    init() {
      this.terminal = document.querySelector('.terminal')
      console.log('init', this.terminal)
    },

    print(data = {}, type = 'info') {
      const text = typeof data === 'string' ? data : data.text

      this.terminal.insertAdjacentHTML('beforeend', `
        <pre class="${ type }">${ text }</pre>
      `)

      return this
    },

    printStatus(data = {}, type = 'success') {
      this.terminal.insertAdjacentHTML('beforeend', `
        <pre class="status ${ type }">
          <span>${data.statusCode}</span>
          <span>${ type.toUpperCase() }</span>
        </pre>
      `)

      return this
    },

    clear() {
      this.terminal.innerHTML = ''
    },

    title(data = {}) {
      return this.print(data, 'title')
    },

    text(data = {}) {
      return this.print(data)
    },

    success(data = {}) {
      return this.printStatus(data, 'success')
    },

    error(data = {}) {
      return this.printStatus(data, 'error')
    },
  }

  const echo = function() {
    const terminal = document.querySelector('.terminal')
    const _this = {}

    function print(data = {}, type = 'info') {
      const text = typeof data === 'string' ? data : data.text

      terminal.insertAdjacentHTML('beforeend', `
        <pre class="${ type }">${ text }</pre>
      `)

      return _this
    }

    function printStatus(data = {}, type = 'success') {
      terminal.insertAdjacentHTML('beforeend', `
        <pre class="status ${ type }">
          <span>${data.statusCode}</span>
          <span>${ type.toUpperCase() }</span>
        </pre>
      `)

      return _this
    }

    Object.assign(_this, {
      clear:
        () => terminal.innerHTML = '',

      title:
        (data = {}) => print(data, 'title'),

      text:
        (data = {}) => print(data),

      success:
        (data = {}) => printStatus(data, 'success'),

      error:
        (data = {}) => printStatus(data, 'error')
    })

    return _this
  }()

  const api = {
    async fetch(url = '') {
      const data = {}

      const res = await fetch(url).then(
        res => {
          console.log(res)

          data.ok = res.ok
          data.statusText = res.ok ? 'success':'error'
          data.statusCode = res.status

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
      const data = await this.fetch('https://jsonplaceholder.typicode.com/posts')
      echo.title('1').title('2').title('3')
      echo.title('[ Get Posts ]')
      echo[data.ok ? 'success' : 'error'](data)
      console.log('data', data)
      echo.text(data)

    }
  }

  // echo.init()

  document.querySelectorAll('.btn-action').forEach(el => {
    //console.log(el)
    el.addEventListener('click', e => {
      api[el.getAttribute('data-action')]()
    })
  })
})()