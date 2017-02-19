
// 添加待办事件
export const addNote = ({ commit }, param) => {
	commit('ADDNOTE', {items: param});
}
// 已经完成的事件
export const eventDone = ({ commit }, param) => {
	commit('EVENTDONE', {id: param});
}
// 已取消事件
export const eventCancel = ({ commit }, param) => {
	commit('EVENTCANCEL', {id: param});
}