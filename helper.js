function getReturnAmount(stake, ratio) {
    return stake * ratio
}

function getRandomBetween(min, max) {
    const range = max - min  + 1;
    return min + Math.floor(Math.random()*range);
}

module.exports =  { getRandomBetween, getReturnAmount }