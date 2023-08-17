const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function goToDog(id) {
    wx.navigateTo({
      url: `/pages/dogs/show?id=${id}`,
    })
}

function goToBreed(id) {
    wx.navigateTo({
      url: `/pages/wiki/show?id=${id}`,
    })
}

function goToEvent(event_id) {
  wx.navigateTo({
    url: `/pages/events/show?id=${event_id}`,
  });
}

module.exports = {
  formatTime,
  goToBreed,
  goToShow,
  goToEvent
}
