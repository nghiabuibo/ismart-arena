import Logo from "./Logo"
import styles from "./Top3.module.css"

function Top3(props) {
    const { leaderboard, setShowTop3 } = props
    if (leaderboard.leaderboard) leaderboard.leaderboard.length = 3

    const renderTop3 = leaderboard?.leaderboard?.map((top, index) => {
        let order = 'order-lg-3'
        if (index === 0) order = 'order-lg-2'
        if (index === 1) order = 'order-lg-1'
        return (
            <div key={top.user.id} className={`col-lg-4 ${order}`}>
                <div className={`${styles.top} ${styles[`top${index + 1}`]}`}>
                    <div className={styles.name}>{top.user.name}</div>
                    <div className={styles.phone}>{top.user.phone}</div>
                    <div className={styles.score}>Corrected answers: <strong>{top.totalCorrected}</strong></div>
                    <div className={styles.score}>Total score: <strong>{top.totalScore}</strong></div>
                    <div className={styles.position}>{index + 1}</div>
                </div>
            </div>
        )
    })

    return (
        <>
            <Logo />
            <div className={styles.top3Wrapper}>
                <div className={styles.title}>Leaderboard</div>
                <div className="row align-items-end mb-3">
                    {renderTop3}
                </div>
                <button className={`m-auto d-block ${styles.leaderboardBack}`} onClick={() => setShowTop3(false)}>Back to Leaderboard</button>
            </div>
        </>
    )
}

export default Top3