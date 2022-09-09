import { getHeadlines } from './api'

// we import all the pages that we want to add to our app
import { Home, NotFound, Error, Detail } from '../pages'
import { Splash } from '../components'

export default {
  bootComponent: Splash,
  // First we define a root, this is the hash were the browser will point to
  // at the moment that you boot your app
  root: () => {
    return new Promise(resolve => {
      resolve('splash')
    })
  },
  // Next we can define the rest of our routes
  routes: [
    {
      // this is a one level deep route.
      path: 'home',
      // define the attached Component that the Router will show
      // on this route. If configured the Router will create an instance
      component: Home,
      before(page) {
        return getHeadlines()
          .then(lists => {
            // set property on the page
            page.results = lists
            return page
          })
          .catch(e => {
            console.log(e)
          })
      },
      cache: 60,
    },
    {
      path: 'headline/details/:headlineId{/[0-9]{0,10}/}',
      component: Detail,
      cache: 60,
    },
    {
      path: '*',
      component: NotFound,
    },
    {
      path: '!',
      component: Error,
    },
  ],
  beforeEachRoute: async (from, to) => {
    return true
  },
}
