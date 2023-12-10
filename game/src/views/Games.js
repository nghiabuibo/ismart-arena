import { useEffect } from "react";
import socket from "../utils/socket";

function Games(props) {
    const { accessToken } = props

    useEffect(() => {
        socket.auth = { token: accessToken }
        socket.connect()
        
        return () => {
            socket.disconnect()
        }
    }, [accessToken])

    useEffect(() => {
        socket.on('result:update', (data) => console.log(data))

        return () => {
            socket.off('result:update')
        }
    }, [])

    return (
        <div>Games</div>
    )
}

export default Games