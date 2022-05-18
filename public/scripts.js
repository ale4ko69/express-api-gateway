
axios.defaults.baseURL = "http://localhost:3000/";
axios.interceptors.request.use(
    config => {
        config.headers['authorization'] = `${localStorage.getItem('access_token')}`;
        return config;
      },
      error => {
          return Promise.reject(error);
      }
);

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if(error.response.status == 403){
            refreshToken()
        }
    }
);

const refreshToken = ()=>{
    // gets new access token
}

const loginForm = document.getElementById('login')
const links = document.getElementById('links')
const sample = document.getElementById('sample')
const loader = document.getElementById('loader')

async function login(e) {
    e.preventDefault();
    const email = document.getElementById('exampleInputEmail1').value
    const password = document.getElementById('exampleInputPassword1').value

    const response = await axios.post('/login', { email, password });
    const {auth, token} = response.data
    if (auth) {
        localStorage.setItem('access_token', token)
        isAuth = true
    }

    if (isAuth) {
        loginForm.style = "display: none;"
        links.style = "display: block;"
    }
}

async function getApi(e, url) {
    e.preventDefault();
    const response = await axios.get(url);
    sample.textContent = JSON.stringify(response.data, undefined, 2); 
}

async function getUnionApi(e, url) {
    e.preventDefault();

    loader.classList.toggle("hide");

    const data = {
        params: {
            $api: [
                {
                    service: 'users',
                    method: 'get',
                    path: '/',
                    fields: 'users(id,firstName,lastName,username,birthDate,address(address,city)),limit,total',
                    query: {limit:2}
                },
                {
                    service: 'carts',
                    method: 'get',
                    path: '/',
                    fields: 'carts(id,products(id,title,price,quantity,total)),limit,total',
                    query: {limit:3}
                },
                {
                    service: 'comments',
                    method: 'get',
                    path: '/',
                    fields: 'id,name,email',
                    query: {postId: 1}
                }
            ]
        }
    }

    const response = await axios.get(url, { params: data });
    sample.textContent = JSON.stringify(response.data, undefined, 2); 
    loader.classList.toggle("hide");

}

let isAuth = localStorage.getItem('access_token') ? true : false

if (isAuth) {
    loginForm.style = "display: none;"
    links.style = "display: block;"
}
