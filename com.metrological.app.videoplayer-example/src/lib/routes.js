import { Advanced, Simple } from '../pages'

export default {
  root: 'simple',
  routes: [
    {
      path: 'simple',
      component: Simple,
      widgets: ['Menu'],
    },
    {
      path: 'advanced',
      component: Advanced,
      widgets: ['Menu'],
    },
  ],
}
