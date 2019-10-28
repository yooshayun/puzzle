/**
 * 拼图分布位置 
 * [                               
 *  [0,0], [1,0], [2,0],        
 *  [0,1], [1,1], [2,1],      
 *  [0,2], [1,2], [2,2],     
 * ]
 * 对应完成后 
 * [
 *   0,1,2,
 *   3,4,5,
 *   6,7,8
 * ]
 */

 function autoCalcSteps(orders) {
    //


 }

 //获取当前坐标的位置
 function getPosition(number) {
    return {
        x: position[number][0],
        y: position[number][1],
    }
 }