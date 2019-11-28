/**
 * 拼图
 */
class Puzzle {
    /**
     * 
     * @param {contain} 拼图渲染位置
     * @param config
     * @param {size}  ·N*N的拼图 最大为8 
     * @param {image} 拼图所用图片
     * @param {animate} 动画速度
     * 
     */
    constructor(contain, config) {
        //固定的位置表示符号 按ascii码大小排列
        this.puzzleConst = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{}';
        if(!contain || (contain && !contain.offsetWidth)) {
            console.error('请传入正确的dom');
            return;
        }
        this.contain = contain;
        this.size = config.size || 3;
        this.image = config.image || 'http://image.kolocdn.com/FmeJFr84wxiozGqT2B6QR0PkwjFh';
        this.animate = config.animate || 0.5;
        //坐标系和初始位置（也是最终还原位置）
        this.xStep = this.contain.offsetWidth / this.size;   //每个格子分配宽度
        this.yStep = this.contain.offsetHeight / this.size;  //每个格子分配高度
        this.position = [];
        this.orders = [];
        this.blank = this.puzzleConst[this.size * this.size - 1];

        //记录当前顺序
        this.currentOrders = [];

        //记录移动历史
        this.historyOrders = [];

        this.init();
    }

    /**
     * 根据size 初始化坐标位置和拼图顺序 eg: size === 3
     * 向右为x轴正方向
     * 向下为y轴正方向[x, y]
     * eg: [                                    [                  
     *          [0,0],[1,0],[2,0],                  '0','1','2',
     *          [0,1],[1,1],[2,1],    ====>         '3','4','5',
     *          [0,2],[1,2],[2,2],                  '6','7','8'
     *     ]                                    ]
     * */
    positionInit() {
        for(let i = 0; i < this.size; i++) { //y
            for(let j = 0; j < this.size; j++) { //x
                let key = this.puzzleConst[i * this.size + j], 
                position = [j, i];
                this.position.push(position); 
                this.orders.push(key);
                this.currentOrders.push(key);
            }
        }
    }

    //初始化渲染拼图
    initRender() {
        this.contain.innerHTML = '';
        this.orders.forEach((item, index)=>{
            //item拼图块的标识，index拼图块的位置
            let _position = this.position[index];
            let dom = document.createElement('div');
            dom.innerText = index;
            dom.className = `puzzle-game position-${ item }`;
            dom.style.left = `${ _position[0] * this.xStep }px`;
            dom.style.top = `${ _position[1] * this.yStep }px`;
            dom.style.width = `${ this.xStep }px`;
            dom.style.height = `${ this.yStep }px`;
            dom.style.lineHeight = `${ this.yStep }px`;
            dom.style.transition = `left ${this.animate}s, top ${this.animate}s`;
            dom.style.backgroundPosition = `-${ _position[0] * this.xStep }px -${ _position[1] * this.yStep }px`;
            if(item === this.blank) {
                dom.style.backgroundImage = 'none';
                dom.style.borderColor = 'transparent';
                dom.innerText = '';
            }
            this.contain.appendChild(dom);
        })
        
    }

    //改变拼图位置
    render() {
        //当前排序和坐标系重新建立映射关系
        // console.log(this.currentOrders, this.orders);
        this.currentOrders.forEach((item, index) => {
            let _position = this.position[index];
            let dom = document.querySelector('.position-' + item);
            dom.style.left = `${ _position[0] * this.xStep }px`;
            dom.style.top = `${ _position[1] * this.yStep }px`;
        })
    }

    //交换两张拼图的位置
    transposer(order, key1, key2) {
        let orders = this.deepCopy(order);
        let placeholder = orders[key1];
        orders[key1] = orders[key2];
        orders[key2] = placeholder;
        return orders;
    }

    /**
     * 拼图的上下左右移动
     * @param right 向右
     *        left 
     *        up
     *        down
     * */
    actionPuzzle(directive) {
        if(!directive) {
            return
        }

        //查询当前空白位置和周围拼图位置，并执行移动
        //空白方块值
        let blankV = this.blank;
        let blankIndex = this.currentOrders.indexOf(blankV);
        let blankPoint = this.getPosition(blankIndex);
        //空白方块周围拼图位置
        let right;
        let left;
        let up;
        let down;
        let length = this.currentOrders.length;
        for(let i = 0; i < length; i++) {
            let _itemPoint = this.getPosition(i);
            if(_itemPoint.x === blankPoint.x) {
                if(_itemPoint.y - 1 === blankPoint.y) {
                    down = i;
                }
                if(_itemPoint.y + 1 === blankPoint.y) {
                    up = i;
                }
            } else if(_itemPoint.y === blankPoint.y) {
                if(_itemPoint.x - 1 === blankPoint.x) {
                    right = i;
                }
                if(_itemPoint.x + 1 === blankPoint.x) {
                    left = i;
                }
            }
        }

        switch(directive) {
            case 'right':
                if(left >= 0) {
                    this.currentOrders = this.transposer(this.currentOrders, left, blankIndex)
                }
                break;
            case 'left':
                if(right >= 0) {
                    this.currentOrders = this.transposer(this.currentOrders, right, blankIndex)
                }
                break;
            case 'up':
                if(down >= 0) {
                    this.currentOrders = this.transposer(this.currentOrders, down, blankIndex)
                }
                break;
            case 'down':
                if(up >= 0) {
                    this.currentOrders = this.transposer(this.currentOrders, up, blankIndex)
                }
                break;
        }
        this.render();
    }

