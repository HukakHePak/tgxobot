import * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      [name: string]: any;
    }
  }
}
