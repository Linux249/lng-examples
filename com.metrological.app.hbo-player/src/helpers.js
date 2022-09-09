export const formatTime = seconds => {
  if (seconds === Infinity) return '--'
  return (
    ('0' + Math.floor(seconds / 60)).slice(-2) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2)
  )
}

export const videos = [
  {
    url: 'http://video.metrological.com/surfing.mp4',
    title: 'surfing',
    subtitle: 'surfing subtitle',
  },
  {
    url: 'http://video.metrological.com/hot_town.mp4',
    title: 'hot_town',
    subtitle: 'hot_town subtitle',
  },
  {
    url: 'http://video.metrological.com/fireworks_paris.mp4',
    title: 'fireworks_paris',
    subtitle: 'fireworks_paris subtitle',
  },
  { url: 'http://video.metrological.com/drop.mp4', title: 'drop', subtitle: 'drop subtitle' },
  {
    url: 'http://video.metrological.com/iceland.mp4',
    title: 'iceland',
    subtitle: 'iceland subtitle',
  },
  {
    url: 'http://video.metrological.com/stockholm.mp4',
    title: 'stockholm',
    subtitle: 'stockholm subtitle',
  },
  {
    url: 'http://video.metrological.com/throw-error.mp4',
    title: 'throw-error',
    subtitle: 'throw-error subtitle',
  },
]