    //游戏初始化
    init() {
        this.positionInit();
        this.initRender();

        //添加滑动事件  //操作拼图滑动
        this.attachEvent(this.contain);
    }
    
    //生成可还原拼图排列
    random() {
        let newPuzzleArr = this.randomPuzzle();
        // console.log(newPuzzleArr);
        while(!this.checkPuzzle(newPuzzleArr)) {
            newPuzzleArr = this.randomPuzzle();
        }
        let orders = [...newPuzzleArr, this.blank];

        this.currentOrders = orders;

        this.historyOrders = [orders];
        this.render();
    }

    //随机生成拼图排列 最后一个位置固定，不参与随机
    randomPuzzle() {
        let randomArr = [], 
            length = this.orders.length - 1,
            origin = this.deepCopy(this.orders).slice(0, length);
        while (randomArr.length < length) {
            let index = Math.floor(Math.random() * origin.length);
            randomArr.push(origin[index]);
            origin.splice(index, 1);
        }
        return randomArr
    }

    //获取index对应的坐标
    getPosition(index) {
        return {
            x: this.position[index][0],
            y: this.position[index][1]
        }
    }

    //深度复制
    deepCopy(o){
        if(o instanceof Array) {
            let n = [];
            for(let i = 0; i < o.length; i++) {
               n[i] = this.deepCopy(o[i]);
            }
            return n
        } else if(o instanceof Object) {
            let n = {};
            for(let i in o) {
               n[i] = this.deepCopy(o[i]);
            }
            return n
        } else {
            return o
        }
    }

    /**
     * 检测拼图是否可以还原 
     * 复原拼图的逆序数为0
     * 当size为奇数时，逆序数相同则可以还原
     * 当size为偶数时，因为空白格始终在原位置，所以逆序数相同则可以还原
     * 总结：逆序数为偶数时可还原
     */
    checkPuzzle(orders) {
        //计算逆序数
        let count = 0, length = orders.length;
        for(let i = 0; i < length -1; i++) {
            for(let j = i + 1; j < length; j++) {
                if(orders[i] > orders[j]) {
                    count++
                }
            }
        }
        return count % 2 == 0
    }

    //事件绑定器
    attachEvent(target) {
        let startX = 0;
        let startY = 0;
        target.addEventListener('touchstart', (event)=> {
            startX = event.touches[0].pageX;
            startY = event.touches[0].pageY;
        });
        target.addEventListener('touchend', (event)=> {
            var spanX = event.changedTouches[0].pageX - startX;
            var spanY = event.changedTouches[0].pageY - startY;

            if(Math.abs(spanX) > Math.abs(spanY)){      //认定为水平方向滑动
                if(spanX > 30){         //向右
                    this.actionPuzzle('right')
                } else if(spanX < -30){ //向左
                    this.actionPuzzle('left')
                }
            } else {                                    //认定为垂直方向滑动
                if(spanY > 30){         //向下
                    this.actionPuzzle('down')
                } else if (spanY < -30) {//向上
                    this.actionPuzzle('up')
                }
            }
        });
    }

    /**
     *  拼图还原步骤算法
     */
    autoCalcPuzzle(order) {
        let orders = order || this.currentOrders;
        let opens = new Map();
        let closeMap = new Map();

        //估值函数
        let curr = orders.join('');
        let nodeValue = this.getDistanceTotal(curr);
        opens.set(curr, {
            v: nodeValue,
            step: 0,
            order: curr
        })

        //a*搜索
        while (opens.size !== 0) {
            // console.log(opens.size, closeMap.size);
            //获取opens中估值最小的节点
            let minKey = this.minOfArray(opens);
            let currentNode = opens.get(minKey);
            opens.delete(minKey);
            // console.log(currentNode, opens);
            closeMap.set(minKey, currentNode);

            //判断是否到达最终状态
            if(minKey == this.orders.join('')) {
                console.log('寻路成功！！！！', currentNode);
                let paths = this.getPath(currentNode, closeMap);
                let pathsNames = [];
                for(let i = paths.length - 1; i > 0; i--) {
                    pathsNames.push(this.isChange(paths[i].order, paths[i-1].order));
                }
                console.log(pathsNames);
                opens.clear();
                closeMap.clear();
                break;
            }

            //未到达最终状态，则继续扩展子节点
            let childNodes = this.getNextOrders(minKey);
            // console.log(childNodes);
            childNodes.forEach(item => {
                //子节点筛选 路径如果扩展过则去掉
                if(!closeMap.has(item)) {
                    let node = {
                        v: this.getDistanceTotal(item) + currentNode.step + 1,
                        step: currentNode.step + 1,
                        order: item,
                        parent: currentNode
                    }

                    //将新的节点按估值大小插入opens列表里面
                    //如果opens中存在，则对比两个的步数和估值，
                    //如果步数不一样，取步数小的，如果步数一样，取估值小地
                    if(!opens.has(item)) {
                        opens.set(item, node)
                    } else {
                        let opnesValue = opens.get(item);
                        if(opnesValue.v > node.v) {
                            opens.set(item, node);
                        }
                    }
                }
            })

            if(opens.size == 0) {
                console.log('寻路失败')
            }
        }
    }

