
/*
    小工具库
*/ 

var _ = {
    
    getId: function(name) {
        return document.getElementById(name);
    },
    
    getTag: function(par, tagname) {
        var par = par || document;
        return par.getElementsByTagName(tagname)[0];
    },
    
    getClass: function(par, classname) {
        var par = par || document;
        par.getElementsByClassName(classname)[0];
    },
    
    each: function(arr, cb) {
        for (var i = 0, len = arr.length; i < len; i++) {
            cb.call(cb, arr[i], i)
        }
    },
    
    render: function(tem, data) {
        var html = '',
            self = this,
            rg;
        
        this.each(data, function(key, i) {
            html += tem.replace(/{{\s+(.*?)\s+}}/igm, function($, $1) {
                return key[$1]? key[$1] : $;
            })
        })
        return html;
    },
    
    on: function(obj, cname, method, cb) {
        obj.addEventListener(method, _fn, false);
        
        function _fn(ev) {
            var ev = ev || window.event;
            var target = ev.target;
            
            if (target.className != cname) return false;

            cb.call(target);
            
        }
    },
    
    sort: function(type, pos) { 
        
        var result;
        
        if (pos == 'up') {
            result = function(x , y) {
                return (x[type] < y[type])
            };
        } else {
            result = function(x , y) {
                return (x[type] > y[type])
            };
        }
        
        return function(x, y) {
            return result(x, y)? 1: -1;
        }
    },
    
    creatDom: function(el) {
        return document.createElement(el);
    },
    
    addClass: function(obj, cssName) {
        var oldname = obj.className;
        obj.className = oldname + ' ' + cssName;
    },
    
    data: function(el, type) {
        return el.getAttribute('data-' + type);
    },
};


/*
    ui_table
*/
function Ui_table(op) {
    
    if(!op.data) return false;
    
    var data = op.data;
    var sortType = op.sortType || 'all';
    
    
    //dom
    var table = _.creatDom('table'),
        thead = _.creatDom('thead'),
        tbody = _.creatDom('tbody');
    
    //添加css
    _.addClass(table, 'm_width');
    _.addClass(thead, 'j-title');
    _.addClass(tbody, 'j-box');
    
    //模板
    var tbodyTem = _.getId('tem-tbody').innerHTML;
    
    var theadTem = (function() {
        var tr = _.creatDom('tr'),
            tem = '';
        
        _.each(data.title, function(key) {
            tem += '<td data-type="'+ key +'">'+ key +'<b class="u-top"></b><b class="u-bottom"></b></td>'
        });
        
        return tr.innerHTML = tem;
    })();
    
    
    
    //默认数据
    var bodyData = data.body.sort(_.sort(sortType, 'up'));

    //注入
    tbody.innerHTML = _.render(tbodyTem, bodyData);
    thead.innerHTML = theadTem;
    
    //拼接插入
    table.appendChild(thead);
    table.appendChild(tbody);
    
    _.getTag('', 'body').appendChild(table);
    
    //添加事件
    _.on(table, 'u-top', 'click', function(){ _even.call(this, 'up') });
    _.on(table, 'u-bottom', 'click', function(){ _even.call(this, 'down'); });
    
    function _even(pos) {

        var sortType = _.data(this.parentNode, 'type');
        var newData = data.body.sort(_.sort(sortType, pos));
  
        tbody.innerHTML = _.render(tbodyTem, newData);;
    };
    
};


