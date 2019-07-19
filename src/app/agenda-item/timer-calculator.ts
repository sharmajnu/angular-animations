
/**
 * Calculate Animation position and duration
 *
 * @param {number} duration in milliseconds 
 * @param {number} totalPixelsToMove
 * @param {number} lineHeight in pixels
 * @param {number} remainingTime in milliseconds
 */
export function calcTime(duration: number, totalPixelsToMove: number, lineHeight: number, remainingTime: number) {

    if (duration - remainingTime <= 0) {
        console.log('Animation is already completed');
    }
    const timeToMoveOnePixel = duration / totalPixelsToMove;

    const pixelsToExpand = lineHeight;

    const timeToExpand = pixelsToExpand * timeToMoveOnePixel;

    const pixelsToSlide = totalPixelsToMove - pixelsToExpand;

    const timeToSlide = pixelsToSlide * timeToMoveOnePixel;

    const spentTime = duration - remainingTime;

    const pixelsMovedInOneUnitTime = totalPixelsToMove / duration;

    const pixelsMovedInSpentTime = pixelsMovedInOneUnitTime * spentTime;

    if (pixelsMovedInSpentTime > lineHeight) {
        console.log(`Slide ${totalPixelsToMove - pixelsMovedInSpentTime} Pixels in ${remainingTime}`);
    } else {
        console.log(`Expand ${pixelsToExpand - pixelsMovedInSpentTime} Pixels in ${timeToExpand - spentTime}`);
        console.log(`Slide ${pixelsToSlide} Pixels in ${timeToSlide}`);
    }
}