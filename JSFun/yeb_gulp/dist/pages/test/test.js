'use strict';

var SAPIROOT = 'https://sapi.beibei.com/';
var FANCHAO = 'asdfsadfsdf';
// 商详页的库存
var _getItemStock = function _getItemStock(_ref) {
	var iid = _ref.iid;

	return SAPIROOT + 'item/stock/' + iid + '.html';
};

var _getHomeItemStock = function _getHomeItemStock(_ref2) {
	var iid = _ref2.iid;

	return SAPIROOT + 'item/stock/' + iid + '.html?iids=' + iid;
};

// 广告
var _getAds = function _getAds(id) {
	return SAPIROOT + 'resource/pc-ads-' + id + '.html';
};

// 拼团首页顶部tab列表
var _getGoodsCategory = function _getGoodsCategory() {
	return SAPIROOT + 'martgoods/category/fightgroup.html';
};

// 拼团首页商品列表
var _getChannelList = function _getChannelList(_ref3) {
	var page = _ref3.page,
	    cat = _ref3.cat;

	return SAPIROOT + 'item/fightgroup/' + page + '-40-today_group-' + (cat || '') + '-340000.html';
};

// 拼团商品详情
var _getItemDetail = function _getItemDetail(iid) {
	return SAPIROOT + 'item/detail/' + iid + '.html?biz=pintuan';
};

var _getHotest = function _getHotest(_ref4) {
	var page = _ref4.page,
	    pagesize = _ref4.pagesize,
	    type = _ref4.type;

	pagesize = typeof pagesize === 'number' ? pagesize : 20;
	type = type === 'new' ? type : 'hot';
	return SAPIROOT + 'fightgroup/hot/' + page + '-' + pagesize + '-' + type + '.html';
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