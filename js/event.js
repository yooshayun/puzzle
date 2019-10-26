var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener)
            element.addEventListener(type, handler, false);
        else if (element.attachEvent)
            element.attachEvent("on" + type, handler);
        else
            element["on" + type] = handler;
    },
    removeHandler: function (element, type, handler) {
        if(element.removeEventListener)
            element.removeEventListener(type, handler, false);
        else if(element.detachEvent)
            element.detachEvent("on" + type, handler);
        else
            element["on" + type] = handler;
    },
    /**
     * 监听触摸的方向
     * @param target            要绑定监听的目标元素
     * @param action.toT        向上滑动的监听回调（若不关心，可以不传，或传false）
     * @param action.toR     向右滑动的监听回调（若不关心，可以不传，或传false）
     * @param action.toB     向下滑动的监听回调（若不关心，可以不传，或传false）
     * @param action.toL      向左滑动的监听回调（若不关心，可以不传，或传false）
     */
    listenTouchDirection: function (target, isPreventDefault, action) {
        this.addHandler(target, "touchstart", handleTouchEvent, { passive: false });
        this.addHandler(target, "touchend", handleTouchEvent, { passive: false });
        this.addHandler(target, "touchmove", handleTouchEvent, { passive: false });
        var startX;
        var startY;
        function handleTouchEvent(event) {
            switch (event.type){
                case "touchstart":
                    startX = event.touches[0].pageX;
                    startY = event.touches[0].pageY;
                    break;
                case "touchend":
                    var spanX = event.changedTouches[0].pageX - startX;
                    var spanY = event.changedTouches[0].pageY - startY;

                    if(Math.abs(spanX) > Math.abs(spanY)){      //认定为水平方向滑动
                        if(spanX > 30){         //向右
                            if(action.toR) {
                                action.toR();
                            }
                        } else if(spanX < -30){ //向左
                            if(action.toL) {
                                action.toL();
                            }
                        }
                    } else {                                    //认定为垂直方向滑动
                        if(spanY > 30){         //向下
                            if(action.toB) {
                                action.toB();
                            }
                        } else if (spanY < -30) {//向上
                            if(action.toT) {
                                action.toT();
                            }
                        }
                    }

                    break;
                case "touchmove":
                    break;
            }
        }
    }
};
