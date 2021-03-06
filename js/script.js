const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';



function makeGETRequest(url) {
    let xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    console.log ('Waiting....');
    xhr.open('GET', url, true);
    let promise = new Promise (function (resolve, reject) {
        if (Math.random () < .6) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    xhr.status >= 200 && xhr.status < 300 ? resolve (xhr.responseText) : reject (xhr.statusText);
                } 
            };
            xhr.send();
        } else if (Math.random () > .5) {
            setTimeout ( () => {
                reject ('Error \nServer timeout exceeded');
            }, 3000);
        } else {
            xhr.open('GET', url+1, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                   reject (`Error \n${xhr.statusText}`);
                } 
            };
            xhr.send();
        };
    });
    return promise;
}



class GoodsItem {
    constructor(product_name, price) {
        this.product_name = product_name;
        this.price = price;
    }
    render() {
        return `<div class="goods-item"><h3>${this.product_name}</h3><p>${this.price}</p></div>`;
    }
}



class GoodsList {
    constructor() {
        this.goods = [];
    }
    fetchGoods(cb) {
        makeGETRequest(`${API_URL}/catalogData.json`)
        .then (response => {
            this.goods = JSON.parse(response)
            cb();
        })
        .catch (reason => alert (reason));
    }
    render() {
        let listHtml = '';
        this.goods.forEach(good => {
            const goodItem = new GoodsItem(good.product_name, good.price);
            listHtml += goodItem.render();
        });
        document.querySelector('.goods-list').innerHTML = listHtml;
    }
}



const list = new GoodsList();
list.fetchGoods(() => {
    list.render();
});

