import { useEffect, useState } from "react";
import Authentication from "./views/Authentication";
import Games from "./views/Games";

function App() {
  const [accessToken, setAccessToken] = useState('')
  const [resultID, setResultID] = useState(null)
  const [groupID, setGroupID] = useState(null)
  
  useEffect(() => {
    const localAccessToken = localStorage.getItem('access_token')

    if (!localAccessToken) return

    setAccessToken(localAccessToken)
  }, [])

  return (
    !accessToken
    ?
    <Authentication setAccessToken={setAccessToken} setResultID={setResultID} setGroupID={setGroupID} />
    :
    <Games accessToken={accessToken} setAccessToken={setAccessToken} resultID={resultID} setResultID={setResultID} groupID={groupID} setGroupID={setGroupID} />
  );
}

export default App;
