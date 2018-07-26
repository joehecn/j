
import Login from '@/views/Login.vue'
import Preset from '@/views/Preset.vue'
import Group from '@/views/Group.vue'
import Chat from '@/views/Chat.vue'
import Github from '@/views/Github.vue'

export default [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/preset',
    name: 'preset',
    component: Preset
  },
  {
    path: '/group',
    name: 'group',
    component: Group
  },
  {
    path: '/chat',
    name: 'chat',
    component: Chat
  },
  {
    path: '/github',
    name: 'github',
    component: Github
  }
]
