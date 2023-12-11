async function gradeToGroup(grade) {
    const gradeInt = parseInt(grade)
    const groups = await strapi.entityService.findMany('api::group.group')
    for (let i in groups) {
        const group = groups[i]
        const groupGrades = group.grades.split(',').map(grade => parseInt(grade))
        if (groupGrades.includes(gradeInt)) return group
    }
}

export default gradeToGroup