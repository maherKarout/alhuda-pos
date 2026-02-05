    export function roundToNearest(number:number, multiple:number) {
      return Math.round(number / multiple) * multiple;
    }