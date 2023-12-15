import { useState } from "react"
import axios from "axios"
import handleRequestError from "../utils/handleRequestError"

import styles from './Authentication.module.css'

import Logo from "./Logo";

function Authentication(props) {
    const { setAccessToken } = props
    const [authInfo, setAuthInfo] = useState({
        name: '',
        phone: '',
        email: '',
        grade: ''
    })

    const handleChange = (e) => {
        setAuthInfo(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const apiUrl = process.env.REACT_APP_API_URL
        const endpoint = '/contest/register'
        const response = await axios.post(apiUrl + endpoint, { data: authInfo }).catch(handleRequestError)

        if (!response) return;

        if (!response?.data?.accessToken) {
            handleRequestError(response?.data ?? { message: 'Authentication error!' })
            return
        }

        localStorage.setItem('access_token', response.data.accessToken)
        setAccessToken(response.data.accessToken)
    }

    return (
        <>
            <Logo />
            <div className={`d-flex align-items-center justify-content-center ${styles.wrapper}`}>
                <form onSubmit={handleSubmit} className={`d-flex flex-column gap-4 ${styles.registerForm}`}>
                    <div>
                        <input type="text" name="name" value={authInfo.name} placeholder="Name" onChange={handleChange} required={true} />
                    </div>
                    <div>
                        <input type="tel" name="phone" value={authInfo.phone} placeholder="Phone" onChange={handleChange} required={true} />
                    </div>
                    <div>
                        <input type="email" name="email" value={authInfo.email} placeholder="Email" onChange={handleChange} required={true} />
                    </div>
                    <div>
                        <select name="grade" value={authInfo.grade} onChange={handleChange} required={true} >
                            <option value="">Grade</option>
                            <option value="1">Khối 1</option>
                            <option value="2">Khối 2</option>
                            <option value="3">Khối 3</option>
                            <option value="4">Khối 4</option>
                            <option value="5">Khối 5</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit">Start</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Authentication