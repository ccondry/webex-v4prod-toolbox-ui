function addUrlQueryParams (endpoint, params) {
  // console.log('addUrlQueryParams:', endpoint, params)
  let url = new window.URL(endpoint)
  // console.log('new URL object =', url)
  if (params) {
    // append URL query paramenters
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key])
    })
  }
  return url
}

async function rest (method, jwt, endpoint, query, data) {
  try {
    // console.log('REST request:', method, endpoint, query, data)
    const url = addUrlQueryParams(endpoint, query)
    // console.log(method, url, data)
    let body
    if (data) {
      body = JSON.stringify(data)
    }
    const response = await window.fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt
      },
      body
    })
    if (response.ok) {
      const text = await response.text()
      try {
        const json = JSON.parse(text)
        return json
      } catch (e) {
        // not json
        return text
      }
    } else {
      const text = await response.text()
      throw Error(`REST error ${response.status} ${response.statusText}: ${text}`)
    }
  } catch (e) {
    throw e
  }
}

export const load = async function (jwt, endpoint, query) {
  return rest('GET', jwt, endpoint, query)
}

export const put = async function (jwt, endpoint, query, data) {
  return rest('PUT', jwt, endpoint, query, data)
}

export const post = async function (jwt, endpoint, query, data) {
  return rest('POST', jwt, endpoint, query, data)
}

export const httpDelete = async function (jwt, endpoint, query) {
  return rest('DELETE', jwt, endpoint, query)
}
