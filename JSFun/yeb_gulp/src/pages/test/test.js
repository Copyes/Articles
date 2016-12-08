'use strict';
const SAPIROOT = 'https://sapi.beibei.com/';
const FANCHAO = 'asdfsadfsdf';
// 商详页的库存
const _getItemStock = ({
	iid
}) => {
	return SAPIROOT + 'item/stock/' + iid + '.html';
};

const _getHomeItemStock = ({
	iid
	}) => {
	return SAPIROOT + 'item/stock/' + iid + '.html?iids=' + iid;
};

// 广告
const _getAds = (id) => {
	return SAPIROOT + 'resource/pc-ads-' + id + '.html'
};

// 拼团首页顶部tab列表
const _getGoodsCategory = () => {
	return SAPIROOT + 'martgoods/category/fightgroup.html';
};

// 拼团首页商品列表
const _getChannelList = ({
	page,
	cat
}) => {
	return SAPIROOT + 'item/fightgroup/' + (page) + '-40-today_group-' + (cat || '') + '-340000.html';
};

// 拼团商品详情
const _getItemDetail = (iid) => {
	return SAPIROOT + 'item/detail/' + iid + '.html?biz=pintuan';
};

const _getHotest = ({
	page,
	pagesize,
	type
}) => {
	pagesize = typeof pagesize === 'number' ? pagesize : 20;
	type = type === 'new' ? type : 'hot';
	return `${SAPIROOT}fightgroup/hot/${page}-${pagesize}-${type}.html`;
};

module.exports = {
	getChannelList: _getChannelList,
	getGoodsCategory: _getGoodsCategory,
	getItemDetail: _getItemDetail,
	getItemStock: _getItemStock,
	getHomeItemStock: _getHomeItemStock,
	getAds: _getAds,
	getHotest: _getHotest
};