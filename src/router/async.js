import Layout from '@/layout'

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/role',
    meta: {
      title: '系统管理', icon: 'tree-table', noCache: true
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/system/role'),
        name: 'RoleManagement',
        meta: {
          title: '角色',
          icon: 'user',
          noCache: true,
          permissions: ['role.edit', 'role.create']
        }
      },
      {
        path: 'permission',
        component: () => import('@/views/permissions/index'),
        name: 'PermissionManagement',
        meta: {
          title: '权限',
          icon: 'password',
          noCache: true,
          permissions: ['permission.edit', 'permission.create']
        }
      },
      {
        path: 'admin',
        component: () => import('@/views/system/admin'),
        name: 'AdminManagement',
        meta: {
          title: '管理员',
          icon: 'people',
          noCache: true,
          permissions: ['admin.read']
        }
      }
    ]
  },
  {
    path: '/development',
    component: Layout,
    redirect: '/development/rules',
    meta: {
      title: '开发控制台', icon: 'tree-table', noCache: true
    },
    children: [
      {
        path: 'rules',
        component: () => import('@/views/development/rules'),
        name: 'RuleManagement',
        meta: {
          title: '访问规则',
          icon: 'lock',
          noCache: true,
          permissions: ['rule.read', 'rule.edit', 'rule.delete']
        }
      },
      {
        path: 'functions',
        component: () => import('@/views/development/functions'),
        name: 'FunctionManagement',
        meta: {
          title: '云函数',
          icon: 'lock',
          noCache: true,
          permissions: ['function.read', 'function.edit', 'function.triggers', 'function.publish', 'function.create', 'function.debug']
        }
      },
      {
        path: 'functions/:id',
        component: () => import('@/views/development/function'),
        name: 'FunctionEdit',
        hidden: true,
        meta: {
          title: '调试云函数',
          icon: 'lock',
          noCache: true,
          permissions: ['function.read', 'function.edit', 'function.publish', 'function.create', 'function.debug']
        }
      },
      {
        path: 'function-logs',
        component: () => import('@/views/development/function_logs'),
        name: 'AllFunctionLogs',
        meta: {
          title: '云函数日志',
          icon: 'lock',
          noCache: true,
          permissions: ['function.read', 'function.edit', 'function.publish', 'function.create', 'function.debug']
        }
      },
      {
        path: 'function-logs/:id',
        component: () => import('@/views/development/function_logs'),
        name: 'FunctionLogs',
        hidden: true,
        meta: {
          title: '云函数日志',
          icon: 'lock',
          noCache: true,
          permissions: ['function.read', 'function.edit', 'function.publish', 'function.create', 'function.debug']
        }
      },
      {
        path: 'triggers/:funcId',
        component: () => import('@/views/development/triggers'),
        name: 'TriggerManagement',
        hidden: true,
        meta: {
          title: '云函数触发器',
          icon: 'lock',
          noCache: true,
          permissions: ['trigger.read', 'trigger.edit', 'trigger.create', 'trigger.debug']
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
