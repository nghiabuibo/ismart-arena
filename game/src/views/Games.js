import { useEffect } from "react";
import socket from "../utils/socket";
import handleRequestError from "../utils/handleRequestError";
// import axios from "axios";

function Games(props) {
    const { accessToken, setAccessToken } = props

    // handle socket authen
    useEffect(() => {
        socket.auth = { token: accessToken }
        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [accessToken])

    useEffect(() => {
        socket.on('connect_error', (err) => {
            handleRequestError(err)
            localStorage.setItem('access_token', '')
            setAccessToken('')
        })

        return () => {
            socket.off('connect_error')
        }
    }, [setAccessToken])

    // setup socket events
    useEffect(() => {
        socket.on('result:update', (data) => console.log(data))
        socket.on('game:updateContest', (data) => console.log(data))
        socket.on('game:updateGameState', (data) => console.log(data))
        socket.on('game:updateResult', (data) => console.log(data))

        return () => {
            socket.off('result:update')
            socket.off('game:updateContest')
            socket.off('game:updateGameState')
            socket.off('game:updateResult')
        }
    }, [])

    return (
        <div>Games</div>
    )
}

export default Games