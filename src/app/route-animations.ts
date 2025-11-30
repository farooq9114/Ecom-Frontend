import { trigger, transition, style, query, animate } from '@angular/animations';

export const fader = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter', [
      style({
        opacity: 0
      })
    ], { optional: true }),

    query(':enter', [
      animate('250ms ease-out', style({ opacity: 1 }))
    ], { optional: true })
  ])
]);
