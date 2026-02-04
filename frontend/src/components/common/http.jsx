export const apiUrl = 'http://127.0.0.1:8000/api'

export const adminToken = () => {
    const data = JSON.parse(localStorage.getItem('adminInfo'));
    return data.token;
}

export const userToken = () => {
    const data = JSON.parse(localStorage.getItem('userInfo'));
    return data.token;
}

export const STRIPE_PUBLIC_KEY = 'pk_test_51Stu9RDVJ3BEtMDVCIJR0ARjFetTF84t19Oth7mvUHn68DHetnKcIiLm5jxl4wRVTsAyjkvbIkTvsyKhlgjVeDmY00AxfVVnOS'

