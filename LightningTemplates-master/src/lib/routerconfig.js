import {
  Splash,
  ListHorizontal,
  ListVertical,
  ListCombination,
  ListVerticalDynamic,
  ListHorizontalDynamic,
  GridHorizontal,
  GridVertical,
  GridHorizontalDynamic,
  GridHorizontalDynamic2,
  KeyboardSimple,
  PinComponent,
} from '../templates';
import ComponentCreation from '../examples/ComponentCreation.js';


export default {
  boot: (async (args) => {
    return;
  }),
  root: 'splash',
  routes: [
    {
      path: 'splash',
      component: Splash,
    },
    // {
    //     path: 'button-example-2',
    //     component: ButtonExample2
    // },
    // {
    //     path: 'simple-vertical-list',
    //     component: SimpleVerticalList
    // },
    // {
    //     path: 'simple-horizontal-list',
    //     component: SimpleHorizontalList
    // },
    // {
    //     path: 'simple-two-list-navigation',
    //     component: SimpleTwoListNavigation
    // },
    {
      path: 'list-vertical',
      component: ListVertical,
    },
    {
      path: 'list-horizontal',
      component: ListHorizontal,
    },
    {
      path: 'list-combination',
      component: ListCombination,
    },
    {
      path: 'list-vertical-dynamic',
      component: ListVerticalDynamic,
    },
    {
      path: 'list-horizontal-dynamic',
      component: ListHorizontalDynamic,
    },
    {
      path: 'grid-vertical',
      component: GridVertical,
    },
    {
      path: 'grid-horizontal',
      component: GridHorizontal,
    },
    {
      path: 'grid-horizontal-dynamic',
      component: GridHorizontalDynamic,
    },
    {
      path: 'grid-horizontal-dynamic-2',
      component: GridHorizontalDynamic2,
    },
    {
      path: 'keyboard-simple',
      component: KeyboardSimple,
    },
    {
      path: 'pin-component',
      component: PinComponent,
    },
    {
      path: 'component-creation',
      component: ComponentCreation,
    },
  ],
};
