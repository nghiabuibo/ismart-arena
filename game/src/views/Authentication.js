import { useState } from "react"
import axios from "axios"
import handleRequestError from "../utils/handleRequestError"

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
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" name="name" value={authInfo.name} placeholder="Name" onChange={handleChange} />
            </div>
            <div>
                <input type="tel" name="phone" value={authInfo.phone} placeholder="Phone" onChange={handleChange} />
            </div>
            <div>
                <input type="email" name="email" value={authInfo.email} placeholder="Email" onChange={handleChange} />
            </div>
            <div>
                <select name="grade" value={authInfo.grade} onChange={handleChange}>
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
    )
}

export default Authentication