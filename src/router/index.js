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
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: false, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'iconfont iconcaidan-quanxianguanli',
      roles: []
    },
    children: [
      {
        path: 'account',
        component: () => import('@/views/permission/account'),
        name: 'AccountPermission',
        meta: {
          title: '账号管理',
          roles: []
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
          roles: []
        }
      }
    ]
  },
  {
    path: '/sysMangment',
    redirect: '/sysMangment/page',
    alwaysShow: false, // will always show the root menu
    component: Layout,
    name: "sysMangment",
    meta: {
      title: '短信管理',
      icon: 'iconfont iconxiaoxixinxiduanxintixingyoujiantongzhisixin',
      roles: []
    },
    children: [{
      path: 'sysSetting',
      component: () => import('@/views/sysMangment/sysSetting/index'),
      name: 'sysSetting',
      meta: {
        title: '短信设置',
        roles: []
      }
    },
    {
      path: 'smsStaues',
      component: () => import('@/views/sysMangment/smsStaues/index'),
      name: 'smsStaues',
      meta: {
        title: '短信状态查询',
        roles: []
      }
    },
    {
      path: 'sendManua',
      component: () => import('@/views/sysMangment/sendManua/index'),
      name: 'sendManua',
      meta: {
        title: '手动发送短信',
        roles: []
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
      roles: []
    },
    children: [
      {
        path: 'waterFactory',
        name: 'waterFactoryPermission',
        component: () => import('@/views/organizationManage/waterFactory'),
        meta: { title: '水厂管理', roles: [] }
      },
      {
        path: 'areaManage',
        name: 'areaManage',
        component: () => import('@/views/organizationManage/areaManage/index'),
        meta: { title: '片区管理', roles: [] }
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/organizationManage/department/index'),
        meta: { title: '部门管理', roles: [] }
      },
      {
        path: 'peopleManage',
        name: 'peopleManage',
        component: () => import('@/views/organizationManage/peopleManage/index'),
        meta: { title: '人员管理', roles: [] }
      }
    ]
  },
  {
    path: '/businessManagement',
    component: Layout,
    redirect: '/businessManagement/page',
    alwaysShow: false, // will always show the root menu
    name: 'businessManagement',
    meta: {
      title: '业务管理',
      icon: 'iconfont iconcaidan-yewuguanli',
      roles: []
    },
    children: [
      {
        path: 'tableSeting',
        component: () => import('@/views/businessManagement/tableSeting/index'),
        name: 'tableSeting',
        meta: {
          title: '表册设置',
          roles: []
        }
      },
      {
        path: 'meterReadingPlan',
        component: () => import('@/views/businessManagement/meterReadingPlan/index'),
        name: 'MeterReadingPlan',
        meta: {
          title: '抄表计划',
          roles: []
        }
      },
      {
        path: 'meterSetUp',
        component: () => import('@/views/businessManagement/meterSetUp/index'),
        name: 'meterSetUp',
        meta: {
          title: '抄表设置',
          roles: []
        }
      },
      {
        path: 'meterQuery',
        component: () => import('@/views/businessManagement/meterQuery/index'),
        name: 'meterQuery',
        meta: {
          title: '抄表查询',
          roles: []
        }
      },
      {
        path: 'cashCharge',
        component: () => import('@/views/businessManagement/cashCharge/index'),
        name: 'cashCharge',
        meta: {
          title: '现金收费',
          roles: []
        }
      },
      {
        path: 'paymentQuery',
        component: () => import('@/views/businessManagement/paymentQuery/index'),
        name: 'paymentQuery',
        meta: {
          title: '收费查询',
          roles: []
        }
      },
      {
        path: 'billDetails',
        component: () => import('@/views/businessManagement/billDetails/index'),
        name: 'billDetails',
        meta: {
          title: '账单详情',
          roles: []
        }
      },
      {
        path: 'arrearsManagement',
        component: () => import('@/views/businessManagement/arrearsManagement/index'),
        name: 'arrearsManagement',
        meta: {
          title: '欠费管理',
          roles: []
        }
      },
    ]
  },
  {
    path: '/systemManagement',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: false, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '系统管理',
      icon: 'iconfont iconxitongguanli',
      roles: []
    },
    children: [
      {
        path: 'waterQuality',
        component: () => import('@/views/systemManagement/waterQualityManagement'),
        name: 'WaterQualityManagement',
        meta: {
          title: '用水性质设置',
          roles: []
        }
      },
      {
        path: 'businessManagement',
        component: () => import('@/views/systemManagement/businessManagement'),
        name: 'businessManagement',
        meta: {
          title: '业务流程管理',
          roles: []
        }
      },
      {
        path: 'logManagement',
        component: () => import('@/views/systemManagement/logManagement/index'),
        name: 'logManagement',
        meta: {
          title: '日志管理',
          roles: []
        }
      }
    ]
  },
  {
    path: '/waterMetermangments',
    component: Layout,
    redirect: '/waterMetermangments/page',
    alwaysShow: false, // will always show the root menu
    name: 'waterMetermangments',
    meta: {
      title: '水表管理',
      icon: 'iconfont iconshuibiaoguanli',
      roles: []
    },
    children: [
      {
        path: 'waterMeterSetting',
        component: () => import('@/views/waterMetermangments/waterMeterSetting/index'),
        name: 'waterMeterSetting',
        meta: {
          title: '水表设置',
          roles: []
        }
      },
      {
        path: 'waterMeterUpdate',
        component: () => import('@/views/waterMetermangments/waterMeterUpdate/index'),
        name: 'waterMeterUpdate',
        meta: {
          title: '水表升级',
          roles: []
        }
      },
      {
        path: 'waterMeterChange',
        component: () => import('@/views/waterMetermangments/waterMeterChange/index'),
        name: 'waterMeterChange',
        meta: {
          title: '水表换表',
          roles: []
        }
      }
    ]
  },
  {
    path: '/userManagement',
    component: Layout,
    redirect: '/userManagement/userTransfer',
    alwaysShow: false, // will always show the root menu
    name: 'userManagement',
    meta: {
      title: '用户管理',
      icon: 'iconfont iconrenyuan',
      roles: []
    },
    children: [
      {
        path: 'userSeting',
        component: () => import('@/views/userManagement/userSeting/index'),
        name: 'userSeting',
        meta: {
          title: '用户设置',
          roles: []
        }
      },
      {
        path: 'userTransfer',
        component: () => import('@/views/userManagement/userTransfer/index'),
        name: 'userTransfer',
        meta: {
          title: '用户过户',
          roles: []
        }
      },
      {
        path: 'userAccount',
        component: () => import('@/views/userManagement/userAccount/index'),
        name: 'userAccount',
        meta: {
          title: '用户销户',
          roles: []
        }
      },
      {
        path: 'userSecur',
        component: () => import('@/views/userManagement/userSecur/index'),
        name: 'userSecur',
        meta: {
          title: '低保户管理',
          roles: []
        }
      },
      {
        path: 'waterNatureChange',
        component: () => import('@/views/userManagement/waterNatureChange/index'),
        name: 'waterNatureChange',
        meta: {
          title: '用水性质变更',
          roles: []
        }
      },
    ]
  },
  {
    path: '/myWorkBench',
    redirect: '/myWorkBench/page',
    alwaysShow: false, // will always show the root menu
    component: Layout,
    name: "myWorkBench",
    meta: {
      title: '我的工作台',
      icon: 'iconfont icongongzuotai',
      roles: []
    },
    children: [{
      path: 'businessAduit',
      component: () => import('@/views/myWorkBench/businessAduit/index'),
      name: 'businessAduit',
      meta: {
        title: '业务审核',
        roles: []
      }
    }
    ]
  },
  {
    path: '/systemConfig',
    redirect: '/systemConfig/basicConfig',
    alwaysShow: false, // will always show the root menu
    component: Layout,
    name: "systemConfig",
    meta: {
      title: '系统配置',
      icon: 'iconfont iconpeizhi',
      roles: []
    },
    children: [{
      path: 'basicConfig',
      component: () => import('@/views/systemConfiguration/basicConfiguration/index'),
      name: 'basicConfig',
      meta: {
        title: '基础功能设置',
        roles: []
      }
    },
    {
      path: 'differenceConfig',
      component: () => import('@/views/systemConfiguration/differenceConfig/index'),
      name: 'differenceConfig',
      meta: {
        title: '产销差供水量设置',
        roles: []
      }
    }]
  },
  {
    path: '/reportStatistics',
    redirect: '/reportStatistics/page',
    alwaysShow: false, // will always show the root menu
    component: Layout,
    name: "reportStatistics",
    meta: {
      title: '报表统计',
      icon: 'iconfont iconcaidan-tongjibaobiao',
      roles: []
    },
    children: [
      {
        path: 'standardRate',
        component: () => import('@/views/reportStatistics/standardRate/index'),
        name: 'standardRate',
        meta: {
          title: '抄表率统计',
          roles: []
        }
      },
      {
        path: 'userStatistics',
        component: () => import('@/views/reportStatistics/userStatistics/index'),
        name: 'userStatistics',
        meta: {
          title: '用户统计',
          roles: []
        }
      },
      {
        path: 'feeStatistics',
        component: () => import('@/views/reportStatistics/feeStatistics/index'),
        name: 'feeStatistics',
        meta: {
          title: '收费统计',
          roles: []
        }
      },
      {
        path: 'garbageFeeStatistics',
        component: () => import('@/views/reportStatistics/garbageFeeStatistics/index'),
        name: 'garbageFeeStatistics',
        meta: {
          title: '垃圾费用统计',
          roles: []
        }
      },
      {
        path: 'waterStatistics',
        component: () => import('@/views/reportStatistics/waterStatistics/index'),
        name: 'waterStatistics',
        meta: {
          title: '用水性质统计',
          roles: []
        }
      },
      {
        path: 'abnormalStatistics',
        component: () => import('@/views/reportStatistics/abnormalStatistics/index'),
        name: 'abnormalStatistics',
        meta: {
          title: '异常监管统计',
          roles: []
        }
      },
      {
        path: 'proSalesStatistics',
        component: () => import('@/views/reportStatistics/proSalesStatistics/index'),
        name: 'proSalesStatistics',
        meta: {
          title: '产销差统计',
          roles: []
        }
      },
      {
        path: 'userBusinessStatistics',
        component: () => import('@/views/reportStatistics/userBusinessStatistics/index'),
        name: 'userBusinessStatistics',
        meta: {
          title: '用户业务办理统计',
          roles: []
        }
      },
      {
        path: 'waterConStatistics',
        component: () => import('@/views/reportStatistics/waterConStatistics/index'),
        name: 'waterConStatistics',
        meta: {
          title: '用水量统计',
          roles: []
        }
      },
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: '权限管理',
  //     icon: 'iconfont iconcaidan-quanxianguanli',
  //     roles: []
  //   },
  //   children: [
  //     {
  //       path: 'account',
  //       component: () => import('@/views/permission/account'),
  //       name: 'AccountPermission',
  //       meta: {
  //         title: '账号管理',
  //         roles: []
  //       }
  //     },
  //     // {
  //     //   path: 'directive',
  //     //   component: () => import('@/views/permission/directive'),
  //     //   name: 'DirectivePermission',
  //     //   meta: {
  //     //     title: 'Directive Permission',
  //     //     roles: ['2']
  //     //   }
  //     // },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role/index'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: '角色管理',
  //         roles: []
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/sysMangment',
  //   redirect: '/sysMangment/page',
  //   alwaysShow: true, // will always show the root menu
  //   component: Layout,
  //   name: "sysMangment",
  //   meta: {
  //     title: '短信管理',
  //     icon: 'iconfont iconxiaoxixinxiduanxintixingyoujiantongzhisixin',
  //     roles: []
  //   },
  //   children: [{
  //     path: 'sysSetting',
  //     component: () => import('@/views/sysMangment/sysSetting/index'),
  //     name: 'sysSetting',
  //     meta: {
  //       title: '短信设置',
  //       roles: []
  //     }
  //   },
  //   {
  //     path: 'smsStaues',
  //     component: () => import('@/views/sysMangment/smsStaues/index'),
  //     name: 'smsStaues',
  //     meta: {
  //       title: '短信状态查询',
  //       roles: []
  //     }
  //   },
  //   {
  //     path: 'sendManua',
  //     component: () => import('@/views/sysMangment/sendManua/index'),
  //     name: 'sendManua',
  //     meta: {
  //       title: '手动发送短信',
  //       roles: []
  //     }
  //   },
  //   ]
  // },
  // {
  //   path: '/organizationManage',
  //   redirect: '/organizationManage/company',
  //   component: Layout,
  //   meta: {
  //     title: '组织管理',
  //     icon: 'iconfont iconcaidan-zuzhiguanli',
  //     roles: []
  //   },
  //   children: [
  //     {
  //       path: 'waterFactory',
  //       name: 'waterFactoryPermission',
  //       component: () => import('@/views/organizationManage/waterFactory'),
  //       meta: { title: '水厂管理', roles: [] }
  //     },
  //     {
  //       path: 'areaManage',
  //       name: 'areaManage',
  //       component: () => import('@/views/organizationManage/areaManage/index'),
  //       meta: { title: '片区管理', roles: [] }
  //     },
  //     {
  //       path: 'department',
  //       name: 'department',
  //       component: () => import('@/views/organizationManage/department/index'),
  //       meta: { title: '部门管理', roles: [] }
  //     },
  //     {
  //       path: 'peopleManage',
  //       name: 'peopleManage',
  //       component: () => import('@/views/organizationManage/peopleManage/index'),
  //       meta: { title: '人员管理', roles: [] }
  //     }
  //   ]
  // },
  // {
  //   path: '/businessManagement',
  //   component: Layout,
  //   redirect: '/businessManagement/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'businessManagement',
  //   meta: {
  //     title: '业务管理',
  //     icon: 'iconfont iconcaidan-yewuguanli',
  //     roles: []
  //   },
  //   children: [
  //     {
  //       path: 'tableSeting',
  //       component: () => import('@/views/businessManagement/tableSeting/index'),
  //       name: 'tableSeting',
  //       meta: {
  //         title: '表册设置',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'meterReadingPlan',
  //       component: () => import('@/views/businessManagement/meterReadingPlan/index'),
  //       name: 'MeterReadingPlan',
  //       meta: {
  //         title: '抄表计划',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'meterSetUp',
  //       component: () => import('@/views/businessManagement/meterSetUp/index'),
  //       name: 'meterSetUp',
  //       meta: {
  //         title: '抄表设置',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'meterQuery',
  //       component: () => import('@/views/businessManagement/meterQuery/index'),
  //       name: 'meterQuery',
  //       meta: {
  //         title: '抄表查询',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'cashCharge',
  //       component: () => import('@/views/businessManagement/cashCharge/index'),
  //       name: 'cashCharge',
  //       meta: {
  //         title: '现金收费',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'paymentQuery',
  //       component: () => import('@/views/businessManagement/paymentQuery/index'),
  //       name: 'paymentQuery',
  //       meta: {
  //         title: '收费查询',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'billDetails',
  //       component: () => import('@/views/businessManagement/billDetails/index'),
  //       name: 'billDetails',
  //       meta: {
  //         title: '账单详情',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'arrearsManagement',
  //       component: () => import('@/views/businessManagement/arrearsManagement/index'),
  //       name: 'arrearsManagement',
  //       meta: {
  //         title: '欠费管理',
  //         roles: []
  //       }
  //     },
  //   ]
  // },
  // {
  //   path: '/systemManagement',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: '系统管理',
  //     icon: 'iconfont iconxitongguanli',
  //     roles: []
  //   },
  //   children: [
  //     {
  //       path: 'waterQuality',
  //       component: () => import('@/views/systemManagement/waterQualityManagement'),
  //       name: 'WaterQualityManagement',
  //       meta: {
  //         title: '用水性质设置',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'businessManagement',
  //       component: () => import('@/views/systemManagement/businessManagement'),
  //       name: 'businessManagement',
  //       meta: {
  //         title: '业务流程管理',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'logManagement',
  //       component: () => import('@/views/systemManagement/logManagement/index'),
  //       name: 'logManagement',
  //       meta: {
  //         title: '日志管理',
  //         roles: []
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/waterMetermangments',
  //   component: Layout,
  //   redirect: '/waterMetermangments/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'waterMetermangments',
  //   meta: {
  //     title: '水表管理',
  //     icon: 'iconfont iconshuibiaoguanli',
  //     roles: []
  //   },
  //   children: [
  //     {
  //       path: 'waterMeterSetting',
  //       component: () => import('@/views/waterMetermangments/waterMeterSetting/index'),
  //       name: 'waterMeterSetting',
  //       meta: {
  //         title: '水表设置',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'waterMeterUpdate',
  //       component: () => import('@/views/waterMetermangments/waterMeterUpdate/index'),
  //       name: 'waterMeterUpdate',
  //       meta: {
  //         title: '水表升级',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'waterMeterChange',
  //       component: () => import('@/views/waterMetermangments/waterMeterChange/index'),
  //       name: 'waterMeterChange',
  //       meta: {
  //         title: '水表换表',
  //         roles: []
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/userManagement',
  //   component: Layout,
  //   redirect: '/userManagement/userTransfer',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'userManagement',
  //   meta: {
  //     title: '用户管理',
  //     icon: 'iconfont iconrenyuan',
  //     roles: []
  //   },
  //   children: [
  //     {
  //       path: 'userSeting',
  //       component: () => import('@/views/userManagement/userSeting/index'),
  //       name: 'userSeting',
  //       meta: {
  //         title: '用户设置',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'userTransfer',
  //       component: () => import('@/views/userManagement/userTransfer/index'),
  //       name: 'userTransfer',
  //       meta: {
  //         title: '用户过户',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'userAccount',
  //       component: () => import('@/views/userManagement/userAccount/index'),
  //       name: 'userAccount',
  //       meta: {
  //         title: '用户销户',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'userSecur',
  //       component: () => import('@/views/userManagement/userSecur/index'),
  //       name: 'userSecur',
  //       meta: {
  //         title: '低保户管理',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'waterNatureChange',
  //       component: () => import('@/views/userManagement/waterNatureChange/index'),
  //       name: 'waterNatureChange',
  //       meta: {
  //         title: '用水性质变更',
  //         roles: []
  //       }
  //     },
  //   ]
  // },
  // {
  //   path: '/myWorkBench',
  //   redirect: '/myWorkBench/page',
  //   alwaysShow: true, // will always show the root menu
  //   component: Layout,
  //   name: "myWorkBench",
  //   meta: {
  //     title: '我的工作台',
  //     icon: 'iconfont icongongzuotai',
  //     roles: []
  //   },
  //   children: [{
  //     path: 'businessAduit',
  //     component: () => import('@/views/myWorkBench/businessAduit/index'),
  //     name: 'businessAduit',
  //     meta: {
  //       title: '业务审核',
  //       roles: []
  //     }
  //   }
  //   ]
  // },
  // {
  //   path: '/systemConfig',
  //   redirect: '/systemConfig/basicConfig',
  //   alwaysShow: true, // will always show the root menu
  //   component: Layout,
  //   name: "systemConfig",
  //   meta: {
  //     title: '系统配置',
  //     icon: 'iconfont iconpeizhi',
  //     roles: []
  //   },
  //   children: [{
  //     path: 'basicConfig',
  //     component: () => import('@/views/systemConfiguration/basicConfiguration/index'),
  //     name: 'basicConfig',
  //     meta: {
  //       title: '基础功能设置',
  //       roles: []
  //     }
  //   },
  //   {
  //     path: 'differenceConfig',
  //     component: () => import('@/views/systemConfiguration/differenceConfig/index'),
  //     name: 'differenceConfig',
  //     meta: {
  //       title: '产销差供水量设置',
  //       roles: []
  //     }
  //   }]
  // },
  // {
  //   path: '/reportStatistics',
  //   redirect: '/reportStatistics/page',
  //   alwaysShow: true, // will always show the root menu
  //   component: Layout,
  //   name: "reportStatistics",
  //   meta: {
  //     title: '报表统计',
  //     icon: 'iconfont iconcaidan-tongjibaobiao',
  //     roles: []
  //   },
  //   children: [
  //     {
  //       path: 'standardRate',
  //       component: () => import('@/views/reportStatistics/standardRate/index'),
  //       name: 'standardRate',
  //       meta: {
  //         title: '抄表率统计',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'userStatistics',
  //       component: () => import('@/views/reportStatistics/userStatistics/index'),
  //       name: 'userStatistics',
  //       meta: {
  //         title: '用户统计',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'feeStatistics',
  //       component: () => import('@/views/reportStatistics/feeStatistics/index'),
  //       name: 'feeStatistics',
  //       meta: {
  //         title: '收费统计',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'garbageFeeStatistics',
  //       component: () => import('@/views/reportStatistics/garbageFeeStatistics/index'),
  //       name: 'garbageFeeStatistics',
  //       meta: {
  //         title: '垃圾费用统计',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'waterStatistics',
  //       component: () => import('@/views/reportStatistics/waterStatistics/index'),
  //       name: 'waterStatistics',
  //       meta: {
  //         title: '用水性质统计',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'abnormalStatistics',
  //       component: () => import('@/views/reportStatistics/abnormalStatistics/index'),
  //       name: 'abnormalStatistics',
  //       meta: {
  //         title: '异常监管统计',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'proSalesStatistics',
  //       component: () => import('@/views/reportStatistics/proSalesStatistics/index'),
  //       name: 'proSalesStatistics',
  //       meta: {
  //         title: '产销差统计',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'userBusinessStatistics',
  //       component: () => import('@/views/reportStatistics/userBusinessStatistics/index'),
  //       name: 'userBusinessStatistics',
  //       meta: {
  //         title: '用户业务办理统计',
  //         roles: []
  //       }
  //     },
  //     {
  //       path: 'waterConStatistics',
  //       component: () => import('@/views/reportStatistics/waterConStatistics/index'),
  //       name: 'waterConStatistics',
  //       meta: {
  //         title: '用水量统计',
  //         roles: []
  //       }
  //     },
  //   ]
  // },


  // // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
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
