function GameState(props) {
    const { currentGamePack, gameState, userResult } = props

    return (
        <>
            {gameState?.currentQuestion + 1}/{currentGamePack?.questions?.length}
            {gameState?.currentTimeLeft ?? 0}
            {userResult?.totalScore ?? 0}
        </>
    )
}
export default GameState