import Cookies from 'js-cookie'
import { getDictionaryItem } from '@/api/index'
import { planConpanySelect } from '@/api/plan'
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  dictionaryItem: [],//字典项
  companyArr: []//字典项
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_DICTIONARY: (state, dictionary) => {
    state.dictionaryItem = dictionary
  },
  SET_companyarr: (state, company) => {
    state.companyArr = company
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setDictionary({ commit }, dictionary) {
    commit('SET_DICTIONARY', dictionary)
  },
  setDictionary({ commit }) {//set字典项
    getDictionaryItem().then(response => {
      const { data } = response
      commit('SET_DICTIONARY', data)
    })
  },
  setDCompany({ commit }, state) {
    return new Promise((resolve, reject) => {
      planConpanySelect(state.token).then(response => {
        const { data } = response.data
        commit('SET_companyarr', data)
        //setToken(data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })

  }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