    //节点价值
    getDistanceTotal(order) {
        let orders = order.split('');
        let total = 0;
        orders.forEach((item, index)=> {
            let itemIndex = this.orders.indexOf(item);
            if(item !== this.blank) {
                total += this.getDistance(itemIndex, index);
            }
        })
        return total * this.size * this.size
    }

    //坐标位置拼图距离应还原位置的步数
    getDistance(origin, point){
        let op = this.getPosition(origin), //该拼图还原位置
           cp = this.getPosition(point);  //该拼图当前位置
        return Math.abs(op.x - cp.x) + Math.abs(op.y - cp.y)
    }
    
    //查询Map数组中最小值
    minOfArray(arr) {
        let minKey = null;
        let min = null;
        arr.forEach((obj, key) => {
            if(!min) {
                min = obj;
                minKey = key;
            }
            if(obj.v < min.v) {
                min = obj;
                minKey = key;
            }
        })
        return minKey
    }

    //查询数组中是否存在
    indexOfArray(arr, one) {
        let index = -1, length = arr.length;
        for(let i = 0; i < length; i++) {
        // console.log(arr[i].order, one)
            if(arr[i].order === one) {
                index = i;
            }
        }
        return index
    }
 

    //扩展目标函数的子节点
    getNextOrders(order) {
        let curr = order.split('');
        let blankValue = this.blank;
        let length = curr.length;
        let blank;
        let blankOrder; //输入节点空白位置
        for(let i = 0; i < length; i++) {
           if(curr[i] === blankValue) {
              blank = this.getPosition(i);
              blankOrder = i;
              break;
           }
        }
        // console.log(blank, blankOrder);
        //查询与当前空白节点只有1步的节点
        let childNodes = [];
        curr.forEach((item, index) => {
            let aroundNode = this.getPosition(index);
            if(Math.abs(aroundNode.x - blank.x) + Math.abs(aroundNode.y - blank.y) == 1) {
                childNodes.push(this.transposer(curr, blankOrder, index).join(''));
            }
        })
        // console.log(JSON.stringify(curr), JSON.stringify(childNodes));
        return childNodes
    }

    //路径拼接
    getPath(node) {
        let paths = [];
        paths.push(node);
        if(node.parent) {
            return paths.concat(this.getPath(node.parent));
        } else {
            return paths
        }
    }

    /**
     * 输入两个数组
     * 如果可以通过移动一次则返回 上下左右 ==》 u，d，l，r
     * 不能一步变换得到则返回 null
     */
    isChange(current, next) {
        let currArr = current.split('');
        let nextArr = next.split('');
        let differents = [];
        let length = currArr.length;
        for(let i = 0; i < length; i++) {
            if(currArr[i] !== nextArr[i]) {
                let obj = {
                    index: i,
                    point: null
                }
                if(currArr[i] == this.blank) {
                    obj.point = 'start';
                }
                if(nextArr[i] == this.blank) {
                    obj.point = 'end';
                }
                differents.push(obj);
            }
        }
        if(differents.length !== 2) {
            console.log('不能靠一步移动得到');
            return null
        }
        let s, e;
        differents.forEach(item => {
            if(item.point == 'start') {
                s = this.getPosition(item.index);  
            }
            if(item.point == 'end') {
                e = this.getPosition(item.index);  
            }
        })
        let direction = {
            x: e.x - s.x,
            y: e.y - s.y
        }
        if(direction.x == 0) {
            if(direction.y == -1) {
                console.log('向下')
                return 'd'
            }
            if(direction.y == 1) {
                console.log('向上')
                return 'u'
            }
        }
        if(direction.y == 0) {
            if(direction.x == -1) {
                console.log('向右')
                return 'r'
            }
            if(direction.x == 1) {
                console.log('向左')
                return 'l'
            }
        }

    }
}