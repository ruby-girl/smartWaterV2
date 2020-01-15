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
      roles: []
    },
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '平台首页', icon: 'dashboard', affix: true }
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
      roles: ['100']
    },
    children: [
      {
        path: 'account',
        component: () => import('@/views/permission/account'),
        name: 'AccountPermission',
        meta: {
          title: '账号管理',
          roles: ['101']
        }
      },
      // {
      //   path: 'directive',
      //   component: () => import('@/views/permission/directive'),
      //   name: 'DirectivePermission',
      //   meta: {
      //     title: 'Directive Permission',
      //     roles: ['2']
      //   }
      // },
      {
        path: 'role',
        component: () => import('@/views/permission/role/index'),
        name: 'RolePermission',
        meta: {
          title: '角色管理',
          roles: ['106']
        }
      }
    ]
  },
  {
    path: '/sysMangment',
    redirect: '/sysMangment/page',
    alwaysShow: true, // will always show the root menu
    component: Layout,
    name: "sysMangment",
    meta: {
      title: '短信管理',
      icon: 'iconfont iconxiaoxixinxiduanxintixingyoujiantongzhisixin',
      roles: ['252']
    },
    children: [{
      path: 'sysSetting',
      component: () => import('@/views/sysMangment/sysSetting/index'),
      name: 'sysSetting',
      meta: {
        title: '短信设置',
        roles: ['253']
      }
    },
    {
      path: 'smsStaues',
      component: () => import('@/views/sysMangment/smsStaues/index'),
      name: 'smsStaues',
      meta: {
        title: '短信状态查询',
        roles: ['257']
      }
    },
    {
      path: 'sendManua',
      component: () => import('@/views/sysMangment/sendManua/index'),
      name: 'sendManua',
      meta: {
        title: '手动发送短信',
        roles: ['258']
      }
    },
    ]
  },
  {
    path: '/organizationManage',
    redirect: '/organizationManage/company',
    component: Layout,
    meta: {
      title: '组织管理',
      icon: 'iconfont iconcaidan-zuzhiguanli',
      roles: ['110']
    },
    children: [
      {
        path: 'waterFactory',
        name: 'waterFactoryPermission',
        component: () => import('@/views/organizationManage/waterFactory'),
        meta: { title: '水厂管理', roles: ['111'] }
      },
      {
        path: 'areaManage',
        name: 'areaManage',
        component: () => import('@/views/organizationManage/areaManage/index'),
        meta: { title: '片区管理', roles: ['115'] }
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/organizationManage/department/index'),
        meta: { title: '部门管理', roles: ['119'] }
      },
      {
        path: 'peopleManage',
        name: 'peopleManage',
        component: () => import('@/views/organizationManage/peopleManage/index'),
        meta: { title: '人员管理', roles: ['123'] }
      }
    ]
  },
  {
    path: '/businessManagement',
    component: Layout,
    redirect: '/businessManagement/page',
    alwaysShow: true, // will always show the root menu
    name: 'businessManagement',
    meta: {
      title: '业务管理',
      icon: 'iconfont iconcaidan-yewuguanli',
      roles: ['128']
    },
    children: [
      {
        path: 'tableSeting',
        component: () => import('@/views/businessManagement/tableSeting/index'),
        name: 'tableSeting',
        meta: {
          title: '表册设置',
          roles: ['129']
        }
      },
      {
        path: 'meterReadingPlan',
        component: () => import('@/views/businessManagement/meterReadingPlan/index'),
        name: 'MeterReadingPlan',
        meta: {
          title: '抄表计划',
          roles: ['137']
        }
      },
      {
        path: 'meterSetUp',
        component: () => import('@/views/businessManagement/meterSetUp/index'),
        name: 'meterSetUp',
        meta: {
          title: '抄表设置',
          roles: ['143']
        }
      },
      {
        path: 'meterQuery',
        component: () => import('@/views/businessManagement/meterQuery/index'),
        name: 'meterQuery',
        meta: {
          title: '抄表查询',
          roles: ['146']
        }
      },
      {
        path: 'cashCharge',
        component: () => import('@/views/businessManagement/cashCharge/index'),
        name: 'cashCharge',
        meta: {
          title: '现金收费',
          roles: ['151']
        }
      },
      {
        path: 'paymentQuery',
        component: () => import('@/views/businessManagement/paymentQuery/index'),
        name: 'paymentQuery',
        meta: {
          title: '收费查询',
          roles: ['156']
        }
      },
      {
        path: 'billDetails',
        component: () => import('@/views/businessManagement/billDetails/index'),
        name: 'billDetails',
        meta: {
          title: '账单详情',
          roles: ['159']
        }
      },
      {
        path: 'arrearsManagement',
        component: () => import('@/views/businessManagement/arrearsManagement/index'),
        name: 'arrearsManagement',
        meta: {
          title: '欠费管理',
          roles: ['161']
        }
      },
    ]
  },
  {
    path: '/systemManagement',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '系统管理',
      icon: 'iconfont iconxitongguanli',
      roles: ['168']
    },
    children: [
      {
        path: 'waterQuality',
        component: () => import('@/views/systemManagement/waterQualityManagement'),
        name: 'WaterQualityManagement',
        meta: {
          title: '用水性质设置',
          roles: ['169']
        }
      },
      {
        path: 'businessManagement',
        component: () => import('@/views/systemManagement/businessManagement'),
        name: 'businessManagement',
        meta: {
          title: '业务流程管理',
          roles: ['175']
        }
      },
      {
        path: 'logManagement',
        component: () => import('@/views/systemManagement/logManagement/index'),
        name: 'logManagement',
        meta: {
          title: '日志管理',
          roles: ['100']
        }
      }
    ]
  },
  {
    path: '/waterMetermangments',
    component: Layout,
    redirect: '/waterMetermangments/page',
    alwaysShow: true, // will always show the root menu
    name: 'waterMetermangments',
    meta: {
      title: '水表管理',
      icon: 'iconfont iconshuibiaoguanli',
      roles: ['187']
    },
    children: [
      {
        path: 'waterMeterSetting',
        component: () => import('@/views/waterMetermangments/waterMeterSetting/index'),
        name: 'waterMeterSetting',
        meta: {
          title: '水表设置',
          roles: ['188']
        }
      },
      {
        path: 'waterMeterUpdate',
        component: () => import('@/views/waterMetermangments/waterMeterUpdate/index'),
        name: 'waterMeterUpdate',
        meta: {
          title: '水表升级',
          roles: ['206']
        }
      },
      {
        path: 'waterMeterChange',
        component: () => import('@/views/waterMetermangments/waterMeterChange/index'),
        name: 'waterMeterChange',
        meta: {
          title: '水表换表',
          roles: ['208']
        }
      }
    ]
  },
  {
    path: '/userManagement',
    component: Layout,
    redirect: '/userManagement/userTransfer',
    alwaysShow: true, // will always show the root menu
    name: 'userManagement',
    meta: {
      title: '用户管理',
      icon: 'iconfont iconrenyuan',
      roles: ['213']
    },
    children: [
      {
        path: 'userSeting',
        component: () => import('@/views/userManagement/userSeting/index'),
        name: 'userSeting',
        meta: {
          title: '用户设置',
          roles: ['214']
        }
      },
      {
        path: 'userTransfer',
        component: () => import('@/views/userManagement/userTransfer/index'),
        name: 'userTransfer',
        meta: {
          title: '用户过户',
          roles: ['225']
        }
      },
      {
        path: 'userAccount',
        component: () => import('@/views/userManagement/userAccount/index'),
        name: 'userAccount',
        meta: {
          title: '用户销户',
          roles: ['227']
        }
      },
      {
        path: 'userSecur',
        component: () => import('@/views/userManagement/userSecur/index'),
        name: 'userSecur',
        meta: {
          title: '低保户管理',
          roles: ['229']
        }
      },
      {
        path: 'waterNatureChange',
        component: () => import('@/views/userManagement/waterNatureChange/index'),
        name: 'waterNatureChange',
        meta: {
          title: '用水性质变更',
          roles: ['231']
        }
      },
    ]
  },
  {
    path: '/myWorkBench',
    redirect: '/myWorkBench/page',
    alwaysShow: true, // will always show the root menu
    component: Layout,
    name: "myWorkBench",
    meta: {
      title: '我的工作台',
      icon: 'iconfont icongongzuotai',
      roles: ['233']
    },
    children: [{
      path: 'businessAduit',
      component: () => import('@/views/myWorkBench/businessAduit/index'),
      name: 'businessAduit',
      meta: {
        title: '业务审核',
        roles: ['234']
      }
    }
    ]
  },
  {
    path: '/systemConfig',
    redirect: '/systemConfig/basicConfig',
    alwaysShow: true, // will always show the root menu
    component: Layout,
    name: "systemConfig",
    meta: {
      title: '系统配置',
      icon: 'iconfont iconpeizhi',
      roles: ['239']
    },
    children: [{
      path: 'basicConfig',
      component: () => import('@/views/systemConfiguration/basicConfiguration/index'),
      name: 'basicConfig',
      meta: {
        title: '基础功能设置',
        roles: ['240']
      }
    },
    {
      path: 'differenceConfig',
      component: () => import('@/views/systemConfiguration/differenceConfig/index'),
      name: 'differenceConfig',
      meta: {
        title: '产销差供水量设置',
        roles: ['100']
      }
    }]
  },
  {
    path: '/reportStatistics',
    redirect: '/reportStatistics/page',
    alwaysShow: true, // will always show the root menu
    component: Layout,
    name: "reportStatistics",
    meta: {
      title: '报表统计',
      icon: 'iconfont iconcaidan-tongjibaobiao',
      roles: ['242']
    },
    children: [
      {
        path: 'standardRate',
        component: () => import('@/views/reportStatistics/standardRate/index'),
        name: 'standardRate',
        meta: {
          title: '抄表率统计',
          roles: ['243']
        }
      },
      {
        path: 'userStatistics',
        component: () => import('@/views/reportStatistics/userStatistics/index'),
        name: 'userStatistics',
        meta: {
          title: '用户统计',
          roles: ['245']
        }
      },
      {
        path: 'feeStatistics',
        component: () => import('@/views/reportStatistics/feeStatistics/index'),
        name: 'feeStatistics',
        meta: {
          title: '收费统计',
          roles: ['247']
        }
      },
      {
        path: 'garbageFeeStatistics',
        component: () => import('@/views/reportStatistics/garbageFeeStatistics/index'),
        name: 'garbageFeeStatistics',
        meta: {
          title: '垃圾费用统计',
          roles: ['248']
        }
      },
      {
        path: 'waterStatistics',
        component: () => import('@/views/reportStatistics/waterStatistics/index'),
        name: 'waterStatistics',
        meta: {
          title: '用水性质统计',
          roles: ['251']
        }
      },
      {
        path: 'abnormalStatistics',
        component: () => import('@/views/reportStatistics/abnormalStatistics/index'),
        name: 'abnormalStatistics',
        meta: {
          title: '异常监管统计',
          roles: ['246']
        }
      },
      {
        path: 'proSalesStatistics',
        component: () => import('@/views/reportStatistics/proSalesStatistics/index'),
        name: 'proSalesStatistics',
        meta: {
          title: '产销差统计',
          roles: ['250']
        }
      },
      {
        path: 'userBusinessStatistics',
        component: () => import('@/views/reportStatistics/userBusinessStatistics/index'),
        name: 'userBusinessStatistics',
        meta: {
          title: '用户业务办理统计',
          roles: ['244']
        }
      },
      {
        path: 'waterConStatistics',
        component: () => import('@/views/reportStatistics/waterConStatistics/index'),
        name: 'waterConStatistics',
        meta: {
          title: '用水量统计',
          roles: ['249']
        }
      },
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
