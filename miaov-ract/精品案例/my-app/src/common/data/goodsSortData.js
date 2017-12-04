let brand = [
    {id:Math.random(), desc: '苹果',},
    {id:Math.random(), desc: '小米',},
    {id:Math.random(), desc: '锤子',},
    {id:Math.random(), desc: '魅族',},
    {id:Math.random(), desc: '华为',},
    {id:Math.random(), desc: '三星',},
    {id:Math.random(), desc: 'OPPO',},
    {id:Math.random(), desc: 'vivo',},
    {id:Math.random(), desc: 'OPPO',},
    {id:Math.random(), desc: '乐视',},
    {id:Math.random(), desc: '360',},
    {id:Math.random(), desc: '中兴',},
    {id:Math.random(), desc: '索尼',}
];

let size = [
    {id:Math.random(), desc: '3.0英寸以下',},
    {id:Math.random(), desc: '3.0-3.9英寸',},
    {id:Math.random(), desc: '4.0-4.5英寸',},
    {id:Math.random(), desc: '4.6-4.9英寸',},
    {id:Math.random(), desc: '5.0-5.5英寸',},
    {id:Math.random(), desc: '6.0英寸以上',}
];

let os = [
    {id:Math.random(), desc: '安卓',},
    {id:Math.random(), desc: '苹果',},
    {id:Math.random(), desc: '微软',},
    {id:Math.random(), desc: '无',},
    {id:Math.random(), desc: '其他',}
];

let net = [
    {id:Math.random(), desc: '联通3G',},
    {id:Math.random(), desc: '双卡单4G',},
    {id:Math.random(), desc: '双卡双4G',},
    {id:Math.random(), desc: '联通4G',},
    {id:Math.random(), desc: '电信4G',},
    {id:Math.random(), desc: '移动4G',}
];

let data = [
    {id: Math.random(), sort: '品牌', data: brand, order:1 },
    {id: Math.random(), sort: '尺寸', data: size, order:2 },
    {id: Math.random(), sort: '系统', data: os, order: 3 },
    {id: Math.random(), sort: '网络', data: net, order: 4 }
];

export default data;
