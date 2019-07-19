
/**
 * Calculate Animation position and duration
 *
 * @param {number} duration in milliseconds 
 * @param {number} totalPixelsToMove
 * @param {number} lineHeight in pixels
 * @param {number} remainingTime in milliseconds
 */
export function calcTime(duration: number, totalPixelsToMove: number, lineHeight: number, remainingTime: number) {

    if (remainingTime < 0) {
        console.log('Animation is already completed');
        return;
    }
    const timeToMoveOnePixel = duration / totalPixelsToMove;

    console.log({timeToMoveOnePixel})

    const pixelsToExpand = lineHeight;

    const timeToExpand = pixelsToExpand * timeToMoveOnePixel;

    const pixelsToSlide = totalPixelsToMove - pixelsToExpand;

    const timeToSlide = pixelsToSlide * timeToMoveOnePixel;

    const spentTime = duration - remainingTime;

    const pixelsMovedInOneUnitTime = totalPixelsToMove / duration;

    const pixelsMovedInSpentTime = pixelsMovedInOneUnitTime * spentTime;

    console.log({timeToMoveOnePixel, pixelsMovedInOneUnitTime, pixelsToSlide, pixelsToExpand, timeToExpand, timeToSlide});

    if (pixelsMovedInSpentTime > lineHeight) {
        

        const result = {
            top: pixelsMovedInSpentTime - lineHeight,
            pixelsToSlide: totalPixelsToMove - pixelsMovedInSpentTime,
            timeToSlide: Math.round(remainingTime),
            lineHeight: lineHeight,
            timeToExpand: 0,
            pixelsToExpand: 0
        };

        console.log(`Slide ${result.pixelsToSlide} Pixels in ${result.timeToSlide} ms`);

        return result;
    } else {
        

        const result =  {
            top: 0,
            pixelsToExpand: pixelsToExpand - pixelsMovedInSpentTime,
            timeToExpand: Math.round(timeToExpand - spentTime),
            lineHeight: pixelsMovedInSpentTime,
            pixelsToSlide,
            timeToSlide
        };

        console.log(`Expand ${result.pixelsToExpand} Pixels in ${result.timeToExpand} ms`);
        console.log(`Slide ${result.pixelsToSlide} Pixels in ${result.timeToSlide} ms` );

        return result;
    }
}

