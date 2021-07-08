(function() {
  const echo = function() {
    const terminal = document.querySelector('.terminal')
    const _this = {}

    function print(data = '', type = 'info') {
      const text = typeof data === 'string'
        ? data
        : JSON.stringify(data.res || data, null, 4)

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
      clear: () => {
        terminal.innerHTML = ''
        return _this
      },

      title:
        (data = {}) => print(data, 'title'),

      text:
        (data = {}) => print(data),

      status:
        (data = {}) => _this[data.ok ? 'success' : 'error'](data),

      success:
        (data = {}) => printStatus(data, 'success'),

      error:
        (data = {}) => printStatus(data, 'error')
    })

    return _this
  }()

  const xhr = function() {

    const _this = {}
    const authDetails = JSON.parse(localStorage.getItem("authDetails"));
    const userId = escape(authDetails.userId)

    console.log(userId)

    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'apiKey': 'VzNZzWQkodAqqnkEXUsNBhHYt6PcDm6w',
    }

    async function load(url = '', params = {}) {
      const data = {}

      const res = await fetch(url, params).then(
        res => {
          console.log(res)

          data.ok = res.ok
          data.statusText = res.ok ? 'success':'error'
          data.statusCode = res.status

          if (data.statusCode === 503) {
            return res.blob()
          }
          return res.json()
        },
        err => {
          console.log(err)
        }
      )

      return {...data, res}
    }

    Object.assign(_this, {
      get userName() {
        return `${authDetails.firstName} ${authDetails.lastName}`
      },

      getDefaultAddresses: async() => {
        const data = await load(`https://hermestest-intg.apigee.net/enterprise-user-account-api/v1/users/${userId}/addresses`, {
          method: 'get',
          headers: headers
        })

        echo.clear()
        echo
          .title('[ Get Default Addresses ]')
          .status(data)
          .text(data)
      },

      deleteDefaultAddresses: async() => {
        const data = await load(`https://hermestest-intg.apigee.net/enterprise-user-account-api/v1/users/${userId}/addresses`, {
          method: 'get',
          headers: headers
        })

        const arr = data.res.addresses?.map(el => el.id)

        echo.clear()
        echo
          .title('-- Delete Default Addresses --')
          .status(data)
          .title('-- Addresses --')
          .text(arr)
          //.text(data)

        console.log(data.res, arr)
      },

      getUsers: async () => {
        const data = await load('https://jsonplaceholder.typicode.com/sers')
        echo.clear()
        echo
          .title('[ Get Users ]')
          .status(data)
          .text(data)

        console.log('data', data)
      },

      getAlbums: async () => {
        const data = await load('https://jsonplaceholder.typicode.com/albums')
        echo.clear()
        echo
          .title('[ Get Albums ]')
          .status(data)
          .text(data)

        console.log('data', data)
      },

      getPosts: async () => {
        const data = await load('https://jsonplaceholder.typicode.com/posts')
        echo.clear()
        echo
          .title('[ Get Posts ]')
          .status(data)
          .text(data)

        console.log('data', data)
      }
    })

    return _this
  }()

  const ui = function() {
    const hau = document.querySelector('.herm-api-ui')
    const userName = hau.querySelector('.user')
    userName.textContent = xhr.userName

    let selectedButton = null

    hau.querySelectorAll('.btn-action').forEach(el => {
      el.addEventListener('click', e => {
        selectedButton?.classList.remove('selected')
        selectedButton = e.target
        selectedButton.classList.add('selected')

        xhr[el.getAttribute('data-action')]()
      })
    })

    xhr.deleteDefaultAddresses()
  }()
})()