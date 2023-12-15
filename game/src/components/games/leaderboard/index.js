function Leaderboard(props) {
    const { leaderboard } = props

    const renderLeaderboard = leaderboard.leaderboard?.map((result, index) => {
        return (
            <tr key={result.id}>
                <td>{index + 1}</td>
                <td>{result.user?.name}</td>
                <td>{result.totalScore ?? 0}</td>
            </tr>
        )
    })

    return (
        leaderboard &&
        <>
            <p>{leaderboard.contest?.name}</p>
            <p>{leaderboard.group?.name}</p>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        renderLeaderboard ??
                        <tr>
                            <td colSpan={3}>No Leaderboard Data!</td>
                        </tr>
                    }
                </tbody>
            </table>
        </>
    )
}

export default Leaderboard