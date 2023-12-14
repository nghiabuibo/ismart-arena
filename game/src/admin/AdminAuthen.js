import { useState } from "react"
import axios from "axios"
import handleRequestError from "../utils/handleRequestError"

function AdminAuthen(props) {
    const { setAdminToken } = props
    const [authInfo, setAuthInfo] = useState({
        identifier: '',
        password: '',
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
        const endpoint = '/auth/local'
        const response = await axios.post(apiUrl + endpoint, authInfo).catch(handleRequestError)

        if (!response) return;
        
        if (!response?.data?.jwt) {
            handleRequestError(response?.data ?? { message: 'Authentication error!' })
            return
        }
        
        localStorage.setItem('admin_token', response.data.jwt)
        setAdminToken(response.data.jwt)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" name="identifier" value={authInfo.identifier} placeholder="Username/Email" onChange={handleChange} />
            </div>
            <div>
                <input type="password" name="password" value={authInfo.password} placeholder="Password" onChange={handleChange} />
            </div>
            <div>
                <button type="submit">Login</button>
            </div>
        </form>
    )
}

export default AdminAuthen