export const getToken = async () => {
  return Promise.resolve('1029387549')
}

export const getHeadlines = async () => {
  // we fake some search request here
  const headlines = [
    { label: 'HEADLINE 7', action: 'view', value: 7, details: '7 info' },
    { label: 'HEADLINE 3', action: 'view', value: 3, details: '3 info' },
    { label: 'HEADLINE 9', action: 'view', value: 9, details: '9 info' },
    { label: 'HEADLINE 50', action: 'view', value: 50, details: '50 info' },
  ]
  return new Promise((resolve, reject) => {
    resolve(headlines)
  })
}
