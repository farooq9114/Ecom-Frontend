import { trigger, transition, style, query, animate } from '@angular/animations';

export const fader =
  trigger('routeAnimations', [
    transition('* <=> *', [
      // Start and end state
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 0,
          transform: 'scale(0.95)'
        })
      ], { optional: true }),

      // Animate new page in
      query(':enter', [
        animate('300ms ease', style({ opacity: 1, transform: 'scale(1)' }))
      ], { optional: true })
    ])
  ]);
