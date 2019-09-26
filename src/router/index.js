import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      title: '首页',
      icon: 'lock',
      roles: ['1']
    },
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '平台首页', icon: 'dashboard',affix: true}
      }
    ]
  }
]
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'iconfont iconcaidan-quanxianguanli',
      roles: ['1']
    },
    children: [
      {
        path: 'account',
        component: () => import('@/views/permission/account'),
        name: 'AccountPermission',
        meta: {
          title: '账号管理',
          roles: ['1']
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission',
          roles: ['2']
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role/index'),
        name: 'RolePermission',
        meta: {
          title: '角色管理',
          roles: ['1']
        }
      }
    ]
  },
 /* {
    path: '/organizationManage',
    redirect: '/organizationManage/company',
    component: Layout,
    meta: {
      title: '组织管理',
      icon: 'iconfont iconcaidan-zuzhiguanli',
      roles: ['1']
    },
    children: [
      {
        path: 'waterFactory',
        name: 'waterFactoryPermission',
        component: () => import('@/views/organizationManage/waterFactory'),
        meta: { title: '水厂管理',  roles: ['1'] }
      },
      {
        path: '/organizationManage/department',
        name: 'department',
        component: () => import('@/views/organizationManage/department'),
        meta: { title: '部门管理',  roles: ['1'] }
      },
      {
        path: '/organizationManage/postManage',
        name: 'postManage',
        component: () => import('@/views/organizationManage/postManage'),
        meta: { title: '岗位管理',  roles: ['1'] }
      },
      {
        path: '/organizationManage/PeopleManage',
        name: 'peopleManage',
        component: () => import('@/views/organizationManage/peopleManage'),
        meta: { title: '人员管理',  roles: ['1'] }
      },
      {
        path: '/organizationManage/areaManage',
        name: 'areaManage',
        component: () => import('@/views/organizationManage/areaManage'),
        meta: { title: '片区管理',  roles: ['1'] }
      }
    ]
  },*/
  {
    path: '/organizationManage',
    redirect: '/organizationManage/company',
    component: Layout,
    meta: {
      title: '组织管理',
      icon: 'iconfont iconcaidan-zuzhiguanli',
      roles: ['1']
    },
    children: [
      {
        path: 'waterFactory',
        name: 'waterFactoryPermission',
        component: () => import('@/views/organizationManage/waterFactory'),
        meta: { title: '水厂管理',  roles: ['1'] }
      },
      {
        path: '/organizationManage/department',
        name: 'department',
        component: () => import('@/views/organizationManage/department/index'),
        meta: { title: '部门管理',  roles: ['1'] }
      },
      {
        path: '/organizationManage/postManage',
        name: 'postManage',
        component: () => import('@/views/organizationManage/postManage/index'),
        meta: { title: '岗位管理',  roles: ['1'] }
      },
      {
        path: '/organizationManage/peopleManage',
        name: 'peopleManage',
        component: () => import('@/views/organizationManage/peopleManage/index'),
        meta: { title: '人员管理',  roles: ['1'] }
      },
      {
        path: '/organizationManage/areaManage',
        name: 'areaManage',
        component: () => import('@/views/organizationManage/areaManage'),
        meta: { title: '片区管理',  roles: ['1'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
