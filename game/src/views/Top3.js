import Logo from "./Logo"
import styles from "./Top3.module.css"

function Top3(props) {
    const { leaderboard } = props
    if (leaderboard.leaderboard) leaderboard.leaderboard.length = 3

    const renderTop3 = leaderboard.leaderboard.map((top, index) => {
        let order = 'order-lg-3'
        if (index === 0) order = 'order-lg-2'
        if (index === 1) order = 'order-lg-1'
        return (
            <div className={`col-lg-4 ${order}`}>
                <div className={`${styles.top} ${styles[`top${index + 1}`]}`}>
                    <div className={styles.name}>{top.user.name}</div>
                    <div className={styles.score}>{top.totalScore}</div>
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
                <div className="row">
                    {renderTop3}
                </div>
            </div>
        </>
    )
}

export default Top3