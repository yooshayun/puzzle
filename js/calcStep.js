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
autoCalcSteps([0,1,2,3,5,7,6,4,8])
function autoCalcSteps(orders) {
   //搜索节点集合
   let opens = [],
      close = [], 
      step = 0;   //搜索步数

   //估值函数  
   let nodeValue = getDistanceTotal(orders) + step;
   let curr = deepCopy(orders);
   opens.push({
      v: nodeValue,
      order: curr
   })

   //搜索
   while (opens.length !== 0) {
      console.log(opens.length);
      //判断当前节点的可能产生的节点
      let currentNode = opens.shift();
      let childOrders = getNextOrders(currentNode.order);
      //
      close.push(currentNode);

      if(childOrders.length == 0) {
         alert('无解');
         opens = [];
      }
      childOrders.forEach(item => {
         //排除掉已经出现的节点，不可以走回头路
         if(!close.some(one => isSameOrder(item, one.order))) {
            let node = {
               v: getDistanceTotal(item) + step,
               order: item,
               parent: currentNode          
            };
            let length = opens.length;
            //将新的节点按估值大小插入opens列表里面
            if(length == 0) {
               opens.push(node);
            } else {
               for(let i = 0; i < length; i++) {
                  if(opens[i].v > node.v) {
                     opens.splice(i, 0, node);
                     break
                  }
               }
            }
         }
         console.log(opens, 'opens');
      })
      if(currentNode.order.join('') == '012345678') {
         console.log('寻路成功！');
         opens = [];
         console.log(close);
         let paths = getPath(close[close.length - 1])
         console.log(paths)
         console.log(paths.map(one => {
            return one.order.join(',')
         }));
         for(let i = paths.length - 1; i > 0; i--) {
            isChange(paths[i].order, paths[i-1].order);
         }
      } else {
         step++;
      }
   }
}

//获取路径
function getPath(node) {
   let paths = [];
   paths.push(node);
   if(node.parent) {
      return paths.concat(getPath(node.parent));
   } else {
      return paths
   }
}

//对比两个数组的变幻关系 current --> next  1向上2向右3向下4向左
/**eg:
 *    0, 1, 2,
 *    3, 5, 8,
 *    6, 4, 7
 * 
 *    0, 1, 2,
 *    3, 5, 7,
 *    6, 4, 8
 * */
function isChange(current, next) {
   //对比两个数组
   let currArr = current;
   let nextArr = next;
   console.log(current.join(','), next.join(','))
   let differents = [];  //记录两个8的位置curr的8==>next的8是动作方向
   for(let i = 0; i < currArr.length; i++) {
      if(currArr[i] !== nextArr[i]) {
         let obj = {};
         obj.index = i;
         obj.point = null;
         if(currArr[i] == 8) {
            obj.point = 'start';
         }
         if(nextArr[i] == 8) {
            obj.point = 'end';
         }
         differents.push(obj);
      }
   }
   if(differents.length !== 2) {
      console.log('不能靠一步移动得到');
      return
   }
   let s, e;
   differents.forEach(item => {
      if(item.point == 'start') {
         s = getPosition(item.index);  
      }
      if(item.point == 'end') {
         e = getPosition(item.index);  
      }
   })
   let direction = {
      x: e.x - s.x,
      y: e.y - s.y
   }
   if(direction.x == 0) {
      if(direction.y == -1) {
         console.log('向下')
      }
      if(direction.y == 1) {
         console.log('向上')
      }
   }
   if(direction.y == 0) {
      if(direction.x == -1) {
         console.log('向右')
      }
      if(direction.x == 1) {
         console.log('向左')
      }
   }
}

//对比两个数组是否相同
function isSameOrder(order0, order1) {
   return order0.join('') == order1.join('')
}

//获取输入节点，移动一步之后可能产生的节点
function getNextOrders(curr) {
   let block, blockOrder; //输入节点空白位置
   for(let i = 0; i < curr.length; i++) {
      if(curr[i] === 8) {
         block = getPosition(i);
         blockOrder = i;
         break;
      }
   }
   // console.log(block, curr);
   //查询与当前空白节点只有1步的节点
   let childNodes = [];
   curr.forEach((item, index) => {
      let aroundNode = getPosition(index);
      if(Math.abs(aroundNode.x - block.x) + Math.abs(aroundNode.y - block.y) == 1) {
         childNodes.push(changePosition(curr, blockOrder, index));
      }
   })
   console.log(JSON.stringify(childNodes));
   return childNodes
}

//交换数组中的两个元素位置
function changePosition(arr, o1, o2) {
   let newArr = deepCopy(arr), stand;
   stand = newArr[o1];
   newArr[o1] = newArr[o2];
   newArr[o2] = stand;
   return newArr
}

//获取当前坐标的位置
function getPosition(number) {
   return {
      x: position[number][0],
      y: position[number][1],
   }
}

//坐标位置拼图距离应还原位置的步数
function getDistance(origin, point){
   let op = getPosition(origin), //该拼图还原位置
      cp = getPosition(point);  //该拼图当前位置
   return Math.abs(op.x - cp.x) + Math.abs(op.y - cp.y)
}

//状态距离还原状态位置 
function getDistanceTotal(orders) {
   let total = 0;
   orders.forEach((item, index)=> {
      total += getDistance(item, index);
   })
   return total
}

//拷贝函数
function deepCopy(o) {
   if(o instanceof Array) {
      let n = [];
      for(let i = 0; i < o.length; i++) {
         n[i] = deepCopy(o[i]);
      }
      return n
   } else if(o instanceof Object) {
      let n = {};
      for(let i in o) {
         n[i] = deepCopy(o[i]);
      }
      return n
   } else {
      return o
   }
}