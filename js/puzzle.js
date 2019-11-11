/**
 * 拼图
 */
class Puzzle {
    /**
     * 
     * @param {contain} 拼图渲染位置
     * @param config
     * @param {size}  ·N*N的拼图 
     * @param {image} 拼图所用图片
     * @param {animate} 动画速度
     * 
     */
    constructor(contain, config) {
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

        //位置和数值的映射关系
        this.originPositon = {};
        //记录当前顺序
        this.currentOrders = [];

        //记录移动历史
        this.historyOrders = [];

        this.init();
    }

    /**
     * 根据size 初始化坐标位置和拼图顺序
     * 向右为x轴正方向
     * 向下为y轴正方向[x, y]
     * eg: [                                    [                  
     *          [0,0],[1,0],[2,0],                  0,1,2,
     *          [0,1],[1,1],[2,1],    ====>         3,4,5,
     *          [0,2],[1,2],[2,2],                  6,7,8
     *     ]                                    ]
     * */
    positionInit() {
        for(let i = 0; i < this.size; i++) { //y
            for(let j = 0; j < this.size; j++) { //x
                this.position.push([j, i]);  
                this.orders.push(i * this.size + j);
                //图片顺序 对应到的位置
                this.originPositon = Object.assign(this.originPositon, {
                    [`${ i * this.size + j }`]: [j, i]
                })
                this.currentOrders.push(i * this.size + j);
            }
        }
    }

    //初始化渲染拼图
    initRender() {
        this.contain.innerHTML = '';
        this.orders.forEach((item)=>{
            let _position = this.position[item];
            let dom = document.createElement('div');
            dom.innerText = item;
            dom.className = `puzzle-game position-${ item }`;
            dom.style.left = `${ _position[0] * this.xStep }px`;
            dom.style.top = `${ _position[1] * this.yStep }px`;
            dom.style.transition = `left ${this.animate}s, top ${this.animate}s`;
            dom.style.backgroundPosition = `-${ _position[0] * this.xStep }px -${ _position[1] * this.yStep }px`;
            if(_position[0] == 2 && _position[1] == 2) {
                dom.style.backgroundImage = 'none';
            }
            this.contain.appendChild(dom);
        })
    }

    //改变拼图位置
    render() {
        //当前排序和坐标系重新建立映射关系
        this.currentOrders.forEach((item, index) => {
            let _position = this.position[index];
            let dom = document.querySelector('.position-' + item);
            dom.style.left = `${ _position[0] * this.xStep }px`;
            dom.style.top = `${ _position[1] * this.yStep }px`;
            this.originPositon = Object.assign(this.originPositon, {
                [`${ item }`]: _position
            })
        })
    }

    //游戏初始化
    init() {
        this.positionInit();
        this.initRender();

        //添加滑动事件  //操作拼图滑动

    }
    
    //生成可还原拼图排列
    random() {
        let newPuzzleArr = this.randomPuzzle();
        // console.log(newPuzzleArr);
        while(!this.checkPuzzle(newPuzzleArr)) {
            newPuzzleArr = this.randomPuzzle();
        }
        let orders = [...newPuzzleArr, this.size * this.size - 1];

        this.currentOrders = orders;

        this.historyOrders = [orders];
        this.render();
    }

    //随机生成拼图排列 最后一个位置固定，不参与随机
    randomPuzzle() {
        let randomArr = [],
            origin = [], 
            length = this.size * this.size - 1;
        for(let i = 0; i < length; i++) {
            origin.push(i);
        }
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
    
}