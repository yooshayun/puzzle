const position = [
    [0,0],
    [1,0],
    [2,0],
    [0,1],
    [1,1],
    [2,1],
    [0,2],
    [1,2],
    [2,2]
]; 

//容器
let content = document.querySelector('.content');
let originPositon = {}; //记录0-8号图片位置

//初始化
position.forEach(item => {
    let dom = document.createElement('div');
    dom.className = `game position-${ item[0] }-${ item[1] }`;
    dom.style.left = `${ item[0] * 100 }px`;
    dom.style.top = `${ item[1] * 100 }px`;
    dom.style.backgroundPosition = `-${ item[0] * 100 }px -${ item[1] * 100 }px`;
    if(item[0] == 2 && item[1] == 2) {
        dom.style.backgroundImage = 'none';
    }
    originPositon = Object.assign(originPositon, {
        [`${ item[0] }-${ item[1] }`]: [item[0], item[1]] 
    })
    content.appendChild(dom);
})

//动作
let action = {
    toL: function() {
        console.log('left');
        if(!willMoveDoms.right) {
            return;
        }
        let rightDom = document.querySelector(`.position-${willMoveDoms.right}`),
            blankDom = document.querySelector(`.position-2-2`);
        rightDom.style.left = `${ (originPositon[willMoveDoms.right][0] - 1) * 100 }px`;
        blankDom.style.left = `${ (originPositon['2-2'][0] + 1) * 100 }px`;
        originPositon[willMoveDoms.right][0]--;     
        originPositon['2-2'][0]++;     
        findWillMoveDoms();
    },
    toR: function() {
        console.log('right');
        if(!willMoveDoms.left) {
            return;
        }

        let leftDom = document.querySelector(`.position-${willMoveDoms.left}`),
            blankDom = document.querySelector(`.position-2-2`);
        leftDom.style.left = `${ (originPositon[willMoveDoms.left][0] + 1) * 100 }px`;
        blankDom.style.left = `${ (originPositon['2-2'][0] - 1) * 100 }px`;
        console.log(originPositon, willMoveDoms.left)
        originPositon[willMoveDoms.left][0]++;     
        originPositon['2-2'][0]--;     
        findWillMoveDoms();
    },
    toB: function() {
        console.log('bottom');
        if(!willMoveDoms.top) {
            return;
        }
        let topDom = document.querySelector(`.position-${willMoveDoms.top}`),
            blankDom = document.querySelector(`.position-2-2`);
        topDom.style.top = `${ (originPositon[willMoveDoms.top][1] + 1) * 100 }px`;
        blankDom.style.top = `${ (originPositon['2-2'][1] - 1) * 100 }px`;
        originPositon[willMoveDoms.top][1]++;     
        originPositon['2-2'][1]--;   
        console.log(originPositon)  
        findWillMoveDoms();

    },
    toT: function() {
        console.log('top');
        if(!willMoveDoms.bottom) {
            return;
        }
        let bottomDom = document.querySelector(`.position-${willMoveDoms.bottom}`),
            blankDom = document.querySelector(`.position-2-2`);
        bottomDom.style.top = `${ (originPositon[willMoveDoms.bottom][1] - 1) * 100 }px`;
        blankDom.style.top = `${ (originPositon['2-2'][1] + 1) * 100 }px`;
        originPositon[willMoveDoms.bottom][1]--;     
        originPositon['2-2'][1]++;     
        findWillMoveDoms();

    }
}

//查询可移动doms
let willMoveDoms = {};
function findWillMoveDoms() {
    let blankDomPos = originPositon['2-2'];
    willMoveDoms = {};
    willMoveDoms.blank = '2-2';
    for(let i in originPositon) {
        let or = originPositon[i];
        if(or[0] == blankDomPos[0] && or[1] + 1 == blankDomPos[1]) {
            if(blankDomPos[1] == 0) {
                willMoveDoms.top = null;
            } else {
                willMoveDoms.top = i;
            }
        }
        if(or[0] == blankDomPos[0] && or[1] - 1 == blankDomPos[1]) {
            if(blankDomPos[1] == 2) {
                willMoveDoms.bottom = null;
            } else {
                willMoveDoms.bottom = i;
            }
        }
        if(or[1] == blankDomPos[1] && or[0] + 1 == blankDomPos[0]) {
            if(blankDomPos[0] == 0) {
                willMoveDoms.left = null;
            } else {
                willMoveDoms.left = i;
            }
        }
        if(or[1] == blankDomPos[1] && or[0] - 1 == blankDomPos[0]) {
            if(blankDomPos[0] == 2) {
                willMoveDoms.right = null;
            } else {
                willMoveDoms.right = i
            }
        }
    }
    console.log(willMoveDoms, '可移动doms')
}

document.addEventListener('keydown', (e)=>{
    e.stopPropagation();
    //查找可移动dom
    findWillMoveDoms();
    //左
    console.log(e.keyCode);
    if(e.keyCode == 65) {
        action.toL();
    }
    //右
    if(e.keyCode == 68) {
        action.toR();
    }
    //上
    if(e.keyCode == 87) {
        action.toT();
    }
    //下
    if(e.keyCode == 83) {
        action.toB();
    }
})

EventUtil.listenTouchDirection(document, true, action);



