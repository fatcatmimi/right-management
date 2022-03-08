import axios from 'axios'
import Qs from 'qs'
import { message } from 'antd'

axios.defaults.withCredentials = true

export const sendAxios = (url, params = {}, method = 'GET') => {
     return new Promise((resolve) => {
          let promise;
          if (method === 'GET') {
               promise = axios.get(url, {
                    params
               })
          } else if (method === 'POST') {
               promise = axios.post(url, Qs.stringify(params))
          }

          promise.then(response => {
               resolve(response.data)
          }).catch(error => {
               message.error(error.message)
          })
     })
}

export const sendAxios_formData = (url, params = {}) => {
     return new Promise((resolve) => {
          let promise;
          promise = axios.post(url, params, {
               headers: { "Content-Type": "multipart/form-data" }
          })

          promise.then((response) => {
               resolve(response.data)
          })
     })

}
