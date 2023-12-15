import { useEffect, useState } from "react";
import Authentication from "./views/Authentication";
import Games from "./views/Games";

function App() {
  const [accessToken, setAccessToken] = useState('')

  useEffect(() => {
    const localAccessToken = localStorage.getItem('access_token')

    if (!localAccessToken) return

    setAccessToken(localAccessToken)
  }, [])

  return (
    !accessToken
      ?
      <Authentication setAccessToken={setAccessToken} />
      :
      <Games accessToken={accessToken} setAccessToken={setAccessToken} />
  );
}

export default App;
