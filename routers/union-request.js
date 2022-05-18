const express = require('express');
const router = express.Router()
const apiAdapter = require('../services/api-adapter')
const isAuth = require('../services/request-auth')
const mask = require('json-mask');
const { microServicesApi } = require('../config');

router.get('/unionrequest', isAuth, (req, res) => {
    
    const { params } = req.query;
    const listUrls = iterate(JSON.parse(params))

    const responses = listUrls.map(mservice => {

        const { method, url, query, fields, service } = mservice
        
        if (method.toUpperCase() === 'GET') {
            
            const api = apiAdapter()
            const _query = new URLSearchParams(query);

            return api
                .get(`${url}?${_query}`)
                .then(res => {
                    const retData = fields ? mask(res.data, fields) : res.data
                    return { [service]: retData }
                })
                .catch(e => console.error(e));
        }
    })

    Promise.all(responses).then(data => {
        const newObj = { data: {}}
        data.map((cur) => {
            Object.assign(newObj.data, cur)
        })
        
        res.send(newObj)
    });
})

function iterate(obj) {

    let newApiArr = []

    if (obj.hasOwnProperty('$api') && Array.isArray(obj.$api)) {
        newApiArr = obj.$api.map((item) => {
            const _obj = objApi()

            const url = microServicesApi[item.service] || null

            getKeys(_obj).map((prop) => { 
                switch (prop) {
                    case 'service':
                    _obj.service = item[prop]
                    case 'fields':
                    _obj.fields = item[prop]
                        break;
                    case 'method':
                    _obj.method = item[prop]    
                        break;
                    case 'url':
                    _obj.url = url ? url + item.path : ''                       
                        break;
                    case 'query':
                    _obj.query = item[prop]    
                        break;
                }
            })

            return _obj
            
        })
    }

    // console.log(newApiArr)
    return newApiArr
}

function objApi() {
    return Object.assign({}, {
        service: "",
        fields: "",
        method: "get",
        url: "",
        query: ""
    })
}

function getKeys(target) {
	return Object.keys(target)
}

const isObject = (value) => {
    return !!(value && typeof value === "object" && !Array.isArray(value));
};

module.exports = router


// The syntax is loosely based on XPath:
// a,b,c comma-separated list will select multiple fields
// a/b/c path will select a field from its parent
// a(b,c) sub-selection will select many fields from a parent
// a/*/c the star * wildcard will select all items in a field

