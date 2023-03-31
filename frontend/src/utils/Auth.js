class Auth {
    constructor(url) {
        this.baseUrl = url;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
    }

    _request(url, option) {
        return fetch(url, option).then(this._checkResponse)
    }

    register(password, email) {
        return this._request(`${this.baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email })
        })
    }

    login(password, email) {
        return this._request(`${this.baseUrl}/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email })
        })
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('jwt', data.token)
                    return data
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    checkToken(jwt) {
        return this._request(`${this.baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        })
    }
}

export const auth = new Auth('https://auth.nomoreparties.co');