(function() {
  herm = {
    init() {
      this.terminal = document.querySelector('.terminal')
      console.log('init', this.terminal)
    },

    clearTerminal() {
      this.terminal.innerHTML = ''
    },

    echo(data = {}) {
      const text = typeof data === 'string' ? data : data.text

      const pre = document.createElement('pre')
      pre.textContent = text
      this.terminal.appendChild(pre)
    },

    async fetch(url = '') {
      this.clearTerminal()

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

      this.echo('-----------')
      this.echo(' Get Users ')
      this.echo('-----------')
      console.log('data', data)
      this.echo(data)
    },

    async getAlbums() {
      this.echo('[ Get Albums ]')
      const data = await this.fetch('https://jsonplaceholder.typicode.com/albums')
      console.log('data', data)
      this.echo(data)
    }
  }

  herm.init()

  document.querySelectorAll('.btn-action').forEach(el => {
    //console.log(el)
    el.addEventListener('click', e => {
      herm[el.getAttribute('data-action')]()
    })
  })
})()